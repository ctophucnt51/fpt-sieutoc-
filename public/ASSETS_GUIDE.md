# HƯỚNG DẪN BỔ SUNG & THAY THẾ TÀI NGUYÊN HÌNH ẢNH / ICON

Hệ thống đã có sẵn bộ ảnh vector SVG tiêu chuẩn cho từng thiết bị và banner. Khi bạn có hình ảnh chụp thực tế hoặc file thiết kế từ Photoshop / Figma, bạn chỉ cần thay thế đúng tên file và thư mục dưới đây:

---

## 📁 Cấu Trúc Thư Mục `public/`

```text
public/
├── favicon.svg                   <-- Icon tab trình duyệt (Vector SVG)
├── images/
│   ├── logo.svg                  <-- Logo thương hiệu trên Header
│   ├── banners/
│   │   ├── og-image.svg          <-- Banner xem trước khi gửi link Facebook/Zalo (1200x630px)
│   │   └── epl-banner.jpg        <-- (Tùy chọn) Banner siêu sao Ngoại Hạng Anh
│   ├── products/
│   │   ├── modem-wifi6.svg       <-- Thiết bị Modem Wi-Fi 6 băng tần kép
│   │   ├── fpt-play-box.svg      <-- Đầu thu FPT Play Box 4K & Remote giọng nói
│   │   ├── camera-play.svg       <-- FPT Camera Play (mẫu trong nhà xoay 355 độ)
│   │   └── camera-iq3.svg        <-- FPT Camera IQ3 (mẫu ngoài trời kháng nước)
│   └── icons/
│       ├── zalo.svg              <-- Logo nút Chat Zalo
│       └── messenger.svg         <-- Logo nút Chat Facebook Messenger
```

---

## 📐 Danh Sách Ảnh Cần Thiết & Kích Thước Khuyến Nghị

| Tên File | Vị trí hiển thị | Kích thước đề xuất | Định dạng tối ưu |
| :--- | :--- | :--- | :--- |
| `favicon.svg` hoặc `favicon.ico` | Favicon hiển thị trên tab trình duyệt và bookmark | 64x64px hoặc 128x128px | `.svg` hoặc `.ico` |
| `images/logo.svg` | Logo trên Header & Footer | Tỉ lệ ngang 4:1 (khoảng 320x80px) | `.svg` hoặc `.png` nền trong suốt |
| `images/banners/og-image.svg` (hoặc `.png`) | Hình đại diện hiển thị khi share link lên Facebook, Zalo, Messenger, SMS | **1200 x 630 px** (tỉ lệ chuẩn 1.91:1 của Meta Ads) | `.png` hoặc `.jpg` sắc nét |
| `images/products/modem-wifi6.svg` (hoặc `.png`) | Hình Modem Wi-Fi 6 trong phần giải thích công nghệ và bảng giá | **800 x 800 px** (Hình vuông, nền trong suốt) | `.png` hoặc `.webp` |
| `images/products/fpt-play-box.svg` (hoặc `.png`) | Đầu thu FPT Play Box & Remote trong section Ngoại Hạng Anh | **800 x 800 px** (Hình vuông, nền trong suốt) | `.png` hoặc `.webp` |
| `images/products/camera-play.svg` (hoặc `.png`) | Camera FPT trong nhà (xoay 355°) | **800 x 800 px** (Nền trong suốt) | `.png` hoặc `.webp` |
| `images/products/camera-iq3.svg` (hoặc `.png`) | Camera FPT ngoài trời (chuẩn IP66) | **800 x 800 px** (Nền trong suốt) | `.png` hoặc `.webp` |
| `images/banners/epl-hero.jpg` *(tùy chọn)* | Ảnh nền các ngôi sao bóng đá Ngoại Hạng Anh (Haaland, Salah...) | **1200 x 675 px** (Tỉ lệ 16:9) | `.webp` hoặc `.jpg` |

---

## 💡 Mẹo Tối Ưu Cho Facebook Ads:
1. **Nền trong suốt (Transparent PNG/WebP):** Ảnh thiết bị (modem, camera, TV box) nên xóa phông để hiển thị hài hòa trên cả nền trắng và nền tối.
2. **Nén dung lượng:** Sử dụng công cụ miễn phí như [TinyPNG](https://tinypng.com) để nén ảnh dưới 150KB trước khi đưa vào thư mục, giúp trang tải tức thì trên 4G.
