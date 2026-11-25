# DỰ ÁN FPT SIÊU TỐC (GOFPT.VN) - BỘ QUY CHUẨN CỐ ĐỊNH & GIAO THỨC BIÊN TẬP SEO

Tài liệu này là quy chuẩn bắt buộc của toàn bộ dự án `gofpt.vn`. Mọi Agent làm việc trong dự án này đều PHẢI tuân thủ 100% các nguyên tắc đã chốt dưới đây.

---

## 0. KIM CHỈ NAM TỐI THƯỢNG: TUÂN THỦ 100% CHÍNH SÁCH GOOGLE ADS
Mọi nội dung trên website (trang chủ, trang dịch vụ, bảng giá, bài viết tin tức, meta SEO) đều phải lấy **Chính sách Google Ads** làm kim chỉ nam, tuyệt đối không để xảy ra vi phạm:
1. **Không tuyên bố phóng đại / không thể kiểm chứng (Unreliable Claims):**
   - CẤM dùng: `tuyệt đối` (*an toàn tuyệt đối, bảo mật tuyệt đối, cam kết tuyệt đối*), `số 1 Việt Nam/thị trường`, `tốt nhất`, `duy nhất`, `bảo hành trọn đời`, `giảm 99%`, `100% không giật lag`, `4.9/5` tự phong, `hoàn toàn miễn phí` (nếu có điều kiện đi kèm phải ghi rõ *"miễn phí theo chính sách gói cước"*).
2. **Minh bạch tư cách pháp nhân (Misrepresentation / Authorized Agent):**
   - Luôn giữ rõ tuyên bố `gofpt.vn` là **kênh đại lý/tư vấn và tiếp nhận đăng ký dịch vụ viễn thông của FPT Telecom** (giữ nguyên `officialDisclaimer` ở Footer & Điều khoản). Không tự nhận là "Trang chủ Tập đoàn FPT".
3. **Minh bạch giá cước & Quyền riêng tư:**
   - Giá cước luôn ghi rõ đơn vị (`/tháng`), VAT (đã gồm VAT), và điều kiện áp dụng.
   - Thông tin liên hệ phải khớp 100% thực tế: Địa chỉ `Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ`, Hotline `0878 800 400`, Email `PhucNT51@fpt.com`.
4. **Kiểm tra tự động:** Trước khi đẩy code, luôn đảm bảo bộ lọc `PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts` không phát hiện vi phạm trên bất kỳ trang nào.

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

Khi người dùng gửi yêu cầu theo cú pháp:
👉 **"Viết bài + [nội dung / thông tin] + [ảnh đính kèm]"**

Agent sẽ TỰ ĐỘNG thực hiện trọn gói theo **Chuẩn Giao Diện Báo Chí Tối Giản (Clean & Minimal Editorial)** đã chốt:

### Bước 1: Xử lý hình ảnh & SEO Meta
1. Lưu ảnh tải lên vào `public/images/banners/` hoặc `public/images/news/` với tên file không dấu chuẩn SEO.
2. Đặt **Tiêu đề (H1)**: 55 - 65 ký tự, chứa từ khóa chính, rõ ràng và thu hút click.
3. Đặt **Slug URL**: Tiếng Việt không dấu, nối bằng `-`, chứa từ khóa chính.
4. Đặt **Excerpt / Meta Description**: 150 - 160 ký tự, tóm tắt giá trị, có CTA.

### Bước 2: Bố cục & Trình bày bài viết (Clean & Minimal Editorial — ĐÃ CHỐT)
1. **Không lặp ảnh bìa:** Trang bài viết tự hiển thị `article.thumbnail` ở đầu bài, tuyệt đối không chèn lặp lại ảnh bìa vào thân bài.
2. **Nền sáng, sạch, độ tương phản tuyệt đối:**
   - Nền trắng (`bg-white`), chữ ghi đen (`text-slate-700` / `text-slate-900`).
   - Tuyệt đối KHÔNG dùng hộp nền tối màu hay các thẻ Bento/CTA rườm rà bên trong bài viết (vì Sidebar đã có sẵn gói cước và Form đăng ký).
3. **Hệ thống tiêu đề dễ quét (Scannable Headings):**
   - **Tiêu đề chính H2 (`1.`, `2.`, `3.`...):** Tự động hiển thị màu cam FPT in đậm (`prose-h2:text-fpt-orange prose-h2:font-black`) kèm đường kẻ phân cách nhạt bên dưới (`border-b border-slate-200`).
   - **Tiêu đề con H3 (`2.1.`, `2.2.`...):** Số thứ tự bọc `<span class="text-fpt-orange">2.1.</span>`, tiêu đề in đậm đen `text-slate-900 font-bold`.
4. **Bảng biểu sáng, thanh lịch (nếu có lịch thi đấu / bảng giá):**
   - Bọc trong `<div class="not-prose my-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">`.
   - Tiêu đề bảng nền xám nhạt `bg-slate-50`, chữ đen đậm `text-slate-900 font-bold`.
   - Nhãn nhấn mạnh (như `4K Ultra HD`) dùng pill nhẹ `bg-red-50 text-red-600 border border-red-200`.
5. **Liên kết nội bộ tự nhiên (Internal Links):**
   - Chèn link tự nhiên trong văn bản về `/combo-ngoai-hang-anh`, `/lap-mang-fpt`, `/bang-gia`, `/camera-fpt`.
6. **Mục Hỏi - Đáp Thường Gặp (FAQ):**
   - 2 - 3 câu hỏi ngắn gọn trong thẻ sáng `bg-slate-50/80 border border-slate-200/80 rounded-xl p-4`.
7. **Khối thông tin liên hệ cố định cuối bài:**
   - Nền cam nhạt dịu `bg-orange-50/70 border border-orange-200 rounded-2xl`, chữ đen rõ nét, đầy đủ: Địa chỉ `Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ`, Hotline `0878 800 400`, Zalo `0878 800 400`, Email `PhucNT51@fpt.com`.

### Bước 3: Kỹ thuật chống lỗi 404 & Google Indexing
1. Lưu bài viết vào `src/data/articles.json`, `data/articles.json` và `INITIAL_ARTICLES` trong `src/lib/articleStorage.ts`.
2. Duy trì `generateStaticParams` trong `src/app/tin-tuc/[slug]/page.tsx` để Next.js xuất bản trang tĩnh SSG.
3. Gắn Schema cấu trúc `NewsArticle` (JSON-LD) và tự động nạp URL vào `https://gofpt.vn/sitemap.xml`.
4. Chạy `next build` kiểm tra biên dịch sạch 100%, sau đó `git commit` và `git push origin main`.
5. Trả lại link bài viết trực tiếp cho người dùng và nhắc bấm **"Đồng bộ từ GitHub"** trên `/admin`.
