---
name: seo-content
description: Xây dựng nội dung SEO chuẩn Clean & Minimal Editorial dựa trên fpt_knowledge.json.
---

# seo-content

Xây dựng nội dung SEO chuẩn Clean & Minimal Editorial dựa trên fpt_knowledge.json.

## Quy trình thực thi
1. Đọc `data/seo-memory/fpt_knowledge.json` và `AGENTS.md`.
2. Soạn bài viết chuẩn cấu trúc Editorial (H2 cam, H3 đánh số, bảng nhẹ, FAQ, khối liên hệ cố định).
3. Chạy `runQaSafetyCheck()` kiểm tra từ cấm Google Ads trước khi xuất bản.

## Nguyên tắc an toàn bắt buộc
- Tuân thủ 100% chính sách Google Ads (`PROHIBITED_ADS_PATTERNS` trong `src/lib/seoAuditor.ts`).
- Không tự ý sửa `LeadForm.tsx`, `TrackingLoader.tsx`, Hotline `0878 800 400`, Zalo hoặc Email `PhucNT51@fpt.com`.
- Không đưa PII khách hàng vào prompt hoặc log.
