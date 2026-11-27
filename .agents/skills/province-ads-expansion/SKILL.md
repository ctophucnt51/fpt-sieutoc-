---
name: province-ads-expansion
description: Quy trình chuẩn tạo trang đích Google Ads theo từng tỉnh/khu vực mới và đồng bộ cấu trúc nhóm quảng cáo
---

# Quy trình nhân rộng trang đích Google Ads theo khu vực

Khi người dùng muốn mở rộng chiến dịch sang tỉnh/thành phố hoặc khu vực mới:

1. **Tạo trang đích dùng chung component**:
   - Tạo `src/app/fpt-<slug-khu-vuc>/page.tsx` sử dụng `ProvinceLandingView` (`src/components/landing/ProvinceLandingView.tsx`).
   - Tuân thủ tuyệt đối quy định địa giới hành chính sau sáp nhập 07/2025 (chỉ dùng Phường/Xã, không dùng Quận/Huyện cũ).
   - Đặt `<title>`, `description`, `canonical`, `<h1>`, và danh sách khu vực khớp chính xác từ khóa mục tiêu.
2. **Cập nhật Sitemap**:
   - Thêm URL mới vào `src/app/sitemap.ts` (`priority: 0.95`).
3. **Build, Commit & Xác minh Live**:
   - Chạy `tsc --noEmit && next build`, commit kèm `.next` và push lên `origin main`.
   - Sau khi server 1Panel pull code, kiểm tra `curl` đảm bảo route mới trả về `HTTP 200` trước khi gắn vào Google Ads.
4. **Cập nhật Google Ads**:
   - Tách nhóm quảng cáo riêng cho khu vực mới, gắn `Final URL` trỏ đúng trang đích mới, đặt Display Path và Tiêu đề/Mô tả RSA khớp 100% với từ khóa của nhóm.
