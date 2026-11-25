---
name: seo-performance
description: Theo dõi và tối ưu tốc độ tải trang (Core Web Vitals / PageSpeed Insights).
---

# seo-performance

Theo dõi và tối ưu tốc độ tải trang (Core Web Vitals / PageSpeed Insights).

## Quy trình thực thi
1. Kiểm tra `src/lib/pageSpeedClient.ts` và `data/seo-memory/baseline.json`.
2. Phân tích LCP/TBT/CLS và tối ưu ảnh, JS bundle mà không phá giao diện bán hàng.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
