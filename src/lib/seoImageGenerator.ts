import fs from "fs";
import path from "path";
import { checkAndIncrementApiUsage } from "./seoMemory";

const SEO_IMAGES_DIR = path.join(process.cwd(), "data", "seo-images");

export interface GeneratedImageResult {
  success: boolean;
  url: string;
  generatedBy: "gemini-image" | "openai-image" | "fallback";
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

async function generateWithGemini(prompt: string, slugHint: string): Promise<{ ok: boolean; url?: string; error?: string }> {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "").trim();
  if (!apiKey) return { ok: false, error: "Chưa cấu hình GEMINI_API_KEY." };

  // 1. Try Gemini native image generation models
  const geminiModels = [
    process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-2.5-flash-image",
    "gemini-2.0-flash-exp-image-generation",
  ];

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

  // 2. Try Imagen 3 predict endpoint
  try {
    const imagenEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${encodeURIComponent(
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
  fallbackThumbnail: string;
}): Promise<GeneratedImageResult> {
  const prompt = buildImagePrompt(params);
  const slugHint = params.slugHint || params.keyword;

  const hasGemini = Boolean((process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "").trim());
  const hasOpenAi = Boolean((process.env.OPENAI_API_KEY || "").trim());

  if (!hasGemini && !hasOpenAi) {
    return {
      success: false,
      url: params.fallbackThumbnail,
      generatedBy: "fallback",
      prompt,
      error: "Chưa cấu hình API Key AI để tạo ảnh.",
    };
  }

  const budget = checkAndIncrementApiUsage("ai_image");
  if (!budget.allowed) {
    return {
      success: false,
      url: params.fallbackThumbnail,
      generatedBy: "fallback",
      prompt,
      error: `Đã đạt giới hạn tạo ảnh AI hôm nay (${budget.usedToday}/${budget.limitToday}).`,
    };
  }

  const provider = (process.env.SEO_AI_PROVIDER || "auto").toLowerCase().trim();
  let lastError = "";

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

  return {
    success: false,
    url: params.fallbackThumbnail,
    generatedBy: "fallback",
    prompt,
    error: lastError || "Không thể tạo ảnh AI, sử dụng ảnh mặc định.",
  };
}
