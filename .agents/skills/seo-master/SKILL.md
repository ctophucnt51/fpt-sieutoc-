---
name: seo-master
description: Điều phối toàn bộ chu trình 8 bước Collect -> Analyze -> Prioritize -> Plan -> Execute -> Validate -> Measure -> Learn.
---

# seo-master

Điều phối toàn bộ chu trình 8 bước Collect -> Analyze -> Prioritize -> Plan -> Execute -> Validate -> Measure -> Learn.

## Quy trình thực thi
1. Gọi `runSeoMasterCycleAsync({ collectLive: true, runAi: true })`.
2. Điều phối các Agent con theo `Task Queue`.
3. Đẩy đề xuất vào `Approval Center` và cập nhật `lessons.json`.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
