# DỰ ÁN FPT SIÊU TỐC (GOFPT.VN) - BỘ QUY CHUẨN CỐ ĐỊNH & BIÊN TẬP SEO

Tài liệu này là quy chuẩn bắt buộc của toàn bộ dự án `gofpt.vn`. Bất kỳ Agent hoặc trợ lý AI nào thao tác trong kho mã nguồn này đều PHẢI tuân thủ 100% các điều khoản dưới đây, tuyệt đối không được tự ý sửa đổi hoặc ghi đè thông tin cố định của khách hàng.

---

## 1. THÔNG TIN DOANH NGHIỆP CỐ ĐỊNH (KHÔNG ĐƯỢC TỰ Ý ĐỔI)
- **Tên thương hiệu:** FPT Siêu Tốc / FPT Telecom Cần Thơ (gofpt.vn)
- **Địa chỉ trụ sở chính:** `Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ`
- **Địa chỉ ngắn gọn:** `Số 10 Phan Văn Trị, Phường Ninh Kiều, Cần Thơ`
- **Email hỗ trợ chính thức:** `PhucNT51@fpt.com`
- **Hotline tư vấn & CSKH:** `0878 800 400`
- **Zalo tư vấn:** `https://zalo.me/0878800400` (0878 800 400)
- **Tên miền website:** `https://gofpt.vn`
- **Tài khoản Google Ads:** `PhucNT51` (`319-630-9201`)

> **CẢNH BÁO QUAN TRỌNG:**
> Mọi thao tác cập nhật cấu hình hoặc tính năng đều phải giữ nguyên vẹn địa chỉ và email trên. Không được phép hoàn nguyên về email cũ (`hotro@lapmangfpt-sieutoc.vn`) hay địa chỉ cũ (`Số 118 Đường 30/4`).

---

## 2. QUY CHUẨN BIÊN TẬP BÀI VIẾT CHUYÊN NGHIỆP CHUẨN SEO

Khi người dùng yêu cầu viết hoặc biên tập bài viết mới cho mục Tin Tức (`/tin-tuc/[slug]`), luôn thực hiện theo các bước chuẩn mực sau:

### 2.1. Cấu trúc tiêu đề & Meta
- **Tiêu đề bài viết (H1 / title):**
  - Chứa từ khóa chính ở đầu hoặc vị trí nổi bật.
  - Độ dài chuẩn từ 55 - 65 ký tự.
  - Mang tính hành động, hấp dẫn, chuẩn văn phong báo chí công nghệ / thể thao.
  - Ví dụ: `Lịch Thi Đấu Ngoại Hạng Anh Vòng 12: Trực Tiếp Trọn Vẹn 10 Trận Đỉnh Cao Trên FPT Play`.
- **Slug URL:**
  - Tiếng Việt không dấu, nối bằng dấu gạch ngang `-`, chứa từ khóa chính, ngắn gọn.
  - Ví dụ: `lich-thi-dau-ngoai-hang-anh-vong-12-truc-tiep-fpt-play`.
- **Mô tả tóm tắt (Excerpt / Meta Description):**
  - Độ dài 150 - 160 ký tự.
  - Tóm tắt đầy đủ giá trị bài viết, chứa từ khóa chính và phụ, có lời kêu gọi hành động (CTA).

### 2.2. Bố cục nội dung bài viết (HTML Semantic)
1. **Phần mở đầu (Introduction):** Đưa ra bức tranh tổng quan trong 1-2 đoạn văn ngắn, nêu bật giá trị thông tin cho độc giả.
2. **Ảnh minh họa chính (Banner / Thumbnail):**
   - Lưu trữ tại `public/images/banners/` hoặc `public/images/news/`.
   - Có thẻ `alt` mô tả chuẩn SEO chứa từ khóa chính.
3. **Phân cấp tiêu đề rõ ràng (H2 - H3):**
   - Sử dụng H2 cho các phần nội dung lớn.
   - Sử dụng H3 cho các chi tiết phân tích sâu bên trong.
4. **Bảng biểu so sánh / Lịch thi đấu (Responsive Table):**
   - Thiết kế dạng bảng có khung viền mềm mại, gradient tiêu đề, rõ ràng thời gian, chất lượng 4K Ultra HD.
5. **Gói cước liên quan & Lời kêu gọi hành động (CTA):**
   - Lồng ghép khéo léo gói cước Internet & Combo FPT Play (Combo Giga 220K, Sky 195K/250K).
6. **Khung thông tin liên hệ cố định:**
   - Luôn đặt block liên hệ với đầy đủ: Địa chỉ `Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ`, Hotline `0878 800 400`, Zalo, Email `PhucNT51@fpt.com`.

---

## 3. QUY TRÌNH XUẤT BẢN & PHÒNG NGỪA LỖI 404

Để bài viết xuất bản lập tức và không bao giờ gặp lỗi 404:
1. **Lưu dữ liệu bài viết:**
   - Ghi vào cả 2 file: `src/data/articles.json` và `data/articles.json`.
   - Bổ sung vào mảng `INITIAL_ARTICLES` trong `src/lib/articleStorage.ts`.
2. **Cơ chế Static Site Generation (SSG):**
   - Trong `src/app/tin-tuc/[slug]/page.tsx`, luôn giữ hàm `generateStaticParams()` để Next.js pre-render toàn bộ file HTML tĩnh vào `.next/server/app/tin-tuc/<slug>.html`.
3. **Hợp nhất đồng bộ cPanel (`/api/admin/sync`):**
   - Route sync cPanel đã được trang bị cơ chế Merge thông minh, tự động gộp các bài viết mới từ GitHub vào hosting mà không đè mất.
4. **Biên dịch & Đẩy lên GitHub:**
   - Chạy `next build` xác nhận `38/38 static pages` biên dịch thành công.
   - Commit và push trực tiếp lên `origin main`.
   - Hướng dẫn người dùng bấm **"Đồng bộ từ GitHub"** trên trang `/admin`.

---

## 4. QUY TRÌNH HỖ TRỢ GOOGLE INDEXING
1. **Sitemap tự động:** File `src/app/sitemap.ts` tự động nạp mọi bài viết trong `articles.json` và xuất bản tại `https://gofpt.vn/sitemap.xml` với `priority: 0.8` và `changeFrequency: weekly`.
2. **Cấu trúc dữ liệu Google Rich Snippet (JSON-LD):**
   - File `src/app/tin-tuc/[slug]/page.tsx` đã gắn sẵn Schema `NewsArticle` chuẩn Schema.org: đầy đủ headline, datePublished, dateModified, author, publisher logo, mainEntityOfPage.
3. **Index nhanh Google:** Sau khi đồng bộ, người dùng có thể gửi URL sitemap hoặc yêu cầu lập chỉ mục ngay lập tức trên Google Search Console.
