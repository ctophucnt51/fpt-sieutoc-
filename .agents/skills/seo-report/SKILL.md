---
name: seo-report
description: Tổng hợp báo cáo thứ hạng GSC, Organic Sessions, Organic Leads và gửi Telegram.
---

# seo-report

Tổng hợp báo cáo thứ hạng GSC, Organic Sessions, Organic Leads và gửi Telegram.

## Quy trình thực thi
1. Đọc `performance.json` và `getAnonymizedConversionSummary()` (tuyệt đối không xuất SĐT/tên khách).
2. Gửi tóm tắt qua `dispatchTelegramSeoSummary()`.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
