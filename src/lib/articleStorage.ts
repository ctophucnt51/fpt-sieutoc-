import fs from "fs";
import path from "path";
import { Article, slugifyVietnamese } from "@/types/article";

export type { Article };
export { slugifyVietnamese };

const PERSISTENT_DIR = path.join(process.cwd(), "data");
const SEED_DIR = path.join(process.cwd(), "src", "data");
const ARTICLES_FILE_PATH = path.join(PERSISTENT_DIR, "articles.json");
const SEED_ARTICLES_FILE = path.join(SEED_DIR, "articles.json");

// Initial seed articles if articles.json does not exist
const INITIAL_ARTICLES: Article[] = [
  {
  "id": "art-ngoai-hang-anh-vong-12-fpt-play-2026",
  "slug": "lich-thi-dau-ngoai-hang-anh-vong-12-truc-tiep-fpt-play",
  "title": "Lịch Thi Đấu Ngoại Hạng Anh Vòng 12: Trực Tiếp Trọn Vẹn 10 Trận Đỉnh Cao Trên FPT Play",
  "excerpt": "Cập nhật chi tiết lịch thi đấu Ngoại Hạng Anh vòng 12 mới nhất. Xem trực tiếp trọn vẹn 10 trận đấu trên FPT Play: Đại chiến Arsenal vs Man City, Derby Merseyside Everton vs Liverpool, MU vs Brentford. Đăng ký Combo Internet FPT thưởng thức 4K siêu mượt.",
  "content": "\n    <h2>1. Ngoại Hạng Anh Vòng 12: Cuối tuần rực lửa, đại chiến bùng nổ</h2>\n    <p>Giải bóng đá <strong>Ngoại Hạng Anh (English Premier League) Vòng 12</strong> tiếp tục hâm nóng hàng triệu con tim người hâm mộ túc cầu với những cuộc đối đầu đầy duyên nợ và kịch tính tột cùng. Mọi ánh mắt của giới mộ điệu trên toàn cầu sẽ đổ dồn về trận cầu kinh điển giữa <strong>Arsenal và Manchester City</strong> – cuộc thư hùng mang tính then chốt định đoạt ngôi vương mùa giải, cùng màn rực lửa truyền thống của trận <strong>Derby Merseyside giữa Everton và Liverpool</strong>.</p>\n    \n    <div class=\"my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-md\">\n      <img src=\"/images/banners/ngoai-hang-anh-vong-12-fpt-play.jpg\" alt=\"Lịch thi đấu Ngoại Hạng Anh Vòng 12 trực tiếp trọn vẹn trên FPT Play\" class=\"w-full h-auto object-cover\" />\n      <p class=\"text-xs text-center text-slate-500 py-2 bg-slate-50 font-medium\">FPT Play – Đơn vị phát sóng chính thức bản quyền trọn vẹn 10 trận Ngoại Hạng Anh Vòng 12 chất lượng 4K Ultra HD</p>\n    </div>\n\n    <h2>2. Bảng lịch thi đấu chi tiết Ngoại Hạng Anh Vòng 12 trên FPT Play</h2>\n    <p>Khán giả có thể theo dõi trực tiếp trọn vẹn toàn bộ 10 trận đấu của Vòng 12 Premier League trên các kênh sóng của <strong>FPT Play</strong> theo lịch thi đấu cụ thể sau (giờ Việt Nam):</p>\n    \n    <div class=\"overflow-x-auto my-6\">\n      <table class=\"w-full text-left text-sm border-collapse bg-white rounded-xl shadow-xs border border-slate-200\">\n        <thead>\n          <tr class=\"bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider\">\n            <th class=\"p-3 border-b border-orange-600\">Thời gian</th>\n            <th class=\"p-3 border-b border-orange-600\">Trận đấu</th>\n            <th class=\"p-3 border-b border-orange-600\">Chất lượng / Kênh phát</th>\n          </tr>\n        </thead>\n        <tbody class=\"divide-y divide-slate-100 text-slate-700\">\n          <tr class=\"hover:bg-orange-50/50 transition-colors font-semibold bg-orange-50/30\">\n            <td class=\"p-3 text-fpt-orange font-bold\">03:00 | 28/11</td>\n            <td class=\"p-3\">Nottingham Forest – Chelsea</td>\n            <td class=\"p-3\"><span class=\"px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-black\">4K ULTRA HD</span> FPT Play</td>\n          </tr>\n          <tr class=\"hover:bg-slate-50 transition-colors\">\n            <td class=\"p-3 text-slate-500 font-medium\">22:00 | 28/11</td>\n            <td class=\"p-3 font-medium\">Leeds United – Coventry City</td>\n            <td class=\"p-3\">FPT Play (Full HD)</td>\n          </tr>\n          <tr class=\"hover:bg-orange-50/50 transition-colors font-semibold\">\n            <td class=\"p-3 text-fpt-orange font-bold\">22:00 | 28/11</td>\n            <td class=\"p-3 text-slate-900 font-bold\">Manchester United – Brentford</td>\n            <td class=\"p-3\"><span class=\"px-2 py-0.5 rounded bg-orange-600 text-white text-[11px] font-bold\">HOT</span> FPT Play (Full HD)</td>\n          </tr>\n          <tr class=\"hover:bg-slate-50 transition-colors\">\n            <td class=\"p-3 text-slate-500 font-medium\">00:30 | 29/11</td>\n            <td class=\"p-3 font-medium\">Ipswich Town – Aston Villa</td>\n            <td class=\"p-3\">FPT Play (Full HD)</td>\n          </tr>\n          <tr class=\"hover:bg-orange-50/50 transition-colors font-semibold bg-orange-50/30\">\n            <td class=\"p-3 text-fpt-orange font-bold\">19:00 | 29/11</td>\n            <td class=\"p-3 text-slate-900 font-black\">Everton – Liverpool (Derby Merseyside)</td>\n            <td class=\"p-3\"><span class=\"px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-black\">4K ULTRA HD</span> FPT Play</td>\n          </tr>\n          <tr class=\"hover:bg-slate-50 transition-colors\">\n            <td class=\"p-3 text-slate-500 font-medium\">21:05 | 29/11</td>\n            <td class=\"p-3 font-medium\">Brighton – Newcastle United</td>\n            <td class=\"p-3\">FPT Play (Full HD)</td>\n          </tr>\n          <tr class=\"hover:bg-slate-50 transition-colors\">\n            <td class=\"p-3 text-slate-500 font-medium\">21:05 | 29/11</td>\n            <td class=\"p-3 font-medium\">Crystal Palace – Hull City</td>\n            <td class=\"p-3\">FPT Play (Full HD)</td>\n          </tr>\n          <tr class=\"hover:bg-slate-50 transition-colors\">\n            <td class=\"p-3 text-slate-500 font-medium\">21:05 | 29/11</td>\n            <td class=\"p-3 font-medium\">Fulham – AFC Bournemouth</td>\n            <td class=\"p-3\">FPT Play (Full HD)</td>\n          </tr>\n          <tr class=\"hover:bg-slate-50 transition-colors\">\n            <td class=\"p-3 text-slate-500 font-medium\">21:05 | 29/11</td>\n            <td class=\"p-3 font-medium\">Sunderland – Tottenham Hotspur</td>\n            <td class=\"p-3\">FPT Play (Full HD)</td>\n          </tr>\n          <tr class=\"hover:bg-orange-50/50 transition-colors font-semibold bg-orange-100/40 border-t-2 border-orange-300\">\n            <td class=\"p-3 text-red-600 font-black\">23:30 | 29/11</td>\n            <td class=\"p-3 text-slate-900 font-black text-base\">Arsenal – Manchester City (Đại chiến ngôi đầu)</td>\n            <td class=\"p-3\"><span class=\"px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-black\">4K ULTRA HD</span> FPT Play</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n\n    <h2>3. Những tâm điểm rực lửa không thể bỏ lỡ tại Vòng 12</h2>\n    \n    <h3>3.1. Đại chiến vương quyền: Arsenal vs Manchester City (23h30 | 29/11)</h3>\n    <p>Đây chắc chắn là trận cầu được chờ đợi nhất tuần đấu. Arsenal với sự thăng hoa của dàn hảo thủ trẻ tuổi cùng lối đá kiểm soát áp đảo dưới thời Mikel Arteta sẽ tiếp đón nhà đương kim vô địch Man City của Pep Guardiola. Trận đấu hứa hẹn màn đọ trí đỉnh cao, nghẹt thở từ phút đầu tiên đến giây cuối cùng.</p>\n\n    <h3>3.2. Derby Merseyside máu lửa: Everton vs Liverpool (19h00 | 29/11)</h3>\n    <p>Trận derby vùng Merseyside giữa Everton và Liverpool chưa bao giờ thiếu đi tính quyết liệt và những pha tranh chấp nảy lửa. Liệu sắc đỏ Liverpool có tiếp tục áp đảo, hay bản lĩnh của The Toffees trên sân nhà Goodison Park sẽ tạo nên bất ngờ lớn?</p>\n\n    <h3>3.3. Thử thách của Quỷ Đỏ: Manchester United vs Brentford (22h00 | 28/11)</h3>\n    <p>Man United đang rất khát điểm để vươn lên nhóm dẫn đầu bảng xếp hạng. Tuy nhiên, Brentford luôn là \"khắc tinh\" nguy hiểm với lối đá phản công tốc độ và thể lực sung mãn. Người hâm mộ Quỷ đỏ kỳ vọng đội bóng con cưng sẽ có một ngày thi đấu bùng nổ.</p>\n\n    <h2>4. Trải nghiệm xem Ngoại Hạng Anh đỉnh cao cùng Combo Internet FPT Siêu Tốc</h2>\n    <p>Để không bỏ lỡ bất kỳ khoảnh khắc ghi bàn hay pha bóng kịch tính nào, đường truyền Internet ổn định và chất lượng hình ảnh sắc nét là yếu tố quan trọng nhất. Khi đăng ký <strong>Combo Internet + Truyền hình FPT Play</strong>, bạn sẽ được tận hưởng:</p>\n    <ul>\n      <li><strong>Trực tiếp trọn vẹn 380 trận đấu/mùa:</strong> Bản quyền phát sóng chính thức độc quyền tại Việt Nam.</li>\n      <li><strong>Chất lượng 4K Ultra HD & Full HD siêu nét:</strong> Hình ảnh chân thực đến từng ngọn cỏ, âm thanh sân vận động sống động như đang ngồi trực tiếp tại khán đài Anh Quốc.</li>\n      <li><strong>Hạ tầng Wi-Fi 6 tốc độ cao lên đến 1 Gbps:</strong> Đường truyền cáp quang băng rộng thế hệ mới, ping cực thấp dưới 10ms, cam kết không giật lag, không đứng hình trong các khung giờ cao điểm.</li>\n      <li><strong>Xem đa thiết bị linh hoạt:</strong> Đăng nhập xem đồng thời trên Smart TV, Smartphone, Tablet, Máy tính mà không cần đầu thu cồng kềnh.</li>\n    </ul>\n\n    <h2>5. Bảng giá ưu đãi Combo Internet FPT + FPT Play chỉ từ 220.000đ/tháng</h2>\n    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 my-6\">\n      <div class=\"p-5 rounded-2xl bg-white border-2 border-orange-500 shadow-sm space-y-3\">\n        <span class=\"px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider\">Gói Hot Nhất</span>\n        <h4 class=\"text-xl font-black text-slate-900\">Combo GIGA (EPL)</h4>\n        <div class=\"text-3xl font-black text-fpt-orange\">220.000đ <span class=\"text-xs font-normal text-slate-500\">/tháng</span></div>\n        <p class=\"text-xs text-slate-600\">Trọn gói Internet cáp quang siêu tốc 150 Mbps + Bản quyền trọn vẹn Ngoại Hạng Anh trên FPT Play.</p>\n        <ul class=\"text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-100\">\n          <li>✓ Miễn phí Modem Wi-Fi 6 thế hệ mới</li>\n          <li>✓ Xem trọn vẹn 10 trận Ngoại Hạng Anh mỗi vòng</li>\n          <li>✓ Gần 170 kênh truyền hình trong nước & quốc tế</li>\n          <li>✓ Tặng kèm Camera AI an ninh thông minh miễn phí</li>\n        </ul>\n      </div>\n      <div class=\"p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3\">\n        <span class=\"px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider\">Tốc Độ Đỉnh Cao</span>\n        <h4 class=\"text-xl font-black text-slate-900\">Combo SKY (EPL)</h4>\n        <div class=\"text-3xl font-black text-slate-900\">250.000đ <span class=\"text-xs font-normal text-slate-500\">/tháng</span></div>\n        <p class=\"text-xs text-slate-600\">Tốc độ mở rộng không giới hạn lên đến 1 Gbps (1000 Mbps), đáp ứng hoàn hảo cho phòng chiếu bóng đá gia đình và quán cafe.</p>\n        <ul class=\"text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-100\">\n          <li>✓ Modem Wi-Fi 6 băng tần kép phát sóng xuyên tường</li>\n          <li>✓ Chuẩn 4K Ultra HD mượt mà cho màn hình lớn</li>\n          <li>✓ Trực tiếp Ngoại Hạng Anh, Cúp C1, FA Cup...</li>\n          <li>✓ Triển khai lắp đặt siêu tốc trong 24 giờ</li>\n        </ul>\n      </div>\n    </div>\n\n    <h2>6. Thông tin liên hệ đăng ký lắp đặt ngay hôm nay</h2>\n    <p>Để kịp thời thưởng thức trọn vẹn vòng 12 Ngoại Hạng Anh cuối tuần này, quý khách hàng vui lòng liên hệ ngay đội ngũ FPT Telecom để được tư vấn và hỗ trợ triển khai trong 24 giờ:</p>\n    \n    <div class=\"p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 text-slate-800 my-4 space-y-2\">\n      <p>📍 <strong>Địa chỉ liên hệ:</strong> Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ</p>\n      <p>📞 <strong>Hotline tư vấn 24/7:</strong> <a href=\"tel:0878800400\" class=\"text-fpt-orange font-black text-lg\">0878 800 400</a></p>\n      <p>💬 <strong>Zalo hỗ trợ trực tiếp:</strong> <a href=\"https://zalo.me/0878800400\" target=\"_blank\" class=\"text-blue-600 font-bold\">0878 800 400 (FPT Siêu Tốc)</a></p>\n      <p>✉️ <strong>Email hỗ trợ:</strong> <a href=\"mailto:PhucNT51@fpt.com\" class=\"text-slate-700 font-semibold\">PhucNT51@fpt.com</a></p>\n      <p>🌐 <strong>Website đăng ký chính thức:</strong> <a href=\"https://gofpt.vn\" class=\"text-fpt-orange font-bold\">https://gofpt.vn</a></p>\n    </div>\n  ",
  "category": "tin-tuc",
  "categoryName": "Tin Tức FPT",
  "thumbnail": "/images/banners/ngoai-hang-anh-vong-12-fpt-play.jpg",
  "author": "FPT Telecom Cần Thơ",
  "published": true,
  "featured": true,
  "views": 89,
  "readTimeMinutes": 4,
  "createdAt": "2026-11-25T15:00:00.000Z",
  "updatedAt": "2026-11-25T15:00:00.000Z"
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
        <li><strong>Gói chỉ Internet Wi-Fi 6 (195.000đ/tháng):</strong> Tốc độ truyền tải siêu tốc lên đến 1 Gbps (1000 Mbps), hỗ trợ kết nối từ 10 - 25 thiết bị đồng thời. Trang bị Modem Wi-Fi 6 hai băng tần hoàn toàn miễn phí.</li>
        <li><strong>Gói Combo Internet + Truyền hình + Ngoại Hạng Anh (220.000đ/tháng):</strong> Thưởng thức Bản quyền trọn vẹn các trận đấu Ngoại Hạng Anh (EPL) bản quyền Full HD cùng gần 170 kênh truyền hình FPT Play trên Smart TV, Smartphone, Tablet mà không cần đầu thu Box rườm rà.</li>
      </ul>

      <h2>3. Chương trình ưu đãi độc quyền từ FPT Cần Thơ</h2>
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
      <p>Khi đăng ký <strong>lắp mạng FPT Cần Thơ</strong>, khách hàng được <strong>FPT Cần Thơ</strong> nâng cấp hoàn toàn miễn phí thiết bị Modem Wi-Fi 6 chuẩn 802.11ax thế hệ mới nhất. So với thế hệ Wi-Fi 5 cũ, công nghệ mới của <strong>FPT Cần Thơ</strong> mang lại bước đột phá lớn về tốc độ và khả năng chịu tải.</p>
      
      <h2>2. Kết quả đo kiểm thực tế tại Thành phố Cần Thơ</h2>
      <ul>
        <li><strong>Tốc độ đo được:</strong> Tốc độ tải về thực tế đạt từ 850 Mbps - 1000 Mbps trên đường truyền gói Sky FPT Cần Thơ.</li>
        <li><strong>Độ trễ (Ping):</strong> Giảm xuống dưới 10ms khi kết nối máy chủ trong nước, giúp game thủ chơi Liên Quân, FO4, Valorant, PUBG mượt mà không bị giật lag.</li>
        <li><strong>Khả năng xuyên tường:</strong> Băng tần kép 2.4 GHz và 5 GHz với công nghệ Beamforming tập trung sóng đến thiết bị, phát xuyên 2 - 3 sàn bê tông tại nhà phố Cần Thơ mà sóng vẫn ổn định.</li>
      </ul>

      <h2>3. FPT Cần Thơ cam kết chất lượng dịch vụ</h2>
      <p>Mọi khách hàng sử dụng dịch vụ <strong>lắp mạng FPT Cần Thơ</strong> đều được hưởng chế độ bảo hành và đổi mới modem Wi-Fi 6 trọn đời thiết bị. Khi gặp bất kỳ sự cố kỹ thuật nào, đội ngũ kỹ sư <strong>FPT Cần Thơ</strong> sẽ có mặt xử lý trong vòng 60 - 120 phút.</p>
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
    excerpt: "Chương trình ưu đãi đặc biệt từ FPT Cần Thơ: Tặng ngay 01 Camera FPT AI an ninh thông minh 0đ khi đăng ký lắp mạng FPT Cần Thơ. Lưu trữ Cloud Việt Nam bảo mật tuyệt đối.",
    content: `
      <h2>1. Chính sách tặng quà độc quyền từ FPT Cần Thơ</h2>
      <p>Nhằm đồng hành cùng người dân Thành phố Cần Thơ trong việc bảo vệ an ninh tổ ấm và giám sát cửa hàng, <strong>FPT Cần Thơ</strong> triển khai chương trình đặc biệt: <strong>Tặng Camera FPT AI an ninh thông minh miễn phí</strong> cho mọi hợp đồng <strong>lắp mạng FPT Cần Thơ</strong> đăng ký mới.</p>
      
      <h2>2. Ưu điểm vượt trội của Camera AI do FPT Cần Thơ cung cấp</h2>
      <ul>
        <li><strong>Nhận diện người thông minh bằng AI:</strong> Phân biệt chuẩn xác giữa chuyển động của con người với xe cộ hay thú cưng, giảm 99% cảnh báo rác.</li>
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
          if (!persistentArticles.some((pa) => pa.id === sa.id || pa.slug === sa.slug)) {
            persistentArticles.unshift(sa);
            hasNew = true;
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
