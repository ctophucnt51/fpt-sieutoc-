---
name: seo-review
description: Kiểm thử các thay đổi SEO, chạy QA Google Ads Safety Gate và Acceptance Tests.
---

# seo-review

Kiểm thử các thay đổi SEO, chạy QA Google Ads Safety Gate và Acceptance Tests.

## Quy trình thực thi
1. Chạy `next build` xác nhận 0 lỗi SSG/TypeScript.
2. Xác nhận `runQaSafetyCheck` pass và các thành phần bán hàng (`LeadForm`, `TrackingLoader`, Hotline/Zalo) nguyên vẹn.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
