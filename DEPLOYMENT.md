# HƯỚNG DẪN TRIỂN KHAI WEBSITE LÊN VPS (UBUNTU / DEBIAN)

Tài liệu này hướng dẫn bạn đưa website FPT Siêu Tốc lên máy chủ VPS độc lập, giúp website chạy 24/7 với tên miền riêng, chứng chỉ bảo mật HTTPS (SSL) miễn phí và lưu trữ dữ liệu Lead khách hàng an toàn tuyệt đối.

---

## BƯỚC 1: Chuẩn bị VPS & Cài đặt môi trường

Đăng nhập vào VPS qua SSH bằng Terminal:
```bash
ssh root@IP_CUA_BAN
```

Cập nhật hệ thống và cài đặt **NodeJS 20 LTS**, **Nginx**, **Git**:
```bash
# 1. Cập nhật gói hệ thống
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt NodeJS 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# 3. Cài đặt công cụ quản lý tiến trình PM2 (tự khởi động khi reboot máy chủ)
sudo npm install -g pm2
```

---

## BƯỚC 2: Copy mã nguồn lên VPS

Tạo thư mục cho website tại `/var/www/fpt-sieutoc`:
```bash
sudo mkdir -p /var/www/fpt-sieutoc
sudo chown -R $USER:$USER /var/www/fpt-sieutoc
```

Bạn có thể đưa code lên bằng 1 trong 2 cách:
- **Cách A (Qua GitHub)**: Đẩy code từ máy lên GitHub rồi chạy `git clone <URL_REPO> /var/www/fpt-sieutoc`.
- **Cách B (Copy trực tiếp từ máy qua SCP/rsync)**:
  ```bash
  rsync -avz --exclude 'node_modules' --exclude '.next' /Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/ root@IP_CUA_BAN:/var/www/fpt-sieutoc/
  ```

---

## BƯỚC 3: Cài đặt gói, cấu hình biến môi trường & Build

Vào thư mục dự án trên VPS:
```bash
cd /var/www/fpt-sieutoc

# 1. Tạo file cấu hình môi trường .env.local
cp .env.example .env.local
nano .env.local
# (Cập nhật NEXT_PUBLIC_SITE_URL thành https://tenmien-cua-ban.vn)

# 2. Cài đặt thư viện & build sản phẩm
npm install
npm run build
```

---

## BƯỚC 4: Chạy website bằng PM2 (Chạy ngầm & Tự phục hồi khi lỗi)

```bash
# Khởi động ứng dụng bằng file ecosystem.config.js đã tạo sẵn
pm2 start ecosystem.config.js

# Lưu trạng thái PM2 và bật tự chạy khi khởi động lại VPS
pm2 save
pm2 startup
```

---

## BƯỚC 5: Cấu hình Nginx làm Reverse Proxy

Tạo file cấu hình Nginx:
```bash
sudo nano /etc/nginx/sites-available/fpt-sieutoc
```

Dán nội dung cấu hình sau (thay `tenmien-cua-ban.vn` bằng tên miền thật):
```nginx
server {
    listen 80;
    server_name tenmien-cua-ban.vn www.tenmien-cua-ban.vn;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt cấu hình và khởi động lại Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/fpt-sieutoc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## BƯỚC 6: Trỏ tên miền & Cài chứng chỉ SSL (HTTPS Miễn phí)

1. **Trỏ tên miền**: Vào trang quản lý tên miền (nhà cung cấp tên miền của bạn), thêm bản ghi DNS:
   - Type `A` | Name `@` | Value `IP_CUA_VPS`
   - Type `A` | Name `www` | Value `IP_CUA_VPS`

2. **Cài đặt HTTPS Let's Encrypt**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d tenmien-cua-ban.vn -d www.tenmien-cua-ban.vn
   ```
   Chọn tùy chọn tự động gia hạn (Renew). Website sẽ chính thức có ổ khóa xanh an toàn `https://`.
