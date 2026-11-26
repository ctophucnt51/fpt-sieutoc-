const INDEXNOW_KEY = "gofpt-indexnow-2026";
const HOST = "gofpt.vn";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export interface IndexNowResult {
  success: boolean;
  submittedCount: number;
  status?: number;
  error?: string;
}

/**
 * Ping IndexNow (Bing, Yandex, Seznam, Naver) immediately when content or meta is published.
 */
export async function pingIndexNow(urls: string[]): Promise<IndexNowResult> {
  const cleanUrls = Array.from(
    new Set(
      urls
        .map((u) => (u.startsWith("http") ? u : `https://${HOST}${u.startsWith("/") ? u : `/${u}`}`))
        .filter(Boolean)
    )
  );

  if (cleanUrls.length === 0) {
    return { success: false, submittedCount: 0, error: "Không có URL hợp lệ để gửi IndexNow." };
  }

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: cleanUrls,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok || res.status === 202) {
      return { success: true, submittedCount: cleanUrls.length, status: res.status };
    }

    return {
      success: false,
      submittedCount: 0,
      status: res.status,
      error: `IndexNow trả về HTTP ${res.status}`,
    };
  } catch (err: any) {
    return {
      success: false,
      submittedCount: 0,
      error: err?.message || "Lỗi kết nối IndexNow.",
    };
  }
}
