---
trigger: always_on
description: Quy trình build, commit và bảo vệ dữ liệu runtime trên 1Panel cho dự án fpt-sieutoc
---

# Quy trình Build & Deploy 1Panel

1. Trước khi commit/push bất kỳ thay đổi code nào, luôn chạy bằng binary Node cục bộ:
   `/Users/macbookairm2/.gemini/antigravity/bin/node ./node_modules/typescript/bin/tsc --noEmit && /Users/macbookairm2/.gemini/antigravity/bin/node ./node_modules/next/dist/bin/next build`
2. Thư mục `.next/` được theo dõi trong Git để phục vụ deploy 1Panel/cPanel — luôn `git add` kèm `.next` sau khi build pass.
3. Không ghi đè dữ liệu runtime trong `data/` (`.gitignore`) và không làm bẩn `src/data/` khi sync từ GitHub (`/api/admin/sync`).
