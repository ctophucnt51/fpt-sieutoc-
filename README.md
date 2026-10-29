# Lắp Mạng FPT Siêu Tốc (Hệ Thống Landing Page CRO & Facebook Ads)

Hệ thống website bán hàng và thu thập khách hàng tiềm năng (Lead Generation) hiệu năng cao, tối ưu tỷ lệ chuyển đổi (CRO) dành riêng cho chiến dịch quảng cáo Facebook Ads trên thiết bị di động. Xây dựng bằng Next.js 14 (App Router), TypeScript và Tailwind CSS.

---

## 🎯 Mục Tiêu Kinh Doanh & CRO
- Thu thập lead có nhu cầu thực tế: Lắp Internet Cáp Quang, Wi-Fi 6, Combo Ngoại Hạng Anh, Truyền hình FPT Play & FPT Camera.
- **Tối ưu Mobile-First:** Thanh hành động ghim đáy màn hình (Gọi ngay, Chat Zalo, Đăng ký), form 30 giây nhanh chóng, nút bấm kích thước lớn.
- **Theo dõi chuyên sâu Facebook Ads:** Tích hợp Meta Pixel & Server Conversions API (CAPI) khử trùng lặp qua `event_id`, theo dõi riêng biệt click Hotline / Zalo / Messenger và chỉ bắn sự kiện `Lead` khi backend đã xác nhận lưu thành công.
- **Tuân thủ pháp lý & Bảo mật:** Khẳng định vai trò đại lý tư vấn độc lập, không tự xưng là cổng thông tin tập đoàn FPT, tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân (checkbox không tích sẵn, link chính sách bảo mật).

---

## 🗺️ Cấu Trúc Trang (Sitemap)

| Đường dẫn | Mục đích chiến dịch Facebook Ads |
| :--- | :--- |
| `/` | Trang chủ chuyển đổi tổng hợp (Internet, Combo, TV, Camera). |
| `/lap-mang-fpt` | Landing page chuyên sâu cho khách tìm kiếm lắp Internet cáp quang gia đình, sinh viên, kinh doanh. |
| `/wifi-6` | Landing page nhấn mạnh công nghệ Wi-Fi 6 thế hệ mới (802.11ax), độ trễ cực thấp, phủ sóng xuyên tường. |
| `/combo-ngoai-hang-anh` | Landing page nhắm mục tiêu fan bóng đá xem trọn vẹn 380 trận Ngoại Hạng Anh (EPL) bản quyền + FPT Play Box giọng nói. |
| `/truyen-hinh-fpt` | Landing page Combo Internet + FPT Play TV gần 200 kênh, giải trí gia đình. |
| `/camera-fpt` | Landing page FPT Camera AI thông minh (Camera Play trong nhà, Camera IQ3 ngoài trời, lưu Cloud VN). |
| `/cam-on` | Trang cảm ơn sau khi gửi form, hiển thị mã hồ sơ, hướng dẫn các bước tiếp theo và kích hoạt Meta Pixel `Lead`. |
| `/chinh-sach-bao-mat` | Chính sách bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP. |
| `/dieu-khoan` | Điều khoản sử dụng và tuyên bố bản quyền thương hiệu FPT Telecom. |

---

## ⚙️ Cấu Hình Tập Trung (`src/config/siteConfig.ts`)

Mọi thông tin thương hiệu, số điện thoại, đường dẫn chat và bảng giá được quản lý tập trung tại `src/config/siteConfig.ts`:
- **Hotline bán hàng:** `0878 800 400` (tự động cập nhật trên toàn bộ Header, Footer, Hero, Form, Sticky Bar).
- **Zalo URL:** `https://zalo.me/0878800400` (có thể ghi đè qua biến môi trường `NEXT_PUBLIC_ZALO_URL`).
- **Messenger URL:** `https://m.me/lapmangfpt.sieutoc` (qua `NEXT_PUBLIC_MESSENGER_URL`).
- **Bảng giá & Gói cước:** Danh sách gói GIGA, SKY, META, F-GAME, Combo EPL, Camera Play, Camera IQ3 với thông số và giá đã được kiểm chứng từ tài liệu công khai của FPT Telecom.

---

## 🔒 Hệ Thống Thu Thập Lead & Bảo Mật

1. **Backend Endpoint:** `POST /api/leads`
2. **Kiểm tra định dạng:** Regex số điện thoại di động Việt Nam (`/^(0|\+84)(3|5|7|8|9)...$/`).
3. **Chống Spam & Bot:**
   - Trường ẩn Honeypot (`website`) loại bỏ submission từ bot.
   - Giới hạn tần suất (Rate Limiting) tối đa 5 yêu cầu/10 phút trên mỗi địa chỉ IP (HTTP 429).
   - Chặn gửi trùng: Tự động phát hiện cùng một số điện thoại gửi liên tiếp trong 30 phút và phản hồi thân thiện mà không tạo bản ghi rác.
4. **Lưu trữ an toàn:** Ghi nguyên tử (atomic write) vào `src/data/leads.json` (không phụ thuộc localStorage).
5. **Mở rộng CRM / Google Sheets:** Hỗ trợ Webhook tự động đẩy dữ liệu sang Google Sheets App Script, CRM, Zapier qua biến `CRM_WEBHOOK_URL`.
6. **Lưu vết chiến dịch:** Tự động bắt `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `_fbc`, `_fbp`.

---

## 📊 Cấu Hình Facebook Ads Tracking

1. **Meta Pixel ID:** Điền vào file `.env.local`:
   ```bash
   NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
   ```
2. **Meta Conversions API (CAPI):** Cấu hình thêm Server Access Token:
   ```bash
   FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN=EAAG...
   ```
   Hệ thống server sẽ tự động băm số điện thoại chuẩn SHA-256 (không gửi PII thô) và gắn `event_id` trùng khớp với trình duyệt để Meta tự động khử trùng (Deduplication).

---

## 🚀 Hướng Dẫn Cài Đặt & Vận Hành

### Yêu Cầu Môi Trường
- Node.js >= 18.17.0 (Đã kiểm nghiệm với Node v20.18.0)
- npm >= 9.0

### Khởi Chạy Local
```bash
# 1. Di chuyển vào thư mục dự án
cd /Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc

# 2. Cài đặt thư viện (nếu chưa cài)
npm install

# 3. Khởi chạy môi trường phát triển (Dev)
npm run dev
# Mở trình duyệt: http://localhost:3000

# 4. Build sản phẩm hoàn chỉnh (Production)
npm run build
npm run start
```

### Triển Khai Lên Vercel / Cloudflare / Server Riêng
- **Vercel (Khuyên Dùng):** Kết nối Git repository, Vercel tự động nhận diện Next.js App Router và thiết lập môi trường Edge/Node.js Serverless.
- **VPS / Docker:** Chạy `npm run build` và chạy `npm run start` dưới PM2 hoặc Docker container chuẩn Node.js.
