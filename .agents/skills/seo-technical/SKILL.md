---
name: seo-technical
description: Phân tích và đề xuất sửa lỗi kỹ thuật SEO (Canonical, Robots, Sitemap, Schema, HTTP status).
---

# seo-technical

Phân tích và đề xuất sửa lỗi kỹ thuật SEO (Canonical, Robots, Sitemap, Schema, HTTP status).

## Quy trình thực thi
1. Kiểm tra `src/app/robots.ts`, `src/app/sitemap.ts` và metadata các route.
2. Đảm bảo `/admin`, `/cam-on` có `noindex`.
3. Đề xuất sửa lỗi qua Approval Center hoặc Git diff.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
