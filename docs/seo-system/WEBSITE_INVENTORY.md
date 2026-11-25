# WEBSITE_INVENTORY.md — Bản Đồ Toàn Bộ URL & Tài Nguyên Website (GoFPT.vn)

> **Nguồn kiểm chứng:** `src/app/`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/data/articles.json`, kết quả `next build` (38 static/SSG/dynamic routes).

---

## 1. Danh Sách Toàn Bộ URL Public Có Thể Index

| # | URL Route | Loại Render | Mục đích & Từ khóa mục tiêu chính | Trong Sitemap? |
| :-: | :--- | :--- | :--- | :---: |
| 1 | `/` | Static (`○`) | Trang chủ — Lắp mạng FPT Siêu Tốc, Wi-Fi 6, Combo EPL | Có (1.0) |
| 2 | `/lap-mang-fpt` | Static (`○`) | Trang dịch vụ chính — Lắp mạng FPT cá nhân & gia đình | Có (0.9) |
| 3 | `/wifi-6` | Static (`○`) | Trang công nghệ — Modem & Mesh Wi-Fi 6 FPT | Có (0.9) |
| 4 | `/combo-ngoai-hang-anh` | Static (`○`) | Trang sản phẩm chủ lực — Combo Internet + Ngoại Hạng Anh 220K | Có (0.9) |
| 5 | `/truyen-hinh-fpt` | Static (`○`) | Trang dịch vụ — Truyền hình FPT Play gần 170 kênh | Có (0.8) |
| 6 | `/camera-fpt` | Static (`○`) | Trang sản phẩm — Camera FPT AI thông minh | Có (0.85) |
| 7 | `/bang-gia` | Static (`○`) | Trang tổng hợp — Bảng giá gói cước FPT mới nhất | Có (0.9) |
| 8 | `/khuyen-mai` | Static (`○`) | Trang ưu đãi — Khuyến mãi lắp mạng FPT tháng hiện tại | Có (0.9) |
| 9 | `/quy-trinh-lap-dat` | Static (`○`) | Trang hướng dẫn — Quy trình khảo sát & lắp đặt 24h | Có (0.7) |
| 10 | `/hoi-dap` | Static (`○`) | Trang FAQ — Giải đáp thắc mắc thủ tục, giá cước | Có (0.7) |
| 11 | `/tin-tuc` | Dynamic (`ƒ`) | Danh mục Tin tức & Cẩm nang | Có (0.8) |
| 12 | `/tin-tuc/lich-thi-dau-ngoai-hang-anh-vong-12-truc-tiep-fpt-play` | SSG (`●`) | Bài viết — Lịch thi đấu Ngoại Hạng Anh Vòng 12 FPT Play | Có (0.8) |
| 13 | `/tin-tuc/bang-gia-lap-mang-fpt-can-tho-khuyen-mai-moi-nhat` | SSG (`●`) | Bài viết — Bảng giá lắp mạng FPT Cần Thơ 2026 | Có (0.8) |
| 14 | `/tin-tuc/danh-gia-toc-do-wifi-6-khi-lap-mang-fpt-can-tho` | SSG (`●`) | Bài viết — Đánh giá tốc độ Wi-Fi 6 FPT Cần Thơ | Có (0.8) |
| 15 | `/tin-tuc/fpt-can-tho-tang-camera-ai-mien-phi-khi-lap-mang-moi` | SSG (`●`) | Bài viết — Tặng Camera AI khi lắp mạng FPT Cần Thơ | Có (0.8) |
| 16 | `/chinh-sach-bao-mat` | Static (`○`) | Trang pháp lý — Chính sách bảo mật thông tin | Có (0.4) |
| 17 | `/dieu-khoan` | Static (`○`) | Trang pháp lý — Điều khoản & Tuyên bố đại lý độc lập | Có (0.4) |

---

## 2. Các Route Không Nên Index (System / Private / Conversion)

| Route | Loại | Hiện trạng kiểm soát Index | Vấn đề phát hiện |
| :--- | :--- | :--- | :--- |
| `/admin` | Client Page (`○`) | **Chưa có trong `robots.ts` disallow và chưa có meta `noindex`** | Google Bot vẫn có thể crawl hoặc index `/admin`. Cần chặn `disallow: ["/api/", "/cam-on", "/admin"]` + gắn `noindex`. |
| `/cam-on` | Static (`○`) | Đã có trong `robots.ts` disallow | Nên bổ sung thêm meta `robots: { index: false, follow: false }` ở page metadata cho chắc chắn. |
| `/api/*` (16 endpoints) | Dynamic (`ƒ`) | Đã chặn trong `robots.ts` | An toàn. |
| `/sitemap.xml` | Dynamic (`○`) | Khai báo trong `robots.ts` | Đang hoạt động tốt. |
| `/robots.txt` | Static (`○`) | Tồn tại tại `src/app/robots.ts` | Cần bổ sung `/admin`. |

---

## 3. Khoảng Trống Nội Dung (Content Gaps) Theo Khu Vực & Ý Định Tìm Kiếm

- **Local SEO Cần Thơ – Sóc Trăng – Hậu Giang (Chưa có URL chuyên biệt):**
  - Thiếu Landing/Bài viết riêng cho: Quận Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt, Phong Điền, TP. Sóc Trăng, Vị Thanh, Ngã Bảy.
- **Nhóm từ khóa ngách chuyển đổi cao (Chưa có bài viết chuyên sâu):**
  - *Lắp mạng FPT cho sinh viên / phòng trọ Cần Thơ*
  - *Lắp Wi-Fi FPT cho quán cafe / nhà hàng / kinh doanh*
  - *So sánh gói Sky 195K và Giga 220K*
  - *Hướng dẫn kiểm tra vùng phủ sóng & chuyển địa điểm mạng FPT*
