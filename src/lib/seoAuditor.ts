export interface PageAuditResult {
  route: string;
  name: string;
  status: number;
  score: number;
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  h1Count: number;
  imagesWithoutAlt: number;
  hasOgTags: boolean;
  hasCanonical: boolean;
  googleAdsSafe: boolean;
  issues: string[];
}

export const AUDITED_ROUTES: { route: string; name: string }[] = [
  { route: "/", name: "Trang chủ" },
  { route: "/lap-mang-fpt", name: "Internet Wi-Fi 6" },
  { route: "/combo-ngoai-hang-anh", name: "Combo Ngoại Hạng Anh" },
  { route: "/truyen-hinh-fpt", name: "Truyền Hình FPT" },
  { route: "/camera-fpt", name: "Camera FPT AI" },
  { route: "/wifi-6", name: "Công Nghệ Wi-Fi 6" },
  { route: "/bang-gia", name: "Bảng Giá Cước" },
  { route: "/khuyen-mai", name: "Ưu Đãi & Khuyến Mãi" },
  { route: "/quy-trinh-lap-dat", name: "Quy Trình Lắp Đặt" },
  { route: "/hoi-dap", name: "Câu Hỏi Thường Gặp" },
  { route: "/tin-tuc", name: "Tin Tức Viễn Thông" },
  { route: "/chinh-sach-bao-mat", name: "Chính Sách Bảo Mật" },
  { route: "/dieu-khoan", name: "Điều Khoản Dịch Vụ" },
];

export const PROHIBITED_ADS_PATTERNS = [
  /4\.9\/5/i,
  /100K\+\s*KH/i,
  /300\s*KH\s*đầu\s*tiên/i,
  /đơn\s*giản\s*nhất\s*thị\s*trường/i,
  /an\s*toàn\s*tuyệt\s*đối/i,
  /bảo\s*mật\s*tuyệt\s*đối/i,
  /tuyệt\s*đối\s*cam\s*kết/i,
  /bảo\s*hành\s*trọn\s*đời/i,
  /bảo\s*trì\s*trọn\s*đời/i,
  /số\s*1\s*(việt\s*nam|thị\s*trường|thế\s*giới)/i,
  /tốt\s*nhất\s*(thị\s*trường|việt\s*nam)/i,
  /giảm\s*99%/i,
  /100%\s*(không\s*giật|miễn\s*phí\s*mãi)/i,
];

export interface QaCheckResult {
  passed: boolean;
  googleAdsSafe: boolean;
  violations: string[];
}

/**
 * QA & Safety Gate: kiểm tra nội dung văn bản hoặc bài viết trước khi duyệt xuất bản
 */
export function runQaSafetyCheck(input: {
  title?: string;
  description?: string;
  contentHtml?: string;
}): QaCheckResult {
  const combined = [input.title || "", input.description || "", input.contentHtml || ""].join("\n");
  const violations: string[] = [];
  let googleAdsSafe = true;

  for (const pattern of PROHIBITED_ADS_PATTERNS) {
    if (pattern.test(combined)) {
      googleAdsSafe = false;
      violations.push(`Vi phạm chính sách Google Ads: chứa cụm từ cấm (${pattern.source}).`);
    }
  }

  if (/hotro@lapmangfpt-sieutoc\.vn|118\s*Đường\s*30\/4/i.test(combined)) {
    violations.push("Phát hiện thông tin liên hệ cũ (email hoặc địa chỉ sai quy chuẩn cố định).");
  }

  return {
    passed: violations.length === 0,
    googleAdsSafe,
    violations,
  };
}

function extractTagContent(html: string, regex: RegExp): string {
  const m = html.match(regex);
  return m?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || "";
}

export async function auditSingleRoute(
  origin: string,
  routeInfo: { route: string; name: string }
): Promise<PageAuditResult> {
  const url = `${origin.replace(/\/$/, "")}${routeInfo.route}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "FPT-SEO-Auditor/1.0" },
      cache: "no-store",
    });

    const html = await res.text();
    const title = extractTagContent(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = extractTagContent(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i
    ) ||
      extractTagContent(
        html,
        /<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["'][^>]*>/i
      );

    const h1Matches = html.match(/<h1[\s>]/gi) || [];
    const h1Count = h1Matches.length;

    const imgTags = html.match(/<img\b[^>]*>/gi) || [];
    let imagesWithoutAlt = 0;
    for (const img of imgTags) {
      if (!/\balt=/i.test(img)) {
        imagesWithoutAlt++;
      }
    }

    const hasOgTags = /property=["']og:title["']/i.test(html);
    const hasCanonical = /rel=["']canonical["']/i.test(html);

    let googleAdsSafe = true;
    const issues: string[] = [];
    let score = 100;

    if (!title) {
      score -= 25;
      issues.push("Thiếu thẻ <title>.");
    } else if (title.length < 25 || title.length > 75) {
      score -= 10;
      issues.push(`Độ dài Title (${title.length} ký tự) chưa tối ưu (nên 30–65 ký tự).`);
    }

    if (!description) {
      score -= 25;
      issues.push("Thiếu thẻ Meta Description.");
    } else if (description.length < 80 || description.length > 175) {
      score -= 10;
      issues.push(`Độ dài Description (${description.length} ký tự) chưa tối ưu (nên 100–165 ký tự).`);
    }

    if (h1Count === 0) {
      score -= 15;
      issues.push("Thiếu thẻ tiêu đề chính <h1>.");
    } else if (h1Count > 1) {
      score -= 8;
      issues.push(`Có ${h1Count} thẻ <h1> (nên chỉ có 1 thẻ <h1> mỗi trang).`);
    }

    if (imagesWithoutAlt > 0) {
      score -= Math.min(15, imagesWithoutAlt * 5);
      issues.push(`Có ${imagesWithoutAlt} hình ảnh thiếu thuộc tính alt.`);
    }

    if (!hasOgTags) {
      score -= 5;
      issues.push("Thiếu thẻ OpenGraph (og:title) cho chia sẻ mạng xã hội.");
    }

    for (const pattern of PROHIBITED_ADS_PATTERNS) {
      if (pattern.test(html)) {
        googleAdsSafe = false;
        score -= 15;
        issues.push(`Phát hiện cụm từ có nguy cơ vi phạm Google Ads (${pattern.source}).`);
      }
    }

    return {
      route: routeInfo.route,
      name: routeInfo.name,
      status: res.status,
      score: Math.max(0, score),
      title,
      titleLength: title.length,
      description,
      descriptionLength: description.length,
      h1Count,
      imagesWithoutAlt,
      hasOgTags,
      hasCanonical,
      googleAdsSafe,
      issues,
    };
  } catch (err) {
    return {
      route: routeInfo.route,
      name: routeInfo.name,
      status: 500,
      score: 0,
      title: "",
      titleLength: 0,
      description: "",
      descriptionLength: 0,
      h1Count: 0,
      imagesWithoutAlt: 0,
      hasOgTags: false,
      hasCanonical: false,
      googleAdsSafe: true,
      issues: [err instanceof Error ? err.message : "Không thể kiểm tra trang này."],
    };
  }
}

export async function runFullSiteAudit(origin: string): Promise<PageAuditResult[]> {
  return Promise.all(AUDITED_ROUTES.map((r) => auditSingleRoute(origin, r)));
}
