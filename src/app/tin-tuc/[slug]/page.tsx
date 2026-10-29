import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getAllArticles } from "@/lib/articleStorage";
import { siteConfig } from "@/config/siteConfig";
import LeadForm from "@/components/forms/LeadForm";
import {
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  Phone,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Share2,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return {
      title: "Không tìm thấy bài viết",
    };
  }

  return {
    title: `${article.title} | ${siteConfig.brand.name}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.thumbnail || "/images/banners/combo-epl-official.jpg"],
      type: "article",
    },
  };
}

export default function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug, true); // increment views

  if (!article || !article.published) {
    notFound();
  }

  const allArticles = getAllArticles(false);
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-fpt-orange transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/tin-tuc" className="hover:text-fpt-orange transition-colors">
            Tin Tức &amp; Cẩm Nang
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Main Article Content (8 cols) - Clean & Minimal */}
          <article className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 sm:p-10 space-y-6">
            {/* Header info */}
            <div className="space-y-3 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {article.categoryName}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTimeMinutes} phút đọc
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Eye className="w-3.5 h-3.5" />
                  {article.views} lượt xem
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight">
                {article.title}
              </h1>

              <div className="text-xs text-slate-500 font-medium">
                Tác giả: <strong className="text-slate-800">{article.author}</strong>
              </div>
            </div>

            {/* Featured Image */}
            {article.thumbnail && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-auto max-h-[420px] object-cover"
                />
              </div>
            )}

            {/* Excerpt Summary Callout */}
            {article.excerpt && (
              <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/70 border-l-4 border-fpt-orange text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {article.excerpt}
              </div>
            )}

            {/* Rendered HTML Body with Professional Typography */}
            <div
              className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4
                prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:pt-4 prose-h2:border-t prose-h2:border-slate-100
                prose-h3:text-lg sm:prose-h3:text-xl
                prose-p:leading-relaxed prose-p:text-slate-700
                prose-li:text-slate-700
                prose-strong:text-slate-900
                prose-a:text-fpt-orange prose-a:font-bold hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Direct Consultation Box in Article Body - Clean / Minimal */}
            <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Cần đăng ký lắp mạng FPT siêu tốc tại Cần Thơ?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gói Sky 1 Gbps chỉ 195K/tháng • Combo EPL 220K/tháng • Tặng Camera AI miễn phí
                </p>
              </div>
              <a
                href={siteConfig.contact.hotlineTel}
                className="px-4 py-2.5 rounded-xl bg-fpt-orange hover:bg-fpt-hover text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Gọi {siteConfig.contact.hotlineDisplay}</span>
              </a>
            </div>
          </article>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Top Recommended Packages Widget - Clean & Minimal */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block border-b border-slate-100 pb-2">
                2 Gói Cước Bán Chạy Nhất
              </span>

              {/* Card 1: Sky 195K */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Gói SKY (Wi-Fi 6)</h4>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                    1 Gbps
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Chỉ <strong className="text-base font-bold text-slate-900">195.000đ</strong>/tháng
                </div>
                <p className="text-[11px] text-slate-500">
                  Tặng kèm Camera FPT AI an ninh thông minh miễn phí
                </p>
                <Link
                  href="/lap-mang-fpt"
                  className="block w-full py-2 text-center rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  Xem Gói Sky 195K
                </Link>
              </div>

              {/* Card 2: Combo Giga EPL 220K */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Combo GIGA (EPL)</h4>
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                    HOT
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Chỉ <strong className="text-base font-bold text-red-600">220.000đ</strong>/tháng
                </div>
                <p className="text-[11px] text-slate-500">
                  380 trận Ngoại Hạng Anh • Xem Smart TV không cần Box
                </p>
                <Link
                  href="/combo-ngoai-hang-anh"
                  className="block w-full py-2 text-center rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors"
                >
                  Xem Combo EPL 220K
                </Link>
              </div>
            </div>

            {/* Embedded Lead Form in Sidebar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
              <h3 className="font-black text-slate-900 text-sm mb-2 text-center">
                Đăng Ký Khảo Sát Tuyến Cáp 0đ
              </h3>
              <p className="text-[11px] text-slate-500 mb-4 text-center">
                Chuyên viên FPT sẽ liên hệ tư vấn vị trí lắp đặt và cổng quang gần nhất
              </p>
              <LeadForm
                defaultPackage="SKY"
                headline="Nhận Báo Giá Ưu Đãi"
                subheadline="Liên hệ lại sau 5 - 15 phút"
                formLocation="news-sidebar-form"
              />
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block border-b border-slate-100 pb-2">
                  Bài Viết Liên Quan
                </span>
                <div className="divide-y divide-slate-100">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/tin-tuc/${rel.slug}`}
                      className="py-3 block group hover:text-fpt-orange transition-colors"
                    >
                      <h5 className="font-bold text-xs text-slate-800 group-hover:text-fpt-orange line-clamp-2 leading-snug">
                        {rel.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(rel.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
