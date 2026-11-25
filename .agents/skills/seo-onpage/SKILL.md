---
name: seo-onpage
description: Tối ưu Title, Meta Description, Heading và Schema cho trang có CTR thấp hoặc Top 4-15.
---

# seo-onpage

Tối ưu Title, Meta Description, Heading và Schema cho trang có CTR thấp hoặc Top 4-15.

## Quy trình thực thi
1. Xem `gscCache.topQueries` và `pageMetaOverrides`.
2. Đề xuất Title/Description mới vào Approval Center (không tự sửa production chưa duyệt).
3. Lưu snapshot để sẵn sàng Rollback.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
