import fs from "fs";
import path from "path";
import { siteConfig as defaultSiteConfig, PackageItem, AreaOption } from "@/config/siteConfig";

export type SiteConfigType = typeof defaultSiteConfig;

const PERSISTENT_DIR = path.join(process.cwd(), "data");
const SEED_DIR = path.join(process.cwd(), "src", "data");
const CONFIG_FILE = path.join(PERSISTENT_DIR, "siteConfig.json");
const SEED_CONFIG_FILE = path.join(SEED_DIR, "siteConfig.json");

function ensureConfigFile(): void {
  if (!fs.existsSync(PERSISTENT_DIR)) {
    fs.mkdirSync(PERSISTENT_DIR, { recursive: true });
  }

  // If persistent file doesn't exist yet, check seed file first or fallback to defaults
  if (!fs.existsSync(CONFIG_FILE)) {
    if (fs.existsSync(SEED_CONFIG_FILE)) {
      try {
        fs.copyFileSync(SEED_CONFIG_FILE, CONFIG_FILE);
        return;
      } catch (err) {
        console.error("Error copying seed config to persistent data directory:", err);
      }
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultSiteConfig, null, 2), "utf8");
  }
}

/**
 * Read the current dynamic site configuration.
 * Falls back safely to default siteConfig if file is missing or corrupted.
 */
export function getDynamicConfig(): SiteConfigType {
  ensureConfigFile();
  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf8");
    const parsed = JSON.parse(raw);
    // Deep merge with defaults to avoid any missing property crashes
    return {
      ...defaultSiteConfig,
      ...parsed,
      brand: { ...defaultSiteConfig.brand, ...(parsed.brand || {}) },
      contact: { ...defaultSiteConfig.contact, ...(parsed.contact || {}) },
      promo: { ...defaultSiteConfig.promo, ...(parsed.promo || {}) },
      tracking: { ...defaultSiteConfig.tracking, ...(parsed.tracking || {}) },
      disclaimer: { ...defaultSiteConfig.disclaimer, ...(parsed.disclaimer || {}) },
      packages: parsed.packages || defaultSiteConfig.packages,
      popularAreas: parsed.popularAreas || defaultSiteConfig.popularAreas,
    };
  } catch (error) {
    console.error("Error reading dynamic config file, falling back to defaults:", error);
    return defaultSiteConfig;
  }
}

/**
 * Save updated configuration to disk.
 */
export function saveDynamicConfig(updatedConfig: Partial<SiteConfigType>): SiteConfigType {
  ensureConfigFile();
  const current = getDynamicConfig();
  
  const cleanContact = {
    ...current.contact,
    ...(updatedConfig.contact || {}),
  };
  
  // Keep hotlineTel synced automatically with hotlineRaw
  if (cleanContact.hotlineRaw) {
    cleanContact.hotlineRaw = cleanContact.hotlineRaw.replace(/\D/g, "");
    cleanContact.hotlineTel = `tel:${cleanContact.hotlineRaw}`;
  }

  const merged: SiteConfigType = {
    ...current,
    ...updatedConfig,
    brand: { ...current.brand, ...(updatedConfig.brand || {}) },
    contact: cleanContact,
    promo: { ...current.promo, ...(updatedConfig.promo || {}) },
    tracking: { ...current.tracking, ...(updatedConfig.tracking || {}) },
    disclaimer: { ...current.disclaimer, ...(updatedConfig.disclaimer || {}) },
    packages: updatedConfig.packages || current.packages,
    popularAreas: updatedConfig.popularAreas || current.popularAreas,
  };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), "utf8");
  if (fs.existsSync(SEED_DIR)) {
    try {
      fs.writeFileSync(SEED_CONFIG_FILE, JSON.stringify(merged, null, 2), "utf8");
    } catch {}
  }
  return merged;
}

/**
 * Reset config back to default factory settings.
 */
export function resetDynamicConfig(): SiteConfigType {
  ensureConfigFile();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultSiteConfig, null, 2), "utf8");
  if (fs.existsSync(SEED_DIR)) {
    try {
      fs.writeFileSync(SEED_CONFIG_FILE, JSON.stringify(defaultSiteConfig, null, 2), "utf8");
    } catch {}
  }
  return defaultSiteConfig;
}
