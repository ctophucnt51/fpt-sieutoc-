---
name: image-optimize-web
description: Quy trình tối ưu dung lượng và kích thước hình ảnh mới trước khi đưa vào public/images/
---

# Quy trình tối ưu ảnh cho gofpt.vn

1. Mọi ảnh sản phẩm/banner tải về `public/images/` phải được resize và nén trước khi commit:
   - Dùng `sips -Z 800 -s format jpeg -s formatOptions 72 <file> --out <file>` (hoặc PNG tách nền khi cần trong suốt).
   - Đảm bảo dung lượng mỗi ảnh gọn nhẹ (mục tiêu `< 60 KB`).
2. Luôn gắn `width` và `height` khớp tỷ lệ thật trên thẻ `<img>` kèm `loading="lazy"` và `decoding="async"` cho ảnh dưới fold.
