type Decimals = 0 | 1 | 2;

function normalize(value: string | number): { negative: boolean; digits: string; fraction: string } {
  const raw = String(value ?? "0").trim().replace(/,/g, "").replace(/^(MYR|RM)/i, "");
  const match = raw.match(/^(-)?(\d*)(?:\.(\d*))?$/);
  if (!match) return { negative: false, digits: "0", fraction: "" };
  return {
    negative: Boolean(match[1]),
    digits: (match[2] || "0").replace(/^0+(?=\d)/, ""),
    fraction: match[3] || "",
  };
}

function decimalParts(value: string | number, decimals: Decimals) {
  const parsed = normalize(value);
  const padded = `${parsed.fraction}${"0".repeat(decimals)}`;
  const kept = decimals ? padded.slice(0, decimals) : "";
  const factor = BigInt(10) ** BigInt(decimals);
  const scaled = BigInt(parsed.digits) * factor + BigInt(kept || "0");
  const integer = scaled / factor;
  const fraction = decimals ? String(scaled % factor).padStart(decimals, "0") : "";
  return { negative: parsed.negative && scaled !== BigInt(0), integer, fraction };
}

function group(value: bigint) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function format(value: string | number, decimals: Decimals, prefix: string, grouped: boolean) {
  const parts = decimalParts(value, decimals);
  const sign = parts.negative ? "-" : "";
  const integer = grouped ? group(parts.integer) : String(parts.integer);
  return `${prefix}${sign}${integer}${decimals ? `.${parts.fraction}` : ""}`;
}

export function formatWithdrawAmount(value: string | number, decimals: Decimals = 2) {
  return format(value, decimals, "RM", true);
}

export function formatSuccessAmount(value: string | number, decimals: Decimals = 1) {
  return format(value, decimals, "MYR", false);
}

export function formatHeadlineAmount(value: string | number, decimals: Decimals = 0) {
  return format(value, decimals, "RM", true);
}

export function amountDigits(value: string | number) {
  return format(value, 0, "", false).replace("-", "");
}
