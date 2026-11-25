---
name: seo-audit
description: Audit toàn bộ website GoFPT.vn về kỹ thuật, nội dung, chính sách Google Ads và NAP.
---

# seo-audit

Audit toàn bộ website GoFPT.vn về kỹ thuật, nội dung, chính sách Google Ads và NAP.

## Quy trình thực thi
1. Đọc `data/seo-memory/inventory.json` và `src/lib/seoAuditor.ts`.
2. Kiểm tra canonical, robots.txt, sitemap, schema JSON-LD và nội dung bài viết.
3. Báo cáo lỗi P0/P1 kèm file path cụ thể.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
