---
name: seo-internal-link
description: Tối ưu hệ thống liên kết nội bộ giữa bài viết tin tức và trang dịch vụ chuyển đổi.
---

# seo-internal-link

Tối ưu hệ thống liên kết nội bộ giữa bài viết tin tức và trang dịch vụ chuyển đổi.

## Quy trình thực thi
1. Kiểm tra các bài trong `src/data/articles.json`.
2. Đảm bảo mỗi bài viết trỏ anchor tự nhiên về `/lap-mang-fpt`, `/combo-ngoai-hang-anh`, `/bang-gia`.
3. Không nhồi nhét liên kết.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
