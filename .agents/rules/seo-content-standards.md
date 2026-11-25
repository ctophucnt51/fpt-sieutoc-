---
trigger: always_on
description: "Quy chuẩn cố định và giao thức viết bài tự động theo lệnh 'Viết bài + nội dung + ảnh' cho gofpt.vn"
---

# QUY CHUẨN DỰ ÁN & GIAO THỨC VIẾT BÀI TỰ ĐỘNG (GOFPT.VN)

## 1. THÔNG TIN DOANH NGHIỆP CỐ ĐỊNH
- Hotline: 0878 800 400
- Zalo: https://zalo.me/0878800400 (0878 800 400)
- Email: PhucNT51@fpt.com
- Địa chỉ: Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ
- Domain: https://gofpt.vn

## 2. GIAO THỨC LỆNH "VIẾT BÀI + NỘI DUNG + ẢNH"
Khi người dùng ra lệnh theo cấu trúc này, tự động thực thi trọn gói:
1. Lưu ảnh vào `public/images/banners/` hoặc `public/images/news/` với tên file SEO.
2. Tiêu đề H1: 55-65 ký tự, từ khóa chính đứng đầu, thu hút click.
3. Excerpt: 150-160 ký tự, tóm tắt có CTA.
4. Layout bài viết:
   - Không lặp ảnh bìa trong nội dung.
   - Tiêu đề H2 (`1.`, `2.`, `3.`...): Huy hiệu số cam bo tròn `bg-orange-600 text-white font-black`, gạch chân nhạt `border-b-2 border-orange-100`, chữ đen đậm `font-black text-slate-900`.
   - Tiêu đề H3 (`3.1.`, `3.2.`...): Viền cam dày bên trái `border-l-4 border-orange-500`, số thứ tự cam `text-orange-600 font-black`, chữ đen đậm `font-black text-slate-900`.
   - Độ tương phản: Khối thông báo nền cam nhạt `bg-orange-50/90`, viền cam `border-2 border-orange-300`, chữ đen đậm `text-slate-900`, bảng biểu chữ đen rõ ràng.
   - Thẻ bảng giá CTA Combo Giga 220K & Combo Sky 250K.
   - Mục FAQ 3 câu hỏi ngắn gọn hỗ trợ Google Featured Snippets.
   - Khối liên hệ cố định ở cuối bài viết.
5. Kỹ thuật:
   - Lưu vào `src/data/articles.json`, `data/articles.json` và `INITIAL_ARTICLES`.
   - Giữ `generateStaticParams` để xuất bản tĩnh SSG chống lỗi 404.
   - Gắn JSON-LD Schema `NewsArticle`.
   - Tự động nạp vào `sitemap.xml`.
   - `next build` kiểm tra sạch lỗi -> `git commit` & `git push origin main`.
   - Trả link bài viết và hướng dẫn người dùng bấm "Đồng bộ từ GitHub" trên `/admin`.
