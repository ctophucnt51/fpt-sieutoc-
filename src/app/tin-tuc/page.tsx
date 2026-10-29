import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articleStorage";
import { siteConfig } from "@/config/siteConfig";
import { Clock, Eye, Calendar, ArrowRight, BookOpen, ChevronRight, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Lắp Mạng FPT Cần Thơ - Bảng Giá Cước & Khuyến Mãi Mới Nhất 2026 | FPT Cần Thơ",
  description:
    "Tổng hợp bảng giá lắp mạng FPT Cần Thơ, combo Internet cáp quang Wi-Fi 6 và truyền hình FPT Cần Thơ mới nhất 2026. Đăng ký lắp mạng FPT Cần Thơ nhận ngay modem Wi-Fi 6 và camera AI miễn phí.",
  keywords: [
    "Lắp mạng FPT Cần Thơ",
    "FPT Cần Thơ",
    "Lắp internet FPT Cần Thơ",
    "Cáp quang FPT Cần Thơ",
    "Gói cước FPT Cần Thơ",
    "FPT Telecom Cần Thơ",
  ],
};

export default function TinTucPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const currentCategory = searchParams.category || "all";
  const allArticles = getAllArticles(false);

  const filteredArticles =
    currentCategory === "all"
      ? allArticles
      : allArticles.filter((a) => a.category === currentCategory);

  const featuredArticle = allArticles.find((a) => a.featured) || allArticles[0];

  const categories = [
    { id: "all", name: "Tất Cả Bài Viết" },
    { id: "khuyen-mai", name: "Khuyến Mãi" },
    { id: "huong-dan", name: "Hướng Dẫn Kỹ Thuật" },
    { id: "tin-tuc", name: "Tin Tức FPT" },
    { id: "goi-cuoc", name: "Tư Vấn Gói Cước" },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-fpt-orange transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-medium">Tin Tức &amp; Cẩm Nang</span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-6 sm:mb-8">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs uppercase tracking-wider mb-1.5">
            FPT Telecom Cần Thơ • 2026
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Lắp Mạng FPT Cần Thơ: Tin Tức &amp; Bảng Giá FPT Cần Thơ Mới Nhất
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Tổng hợp thông tin chính thống về dịch vụ <strong>lắp mạng FPT Cần Thơ</strong>, các gói cước Wi-Fi 6 siêu tốc từ 195K/tháng, ưu đãi tặng Camera AI và thủ tục đăng ký lắp mạng nhanh chóng tại văn phòng giao dịch <strong>FPT Cần Thơ</strong>.
          </p>
        </div>

        {/* Category Filter Pills - White Glassmorphism */}
        <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === "all" ? "/tin-tuc" : `/tin-tuc?category=${cat.id}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                currentCategory === cat.id
                  ? "bg-fpt-orange text-white shadow-[0_2px_10px_rgba(243,112,33,0.3)]"
                  : "bg-white/85 backdrop-blur-md text-slate-700 border border-slate-200/80 hover:border-orange-200 hover:text-fpt-orange shadow-2xs"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Featured Top Article (If on 'all' tab) */}
        {currentCategory === "all" && featuredArticle && (
          <div className="mb-10 rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs hover:border-slate-300 transition-all group">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 overflow-hidden relative min-h-[240px] sm:min-h-[320px]">
                <img
                  src={featuredArticle.thumbnail}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-slate-900/90 text-white font-semibold text-[10px] uppercase shadow-xs">
                  Bài Viết Nổi Bật
                </span>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">
                      {featuredArticle.categoryName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      {featuredArticle.readTimeMinutes} phút đọc
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-fpt-orange transition-colors">
                    <Link href={`/tin-tuc/${featuredArticle.slug}`}>
                      {featuredArticle.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed font-normal">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-normal">
                    {featuredArticle.author}
                  </span>
                  <Link
                    href={`/tin-tuc/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-fpt-orange transition-colors"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative overflow-hidden h-44 bg-slate-100">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-slate-700 font-medium text-[10px] shadow-2xs">
                    {article.categoryName}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTimeMinutes} phút đọc
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-fpt-orange transition-colors line-clamp-2 leading-snug">
                    <Link href={`/tin-tuc/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-normal truncate max-w-[60%]">
                  {article.author}
                </span>
                <Link
                  href={`/tin-tuc/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-fpt-orange transition-colors"
                >
                  <span>Chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fast Consultation Banner - White Glassmorphism */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-2xl text-slate-900 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-orange-200/90 shadow-[0_12px_40px_rgba(243,112,33,0.08)]">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
              Cần Tư Vấn Khảo Sát Tuyến Cáp Nhanh Chóng?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              Đội ngũ chuyên viên FPT hỗ trợ kiểm tra cổng quang tại nhà miễn phí trong 15 phút.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={siteConfig.contact.hotlineTel}
              className="px-5 py-2.5 rounded-full bg-fpt-orange hover:bg-fpt-hover text-white font-bold text-xs shadow-[0_4px_16px_rgba(243,112,33,0.3)] transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Gọi {siteConfig.contact.hotlineDisplay}</span>
            </a>
            <Link
              href="/#lead-form"
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors whitespace-nowrap"
            >
              Đăng Ký Khảo Sát 0đ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
