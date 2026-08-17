"use client";

import type { ChangeEvent, ReactNode } from "react";
import type { BackgroundConfig, ImageConfig, ImageKey, PosterConfig, TextLayerConfig, TransformConfig } from "@/types/poster";

interface ControlPanelProps {
  config: PosterConfig;
  exporting: boolean;
  onChange: (config: PosterConfig) => void;
  onUpload: (key: ImageKey, file: File) => void;
  onSavePreset: () => void;
  onLoadPreset: () => void;
  onReset: () => void;
  onUseCurrentTime: () => void;
  onExport: (format: "jpg" | "png") => void;
}

function Accordion({ title, badge, children, open = false }: { title: string; badge?: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="accordion" open={open}>
      <summary>
        <span>{title}</span>
        {badge && <small>{badge}</small>}
      </summary>
      <div className="accordion-content">{children}</div>
    </details>
  );
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <small className="field-hint">{hint}</small>}
    </label>
  );
}

function TextInput({ value, onChange, type = "text", placeholder }: { value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function NumberInput({ value, onChange, min, max, step = 1 }: { value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  return <input type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />;
}

function Range({ label, value, onChange, min, max, step = 1, suffix = "" }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; step?: number; suffix?: string }) {
  return (
    <Field label={label}>
      <div className="range-row">
        <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
        <output>{Number.isInteger(value) ? value : value.toFixed(2)}{suffix}</output>
      </div>
    </Field>
  );
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <div className="color-row">
        <input className="color-input" type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        <input value={value.toUpperCase()} onChange={(event) => /^#[0-9a-f]{6}$/i.test(event.target.value) && onChange(event.target.value)} aria-label={`${label} hex value`} />
      </div>
    </Field>
  );
}

function Upload({ label, onFile }: { label: string; onFile: (file: File) => void }) {
  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFile(file);
    event.target.value = "";
  };
  return (
    <label className="upload-button">
      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={choose} />
      <span className="upload-icon">＋</span>
      <span><strong>{label}</strong><small>PNG · JPG · WEBP · 最大 12MB</small></span>
    </label>
  );
}

function PositionControls({ value, onPatch, scaleLabel = "Scale" }: { value: TransformConfig; onPatch: (patch: Partial<TransformConfig>) => void; scaleLabel?: string }) {
  return (
    <>
      <div className="two-columns">
        <Field label="Position X"><NumberInput value={Math.round(value.x)} onChange={(x) => onPatch({ x })} /></Field>
        <Field label="Position Y"><NumberInput value={Math.round(value.y)} onChange={(y) => onPatch({ y })} /></Field>
      </div>
      <Range label={scaleLabel} value={value.scale} min={0.2} max={2.5} step={0.01} onChange={(scale) => onPatch({ scale })} suffix="×" />
    </>
  );
}

function ImageSettings({ config, onPatch, compact = false }: { config: ImageConfig; onPatch: (patch: Partial<ImageConfig>) => void; compact?: boolean }) {
  return (
    <>
      <Range label="Width" value={config.width} min={80} max={1100} onChange={(width) => onPatch({ width })} suffix="px" />
      <PositionControls value={config} onPatch={onPatch} />
      {!compact && (
        <>
          <Range label="Border Radius" value={config.borderRadius} min={0} max={80} onChange={(borderRadius) => onPatch({ borderRadius })} suffix="px" />
          <Range label="Border Width" value={config.borderWidth} min={0} max={16} onChange={(borderWidth) => onPatch({ borderWidth })} suffix="px" />
          <Color label="Border Color" value={config.borderColor} onChange={(borderColor) => onPatch({ borderColor })} />
          <Range label="Shadow" value={config.shadowBlur} min={0} max={60} onChange={(shadowBlur) => onPatch({ shadowBlur })} suffix="px" />
        </>
      )}
    </>
  );
}

function TextStyleSettings({ value, onPatch, includeText = true }: { value: TextLayerConfig; onPatch: (patch: Partial<TextLayerConfig>) => void; includeText?: boolean }) {
  return (
    <>
      {includeText && <Field label="Text"><TextInput value={value.text} onChange={(text) => onPatch({ text })} /></Field>}
      <div className="two-columns">
        <Field label="Font Size"><NumberInput value={value.fontSize} min={20} max={180} onChange={(fontSize) => onPatch({ fontSize })} /></Field>
        <Field label="Font Weight">
          <select value={value.fontWeight} onChange={(event) => onPatch({ fontWeight: Number(event.target.value) })}>
            <option value="700">Bold</option><option value="800">Extra Bold</option><option value="900">Black</option>
          </select>
        </Field>
      </div>
      <Field label="Font Family">
        <select value={value.fontFamily} onChange={(event) => onPatch({ fontFamily: event.target.value })}>
          <option value="Impact, Arial Black, sans-serif">Impact</option>
          <option value="Arial Black, Arial, sans-serif">Arial Black</option>
          <option value="Georgia, serif">Georgia</option>
        </select>
      </Field>
      <div className="two-columns color-pair">
        <Color label="Fill" value={value.fill} onChange={(fill) => onPatch({ fill })} />
        <Color label="Stroke" value={value.stroke} onChange={(stroke) => onPatch({ stroke })} />
      </div>
      <Range label="Stroke Width" value={value.strokeWidth} min={0} max={18} onChange={(strokeWidth) => onPatch({ strokeWidth })} suffix="px" />
      <Color label="Shadow Color" value={value.shadowColor} onChange={(shadowColor) => onPatch({ shadowColor })} />
      <Range label="Shadow Blur" value={value.shadowBlur} min={0} max={40} onChange={(shadowBlur) => onPatch({ shadowBlur })} suffix="px" />
      <PositionControls value={value} onPatch={onPatch} />
    </>
  );
}

export default function ControlPanel({
  config,
  exporting,
  onChange,
  onUpload,
  onSavePreset,
  onLoadPreset,
  onReset,
  onUseCurrentTime,
  onExport,
}: ControlPanelProps) {
  const patchImage = (key: Exclude<ImageKey, "background">, patch: Partial<ImageConfig>) =>
    onChange({ ...config, [key]: { ...config[key], ...patch } });
  const patchBackground = (patch: Partial<BackgroundConfig>) =>
    onChange({ ...config, background: { ...config.background, ...patch } });
  const patchHeadline = <K extends keyof PosterConfig["headline"]>(key: K, patch: Partial<PosterConfig["headline"][K]>) =>
    onChange({ ...config, headline: { ...config.headline, [key]: { ...config.headline[key], ...patch } } });

  const amountColors = ["#F6C34B", "#EF4444", "#22C55E", "#3B82F6", "#FFFFFF"];

  return (
    <aside className="control-panel">
      <div className="brand-block">
        <div className="brand-mark">V</div>
        <div><p>VIP POSTER</p><h1>Studio</h1></div>
        <span className="local-badge">LOCAL</span>
      </div>

      <section className="quick-card">
        <div className="section-kicker">QUICK EDIT</div>
        <Field label="MASTER AMOUNT" hint="输入一次，自动同步三个金额区域">
          <div className="amount-input-wrap"><span>RM</span><TextInput value={config.masterAmount} onChange={(masterAmount) => onChange({ ...config, masterAmount })} placeholder="1096.80" /></div>
        </Field>
        <label className="toggle-row">
          <span><strong>Sync all amounts</strong><small>Withdraw · Success · Headline</small></span>
          <input type="checkbox" checked={config.syncAmounts} onChange={(event) => onChange({ ...config, syncAmounts: event.target.checked })} />
        </label>
        <div className="field-label">RM AMOUNT COLOR</div>
        <div className="swatches">
          {amountColors.map((color) => (
            <button
              key={color}
              className={config.headline.amount.fill.toUpperCase() === color ? "active" : ""}
              style={{ background: color }}
              aria-label={`Set amount color to ${color}`}
              onClick={() => patchHeadline("amount", { fill: color, style: "solid" })}
            />
          ))}
          <label className="custom-swatch" title="Custom color">
            <input type="color" value={config.headline.amount.fill} onChange={(event) => patchHeadline("amount", { fill: event.target.value, style: "solid" })} />
            <span>＋</span>
          </label>
        </div>
      </section>

      <nav className="accordions" aria-label="Poster controls">
        <Accordion title="GENERAL" badge="PRESET">
          <Field label="Template"><select value={config.template} disabled><option value="template-1">Template 1 · Royal Blue</option></select></Field>
          <div className="button-grid three"><button onClick={onSavePreset}>Save Preset</button><button onClick={onLoadPreset}>Load</button><button className="danger-ghost" onClick={onReset}>Reset</button></div>
          <p className="info-note">设定保存在当前浏览器。为避免空间不足，上传图片只保留到当前页面会话。</p>
        </Accordion>

        <Accordion title="COMPANY" badge="LOGO">
          <Field label="Company Name"><TextInput value={config.companyName} onChange={(companyName) => onChange({ ...config, companyName })} /></Field>
          <Upload label="Upload Company Logo" onFile={(file) => onUpload("companyLogo", file)} />
          <ImageSettings config={config.companyLogo} onPatch={(patch) => patchImage("companyLogo", patch)} compact />
        </Accordion>

        <Accordion title="GAME LOGOS" badge="2 LAYERS">
          <div className="subsection"><h3>Left Logo</h3><Upload label="Upload Left Logo" onFile={(file) => onUpload("gameLogoLeft", file)} /><ImageSettings config={config.gameLogoLeft} onPatch={(patch) => patchImage("gameLogoLeft", patch)} /></div>
          <div className="subsection"><h3>Right Logo</h3><Upload label="Upload Right Logo" onFile={(file) => onUpload("gameLogoRight", file)} /><ImageSettings config={config.gameLogoRight} onPatch={(patch) => patchImage("gameLogoRight", patch)} /></div>
        </Accordion>

        <Accordion title="PERSON" badge="MAIN VISUAL" open>
          <Upload label="Upload Person" onFile={(file) => onUpload("person", file)} />
          <ImageSettings config={config.person} onPatch={(patch) => patchImage("person", patch)} compact />
          <button className="full-button" onClick={() => patchImage("person", { x: 627, y: 238, scale: 1 })}>Reset Person Position</button>
          <p className="info-note">在预览中拖动人物；选中后拖四角缩放。透明 PNG 效果最佳。</p>
        </Accordion>

        <Accordion title="BACKGROUND" badge="EFFECTS">
          <Upload label="Upload Background" onFile={(file) => onUpload("background", file)} />
          <PositionControls value={config.background} onPatch={patchBackground} scaleLabel="Background Scale" />
          <Range label="Brightness" value={config.background.brightness} min={-50} max={50} onChange={(brightness) => patchBackground({ brightness })} suffix="%" />
          <Range label="Contrast" value={config.background.contrast} min={-50} max={80} onChange={(contrast) => patchBackground({ contrast })} suffix="%" />
          <Range label="Blur" value={config.background.blur} min={0} max={20} onChange={(blur) => patchBackground({ blur })} suffix="px" />
          <Range label="Dark Overlay" value={config.background.overlay} min={0} max={0.75} step={0.01} onChange={(overlay) => patchBackground({ overlay })} />
        </Accordion>

        <Accordion title="WITHDRAW" badge="CARD">
          <Field label="Withdraw Title"><TextInput value={config.withdraw.title} onChange={(title) => onChange({ ...config, withdraw: { ...config.withdraw, title } })} /></Field>
          <Field label="Order ID"><TextInput value={config.withdraw.orderId} onChange={(orderId) => onChange({ ...config, withdraw: { ...config.withdraw, orderId } })} /></Field>
          {!config.syncAmounts && <Field label="Withdraw Amount"><TextInput value={config.withdraw.amount} onChange={(amount) => onChange({ ...config, withdraw: { ...config.withdraw, amount } })} /></Field>}
          <Color label="Withdraw Amount Color" value={config.withdraw.amountColor} onChange={(amountColor) => onChange({ ...config, withdraw: { ...config.withdraw, amountColor } })} />
          <div className="two-columns"><Field label="Date"><TextInput type="date" value={config.withdraw.date} onChange={(date) => onChange({ ...config, withdraw: { ...config.withdraw, date } })} /></Field><Field label="Time"><TextInput type="time" value={config.withdraw.time} onChange={(time) => onChange({ ...config, withdraw: { ...config.withdraw, time } })} /></Field></div>
          <button className="full-button" onClick={onUseCurrentTime}>Use Current Time</button>
          <Range label="Amount Font Size" value={config.withdraw.amountFontSize} min={22} max={55} onChange={(amountFontSize) => onChange({ ...config, withdraw: { ...config.withdraw, amountFontSize } })} />
          <PositionControls value={config.withdraw} onPatch={(patch) => onChange({ ...config, withdraw: { ...config.withdraw, ...patch } })} />
        </Accordion>

        <Accordion title="SUCCESS BOX" badge="CARD">
          <Field label="Success Title"><TextInput value={config.success.title} onChange={(title) => onChange({ ...config, success: { ...config.success, title } })} /></Field>
          {!config.syncAmounts && <Field label="Success Amount"><TextInput value={config.success.amount} onChange={(amount) => onChange({ ...config, success: { ...config.success, amount } })} /></Field>}
          <Color label="Success Amount Color" value={config.success.amountColor} onChange={(amountColor) => onChange({ ...config, success: { ...config.success, amountColor } })} />
          <Field label="Description Line 1"><textarea value={config.success.description1} onChange={(event) => onChange({ ...config, success: { ...config.success, description1: event.target.value } })} /></Field>
          <Field label="Description Line 2"><TextInput value={config.success.description2} onChange={(description2) => onChange({ ...config, success: { ...config.success, description2 } })} /></Field>
          <PositionControls value={config.success} onPatch={(patch) => onChange({ ...config, success: { ...config.success, ...patch } })} />
        </Accordion>

        <Accordion title="HEADLINE" badge="TANIAH">
          <TextStyleSettings value={config.headline.line1} onPatch={(patch) => patchHeadline("line1", patch)} />
        </Accordion>

        <Accordion title="AMOUNT" badge="CUCI + RM">
          <div className="layer-callout"><strong>Independent layers</strong><span>CUCI 与 RM 金额可分别改色，不会互相影响。</span></div>
          <div className="subsection"><h3>CUCI Layer</h3><TextStyleSettings value={config.headline.cuci} onPatch={(patch) => patchHeadline("cuci", patch)} /></div>
          <div className="subsection">
            <h3>RM Amount Layer</h3>
            {!config.syncAmounts && <Field label="Headline Amount"><TextInput value={config.headline.amount.value} onChange={(value) => patchHeadline("amount", { value })} /></Field>}
            <Field label="Amount Decimals"><select value={config.headline.amount.decimals} onChange={(event) => patchHeadline("amount", { decimals: Number(event.target.value) as 0 | 1 | 2 })}><option value="0">0 decimals</option><option value="1">1 decimal</option><option value="2">2 decimals</option></select></Field>
            <Field label="Amount Style"><select value={config.headline.amount.style} onChange={(event) => patchHeadline("amount", { style: event.target.value as "solid" | "gold" | "silver" })}><option value="solid">Solid</option><option value="gold">Gold Gradient</option><option value="silver">Silver Gradient</option></select></Field>
            <TextStyleSettings value={config.headline.amount} includeText={false} onPatch={(patch) => patchHeadline("amount", patch)} />
          </div>
        </Accordion>

        <Accordion title="BANK LOGOS" badge="STRIP">
          <Upload label="Upload Bank Logo Bar" onFile={(file) => onUpload("bankBar", file)} />
          <ImageSettings config={config.bankBar} onPatch={(patch) => patchImage("bankBar", patch)} compact />
        </Accordion>

        <Accordion title="EXPORT" badge="1254 × 1254">
          <Field label="Default Format"><select value={config.export.format} onChange={(event) => onChange({ ...config, export: { ...config.export, format: event.target.value as "jpg" | "png" } })}><option value="jpg">JPG</option><option value="png">PNG</option></select></Field>
          <Field label="JPG Quality"><select value={config.export.quality} onChange={(event) => onChange({ ...config, export: { ...config.export, quality: Number(event.target.value) } })}>{[0.8, 0.85, 0.9, 0.95, 0.98, 1].map((quality) => <option key={quality} value={quality}>{quality * 100}%</option>)}</select></Field>
          <div className="export-buttons"><button disabled={exporting} onClick={() => onExport("jpg")}>{exporting ? "EXPORTING…" : "EXPORT JPG"}</button><button disabled={exporting} className="secondary" onClick={() => onExport("png")}>EXPORT PNG</button></div>
          <p className="info-note">导出永远保持真实 1254 × 1254 px；预览缩小不会降低图片尺寸。</p>
        </Accordion>
      </nav>
    </aside>
  );
}

