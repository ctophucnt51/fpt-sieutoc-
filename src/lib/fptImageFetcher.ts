import fs from "fs";
import path from "path";
import crypto from "crypto";
import { readMemoryFile, writeMemoryFile } from "./seoMemory";

const SEO_IMAGES_DIR = path.join(process.cwd(), "data", "seo-images");
const POOL_FILE = "fpt_image_pool.json";

export interface FptImagePoolItem {
  url: string;
  sourceUrl: string;
  filename: string;
  tags: string[];
  bytes: number;
  fetchedAt: string;
}

interface FptImagePoolStore {
  lastSyncedAt: string;
  items: FptImagePoolItem[];
}

function ensureImagesDir(): void {
  if (!fs.existsSync(SEO_IMAGES_DIR)) {
    fs.mkdirSync(SEO_IMAGES_DIR, { recursive: true });
  }
}

function inferTagsFromUrl(url: string): string[] {
  const lower = url.toLowerCase();
  const tags: string[] = [];
  if (lower.includes("wifi7") || lower.includes("wifi-7") || lower.includes("speedx")) {
    tags.push("wifi", "wifi7", "modem", "cong-nghe");
  }
  if (lower.includes("wifi6") || lower.includes("wifi-6") || lower.includes("modem")) {
    tags.push("wifi", "wifi6", "modem", "cong-nghe");
  }
  if (lower.includes("camera") || lower.includes("eyes3") || lower.includes("iq4") || lower.includes("iq3")) {
    tags.push("camera", "an-ninh", "ai");
  }
  if (lower.includes("vvip") || lower.includes("play") || lower.includes("epl")) {
    tags.push("combo", "fpt-play", "ngoai-hang-anh", "truyen-hinh");
  }
  if (lower.includes("giga") || lower.includes("sky") || lower.includes("meta") || lower.includes("internet")) {
    tags.push("internet", "lap-mang", "cap-quang");
  }
  if (lower.includes("hero_d") || lower.includes("hero_desktop") || lower.includes("card_desktop") || lower.includes("1920x")) {
    tags.push("banner", "desktop");
  }
  if (tags.length === 0) tags.push("fpt", "banner");
  return Array.from(new Set(tags));
}

function isGoodBannerCandidate(url: string): boolean {
  const lower = url.toLowerCase();
  if (!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(lower)) return false;
  const blocked = [
    "icon",
    "logo",
    "favicon",
    "message-add",
    "play-circle",
    "wifi-square",
    "avatar",
    "_mobile",
    "card_mobile",
    "hero_m",
    "375x236",
    "-150.",
    "sprite",
  ];
  return !blocked.some((b) => lower.includes(b));
}

/**
 * Chủ động thu thập và lưu cache các ảnh banner/sản phẩm chính thức từ trang chủ https://fpt.vn/
 * về thư mục local `data/seo-images/` để phục vụ nhanh qua `/api/seo-images/[filename]`.
 */
export async function syncFptVnImagePool(forceRefresh = false): Promise<FptImagePoolItem[]> {
  ensureImagesDir();
  const store = readMemoryFile<FptImagePoolStore>(POOL_FILE, { lastSyncedAt: "", items: [] });
  const cacheAgeMs = store.lastSyncedAt ? Date.now() - new Date(store.lastSyncedAt).getTime() : Infinity;

  // Use cached pool if synced within 24h and files still exist
  if (!forceRefresh && cacheAgeMs < 24 * 60 * 60 * 1000 && store.items.length >= 4) {
    const valid = store.items.filter((it) => fs.existsSync(path.join(SEO_IMAGES_DIR, it.filename)));
    if (valid.length >= 4) return valid;
  }

  try {
    const res = await fetch("https://fpt.vn/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return store.items;

    const html = await res.text();
    const matches = html.match(/https?:\/\/[^"' \t\r\n<>\\]+\.(?:jpg|jpeg|png|webp)/gi) || [];
    const uniqueUrls = Array.from(new Set(matches))
      .filter((u) => u.includes("fpt.vn"))
      .filter(isGoodBannerCandidate);

    // Prioritize desktop hero/card/tech/camera/combo images
    const prioritized = uniqueUrls.sort((a, b) => {
      const score = (u: string) => {
        let s = 0;
        if (u.includes("hero_desktop") || u.includes("hero_d") || u.includes("1920x")) s += 5;
        if (u.includes("card_desktop")) s += 4;
        if (u.includes("wifi7") || u.includes("camera") || u.includes("vvip")) s += 3;
        return s;
      };
      return score(b) - score(a);
    });

    const downloaded: FptImagePoolItem[] = [];
    for (const srcUrl of prioritized.slice(0, 18)) {
      try {
        const hash = crypto.createHash("md5").update(srcUrl).digest("hex").slice(0, 10);
        const extMatch = srcUrl.match(/\.(jpg|jpeg|png|webp)/i);
        const ext = (extMatch?.[1] || "webp").toLowerCase();
        const filename = `fptvn-${hash}.${ext}`;
        const localPath = path.join(SEO_IMAGES_DIR, filename);

        let bytes = 0;
        if (fs.existsSync(localPath)) {
          bytes = fs.statSync(localPath).size;
        } else {
          const imgRes = await fetch(srcUrl, { signal: AbortSignal.timeout(8000) });
          if (!imgRes.ok) continue;
          const buf = Buffer.from(await imgRes.arrayBuffer());
          if (buf.length < 15000) continue; // skip tiny icons < 15KB
          fs.writeFileSync(localPath, buf);
          bytes = buf.length;
        }

        if (bytes >= 15000) {
          downloaded.push({
            url: `/api/seo-images/${filename}`,
            sourceUrl: srcUrl,
            filename,
            tags: inferTagsFromUrl(srcUrl),
            bytes,
            fetchedAt: new Date().toISOString(),
          });
        }
      } catch {
        // skip individual broken image URL
      }
      if (downloaded.length >= 12) break;
    }

    if (downloaded.length > 0) {
      writeMemoryFile<FptImagePoolStore>(POOL_FILE, {
        lastSyncedAt: new Date().toISOString(),
        items: downloaded,
      });
      return downloaded;
    }
  } catch {
    // network error -> return existing cached pool
  }

  return store.items;
}

const LOCAL_CURATED_POOL: { url: string; tags: string[] }[] = [
  { url: "/images/products/modem-wifi6-official.png", tags: ["wifi", "wifi6", "modem", "cong-nghe"] },
  { url: "/images/banners/fpt-official-banner.jpg", tags: ["internet", "lap-mang", "wifi", "banner"] },
  { url: "/images/banners/combo-epl-official.jpg", tags: ["combo", "ngoai-hang-anh", "epl", "fpt-play"] },
  { url: "/images/banners/combo-vvip-official.jpg", tags: ["combo", "truyen-hinh", "fpt-play", "vvip"] },
  { url: "/images/banners/fpt-award-banner.jpg", tags: ["camera", "ai", "an-ninh", "banner"] },
  { url: "/images/banners/ngoai-hang-anh-vong-12-fpt-play.jpg", tags: ["ngoai-hang-anh", "epl", "fpt-play"] },
  { url: "/images/banners/vietnam-network-map.png", tags: ["lap-mang", "cap-quang", "cong-nghe"] },
];

/**
 * Chọn ảnh bìa đa dạng, khớp chủ đề từ kho ảnh fpt.vn + ảnh sản phẩm FPT,
 * tự động tránh lặp lại ảnh đã dùng ở các bài viết gần đây.
 */
export async function pickDiverseFptVnCover(params: {
  keyword: string;
  title?: string;
  category?: string;
  usedUrls?: string[];
}): Promise<{ url: string; source: "fpt-vn-official" | "local-curated" }> {
  const fptPool = await syncFptVnImagePool(false);
  const usedSet = new Set((params.usedUrls || []).filter(Boolean));
  const text = `${params.keyword} ${params.title || ""} ${params.category || ""}`.toLowerCase();

  const desiredTags: string[] = [];
  if (text.includes("modem") || text.includes("wifi 7") || text.includes("wi-fi 7") || text.includes("công nghệ")) {
    desiredTags.push("wifi7", "wifi", "modem", "cong-nghe");
  } else if (text.includes("wifi") || text.includes("wi-fi") || text.includes("tốc độ")) {
    desiredTags.push("wifi", "wifi6", "modem", "cong-nghe");
  }
  if (text.includes("camera") || text.includes("an ninh")) {
    desiredTags.push("camera", "an-ninh", "ai");
  }
  if (text.includes("ngoại hạng") || text.includes("epl") || text.includes("truyền hình") || text.includes("fpt play") || text.includes("combo")) {
    desiredTags.push("combo", "fpt-play", "ngoai-hang-anh", "vvip");
  }
  if (desiredTags.length === 0) {
    desiredTags.push("internet", "lap-mang", "cap-quang", "banner", "desktop");
  }

  type Candidate = { url: string; score: number; source: "fpt-vn-official" | "local-curated" };
  const candidates: Candidate[] = [
    ...fptPool.map((item) => ({ url: item.url, tags: item.tags, source: "fpt-vn-official" as const })),
    ...LOCAL_CURATED_POOL.map((item) => ({ url: item.url, tags: item.tags, source: "local-curated" as const })),
  ].map((c) => {
    let score = c.source === "fpt-vn-official" ? 15 : 5;
    for (const tag of desiredTags) {
      if (c.tags.includes(tag)) score += 10;
    }
    if (usedSet.has(c.url)) score -= 100; // strongly avoid recently used covers
    score += Math.random() * 4; // diversify among equal matches
    return { url: c.url, score, source: c.source };
  });

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return {
    url: best?.url || "/images/banners/fpt-official-banner.jpg",
    source: best?.source || "local-curated",
  };
}
