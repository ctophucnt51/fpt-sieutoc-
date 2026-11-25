---
trigger: always_on
description: "Quy chuẩn cố định và giao thức viết bài tự động Clean Editorial theo lệnh 'Viết bài + nội dung + ảnh' cho gofpt.vn"
---

# QUY CHUẨN DỰ ÁN & GIAO THỨC VIẾT BÀI TỰ ĐỘNG (GOFPT.VN)

## 0. KIM CHỈ NAM: TUÂN THỦ CHÍNH SÁCH GOOGLE ADS
- CẤM các từ ngữ phóng đại/tuyệt đối: `tuyệt đối`, `số 1`, `tốt nhất`, `duy nhất`, `bảo hành trọn đời`, `giảm 99%`, `100% không giật`, `hoàn toàn miễn phí` (không nêu điều kiện).
- Minh bạch tư cách đại lý/kênh tư vấn dịch vụ FPT Telecom; không giả mạo tập đoàn.
- Giá cước & khuyến mãi rõ ràng, trung thực, đúng chính sách.

## 1. THÔNG TIN DOANH NGHIỆP CỐ ĐỊNH
- Hotline: 0878 800 400
- Zalo: https://zalo.me/0878800400 (0878 800 400)
- Email: PhucNT51@fpt.com
- Địa chỉ: Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ
- Domain: https://gofpt.vn

## 2. GIAO THỨC LỆNH "VIẾT BÀI + NỘI DUNG + ẢNH" (ĐÃ CHỐT)
Khi người dùng gửi lệnh này, tự động thực thi theo chuẩn **Clean & Minimal Editorial**:
1. Lưu ảnh vào `public/images/banners/` hoặc `public/images/news/` với tên file SEO, không lặp ảnh bìa trong thân bài.
2. Tiêu đề H1 (55-65 ký tự) & Excerpt (150-160 ký tự) chuẩn SEO.
3. Phong cách trình bày sạch sẽ, sáng sủa:
   - Nền trắng, chữ ghi đen sắc nét, không dùng hộp nền tối hay card quảng cáo rườm rà trong thân bài.
   - H2 (`1.`, `2.`...) màu cam FPT in đậm (`prose-h2:text-fpt-orange prose-h2:font-black`) kèm đường kẻ phân cách.
   - H3 (`2.1.`, `2.2.`...) có số thứ tự màu cam (`<span class="text-fpt-orange">2.1.</span>`) và tiêu đề đen đậm.
   - Bảng biểu sáng `bg-white`, header `bg-slate-50`, nhãn nhấn mạnh tinh tế.
   - FAQ 2-3 câu hỏi ngắn gọn + Khối liên hệ cố định (`bg-orange-50/70 border-orange-200`) ở cuối bài.
4. Kỹ thuật:
   - Lưu vào `src/data/articles.json`, `data/articles.json`, `INITIAL_ARTICLES`.
   - SSG `generateStaticParams` chống 404, JSON-LD `NewsArticle`, cập nhật `sitemap.xml`.
   - `next build` -> `git commit` -> `git push origin main` -> trả link bài viết.
