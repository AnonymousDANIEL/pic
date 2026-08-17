import type { PosterConfig } from "@/types/poster";

const PRESET_KEY = "vip-poster-studio-preset-v1";
const AUTOSAVE_KEY = "vip-poster-studio-autosave-v1";

function withoutSessionImages(config: PosterConfig): PosterConfig {
  const copy = structuredClone(config);
  const imageKeys = ["companyLogo", "gameLogoLeft", "gameLogoRight", "person", "bankBar"] as const;
  for (const key of imageKeys) {
    if (/^(blob:|data:)/.test(copy[key].src)) copy[key].src = "";
  }
  if (/^(blob:|data:)/.test(copy.background.src)) copy.background.src = "";
  return copy;
}

function save(key: string, config: PosterConfig) {
  try {
    localStorage.setItem(key, JSON.stringify(withoutSessionImages(config)));
    return true;
  } catch {
    return false;
  }
}

function load(key: string): PosterConfig | null {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as PosterConfig) : null;
  } catch {
    return null;
  }
}

export const savePreset = (config: PosterConfig) => save(PRESET_KEY, config);
export const loadPreset = () => load(PRESET_KEY);
export const saveAutosave = (config: PosterConfig) => save(AUTOSAVE_KEY, config);
export const loadAutosave = () => load(AUTOSAVE_KEY);

