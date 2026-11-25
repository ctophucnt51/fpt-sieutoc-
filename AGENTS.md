# DỰ ÁN FPT SIÊU TỐC (GOFPT.VN) - BỘ QUY CHUẨN CỐ ĐỊNH & GIAO THỨC BIÊN TẬP SEO

Tài liệu này là quy chuẩn bắt buộc của toàn bộ dự án `gofpt.vn`. Bất kỳ Agent hoặc trợ lý AI nào làm việc trong kho mã nguồn này đều PHẢI tuân thủ 100% các điều khoản dưới đây.

---

## 1. THÔNG TIN DOANH NGHIỆP CỐ ĐỊNH (KHÔNG ĐƯỢC TỰ Ý SỬA ĐỔI)
- **Tên thương hiệu:** FPT Siêu Tốc / FPT Telecom Cần Thơ (gofpt.vn)
- **Địa chỉ trụ sở chính:** `Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ`
- **Địa chỉ ngắn gọn:** `Số 10 Phan Văn Trị, Phường Ninh Kiều, Cần Thơ`
- **Email hỗ trợ chính thức:** `PhucNT51@fpt.com`
- **Hotline tư vấn & CSKH:** `0878 800 400`
- **Zalo tư vấn:** `https://zalo.me/0878800400` (0878 800 400)
- **Tên miền website:** `https://gofpt.vn`
- **Tài khoản Google Ads:** `PhucNT51` (`319-630-9201`)

---

## 2. GIAO THỨC TỰ ĐỘNG: LỆNH "VIẾT BÀI + NỘI DUNG + ẢNH"

Bất cứ khi nào người dùng đưa ra yêu cầu theo cú pháp:
👉 **"Viết bài + [nội dung/ý tưởng/bài viết] + [ảnh đính kèm]"**

Agent sẽ TỰ ĐỘNG thực hiện toàn bộ chu trình khép kín sau mà không cần hỏi lại các bước cơ bản:

### Bước 1: Xử lý hình ảnh & SEO Meta
1. Lưu ảnh người dùng tải lên vào `public/images/banners/` hoặc `public/images/news/` với tên file tiếng Việt không dấu chuẩn SEO (ví dụ: `lich-thi-dau-ngoai-hang-anh-vong-12-fpt-play.jpg`).
2. Xác định từ khóa chính (Primary Keyword) và từ khóa phụ (Secondary Keywords).
3. Đặt **Tiêu đề (H1)**: 55 - 65 ký tự, từ khóa chính đứng đầu, phong cách chuyên nghiệp, thu hút click.
4. Đặt **Slug URL**: Chuẩn hóa không dấu, nối dấu gạch ngang `-`, chứa từ khóa chính.
5. Đặt **Meta Description / Excerpt**: 150 - 160 ký tự, tóm tắt cô đọng, có CTA.

### Bước 2: Thiết kế giao diện bài viết chuẩn Tạp chí cao cấp (Đã chốt)
1. **Không lặp ảnh banner:** Vì trang chi tiết đã tự render ảnh đại diện ở phần đầu, trong thân bài không chèn lặp lại ảnh bìa đó.
2. **Hệ thống tiêu đề đánh số (Tiêu đề chấm) nổi bật:**
   - **Tiêu đề chính H2 (`1.`, `2.`, `3.`...):**
     * Gắn huy hiệu số bo tròn màu cam: `<span class="w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shrink-0 shadow-xs">1</span>`
     * Chữ tiêu đề in đậm đen tuyền: `text-xl sm:text-2xl font-black text-slate-900`
     * Đường gạch chân phân cách nhạt: `pt-6 pb-2.5 border-b-2 border-orange-100`
   - **Tiêu đề con H3 (`3.1.`, `3.2.`...):**
     * Có viền cam dày bên trái: `border-l-4 border-orange-500 pl-3.5 py-1 my-4`
     * Số thứ tự màu cam nổi bật: `<span class="text-orange-600 font-black">3.1.</span>`
     * Chữ tiêu đề in đậm: `text-lg sm:text-xl font-black text-slate-900`
3. **Độ tương phản tuyệt đối (Tránh chìm chữ):**
   - Các hộp thông báo quan trọng dùng nền kem cam ấm dịu (`bg-orange-50/90`), viền cam sắc nét (`border-2 border-orange-300`), chữ đen đậm `text-slate-900 font-semibold`, badge cam chữ trắng.
   - Tuyệt đối không dùng nền tối chứa thẻ `<p>` bên trong vì class `prose` sẽ làm tối màu chữ.
4. **Bảng biểu & Thẻ tính năng:**
   - Bảng phân chia theo ngày, giờ đấu, cặp đấu, tiêu điểm, kênh phát sóng kèm nhãn `4K ULTRA HD` đỏ tươi.
   - Header bảng có chữ đen đậm `font-black text-slate-900` trên nền xám sáng `bg-slate-100`.
   - Card so sánh gói cước Combo Giga 220K & Combo Sky 250K có nút bấm CTA.
5. **Mục Hỏi - Đáp Thường Gặp (FAQ):**
   - 3 câu hỏi - đáp ngắn gọn giúp kích hoạt Google Rich Snippet (Top 0).
6. **Khung thông tin liên hệ cố định:**
   - Luôn đặt block liên hệ với đầy đủ: Địa chỉ `Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ`, Hotline `0878 800 400`, Zalo `0878 800 400`, Email `PhucNT51@fpt.com`, Website `https://gofpt.vn`.

### Bước 3: Kỹ thuật xuất bản phòng ngừa 404 & Tối ưu Google Indexing
1. Ghi bài viết mới vào cả `src/data/articles.json` và `data/articles.json`.
2. Đồng bộ bài viết vào `INITIAL_ARTICLES` trong `src/lib/articleStorage.ts`.
3. Duy trì `generateStaticParams` trong `src/app/tin-tuc/[slug]/page.tsx` để xuất bản sẵn file HTML tĩnh SSG.
4. Tự động cập nhật `sitemap.xml` và gắn cấu trúc dữ liệu JSON-LD `NewsArticle`.
5. Chạy `next build` kiểm tra đạt 100% không lỗi.
6. Commit và `git push origin main` tự động.
7. Trả lại link bài viết trực tiếp cho người dùng và hướng dẫn bấm "Đồng bộ từ GitHub" trên cPanel.
