"use client";

import { useState } from "react";
import { Article, slugifyVietnamese } from "@/types/article";
import { getAdminHeaders } from "@/lib/clientAdminAuth";
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  ExternalLink,
  Save,
  X,
  Sparkles,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ArticleManagementProps {
  articles: Article[];
  onRefresh: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function ArticleManagement({
  articles,
  onRefresh,
  showToast,
}: ArticleManagementProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "published" | "draft">("all");

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<"edit" | "preview">("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [category, setCategory] = useState<Article["category"]>("khuyen-mai");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("/images/banners/combo-epl-official.jpg");
  const [author, setAuthor] = useState("FPT Telecom Cần Thơ");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Delete Confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered list
  const filteredArticles = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "all" || a.category === selectedCategory;
    const matchStatus =
      selectedStatus === "all" ||
      (selectedStatus === "published" && a.published) ||
      (selectedStatus === "draft" && !a.published);
    return matchSearch && matchCategory && matchStatus;
  });

  // Open modal for Create New
  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setAutoSlug(true);
    setCategory("khuyen-mai");
    setExcerpt("");
    setContent(`<h2>1. Giới thiệu chương trình</h2>
<p>Nội dung chi tiết giới thiệu gói cước, tính năng và chương trình khuyến mại mới nhất tại Thành phố Cần Thơ...</p>

<h2>2. Bảng giá & Lợi ích nổi bật</h2>
<ul>
  <li>Trang bị Modem Wi-Fi 6 băng tần kép thế hệ mới</li>
  <li>Đặc biệt: Tặng kèm Camera FPT AI an ninh thông minh miễn phí</li>
  <li>Khảo sát và hoàn tất lắp đặt trong 24 giờ</li>
</ul>

<h2>3. Hướng dẫn đăng ký nhanh</h2>
<p>Quý khách liên hệ trực tiếp hotline 0878 800 400 để được phục vụ 24/7.</p>`);
    setThumbnail("/images/banners/combo-epl-official.jpg");
    setAuthor("FPT Telecom Cần Thơ");
    setPublished(true);
    setFeatured(false);
    setActiveEditorTab("edit");
    setIsEditorOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setAutoSlug(false);
    setCategory(article.category);
    setExcerpt(article.excerpt);
    setContent(article.content);
    setThumbnail(article.thumbnail || "/images/banners/combo-epl-official.jpg");
    setAuthor(article.author);
    setPublished(article.published);
    setFeatured(Boolean(article.featured));
    setActiveEditorTab("edit");
    setIsEditorOpen(true);
  };

  // Auto-slugify when title changes if autoSlug enabled
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(slugifyVietnamese(val));
    }
  };

  // Toolbar action helpers
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("article-content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || "Nội dung"}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  // Save Article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("Vui lòng nhập tiêu đề và nội dung bài viết.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Article> = {
        id: editingId || undefined,
        title: title.trim(),
        slug: slug.trim() || slugifyVietnamese(title),
        category,
        excerpt: excerpt.trim(),
        content,
        thumbnail,
        author: author.trim(),
        published,
        featured,
      };

      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: getAdminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Không thể lưu bài viết.", "error");
        return;
      }

      showToast(editingId ? "Đã cập nhật bài viết thành công!" : "Đã tạo bài viết mới thành công!");
      setIsEditorOpen(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || "Lỗi lưu bài viết.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Published Status quickly
  const handleTogglePublish = async (article: Article) => {
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: getAdminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          id: article.id,
          published: !article.published,
        }),
      });

      if (res.ok) {
        showToast(article.published ? "Đã chuyển bài viết về Bản nháp" : "Đã xuất bản bài viết thành công!");
        onRefresh();
      } else {
        showToast("Không thể đổi trạng thái bài viết.", "error");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ.", "error");
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });

      if (res.ok) {
        showToast("Đã xóa bài viết thành công!");
        setDeleteConfirmId(null);
        onRefresh();
      } else {
        showToast("Không thể xóa bài viết.", "error");
      }
    } catch {
      showToast("Lỗi kết nối máy chủ.", "error");
    }
  };

  // Category label helper
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "khuyen-mai":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-fpt-dark border border-orange-200">Khuyến Mãi</span>;
      case "huong-dan":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">Hướng Dẫn</span>;
      case "tin-tuc":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Tin Tức FPT</span>;
      case "goi-cuoc":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">Gói Cước</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{cat}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Quản Lý Bài Viết &amp; Tin Tức FPT
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-fpt-dark font-extrabold text-xs">
              {articles.length} bài
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Soạn thảo, cập nhật khuyến mãi và xuất bản các bài viết tư vấn khách hàng chuẩn SEO Google
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-fpt-orange to-fpt-dark text-white font-bold text-xs shadow-cta hover:opacity-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Soạn Bài Viết Mới</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề hoặc slug..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 bg-white outline-none focus:border-fpt-orange"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 bg-white outline-none focus:border-fpt-orange"
          >
            <option value="all">Tất cả chuyên mục</option>
            <option value="khuyen-mai">Khuyến Mãi</option>
            <option value="huong-dan">Hướng Dẫn Kỹ Thuật</option>
            <option value="tin-tuc">Tin Tức FPT</option>
            <option value="goi-cuoc">Tư Vấn Gói Cước</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-800 bg-white outline-none focus:border-fpt-orange"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* Articles List / Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Mobile Cards (Visible on screens < md) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-medium text-xs">Chưa có bài viết nào phù hợp.</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div key={article.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={article.thumbnail || "/images/banners/combo-epl-official.jpg"}
                    alt={article.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getCategoryBadge(article.category)}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      /{article.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublish(article)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] cursor-pointer transition-all ${
                        article.published
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          article.published ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span>{article.published ? "Đã Xuất Bản" : "Bản Nháp"}</span>
                    </button>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {article.views} xem
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={`/tin-tuc/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Xem trên web"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleOpenEdit(article)}
                      className="p-2 rounded-xl text-slate-600 hover:text-fpt-orange hover:bg-orange-50 transition-colors"
                      title="Chỉnh sửa bài viết"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(article.id)}
                      className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table (Hidden on screens < md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Bài Viết</th>
                <th className="py-3 px-4">Chuyên Mục</th>
                <th className="py-3 px-4">Lượt Xem</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4">Ngày Đăng</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-xs">Chưa có bài viết nào phù hợp.</p>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.thumbnail || "/images/banners/combo-epl-official.jpg"}
                          alt={article.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 line-clamp-1 leading-snug">
                            {article.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                            /{article.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getCategoryBadge(article.category)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-600">
                      {article.views.toLocaleString()} lượt
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(article)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] cursor-pointer transition-all ${
                          article.published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click để đổi trạng thái"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            article.published ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{article.published ? "Đã Xuất Bản" : "Bản Nháp"}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <a
                          href={`/tin-tuc/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Xem trên web"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleOpenEdit(article)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-fpt-orange hover:bg-orange-50 transition-colors"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(article.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-base">Xác Nhận Xóa Bài Viết</h3>
            <p className="text-xs text-slate-600">
              Hành động này sẽ xóa vĩnh viễn bài viết khỏi hệ thống và không thể phục hồi. Bạn có chắc chắn muốn xóa?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteArticle(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 cursor-pointer"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Featured Article Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[92vh] max-w-4xl sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
              <div className="min-w-0 pr-2">
                <h3 className="font-black text-slate-900 text-sm sm:text-lg truncate">
                  {editingId ? "Chỉnh Sửa Bài Viết" : "Soạn Bài Viết Mới"}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                  {editingId ? `ID: ${editingId}` : "Hỗ trợ định dạng HTML trực quan và tự động tạo slug"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Tab switch between Edit and Preview */}
                <div className="flex bg-slate-200 p-0.5 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab("edit")}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                      activeEditorTab === "edit" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                    }`}
                  >
                    Soạn Thảo
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab("preview")}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                      activeEditorTab === "preview" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                    }`}
                  >
                    Xem Trước
                  </button>
                </div>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {activeEditorTab === "edit" ? (
                <form id="article-form" onSubmit={handleSaveArticle} className="space-y-4">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-7">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tiêu Đề Bài Viết <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="VD: Khuyến Mãi Lắp Mạng FPT Cần Thơ Tháng Này"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 outline-none"
                      />
                    </div>

                    <div className="md:col-span-5">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700">Đường Dẫn (Slug)</label>
                        <button
                          type="button"
                          onClick={() => {
                            setAutoSlug(!autoSlug);
                            if (!autoSlug) setSlug(slugifyVietnamese(title));
                          }}
                          className="text-[10px] text-fpt-orange font-bold hover:underline"
                        >
                          {autoSlug ? "Đang Tự Động" : "Tạo Lại Theo Tiêu Đề"}
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => {
                          setAutoSlug(false);
                          setSlug(e.target.value);
                        }}
                        placeholder="khuyen-mai-lap-mang-fpt-can-tho"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:border-fpt-orange focus:ring-2 focus:ring-orange-100 outline-none"
                      />
                    </div>
                  </div>

                  {/* Category, Thumbnail & Author */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên Mục</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-fpt-orange outline-none bg-white"
                      >
                        <option value="khuyen-mai">Khuyến Mãi</option>
                        <option value="huong-dan">Hướng Dẫn Kỹ Thuật</option>
                        <option value="tin-tuc">Tin Tức FPT</option>
                        <option value="goi-cuoc">Tư Vấn Gói Cước</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ảnh Đại Diện (URL)</label>
                      <input
                        type="text"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        placeholder="/images/banners/combo-epl-official.jpg"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-fpt-orange outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tác Giả</label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="FPT Telecom Cần Thơ"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-fpt-orange outline-none"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tóm Tắt Ngắn (Excerpt cho SEO và thẻ xem trước)
                    </label>
                    <textarea
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Tóm tắt nội dung chính trong 1 - 2 câu ngắn gọn..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-fpt-orange outline-none"
                    />
                  </div>

                  {/* Content Formatting Toolbar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Nội Dung Bài Viết (Hỗ trợ HTML/Rich Format) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Sử dụng thanh công cụ để chèn thẻ định dạng nhanh
                      </span>
                    </div>

                    {/* Toolbar (Wrap on mobile, zero horizontal scroll) */}
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 border border-slate-200 rounded-t-xl">
                      <button
                        type="button"
                        onClick={() => insertFormatting("<h2>", "</h2>")}
                        className="p-1.5 rounded hover:bg-white text-slate-700 font-bold text-xs shrink-0"
                        title="Tiêu đề H2"
                      >
                        <Heading2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("<h3>", "</h3>")}
                        className="p-1.5 rounded hover:bg-white text-slate-700 font-bold text-xs shrink-0"
                        title="Tiêu đề H3"
                      >
                        <Heading3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("<strong>", "</strong>")}
                        className="p-1.5 rounded hover:bg-white text-slate-700 font-bold text-xs shrink-0"
                        title="In đậm (Bold)"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("<em>", "</em>")}
                        className="p-1.5 rounded hover:bg-white text-slate-700 font-bold text-xs shrink-0"
                        title="In nghiêng (Italic)"
                      >
                        <Italic className="w-4 h-4" />
                      </button>

                      <span className="w-px h-4 bg-slate-300 mx-1 shrink-0" />

                      <button
                        type="button"
                        onClick={() => insertFormatting("<ul>\n  <li>", "</li>\n  <li>Mục 2</li>\n</ul>")}
                        className="p-1.5 rounded hover:bg-white text-slate-700 shrink-0"
                        title="Danh sách gạch đầu dòng"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("<ol>\n  <li>", "</li>\n  <li>Bước 2</li>\n</ol>")}
                        className="p-1.5 rounded hover:bg-white text-slate-700 shrink-0"
                        title="Danh sách thứ tự"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting("<blockquote>", "</blockquote>")}
                        className="p-1.5 rounded hover:bg-white text-slate-700 shrink-0"
                        title="Đoạn trích dẫn"
                      >
                        <Quote className="w-4 h-4" />
                      </button>

                      <span className="w-px h-4 bg-slate-300 mx-1 shrink-0" />

                      <button
                        type="button"
                        onClick={() => insertFormatting('<a href="tel:0878800400" class="text-fpt-orange font-bold">', "</a>")}
                        className="p-1.5 rounded hover:bg-white text-slate-700 text-xs font-semibold px-2 shrink-0"
                        title="Chèn liên kết Hotline"
                      >
                        + Link Hotline
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<div class="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-fpt-dark font-bold my-4">\n  ', "\n</div>")}
                        className="p-1.5 rounded hover:bg-white text-slate-700 text-xs font-semibold px-2 shrink-0"
                        title="Hộp lưu ý nổi bật"
                      >
                        + Khung Lưu Ý
                      </button>
                    </div>

                    <textarea
                      id="article-content-textarea"
                      rows={12}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-4 rounded-b-xl border-x border-b border-slate-300 text-xs font-mono text-slate-800 focus:border-fpt-orange outline-none bg-slate-50/30"
                      placeholder="Nhập nội dung bài viết dạng HTML..."
                    />
                  </div>

                  {/* Publish & Featured Toggles */}
                  <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className="w-4 h-4 rounded text-fpt-orange focus:ring-fpt-orange"
                      />
                      <span>Xuất Bản Ngay (Khách hàng có thể đọc được ngay trên web)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-fpt-orange focus:ring-fpt-orange"
                      />
                      <span>Đánh Dấu Bài Viết Nổi Bật (Ghim đầu trang)</span>
                    </label>
                  </div>
                </form>
              ) : (
                /* Preview Tab */
                <div className="space-y-6 max-w-2xl mx-auto py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(category)}
                      <span className="text-xs text-slate-400">• Tác giả: {author}</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 leading-snug">
                      {title || "Tiêu đề bài viết chưa nhập"}
                    </h1>
                    <p className="text-xs text-slate-500 italic">
                      Đường dẫn xem bài: /tin-tuc/{slug || "slug-bai-viet"}
                    </p>
                  </div>

                  {thumbnail && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200">
                      <img src={thumbnail} alt="Ảnh đại diện" className="w-full h-64 object-cover" />
                    </div>
                  )}

                  {excerpt && (
                    <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-fpt-orange text-xs text-slate-700 italic">
                      {excerpt}
                    </div>
                  )}

                  {/* Rendered HTML Body */}
                  <div
                    className="prose prose-sm max-w-none text-slate-800 space-y-4"
                    dangerouslySetInnerHTML={{ __html: content || "<p>Chưa có nội dung bài viết.</p>" }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
              <span className="text-[11px] sm:text-xs text-slate-500 hidden sm:inline">
                {published ? "Trạng thái: Xuất bản công khai" : "Trạng thái: Lưu bản nháp nội bộ"}
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors text-center"
                >
                  Đóng
                </button>

                <button
                  type="submit"
                  form="article-form"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-fpt-orange to-fpt-dark text-white font-bold text-xs shadow-cta hover:opacity-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Lưu Bài Viết</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
