---
trigger: model_decision
description: Quy chuẩn Google Ads Landing Page, PageSpeed Insights và UI Mobile cho các trang public của gofpt.vn
---

# Quy chuẩn Google Ads & PageSpeed cho gofpt.vn

1. **Tuân thủ chính sách Google Ads**:
   - Thông tin sản phẩm/giá cước phải minh bạch (ghi rõ giá tham khảo đã/chưa gồm 10% VAT, điều kiện áp dụng), không dùng cam kết phóng đại, không đếm ngược giả.
   - **Không trả HTTP 403** trên các route trang công khai (`/`, `/fpt-*`, `/camera-fpt`, v.v.) đối với IP bị chặn click tặc; chỉ khóa hành động chuyển đổi (form `/api/leads`, `tel:`, `zalo.me` và conversion pixels).

2. **Chuẩn PageSpeed Insights (`pagespeed.web.dev`) & Mobile UX**:
   - Mọi thẻ `<img>` đều phải khai báo rõ `width` và `height` (tránh CLS), dùng `loading="lazy"` + `decoding="async"` cho ảnh dưới màn hình đầu.
   - Ảnh mới thêm vào `public/images/` phải được nén gọn nhẹ (ưu tiên `< 60 KB`).
   - Các container/thẻ trên mobile bắt buộc có `min-w-0`, `flex-wrap` hợp lý và `overflow-x-hidden` để không bao giờ tràn ngang trên màn hình 320px–375px.
