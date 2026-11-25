---
name: seo-research
description: Nghiên cứu từ khóa Internet FPT Cần Thơ, Sóc Trăng, Hậu Giang và cập nhật Keyword Mapping.
---

# seo-research

Nghiên cứu từ khóa Internet FPT Cần Thơ, Sóc Trăng, Hậu Giang và cập nhật Keyword Mapping.

## Quy trình thực thi
1. Đọc `data/seo-memory/keywords.json` và dữ liệu GSC cache trong `seoConfig.json`.
2. Tìm từ khóa Quick-Win (Top 4-15) và khoảng trống từ khóa địa phương.
3. Cập nhật mapping 1:1 tránh cannibalization.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
