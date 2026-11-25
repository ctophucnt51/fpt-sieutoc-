import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import {
  getSeoConfig,
  saveSeoConfig,
  getPublicSafeSeoConfig,
  WatchlistKeyword,
} from "@/lib/seoStorage";
import { fetchGscAnalytics } from "@/lib/googleSearchConsole";
import { checkKeywordSerp } from "@/lib/serpChecker";

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  const config = getSeoConfig();
  return NextResponse.json({
    success: true,
    seo: getPublicSafeSeoConfig(config),
  });
}

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Chưa xác thực quyền quản trị." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action } = body;
    const config = getSeoConfig();

    // 1. Lưu cấu hình Google Search Console (hỗ trợ dán nguyên file JSON Service Account)
    if (action === "save_gsc_settings") {
      let siteUrl = String(body.siteUrl || config.gscSettings.siteUrl || "").trim();
      let serviceAccountEmail = String(
        body.serviceAccountEmail || config.gscSettings.serviceAccountEmail || ""
      ).trim();
      let privateKey = String(body.privateKey || "").trim();

      if (body.serviceAccountJson && typeof body.serviceAccountJson === "string") {
        try {
          const parsedJson = JSON.parse(body.serviceAccountJson);
          if (parsedJson.client_email) serviceAccountEmail = String(parsedJson.client_email).trim();
          if (parsedJson.private_key) privateKey = String(parsedJson.private_key).trim();
        } catch {
          return NextResponse.json(
            { success: false, message: "File JSON Service Account không hợp lệ." },
            { status: 400 }
          );
        }
      }

      if (!siteUrl) {
        return NextResponse.json(
          { success: false, message: "Vui lòng nhập Site URL (ví dụ: https://gofpt.vn/ hoặc sc-domain:gofpt.vn)." },
          { status: 400 }
        );
      }

      config.gscSettings = {
        ...config.gscSettings,
        siteUrl,
        serviceAccountEmail,
        privateKey: privateKey || config.gscSettings.privateKey,
        connected: Boolean(siteUrl && serviceAccountEmail && (privateKey || config.gscSettings.privateKey)),
        lastError: undefined,
      };

      saveSeoConfig(config);
      return NextResponse.json({
        success: true,
        message: "Đã lưu cấu hình Google Search Console API!",
        seo: getPublicSafeSeoConfig(config),
      });
    }

    // 2. Đồng bộ dữ liệu từ Google Search Console API
    if (action === "sync_gsc") {
      const dateRange: "7d" | "28d" | "90d" =
        body.dateRange === "7d" || body.dateRange === "90d" ? body.dateRange : "28d";

      if (
        !config.gscSettings.siteUrl ||
        !config.gscSettings.serviceAccountEmail ||
        !config.gscSettings.privateKey
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Chưa cấu hình đầy đủ Google Search Console API (Site URL, Service Account Email, Private Key).",
          },
          { status: 400 }
        );
      }

      try {
        const gscData = await fetchGscAnalytics({
          siteUrl: config.gscSettings.siteUrl,
          serviceAccountEmail: config.gscSettings.serviceAccountEmail,
          privateKey: config.gscSettings.privateKey,
          dateRange,
        });

        // Tự động đối chiếu từ khóa mục tiêu (Watchlist) với dữ liệu thực từ Google Search Console
        const updatedWatchlist: WatchlistKeyword[] = config.watchlistKeywords.map((kw) => {
          const normKw = kw.keyword.toLowerCase().trim();
          const exactMatch = gscData.topQueries.find((q) => q.query.toLowerCase().trim() === normKw);
          const partialMatch =
            exactMatch ||
            gscData.topQueries.find(
              (q) =>
                q.query.toLowerCase().includes(normKw) || normKw.includes(q.query.toLowerCase())
            );

          if (!partialMatch) {
            return kw;
          }

          return {
            ...kw,
            previousPosition: kw.lastPosition,
            lastPosition: partialMatch.position,
            clicks: partialMatch.clicks,
            impressions: partialMatch.impressions,
            ctr: partialMatch.ctr,
            matchedQuery: partialMatch.query,
            updatedAt: new Date().toISOString(),
          };
        });

        config.gscCache = gscData;
        config.watchlistKeywords = updatedWatchlist;
        config.gscSettings.connected = true;
        config.gscSettings.lastSyncedAt = new Date().toISOString();
        config.gscSettings.lastError = undefined;
        saveSeoConfig(config);

        return NextResponse.json({
          success: true,
          message: `Đã đồng bộ thành công ${gscData.topQueries.length} từ khóa từ Google Search Console!`,
          seo: getPublicSafeSeoConfig(config),
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Lỗi kết nối Google Search Console.";
        config.gscSettings.lastError = msg;
        saveSeoConfig(config);
        return NextResponse.json({ success: false, message: msg }, { status: 400 });
      }
    }

    // 3. Thêm từ khóa theo dõi (Watchlist)
    if (action === "add_keyword") {
      const keyword = String(body.keyword || "").trim();
      const targetUrl = String(body.targetUrl || "/").trim();
      if (!keyword) {
        return NextResponse.json(
          { success: false, message: "Vui lòng nhập từ khóa cần theo dõi." },
          { status: 400 }
        );
      }

      const exists = config.watchlistKeywords.some(
        (k) => k.keyword.toLowerCase() === keyword.toLowerCase()
      );
      if (exists) {
        return NextResponse.json(
          { success: false, message: "Từ khóa này đã có trong danh sách theo dõi." },
          { status: 400 }
        );
      }

      const newKw: WatchlistKeyword = {
        id: `kw-${Date.now()}`,
        keyword,
        targetUrl: targetUrl || "/",
        lastPosition: null,
        previousPosition: null,
        clicks: 0,
        impressions: 0,
        ctr: 0,
      };

      // Nếu đã có sẵn gscCache thì khớp ngay lập tức
      if (config.gscCache?.topQueries?.length) {
        const normKw = keyword.toLowerCase();
        const match =
          config.gscCache.topQueries.find((q) => q.query.toLowerCase() === normKw) ||
          config.gscCache.topQueries.find(
            (q) => q.query.toLowerCase().includes(normKw) || normKw.includes(q.query.toLowerCase())
          );
        if (match) {
          newKw.lastPosition = match.position;
          newKw.clicks = match.clicks;
          newKw.impressions = match.impressions;
          newKw.ctr = match.ctr;
          newKw.matchedQuery = match.query;
          newKw.updatedAt = new Date().toISOString();
        }
      }

      config.watchlistKeywords = [newKw, ...config.watchlistKeywords];
      saveSeoConfig(config);

      return NextResponse.json({
        success: true,
        message: `Đã thêm từ khóa "${keyword}" vào danh sách theo dõi!`,
        seo: getPublicSafeSeoConfig(config),
      });
    }

    // 4. Xóa từ khóa theo dõi
    if (action === "remove_keyword") {
      const id = String(body.id || "");
      config.watchlistKeywords = config.watchlistKeywords.filter((k) => k.id !== id);
      saveSeoConfig(config);
      return NextResponse.json({
        success: true,
        message: "Đã xóa từ khóa khỏi danh sách theo dõi.",
        seo: getPublicSafeSeoConfig(config),
      });
    }

    // 5. Lưu cấu hình Serper.dev API (Real-Time SERP & Top 1-3 Đối Thủ)
    if (action === "save_serper_settings") {
      const apiKey = String(body.apiKey || "").trim();
      const targetDomain = String(body.targetDomain || config.serperSettings?.targetDomain || "gofpt.vn").trim();
      const location = String(body.location || config.serperSettings?.location || "Can Tho, Vietnam").trim();

      const effectiveKey = apiKey || config.serperSettings?.apiKey || "";
      if (!effectiveKey) {
        return NextResponse.json(
          { success: false, message: "Vui lòng nhập Serper.dev API Key." },
          { status: 400 }
        );
      }

      config.serperSettings = {
        ...config.serperSettings,
        apiKey: effectiveKey,
        targetDomain,
        location,
        connected: Boolean(effectiveKey),
        lastError: undefined,
      };

      saveSeoConfig(config);
      return NextResponse.json({
        success: true,
        message: "Đã lưu cấu hình Serper.dev SERP API!",
        seo: getPublicSafeSeoConfig(config),
      });
    }

    // 6. Check Top 1-3 Đối Thủ & Thứ hạng thực tế cho 1 từ khóa
    if (action === "check_serp_single") {
      const id = String(body.id || "");
      if (!config.serperSettings?.apiKey) {
        return NextResponse.json(
          { success: false, message: "Chưa cấu hình Serper.dev API Key trong tab Kết Nối API." },
          { status: 400 }
        );
      }

      const targetKw = config.watchlistKeywords.find((k) => k.id === id);
      if (!targetKw) {
        return NextResponse.json({ success: false, message: "Không tìm thấy từ khóa." }, { status: 404 });
      }

      try {
        const result = await checkKeywordSerp({
          keyword: targetKw.keyword,
          apiKey: config.serperSettings.apiKey,
          targetDomain: config.serperSettings.targetDomain,
          location: config.serperSettings.location,
        });

        config.watchlistKeywords = config.watchlistKeywords.map((k) =>
          k.id === id
            ? {
                ...k,
                serpPreviousPosition: k.serpPosition ?? null,
                serpPosition: result.ourPosition,
                serpMatchedUrl: result.ourMatchedUrl,
                topCompetitors: result.topCompetitors,
                serpCheckedAt: result.checkedAt,
              }
            : k
        );
        config.serperSettings.lastCheckedAt = result.checkedAt;
        config.serperSettings.lastError = undefined;
        saveSeoConfig(config);

        return NextResponse.json({
          success: true,
          message: `Đã check xong "${targetKw.keyword}"!`,
          seo: getPublicSafeSeoConfig(config),
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Lỗi gọi Serper.dev API.";
        config.serperSettings.lastError = msg;
        saveSeoConfig(config);
        return NextResponse.json({ success: false, message: msg }, { status: 400 });
      }
    }

    // 7. Check hàng loạt toàn bộ từ khóa Watchlist qua Serper.dev
    if (action === "check_serp_all") {
      if (!config.serperSettings?.apiKey) {
        return NextResponse.json(
          { success: false, message: "Chưa cấu hình Serper.dev API Key trong tab Kết Nối API." },
          { status: 400 }
        );
      }

      try {
        const results = await Promise.all(
          config.watchlistKeywords.map((kw) =>
            checkKeywordSerp({
              keyword: kw.keyword,
              apiKey: config.serperSettings.apiKey,
              targetDomain: config.serperSettings.targetDomain,
              location: config.serperSettings.location,
            })
          )
        );

        const nowIso = new Date().toISOString();
        config.watchlistKeywords = config.watchlistKeywords.map((kw, idx) => {
          const r = results[idx];
          return {
            ...kw,
            serpPreviousPosition: kw.serpPosition ?? null,
            serpPosition: r.ourPosition,
            serpMatchedUrl: r.ourMatchedUrl,
            topCompetitors: r.topCompetitors,
            serpCheckedAt: r.checkedAt,
          };
        });

        config.serperSettings.lastCheckedAt = nowIso;
        config.serperSettings.lastError = undefined;
        saveSeoConfig(config);

        return NextResponse.json({
          success: true,
          message: `Đã quét Top đối thủ theo thời gian thực cho ${results.length} từ khóa!`,
          seo: getPublicSafeSeoConfig(config),
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Lỗi gọi Serper.dev API.";
        config.serperSettings.lastError = msg;
        saveSeoConfig(config);
        return NextResponse.json({ success: false, message: msg }, { status: 400 });
      }
    }

    return NextResponse.json({ success: false, message: "Hành động không hợp lệ." }, { status: 400 });
  } catch (error) {
    console.error("API /api/admin/seo error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi xử lý yêu cầu SEO." },
      { status: 500 }
    );
  }
}
