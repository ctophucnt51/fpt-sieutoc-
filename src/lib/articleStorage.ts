import fs from "fs";
import path from "path";
import { Article, slugifyVietnamese } from "@/types/article";

export type { Article };
export { slugifyVietnamese };

const PERSISTENT_DIR = path.join(process.cwd(), "data");
const SEED_DIR = path.join(process.cwd(), "src", "data");
const ARTICLES_FILE_PATH = path.join(PERSISTENT_DIR, "articles.json");
const SEED_ARTICLES_FILE = path.join(SEED_DIR, "articles.json");

const INITIAL_ARTICLES: Article[] = [
  {
  "id": "art-ngoai-hang-anh-vong-12-fpt-play-2026",
  "slug": "lich-thi-dau-ngoai-hang-anh-vong-12-truc-tiep-fpt-play",
  "title": "Lịch Thi Đấu Ngoại Hạng Anh Vòng 12: Trực Tiếp Trọn Vẹn 10 Trận Đỉnh Cao Trên FPT Play",
  "excerpt": "Lịch thi đấu Ngoại Hạng Anh Vòng 12 mới nhất: Tâm điểm đại chiến Arsenal vs Man City, rực lửa derby Merseyside Everton vs Liverpool, MU quyết đấu Brentford. Trực tiếp trọn vẹn 10 trận chuẩn 4K Ultra HD trên FPT Play.",
  "content": "\n<p>Không khí <strong>Ngoại Hạng Anh (Premier League) Vòng 12</strong> đang nóng lên hơn bao giờ hết với hàng loạt cuộc đối đầu đầy duyên nợ diễn ra vào hai ngày cuối tuần <strong>28/11 và 29/11</strong>. Từ trận <strong>derby Merseyside</strong> rực lửa giữa Everton và Liverpool cho đến màn đại chiến phân định ngôi đầu giữa <strong>Arsenal và Manchester City</strong>, tất cả sẽ được phát sóng trực tiếp và trọn vẹn 10/10 trận đấu trên <strong>FPT Play</strong>.</p>\n\n<h2>1. Lịch thi đấu Ngoại Hạng Anh Vòng 12 trực tiếp trên FPT Play</h2>\n<p>Quý khán giả có thể theo dõi đầy đủ 10 trận đấu thuộc khuôn khổ Vòng 12 Ngoại Hạng Anh trên hệ thống kênh thể thao của FPT Play theo lịch thi đấu chi tiết dưới đây (giờ Việt Nam):</p>\n\n<div class=\"not-prose my-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs\">\n  <table class=\"w-full text-left text-xs sm:text-sm border-collapse\">\n    <thead>\n      <tr class=\"bg-slate-50 border-b border-slate-200 text-slate-900 font-bold\">\n        <th class=\"py-3 px-4\">Thời gian</th>\n        <th class=\"py-3 px-4\">Cặp đấu</th>\n        <th class=\"py-3 px-4 text-right\">Chất lượng phát sóng</th>\n      </tr>\n    </thead>\n    <tbody class=\"divide-y divide-slate-100 text-slate-700\">\n      <tr class=\"hover:bg-slate-50/70 transition-colors\">\n        <td class=\"py-3 px-4 font-semibold text-fpt-orange whitespace-nowrap\">03:00 | 28/11</td>\n        <td class=\"py-3 px-4 font-bold text-slate-900\">Nottingham Forest – Chelsea</td>\n        <td class=\"py-3 px-4 text-right\"><span class=\"inline-block px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold\">4K Ultra HD</span></td>\n      </tr>\n      <tr class=\"hover:bg-slate-50/70 transition-colors\">\n        <td class=\"py-3 px-4 font-medium text-slate-600 whitespace-nowrap\">22:00 | 28/11</td>\n        <td class=\"py-3 px-4 font-semibold text-slate-800\">Leeds United – Coventry City</td>\n        <td class=\"py-3 px-4 text-right text-xs text-slate-500 font-medium\">FPT Play Full HD</td>\n      </tr>\n      <tr class=\"hover:bg-slate-50/70 transition-colors bg-orange-50/30\">\n        <td class=\"py-3 px-4 font-semibold text-fpt-orange whitespace-nowrap\">22:00 | 28/11</td>\n        <td class=\"py-3 px-4 font-bold text-slate-900\">Manchester United – Brentford</td>\n        <td class=\"py-3 px-4 text-right\"><span class=\"inline-block px-2 py-0.5 rounded-md bg-orange-50 text-fpt-orange border border-orange-200 text-[11px] font-bold\">Tâm điểm</span></td>\n      </tr>\n      <tr class=\"hover:bg-slate-50/70 transition-colors\">\n        <td class=\"py-3 px-4 font-medium text-slate-600 whitespace-nowrap\">00:30 | 29/11</td>\n        <td class=\"py-3 px-4 font-semibold text-slate-800\">Ipswich Town – Aston Villa</td>\n        <td class=\"py-3 px-4 text-right text-xs text-slate-500 font-medium\">FPT Play Full HD</td>\n      </tr>\n      <tr class=\"hover:bg-slate-50/70 transition-colors bg-orange-50/30\">\n        <td class=\"py-3 px-4 font-semibold text-fpt-orange whitespace-nowrap\">19:00 | 29/11</td>\n        <td class=\"py-3 px-4 font-bold text-slate-900\">Everton – Liverpool <span class=\"text-xs font-normal text-slate-500\">(Derby Merseyside)</span></td>\n        <td class=\"py-3 px-4 text-right\"><span class=\"inline-block px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold\">4K Ultra HD</span></td>\n      </tr>\n      <tr class=\"hover:bg-slate-50/70 transition-colors\">\n        <td class=\"py-3 px-4 font-medium text-slate-600 whitespace-nowrap\">21:05 | 29/11</td>\n        <td class=\"py-3 px-4 font-semibold text-slate-800\">Brighton – Newcastle United</td>\n        <td class=\"py-3 px-4 text-right text-xs text-slate-500 font-medium\">FPT Play Full HD</td>\n      </tr>\n      <tr class=\"hover:bg-slate-50/70 transition-colors\">\n        <td class=\"py-3 px-4 font-medium text-slate-600 whitespace-nowrap\">21:05 | 29/11</td>\n        <td class=\"py-3 px-4 font-semibold text-slate-800\">Crystal Palace – Hull City</td>\n        <td class=\"py-3 px-4 text-right text-xs text-slate-500 font-medium\">FPT Play Full HD</td>\n      </tr>\n      <tr class=\"hover:bg-slate-50/70 transition-colors\">\n        <td class=\"py-3 px-4 font-medium text-slate-600 whitespace-nowrap\">21:05 | 29/11</td>\n        <td class=\"py-3 px-4 font-semibold text-slate-800\">Fulham – AFC Bournemouth</td>\n        <td class=\"py-3 px-4 text-right text-xs text-slate-500 font-medium\">FPT Play Full HD</td>\n      </tr>\n      <tr class=\"hover:bg-slate-50/70 transition-colors\">\n        <td class=\"py-3 px-4 font-medium text-slate-600 whitespace-nowrap\">21:05 | 29/11</td>\n        <td class=\"py-3 px-4 font-semibold text-slate-800\">Sunderland – Tottenham Hotspur</td>\n        <td class=\"py-3 px-4 text-right text-xs text-slate-500 font-medium\">FPT Play Full HD</td>\n      </tr>\n      <tr class=\"hover:bg-slate-50/70 transition-colors bg-orange-50/50\">\n        <td class=\"py-3 px-4 font-bold text-red-600 whitespace-nowrap\">23:30 | 29/11</td>\n        <td class=\"py-3 px-4 font-black text-slate-900\">Arsenal – Manchester City <span class=\"text-xs font-semibold text-fpt-orange\">(Đại chiến)</span></td>\n        <td class=\"py-3 px-4 text-right\"><span class=\"inline-block px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold\">4K Ultra HD</span></td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n\n<h2>2. Những trận cầu tâm điểm không thể bỏ lỡ</h2>\n\n<h3><span class=\"text-fpt-orange\">2.1.</span> Arsenal – Manchester City (23h30 | 29/11): Đại chiến ngôi vương</h3>\n<p>Cuộc chạm trán tại sân Emirates được xem là tâm điểm lớn nhất của Vòng 12. <strong>Arsenal</strong> dưới thời Mikel Arteta đang cho thấy bản lĩnh phòng ngự chắc chắn cùng lối chơi kiểm soát chặt chẽ, trong khi <strong>Manchester City</strong> của Pep Guardiola luôn sẵn sàng trừng phạt mọi sai lầm bằng sức công phá của Erling Haaland. Pháo thủ hay Man City sẽ ca khúc khải hoàn sau 90 phút rực lửa?</p>\n\n<h3><span class=\"text-fpt-orange\">2.2.</span> Everton – Liverpool (19h00 | 29/11): Rực lửa Derby Merseyside</h3>\n<p>Những trận derby vùng Merseyside tại Goodison Park chưa bao giờ thiếu sự quyết liệt. Sắc đỏ <strong>Liverpool</strong> hành quân với mục tiêu giành trọn 3 điểm để củng cố vị thế, nhưng tinh thần chiến đấu không khoan nhượng của <strong>Everton</strong> trước khán giả nhà luôn ẩn chứa nhiều bất ngờ.</p>\n\n<h3><span class=\"text-fpt-orange\">2.3.</span> Manchester United – Brentford (22h00 | 28/11): Thử thách cho Quỷ Đỏ</h3>\n<p><strong>Manchester United</strong> cần một chiến thắng thuyết phục tại khung giờ vàng tối thứ Bảy để tạo đà tâm lý cho giai đoạn tăng tốc. Dù vậy, Brentford với lối đá chuyển trạng thái nhanh và kỷ luật vẫn luôn là đối thủ khó chịu với mọi đội bóng lớn.</p>\n\n<h3><span class=\"text-fpt-orange\">2.4.</span> Nottingham Forest – Chelsea (03h00 | 28/11): Mở màn chuẩn 4K</h3>\n<p>Trận đấu sớm nhất Vòng 12 là chuyến làm khách của <strong>Chelsea</strong> trên sân The City Ground. Cả hai đội đều sở hữu lối chơi giàu tốc độ, hứa hẹn mang đến bữa tiệc bóng đá cởi mở ngay từ rạng sáng 28/11.</p>\n\n<h2>3. Trực tiếp trọn vẹn Ngoại Hạng Anh trên FPT Play &amp; Internet Wi-Fi 6</h2>\n<p>Để tận hưởng trọn vẹn từng khoảnh khắc thăng hoa cùng trái bóng tròn mà không lo giật lag hay gián đoạn, quý khán giả có thể đồng hành cùng <strong>FPT Play</strong> – đơn vị phát sóng chính thức bản quyền Ngoại Hạng Anh tại Việt Nam:</p>\n<ul>\n  <li><strong>Phát sóng đầy đủ 10/10 trận đấu mỗi vòng:</strong> Không bỏ lỡ bất kỳ trận cầu nào ở mọi khung giờ.</li>\n  <li><strong>Hình ảnh sắc nét chuẩn 4K Ultra HD &amp; Full HD:</strong> Đường truyền mượt mà, bình luận tiếng Việt sôi động.</li>\n  <li><strong>Xem trực tiếp trên Smart TV không cần đầu thu Box:</strong> Hỗ trợ đa thiết bị từ TV, điện thoại, máy tính bảng đến laptop.</li>\n  <li><strong>Kết hợp đường truyền Internet Wi-Fi 6 siêu tốc:</strong> Tham khảo ngay <a href=\"/combo-ngoai-hang-anh\">gói Combo Internet + Ngoại Hạng Anh chỉ 220.000đ/tháng</a> hoặc <a href=\"/lap-mang-fpt\">các gói lắp mạng FPT Wi-Fi 6 tốc độ 1 Gbps</a> để có đường truyền ổn định tối đa cho gia đình và quán cà phê bóng đá.</li>\n</ul>\n\n<h2>4. Câu hỏi thường gặp khi xem Ngoại Hạng Anh trên FPT Play</h2>\n<div class=\"not-prose my-4 space-y-3\">\n  <div class=\"p-4 rounded-xl bg-slate-50/80 border border-slate-200/80\">\n    <p class=\"font-bold text-sm text-slate-900 mb-1\">FPT Play có phát sóng đầy đủ cả 10 trận Vòng 12 không?</p>\n    <p class=\"text-xs sm:text-sm text-slate-600 leading-relaxed\">Có. FPT Play phát sóng trực tiếp và trọn vẹn toàn bộ 10 trận đấu mỗi vòng của giải Ngoại Hạng Anh bản quyền tại Việt Nam.</p>\n  </div>\n  <div class=\"p-4 rounded-xl bg-slate-50/80 border border-slate-200/80\">\n    <p class=\"font-bold text-sm text-slate-900 mb-1\">Đăng ký Combo Internet FPT + FPT Play lắp đặt mất bao lâu?</p>\n    <p class=\"text-xs sm:text-sm text-slate-600 leading-relaxed\">Kỹ thuật viên FPT hỗ trợ khảo sát tuyến cáp 0đ và thi công lắp đặt hoàn tất trong vòng 24 giờ kể từ lúc đăng ký.</p>\n  </div>\n</div>\n\n<h2>5. Thông tin liên hệ tư vấn &amp; đăng ký lắp đặt</h2>\n<div class=\"not-prose my-4 p-4 sm:p-5 rounded-2xl bg-orange-50/70 border border-orange-200 text-slate-800 space-y-2 text-xs sm:text-sm\">\n  <p><strong>📍 Địa chỉ:</strong> Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ</p>\n  <p><strong>📞 Hotline hỗ trợ 24/7:</strong> <a href=\"tel:0878800400\" class=\"text-fpt-orange font-black hover:underline\">0878 800 400</a></p>\n  <p><strong>💬 Zalo tư vấn trực tiếp:</strong> <a href=\"https://zalo.me/0878800400\" target=\"_blank\" class=\"text-blue-600 font-bold hover:underline\">0878 800 400</a></p>\n  <p><strong>✉️ Email hỗ trợ:</strong> <a href=\"mailto:PhucNT51@fpt.com\" class=\"text-slate-900 font-semibold hover:underline\">PhucNT51@fpt.com</a></p>\n</div>\n",
  "category": "tin-tuc",
  "categoryName": "Tin Tức FPT",
  "thumbnail": "/images/banners/ngoai-hang-anh-vong-12-fpt-play.jpg",
  "author": "FPT Telecom Cần Thơ",
  "published": true,
  "featured": true,
  "views": 99,
  "readTimeMinutes": 4,
  "createdAt": "2026-11-25T15:00:00.000Z",
  "updatedAt": "2026-11-25T15:35:39.551Z"
},
  {
    id: "art-fpt-can-tho-khuyen-mai-2026",
    slug: "bang-gia-lap-mang-fpt-can-tho-khuyen-mai-moi-nhat",
    title: "Lắp Mạng FPT Cần Thơ: Bảng Giá Cước 2026 & Ưu Đãi Mới Nhất Tại FPT Cần Thơ",
    excerpt: "Tổng hợp chi tiết chương trình lắp mạng FPT Cần Thơ mới nhất 2026. FPT Cần Thơ ưu đãi gói chỉ Internet Wi-Fi 6 195.000đ/tháng, Combo Ngoại Hạng Anh 220.000đ/tháng, tặng kèm Camera AI an ninh miễn phí và lắp đặt trong 24 giờ.",
    content: `
      <h2>1. Tổng quan dịch vụ Lắp mạng FPT Cần Thơ</h2>
      <p>Dịch vụ <strong>lắp mạng FPT Cần Thơ</strong> do <strong>FPT Cần Thơ</strong> cung cấp hiện đã phủ sóng 100% hạ tầng cáp quang băng rộng thế hệ mới tại khắp các phường, xã trực thuộc Thành phố Cần Thơ. Với công nghệ cáp quang FTTH kết hợp chuẩn Wi-Fi 6 tiên tiến, <strong>FPT Cần Thơ</strong> mang lại trải nghiệm truy cập Internet siêu tốc, đáp ứng hoàn hảo cho việc học tập trực tuyến, giải trí phim ảnh 4K, livestream bán hàng và chơi game mượt mà.</p>
      
      <h2>2. Bảng giá lắp mạng FPT Cần Thơ cho cá nhân & gia đình</h2>
      <p>Khi đăng ký <strong>lắp mạng FPT Cần Thơ</strong>, khách hàng được ưu tiên lựa chọn 2 gói cước chiến lược phù hợp nhất:</p>
      <ul>
        <li><strong>Gói chỉ Internet Wi-Fi 6 (195.000đ/tháng):</strong> Tốc độ truyền tải siêu tốc lên đến 1 Gbps (1000 Mbps), hỗ trợ kết nối từ 10 - 25 thiết bị đồng thời. Trang bị Modem Wi-Fi 6 hai băng tần miễn phí theo chính sách gói cước.</li>
        <li><strong>Gói Combo Internet + Truyền hình + Ngoại Hạng Anh (220.000đ/tháng):</strong> Thưởng thức Bản quyền trọn vẹn các trận đấu Ngoại Hạng Anh (EPL) bản quyền Full HD cùng gần 170 kênh truyền hình FPT Play trên Smart TV, Smartphone, Tablet mà không cần đầu thu Box rườm rà.</li>
      </ul>

      <h2>3. chương trình ưu đãi hấp dẫn từ FPT Cần Thơ</h2>
      <p>Đặc biệt trong tháng này, khách hàng hoàn tất thủ tục đăng ký <strong>lắp mạng FPT Cần Thơ</strong> sẽ nhận ngay gói quà tặng an ninh giá trị cao:</p>
      <ul>
        <li><strong>Trang bị Modem Wi-Fi 6 & Tặng Camera AI miễn phí:</strong> Camera FPT thông minh độ phân giải Full HD, nhận diện chuyển động người bằng AI và lưu trữ đám mây Cloud bảo mật chuẩn quốc tế Tier III.</li>
        <li><strong>Khảo sát hạ tầng 0 đồng:</strong> Kỹ thuật viên <strong>FPT Cần Thơ</strong> kiểm tra tuyến cáp và tư vấn vị trí lắp đặt tận nơi không thu bất kỳ khoản phí nào.</li>
        <li><strong>Thi công siêu tốc trong 24 giờ:</strong> Kéo cáp quang, cấu hình thiết bị và kích hoạt đường truyền hoàn tất ngay trong ngày.</li>
      </ul>

      <h2>4. Phạm vi phục vụ của FPT Cần Thơ</h2>
      <p><strong>FPT Cần Thơ</strong> tiếp nhận đăng ký và bảo trì kỹ thuật tại tất cả 31 Phường và 72 Xã thuộc Thành phố Cần Thơ (sau sáp nhập đơn vị hành chính 07/2025):</p>
      <ul>
        <li>Phường Ninh Kiều, Cái Khế, Tân An, An Bình, Thới An Đông, Bình Thủy, Long Tuyền, Cái Răng, Hưng Phú, Ô Môn, Phước Thới, Thới Long, Thốt Nốt, Thuận Hưng, Tân Lộc...</li>
        <li>Các xã Phong Điền, Nhơn Ái, Thới Lai, Đông Thuận, Cờ Đỏ, Vĩnh Thạnh, Thạnh Lộc, Vị Thanh, Ngã Bảy, Sóc Trăng, Vĩnh Châu...</li>
      </ul>

      <h2>5. Hướng dẫn liên hệ đăng ký lắp mạng FPT Cần Thơ</h2>
      <p>Khách hàng có nhu cầu tư vấn hoặc đăng ký <strong>lắp mạng FPT Cần Thơ</strong> chỉ cần chuẩn bị ảnh Căn cước công dân (CCCD) và liên hệ qua:</p>
      <div class="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-slate-800 my-4">
        <p><strong>Hotline tư vấn FPT Cần Thơ:</strong> <a href="tel:0878800400" class="text-fpt-orange font-black">0878 800 400</a> (Hỗ trợ 24/7)</p>
        <p class="mt-1"><strong>Zalo hỗ trợ trực tiếp:</strong> <a href="https://zalo.me/0878800400" target="_blank" class="text-blue-600 font-bold">0878 800 400</a></p>
        <p class="mt-1"><strong>Đăng ký trực tuyến:</strong> Điền thông tin vào form trên website để chuyên viên FPT Cần Thơ gọi lại sau 5 - 15 phút.</p>
      </div>
    `,
    category: "khuyen-mai",
    categoryName: "Khuyến Mãi",
    thumbnail: "/images/banners/combo-epl-official.jpg",
    author: "FPT Telecom Cần Thơ",
    published: true,
    featured: true,
    views: 1520,
    readTimeMinutes: 4,
    createdAt: "2026-10-20T08:30:00.000Z",
    updatedAt: "2026-10-26T14:20:00.000Z",
  },
  {
    id: "art-danh-gia-wifi-6-fpt",
    slug: "danh-gia-toc-do-wifi-6-khi-lap-mang-fpt-can-tho",
    title: "Đánh Giá Tốc Độ Wi-Fi 6 Khi Lắp Mạng FPT Cần Thơ Cho Hộ Gia Đình",
    excerpt: "Trải nghiệm thực tế tốc độ mạng Wi-Fi 6 khi đăng ký lắp mạng FPT Cần Thơ. FPT Cần Thơ trang bị thiết bị Wi-Fi 6 thế hệ mới giúp sóng khỏe, ping dưới 10ms, phủ kín nhà phố nhiều tầng.",
    content: `
      <h2>1. Vì sao nên chọn Wi-Fi 6 khi lắp mạng FPT Cần Thơ?</h2>
      <p>Khi đăng ký <strong>lắp mạng FPT Cần Thơ</strong>, khách hàng được <strong>FPT Cần Thơ</strong> nâng cấp miễn phí theo chính sách gói cước thiết bị Modem Wi-Fi 6 chuẩn 802.11ax thế hệ mới nhất. So với thế hệ Wi-Fi 5 cũ, công nghệ mới của <strong>FPT Cần Thơ</strong> mang lại bước đột phá lớn về tốc độ và khả năng chịu tải.</p>
      
      <h2>2. Kết quả đo kiểm thực tế tại Thành phố Cần Thơ</h2>
      <ul>
        <li><strong>Tốc độ đo được:</strong> Tốc độ tải về thực tế đạt từ 850 Mbps - 1000 Mbps trên đường truyền gói Sky FPT Cần Thơ.</li>
        <li><strong>Độ trễ (Ping):</strong> Giảm xuống dưới 10ms khi kết nối máy chủ trong nước, giúp game thủ chơi Liên Quân, FO4, Valorant, PUBG mượt mà không bị giật lag.</li>
        <li><strong>Khả năng xuyên tường:</strong> Băng tần kép 2.4 GHz và 5 GHz với công nghệ Beamforming tập trung sóng đến thiết bị, phát xuyên 2 - 3 sàn bê tông tại nhà phố Cần Thơ mà sóng vẫn ổn định.</li>
      </ul>

      <h2>3. FPT Cần Thơ cam kết chất lượng dịch vụ</h2>
      <p>Mọi khách hàng sử dụng dịch vụ <strong>lắp mạng FPT Cần Thơ</strong> đều được hưởng chế độ bảo hành và hỗ trợ đổi mới modem Wi-Fi 6 trong suốt thời gian sử dụng dịch vụ theo chính sách FPT Telecom. Khi gặp bất kỳ sự cố kỹ thuật nào, đội ngũ kỹ sư <strong>FPT Cần Thơ</strong> sẽ có mặt xử lý trong vòng 60 - 120 phút.</p>
    `,
    category: "huong-dan",
    categoryName: "Hướng Dẫn Kỹ Thuật",
    thumbnail: "/images/products/modem-wifi6-official.png",
    author: "Ban Kỹ Thuật FPT Cần Thơ",
    published: true,
    featured: false,
    views: 1040,
    readTimeMinutes: 3,
    createdAt: "2026-10-22T09:00:00.000Z",
    updatedAt: "2026-10-26T14:20:00.000Z",
  },
  {
    id: "art-camera-ai-fpt-an-toan",
    slug: "fpt-can-tho-tang-camera-ai-mien-phi-khi-lap-mang-moi",
    title: "FPT Cần Thơ Tặng Camera AI An Ninh Miễn Phí Cho Khách Hàng Lắp Mạng Mới",
    excerpt: "Chương trình ưu đãi đặc biệt từ FPT Cần Thơ: Tặng ngay 01 Camera FPT AI an ninh thông minh 0đ khi đăng ký lắp mạng FPT Cần Thơ. Lưu trữ Cloud Việt Nam bảo mật cao chuẩn quốc tế Tier III.",
    content: `
      <h2>1. chương trình ưu đãi hấp dẫn từ FPT Cần Thơ</h2>
      <p>Nhằm đồng hành cùng người dân Thành phố Cần Thơ trong việc bảo vệ an ninh tổ ấm và giám sát cửa hàng, <strong>FPT Cần Thơ</strong> triển khai chương trình đặc biệt: <strong>Tặng Camera FPT AI an ninh thông minh miễn phí</strong> cho mọi hợp đồng <strong>lắp mạng FPT Cần Thơ</strong> đăng ký mới.</p>
      
      <h2>2. Ưu điểm vượt trội của Camera AI do FPT Cần Thơ cung cấp</h2>
      <ul>
        <li><strong>Nhận diện người thông minh bằng AI:</strong> Phân biệt chuẩn xác giữa chuyển động của con người với xe cộ hay thú cưng, giảm thiểu tối đa cảnh báo giả.</li>
        <li><strong>Lưu trữ dữ liệu đám mây Cloud tại Việt Nam:</strong> Toàn bộ dữ liệu video được mã hóa an toàn trên hệ thống máy chủ FPT đạt chuẩn quốc tế Tier III, đảm bảo quyền riêng tư và không lo bị trộm thẻ nhớ.</li>
        <li><strong>Hình ảnh sắc nét Full HD ban đêm:</strong> Hồng ngoại tầm xa quan sát rõ mặt người ngay cả trong bóng tối hoàn toàn.</li>
        <li><strong>Đàm thoại 2 chiều to rõ:</strong> Dễ dàng nhắc nhở con nhỏ hoặc trao đổi với người thân từ xa qua ứng dụng FPT Camera trên điện thoại.</li>
      </ul>

      <h2>3. Cách nhận ưu đãi từ FPT Cần Thơ ngay hôm nay</h2>
      <p>Để nhận trọn bộ Modem Wi-Fi 6 & Camera AI miễn phí từ <strong>FPT Cần Thơ</strong>, quý khách hãy liên hệ Hotline <a href="tel:0878800400" class="text-fpt-orange font-black">0878 800 400</a> để được chuyên viên <strong>lắp mạng FPT Cần Thơ</strong> hỗ trợ khảo sát và lên hồ sơ lắp đặt trong 24 giờ.</p>
    `,
    category: "tin-tuc",
    categoryName: "Tin Tức FPT",
    thumbnail: "/images/products/camera-iq3-official.jpg",
    author: "Chuyên Viên FPT Cần Thơ",
    published: true,
    featured: false,
    views: 920,
    readTimeMinutes: 3,
    createdAt: "2026-10-24T11:00:00.000Z",
    updatedAt: "2026-10-26T14:20:00.000Z",
  },
];

// Ensure articles file exists
function ensureArticlesFile(): Article[] {
  try {
    if (!fs.existsSync(PERSISTENT_DIR)) {
      fs.mkdirSync(PERSISTENT_DIR, { recursive: true });
    }
    if (!fs.existsSync(ARTICLES_FILE_PATH)) {
      if (fs.existsSync(SEED_ARTICLES_FILE)) {
        try {
          fs.copyFileSync(SEED_ARTICLES_FILE, ARTICLES_FILE_PATH);
          const copied = fs.readFileSync(ARTICLES_FILE_PATH, "utf-8");
          return JSON.parse(copied) as Article[];
        } catch (copyErr) {
          console.error("Error copying seed articles:", copyErr);
        }
      }
      fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(INITIAL_ARTICLES, null, 2), "utf-8");
      return INITIAL_ARTICLES;
    }
    const data = fs.readFileSync(ARTICLES_FILE_PATH, "utf-8");
    const persistentArticles = JSON.parse(data) as Article[];
    if (fs.existsSync(SEED_ARTICLES_FILE)) {
      try {
        const seedData = fs.readFileSync(SEED_ARTICLES_FILE, "utf-8");
        const seedArticles = JSON.parse(seedData) as Article[];
        let hasNew = false;
        for (const sa of seedArticles) {
          const existingIdx = persistentArticles.findIndex((pa) => pa.id === sa.id || pa.slug === sa.slug);
          if (existingIdx === -1) {
            persistentArticles.unshift(sa);
            hasNew = true;
          } else {
            const pa = persistentArticles[existingIdx];
            const hasLegacyViolation = /bảo\s*mật\s*tuyệt\s*đối|giảm\s*99%|an\s*toàn\s*tuyệt\s*đối/i.test(
              `${pa.title} ${pa.excerpt} ${pa.content}`
            );
            if (hasLegacyViolation || new Date(sa.updatedAt).getTime() > new Date(pa.updatedAt).getTime()) {
              persistentArticles[existingIdx] = {
                ...pa,
                title: sa.title,
                excerpt: sa.excerpt,
                content: sa.content,
                updatedAt: sa.updatedAt,
              };
              hasNew = true;
            }
          }
        }
        if (hasNew) {
          fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(persistentArticles, null, 2), "utf-8");
        }
      } catch {}
    }
    return persistentArticles;
  } catch (err) {
    console.error("Error reading articles file:", err);
    return INITIAL_ARTICLES;
  }
}

// Get all articles (for admin: all; for public: published only)
export function getAllArticles(includeUnpublished = false): Article[] {
  const articles = ensureArticlesFile();
  if (includeUnpublished) {
    return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return articles
    .filter((a) => a.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Get single article by slug
export function getArticleBySlug(slug: string, incrementViews = false): Article | null {
  const articles = ensureArticlesFile();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;

  if (incrementViews) {
    article.views = (article.views || 0) + 1;
    saveAllArticles(articles);
  }
  return article;
}

// Get article by ID
export function getArticleById(id: string): Article | null {
  const articles = ensureArticlesFile();
  return articles.find((a) => a.id === id) || null;
}

// Save all articles
export function saveAllArticles(articles: Article[]): boolean {
  try {
    if (!fs.existsSync(PERSISTENT_DIR)) {
      fs.mkdirSync(PERSISTENT_DIR, { recursive: true });
    }
    fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(articles, null, 2), "utf-8");
    if (fs.existsSync(SEED_DIR)) {
      try {
        fs.writeFileSync(SEED_ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
      } catch {}
    }
    return true;
  } catch (err) {
    console.error("Error saving articles file:", err);
    return false;
  }
}

// Create or update article
export function upsertArticle(articleData: Partial<Article>): { success: boolean; article?: Article; error?: string } {
  try {
    const articles = ensureArticlesFile();
    const now = new Date().toISOString();

    if (articleData.id) {
      // Update existing
      const index = articles.findIndex((a) => a.id === articleData.id);
      if (index === -1) {
        return { success: false, error: "Bài viết không tồn tại." };
      }

      // If title changed and no explicit slug provided, re-generate slug
      const slug = articleData.slug || slugifyVietnamese(articleData.title || articles[index].title);

      const updatedArticle: Article = {
        ...articles[index],
        ...articleData,
        slug,
        updatedAt: now,
      };

      articles[index] = updatedArticle;
      saveAllArticles(articles);
      return { success: true, article: updatedArticle };
    } else {
      // Create new
      if (!articleData.title || !articleData.content) {
        return { success: false, error: "Vui lòng nhập tiêu đề và nội dung bài viết." };
      }

      const id = `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      let slug = articleData.slug ? slugifyVietnamese(articleData.slug) : slugifyVietnamese(articleData.title);

      // Ensure slug uniqueness
      let counter = 1;
      let finalSlug = slug;
      while (articles.some((a) => a.slug === finalSlug)) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }

      // Calculate read time approx 200 words/min
      const words = (articleData.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
      const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

      const categoryNameMap: Record<string, string> = {
        "khuyen-mai": "Khuyến Mãi",
        "huong-dan": "Hướng Dẫn Kỹ Thuật",
        "tin-tuc": "Tin Tức FPT",
        "goi-cuoc": "Tư Vấn Gói Cước",
      };

      const category = articleData.category || "tin-tuc";

      const newArticle: Article = {
        id,
        slug: finalSlug,
        title: articleData.title.trim(),
        excerpt: articleData.excerpt || articleData.content.replace(/<[^>]*>/g, "").substring(0, 160) + "...",
        content: articleData.content,
        category,
        categoryName: categoryNameMap[category] || "Tin Tức",
        thumbnail: articleData.thumbnail || "/images/banners/combo-epl-official.jpg",
        author: articleData.author || "FPT Telecom Cần Thơ",
        published: articleData.published !== undefined ? articleData.published : true,
        featured: Boolean(articleData.featured),
        views: 0,
        readTimeMinutes,
        createdAt: now,
        updatedAt: now,
      };

      articles.unshift(newArticle);
      saveAllArticles(articles);
      return { success: true, article: newArticle };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Lỗi lưu bài viết." };
  }
}

// Delete article
export function deleteArticle(id: string): boolean {
  try {
    const articles = ensureArticlesFile();
    const filtered = articles.filter((a) => a.id !== id);
    if (filtered.length === articles.length) return false;
    saveAllArticles(filtered);
    return true;
  } catch (err) {
    console.error("Error deleting article:", err);
    return false;
  }
}
