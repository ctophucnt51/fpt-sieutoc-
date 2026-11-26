import fs from "fs";
import path from "path";
import { checkAndIncrementApiUsage } from "./seoMemory";
import { pickDiverseFptVnCover } from "./fptImageFetcher";

const SEO_IMAGES_DIR = path.join(process.cwd(), "data", "seo-images");

export interface GeneratedImageResult {
  success: boolean;
  url: string;
  generatedBy: "gemini-image" | "openai-image" | "fpt-vn-official" | "local-curated" | "editorial-svg" | "fallback";
  prompt?: string;
  error?: string;
}

function ensureImagesDir(): void {
  if (!fs.existsSync(SEO_IMAGES_DIR)) {
    fs.mkdirSync(SEO_IMAGES_DIR, { recursive: true });
  }
}

function buildImagePrompt(params: {
  keyword: string;
  title?: string;
  category?: string;
  areaName?: string;
}): string {
  const kw = `${params.keyword} ${params.title || ""}`.toLowerCase();
  const area = params.areaName || "Can Tho, Vietnam";

  let scene =
    "A sleek modern Vietnamese family living room with a glowing orange and white Wi-Fi 6 fiber optic router on a minimalist wooden console, warm natural sunlight, ultra-fast wireless internet aura, clean editorial lifestyle photography";

  if (kw.includes("ngoại hạng") || kw.includes("epl") || kw.includes("bóng đá") || kw.includes("truyền hình") || kw.includes("fpt play")) {
    scene =
      "A modern stylish Vietnamese living room at night with a large ultra-thin 4K Smart TV displaying an exciting live stadium football match in vivid colors, warm ambient orange accent lighting, cozy sofa, clean editorial photography";
  } else if (kw.includes("camera") || kw.includes("an ninh")) {
    scene =
      "A sleek modern white smart AI security camera mounted cleanly under the eave of a contemporary Vietnamese townhouse, subtle glowing status LED, sunny morning sky, architectural editorial photography";
  } else if (kw.includes("wifi 6") || kw.includes("wi-fi 6") || kw.includes("modem") || kw.includes("tốc độ")) {
    scene =
      "Close-up editorial tech photography of a futuristic matte white and orange dual-band Wi-Fi 6 router on a clean desk next to a sleek laptop, soft fiber optic light trails in the background, crisp studio lighting";
  } else if (kw.includes("doanh nghiệp") || kw.includes("quán") || kw.includes("cafe") || kw.includes("game")) {
    scene =
      "A vibrant modern Vietnamese coworking cafe with people working smoothly on laptops, sleek ceiling Wi-Fi access point, warm orange and slate interior design, natural daylight, editorial photography";
  } else if (area && !area.toLowerCase().includes("cần thơ")) {
    scene = `Modern suburban Vietnamese home interior in ${area} with high-speed fiber optic Wi-Fi 6 router, bright clean minimalist aesthetic, warm orange accent decor, editorial lifestyle photography`;
  }

  return `${scene}. Widescreen 16:9 composition, photorealistic, high contrast, crisp focus. Strictly NO text, NO letters, NO words, NO logos, NO watermarks anywhere in the image.`;
}

function saveBase64Image(base64Data: string, slugHint: string, ext: "png" | "jpg" = "png"): string {
  ensureImagesDir();
  const safeSlug = (slugHint || "seo-cover")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const filename = `${safeSlug || "seo"}-${Date.now()}.${ext}`;
  const filePath = path.join(SEO_IMAGES_DIR, filename);
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(filePath, buffer);
  return `/api/seo-images/${filename}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Tạo ảnh bìa Editorial SVG sắc nét (1200x675) phù hợp nội dung & thương hiệu GoFPT.vn
 * khi Gemini/OpenAI Image API không khả dụng trên gói Free Tier.
 */
function generateEditorialSvgCover(params: {
  keyword: string;
  title?: string;
  areaName?: string;
  slugHint: string;
}): string {
  ensureImagesDir();
  const rawTitle = (params.title || params.keyword || "Lắp Mạng FPT Wi-Fi 6").trim();
  const words = rawTitle.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > 34 && current) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
    if (lines.length >= 3) break;
  }
  if (current && lines.length < 3) lines.push(current.trim());

  const kwLower = `${params.keyword} ${rawTitle}`.toLowerCase();
  const badgeText = kwLower.includes("camera")
    ? "CAMERA FPT AI • AN NINH CLOUD"
    : kwLower.includes("ngoại hạng") || kwLower.includes("epl") || kwLower.includes("truyền hình")
    ? "COMBO FPT PLAY • NGOẠI HẠNG ANH"
    : "INTERNET CÁP QUANG • WI-FI 6";
  const areaLabel = escapeXml((params.areaName || "Cần Thơ & ĐBSCL").toUpperCase());

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="55%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#431407"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f37021"/>
      <stop offset="100%" stop-color="#fb923c"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="1030" cy="140" r="240" fill="#f37021" opacity="0.14"/>
  <circle cx="1060" cy="540" r="190" fill="#38bdf8" opacity="0.1"/>
  <rect x="72" y="72" width="1056" height="531" rx="28" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
  <rect x="112" y="116" width="380" height="40" rx="20" fill="url(#accent)"/>
  <text x="302" y="142" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">${escapeXml(badgeText)}</text>
  <text x="112" y="218" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="#fdba74" letter-spacing="1.5">KHU VỰC: ${areaLabel}</text>
  ${lines
    .map(
      (line, idx) =>
        `<text x="112" y="${282 + idx * 62}" font-family="Inter, Arial, sans-serif" font-size="46" font-weight="900" fill="#ffffff">${escapeXml(line)}</text>`
    )
    .join("\n  ")}
  <rect x="112" y="486" width="96" height="6" rx="3" fill="#f37021"/>
  <text x="112" y="534" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#e2e8f0">GoFPT.vn — Đại Lý Ủy Quyền FPT Telecom • Hotline 0878 800 400</text>
  <text x="112" y="568" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="500" fill="#94a3b8">Wi-Fi 6 từ 195.000đ/tháng • Combo Ngoại Hạng Anh 220.000đ/tháng • Lắp đặt trong 24h</text>
</svg>`;

  const safeSlug = (params.slugHint || "seo-cover")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const filename = `${safeSlug || "seo"}-${Date.now()}.svg`;
  const filePath = path.join(SEO_IMAGES_DIR, filename);
  fs.writeFileSync(filePath, svg, "utf8");
  return `/api/seo-images/${filename}`;
}

async function generateWithGemini(prompt: string, slugHint: string): Promise<{ ok: boolean; url?: string; error?: string }> {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "").trim();
  if (!apiKey) return { ok: false, error: "Chưa cấu hình GEMINI_API_KEY." };

  // 1. Try Gemini native image generation models
  const geminiModels = Array.from(
    new Set([
      process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-2.5-flash-image",
      "gemini-2.0-flash-exp-image-generation",
    ])
  );

  let lastError = "Gemini Image không phản hồi.";
  for (const model of geminiModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        }),
        signal: AbortSignal.timeout(45000),
      });

      const json = await res.json();
      if (!res.ok) {
        lastError = json?.error?.message || `Gemini Image (${model}) HTTP ${res.status}`;
        continue;
      }

      const parts = json?.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find((p: any) => p?.inlineData?.data);
      if (imgPart?.inlineData?.data) {
        const mime = String(imgPart.inlineData.mimeType || "image/png");
        const ext = mime.includes("jpeg") || mime.includes("jpg") ? "jpg" : "png";
        const url = saveBase64Image(imgPart.inlineData.data, slugHint, ext);
        return { ok: true, url };
      }
    } catch (err: any) {
      lastError = err?.message || `Lỗi khi gọi ${model}`;
    }
  }

  // 2. Try Imagen 4 predict endpoints (current v1beta models)
  for (const imagenModel of ["imagen-4.0-fast-generate-001", "imagen-4.0-generate-001"]) {
    try {
      const imagenEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${imagenModel}:predict?key=${encodeURIComponent(
        apiKey
      )}`;
      const res = await fetch(imagenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: "16:9" },
        }),
        signal: AbortSignal.timeout(45000),
      });
      const json = await res.json();
      const b64 = json?.predictions?.[0]?.bytesBase64Encoded;
      if (res.ok && b64) {
        const url = saveBase64Image(b64, slugHint, "png");
        return { ok: true, url };
      }
      if (!res.ok) {
        lastError = json?.error?.message || lastError;
      }
    } catch (err: any) {
      lastError = err?.message || lastError;
    }
  }

  return { ok: false, error: lastError };
}

async function generateWithOpenAi(prompt: string, slugHint: string): Promise<{ ok: boolean; url?: string; error?: string }> {
  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) return { ok: false, error: "Chưa cấu hình OPENAI_API_KEY." };

  const model = (process.env.OPENAI_IMAGE_MODEL || "dall-e-3").trim();
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size: model === "dall-e-3" ? "1792x1024" : "1536x1024",
        response_format: "b64_json",
      }),
      signal: AbortSignal.timeout(55000),
    });

    const json = await res.json();
    const b64 = json?.data?.[0]?.b64_json;
    if (res.ok && b64) {
      const url = saveBase64Image(b64, slugHint, "png");
      return { ok: true, url };
    }
    return { ok: false, error: json?.error?.message || `OpenAI Image HTTP ${res.status}` };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Lỗi khi gọi OpenAI Image API." };
  }
}

/**
 * Tạo ảnh bìa AI phù hợp với nội dung bài viết SEO.
 * Tự động fallback giữa Gemini Image -> OpenAI Image -> Thumbnail tĩnh có sẵn.
 */
export async function generateArticleCoverImage(params: {
  keyword: string;
  title?: string;
  category?: string;
  areaName?: string;
  slugHint?: string;
  usedUrls?: string[];
  fallbackThumbnail: string;
}): Promise<GeneratedImageResult> {
  const prompt = buildImagePrompt(params);
  const slugHint = params.slugHint || params.keyword;

  const hasGemini = Boolean((process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "").trim());
  const hasOpenAi = Boolean((process.env.OPENAI_API_KEY || "").trim());

  let lastError = "";
  const budget = hasGemini || hasOpenAi ? checkAndIncrementApiUsage("ai_image") : { allowed: false, usedToday: 0, limitToday: 0 };

  if (budget.allowed) {
    const provider = (process.env.SEO_AI_PROVIDER || "auto").toLowerCase().trim();
    if (provider === "openai" && hasOpenAi) {
      const oai = await generateWithOpenAi(prompt, slugHint);
      if (oai.ok && oai.url) {
        return { success: true, url: oai.url, generatedBy: "openai-image", prompt };
      }
      lastError = oai.error || "";
    } else {
      if (hasGemini) {
        const gem = await generateWithGemini(prompt, slugHint);
        if (gem.ok && gem.url) {
          return { success: true, url: gem.url, generatedBy: "gemini-image", prompt };
        }
        lastError = gem.error || "";
      }
      if (hasOpenAi) {
        const oai = await generateWithOpenAi(prompt, slugHint);
        if (oai.ok && oai.url) {
          return { success: true, url: oai.url, generatedBy: "openai-image", prompt };
        }
        lastError = oai.error || lastError;
      }
    }
  }

  // 2. Chủ động lấy ảnh đa dạng từ trang chủ fpt.vn (đã cache local) + kho ảnh sản phẩm FPT
  try {
    const picked = await pickDiverseFptVnCover({
      keyword: params.keyword,
      title: params.title,
      category: params.category,
      usedUrls: params.usedUrls,
    });
    return {
      success: true,
      url: picked.url,
      generatedBy: picked.source,
      prompt,
      error: lastError || undefined,
    };
  } catch {
    // fall through to editorial SVG
  }

  // 3. Fallback cuối cùng: tạo ảnh bìa Editorial SVG theo tiêu đề
  try {
    const svgUrl = generateEditorialSvgCover({
      keyword: params.keyword,
      title: params.title,
      areaName: params.areaName,
      slugHint,
    });
    return {
      success: true,
      url: svgUrl,
      generatedBy: "editorial-svg",
      prompt,
      error: lastError || undefined,
    };
  } catch {
    return {
      success: false,
      url: params.fallbackThumbnail,
      generatedBy: "fallback",
      prompt,
      error: lastError || "Không thể tạo ảnh AI, sử dụng ảnh mặc định.",
    };
  }
}
