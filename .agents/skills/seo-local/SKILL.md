---
name: seo-local
description: Phát triển Local SEO cho Cần Thơ (Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt), Sóc Trăng, Hậu Giang.
---

# seo-local

Phát triển Local SEO cho Cần Thơ (Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt), Sóc Trăng, Hậu Giang.

## Quy trình thực thi
1. Kiểm tra độ phủ 7 khu vực mục tiêu trong `seoOrchestrator.ts`.
2. Đảm bảo NAP cố định: `Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ`, `0878 800 400`, `PhucNT51@fpt.com`.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
