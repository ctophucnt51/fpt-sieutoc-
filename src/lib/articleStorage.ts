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
  "content": "\n<h2 class=\"text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3 pt-6 pb-2.5 border-b-2 border-orange-100\">\n  <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shrink-0 shadow-xs\">1</span>\n  <span>Khúc Cua Định Mệnh: Ngoại Hạng Anh Vòng 12 Rực Lửa Đại Chiến</span>\n</h2>\n<p class=\"text-slate-800 leading-relaxed text-base\">\n  Sau những vòng đấu nghẹt thở, giải bóng đá hấp dẫn nhất hành tinh <strong>Ngoại Hạng Anh (English Premier League)</strong> bước vào <strong>Vòng đấu thứ 12</strong> với những cuộc đại chiến mang tính bước ngoặt của cả mùa giải. Mọi tâm điểm sẽ hướng trọn về sân vận động Emirates trong màn thư hùng đỉnh cao giữa <strong>Arsenal và Manchester City</strong> – trận chiến trực tiếp định đoạt ngôi vương. Cùng với đó là chảo lửa Goodison Park bùng cháy trong trận <strong>Derby Merseyside rực lửa giữa Everton và Liverpool</strong>.\n</p>\n\n<!-- Khối Thông Tin Phát Sóng: Độ Tương Phản Cao, Chữ Đậm Rõ Nét -->\n<div class=\"my-6 p-5 rounded-2xl bg-orange-50/90 border-2 border-orange-300 shadow-xs\">\n  <div class=\"flex items-center gap-2 mb-2\">\n    <span class=\"inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-600 text-white text-xs font-black uppercase tracking-wider shadow-xs\">\n      ⚡ THÔNG TIN PHÁT SÓNG ĐỘC QUYỀN\n    </span>\n    <span class=\"text-xs font-bold text-orange-950\">Chính thức tại Việt Nam</span>\n  </div>\n  <p class=\"text-sm sm:text-base leading-relaxed text-slate-900 font-semibold mb-0\">\n    Toàn bộ <strong>10 trận đấu của Vòng 12 Ngoại Hạng Anh</strong> được phát sóng <strong>trực tiếp &amp; trọn vẹn trên FPT Play</strong> với độ phân giải siêu nét lên tới <strong>4K Ultra HD</strong>, âm thanh vòm sống động và đội ngũ bình luận viên tiếng Việt giàu nhiệt huyết.\n  </p>\n</div>\n\n<h2 class=\"text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3 pt-6 pb-2.5 border-b-2 border-orange-100\">\n  <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shrink-0 shadow-xs\">2</span>\n  <span>Bảng Lịch Thi Đấu Chi Tiết Vòng 12 Ngoại Hạng Anh Trên FPT Play</span>\n</h2>\n<p class=\"text-slate-800 leading-relaxed text-base\">\n  Dưới đây là lịch thi đấu chi tiết 10 trận cầu Vòng 12 giải Ngoại Hạng Anh được phân chia cụ thể theo từng ngày (theo giờ Việt Nam) để quý khán giả chủ động sắp xếp thời gian theo dõi:\n</p>\n\n<!-- BẢNG THỨ SÁU & THỨ BẢY: NGÀY 28/11 -->\n<div class=\"my-6 space-y-3\">\n  <div class=\"flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider w-fit shadow-xs\">\n    📅 NGÀY 28/11/2026 (THỨ SÁU &amp; THỨ BẢY)\n  </div>\n  <div class=\"overflow-x-auto rounded-2xl border-2 border-slate-200 shadow-xs\">\n    <table class=\"w-full text-left text-sm border-collapse bg-white\">\n      <thead>\n        <tr class=\"bg-slate-100 text-slate-900 font-black text-xs uppercase border-b-2 border-slate-200\">\n          <th class=\"p-3.5 font-black text-slate-900\">Giờ đấu</th>\n          <th class=\"p-3.5 font-black text-slate-900\">Cặp đấu</th>\n          <th class=\"p-3.5 font-black text-slate-900\">Tiêu điểm trận đấu</th>\n          <th class=\"p-3.5 font-black text-slate-900 text-right\">Kênh phát sóng</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 text-slate-800 font-medium\">\n        <tr class=\"hover:bg-orange-50/60 transition-colors\">\n          <td class=\"p-3.5 font-black text-orange-600 text-base\">03:00</td>\n          <td class=\"p-3.5 font-black text-slate-900 text-base\">Nottingham Forest – Chelsea</td>\n          <td class=\"p-3.5 text-xs text-slate-600 font-semibold\">Thử thách The Blues tại The City Ground</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black shadow-2xs\">4K ULTRA HD</span></td>\n        </tr>\n        <tr class=\"hover:bg-slate-50 transition-colors\">\n          <td class=\"p-3.5 font-bold text-slate-600\">22:00</td>\n          <td class=\"p-3.5 font-bold text-slate-900\">Leeds United – Coventry City</td>\n          <td class=\"p-3.5 text-xs text-slate-500\">Cuộc chiến giành giật từng điểm số</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200\">FPT Play Full HD</span></td>\n        </tr>\n        <tr class=\"hover:bg-orange-50/60 transition-colors bg-orange-50/30\">\n          <td class=\"p-3.5 font-black text-orange-600 text-base\">22:00</td>\n          <td class=\"p-3.5 font-black text-slate-900 text-base\">Manchester United – Brentford</td>\n          <td class=\"p-3.5 text-xs text-orange-800 font-bold\">🔥 Quỷ Đỏ quyết tâm giành trọn 3 điểm</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2.5 py-1 rounded-md bg-orange-600 text-white text-[11px] font-black shadow-2xs\">FPT PLAY 1</span></td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n\n<!-- BẢNG CHỦ NHẬT: NGÀY 29/11 -->\n<div class=\"my-6 space-y-3\">\n  <div class=\"flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600 text-white font-black text-xs uppercase tracking-wider w-fit shadow-xs\">\n    📅 NGÀY 29/11/2026 (CHỦ NHẬT) – NGÀY ĐẠI CHIẾN BÙNG NỔ\n  </div>\n  <div class=\"overflow-x-auto rounded-2xl border-2 border-slate-200 shadow-xs\">\n    <table class=\"w-full text-left text-sm border-collapse bg-white\">\n      <thead>\n        <tr class=\"bg-slate-100 text-slate-900 font-black text-xs uppercase border-b-2 border-slate-200\">\n          <th class=\"p-3.5 font-black text-slate-900\">Giờ đấu</th>\n          <th class=\"p-3.5 font-black text-slate-900\">Cặp đấu</th>\n          <th class=\"p-3.5 font-black text-slate-900\">Tiêu điểm trận đấu</th>\n          <th class=\"p-3.5 font-black text-slate-900 text-right\">Kênh phát sóng</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 text-slate-800 font-medium\">\n        <tr class=\"hover:bg-slate-50 transition-colors\">\n          <td class=\"p-3.5 font-bold text-slate-600\">00:30</td>\n          <td class=\"p-3.5 font-bold text-slate-900\">Ipswich Town – Aston Villa</td>\n          <td class=\"p-3.5 text-xs text-slate-500\">Thầy trò Unai Emery săn vé Top 4</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200\">FPT Play Full HD</span></td>\n        </tr>\n        <tr class=\"hover:bg-orange-50/60 transition-colors bg-red-50/40\">\n          <td class=\"p-3.5 font-black text-red-600 text-base\">19:00</td>\n          <td class=\"p-3.5 font-black text-slate-900 text-base\">Everton – Liverpool</td>\n          <td class=\"p-3.5 text-xs text-red-700 font-black\">🔥 DERBY MERSEYSIDE RỰC LỬA GOODISON PARK</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black shadow-2xs\">4K ULTRA HD</span></td>\n        </tr>\n        <tr class=\"hover:bg-slate-50 transition-colors\">\n          <td class=\"p-3.5 font-bold text-slate-600\">21:05</td>\n          <td class=\"p-3.5 font-bold text-slate-900\">Brighton – Newcastle United</td>\n          <td class=\"p-3.5 text-xs text-slate-500\">Đại chiến tấn công cởi mở</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200\">FPT Play Full HD</span></td>\n        </tr>\n        <tr class=\"hover:bg-slate-50 transition-colors\">\n          <td class=\"p-3.5 font-bold text-slate-600\">21:05</td>\n          <td class=\"p-3.5 font-bold text-slate-900\">Crystal Palace – Hull City</td>\n          <td class=\"p-3.5 text-xs text-slate-500\">Cạnh tranh bứt phá nửa dưới bảng</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200\">FPT Play Full HD</span></td>\n        </tr>\n        <tr class=\"hover:bg-slate-50 transition-colors\">\n          <td class=\"p-3.5 font-bold text-slate-600\">21:05</td>\n          <td class=\"p-3.5 font-bold text-slate-900\">Fulham – AFC Bournemouth</td>\n          <td class=\"p-3.5 text-xs text-slate-500\">Đọ sức cân tài cân sức</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200\">FPT Play Full HD</span></td>\n        </tr>\n        <tr class=\"hover:bg-slate-50 transition-colors\">\n          <td class=\"p-3.5 font-bold text-slate-600\">21:05</td>\n          <td class=\"p-3.5 font-bold text-slate-900\">Sunderland – Tottenham Hotspur</td>\n          <td class=\"p-3.5 text-xs text-slate-500\">Son Heung-min và Spurs tìm chiến thắng</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200\">FPT Play Full HD</span></td>\n        </tr>\n        <tr class=\"hover:bg-orange-50/60 transition-colors bg-gradient-to-r from-orange-100/70 to-amber-100/70 border-t-2 border-orange-500\">\n          <td class=\"p-3.5 font-black text-red-600 text-lg\">23:30</td>\n          <td class=\"p-3.5 font-black text-slate-950 text-lg\">Arsenal – Manchester City</td>\n          <td class=\"p-3.5 text-xs text-orange-950 font-black\">👑 SIÊU ĐẠI CHIẾN ĐỈNH BẢNG NGOẠI HẠNG ANH</td>\n          <td class=\"p-3.5 text-right\"><span class=\"px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black shadow-2xs\">4K ULTRA HD</span></td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n\n<h2 class=\"text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3 pt-6 pb-2.5 border-b-2 border-orange-100\">\n  <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shrink-0 shadow-xs\">3</span>\n  <span>Phân Tích Chuyên Sâu Các Trận Cầu Tâm Điểm</span>\n</h2>\n\n<!-- TIÊU ĐỀ CHẤM 3.1: NỔI BẬT VIỀN CAM, CHỮ ĐẬM -->\n<h3 class=\"text-lg sm:text-xl font-black text-slate-900 border-l-4 border-orange-500 pl-3.5 py-1 my-4\">\n  <span class=\"text-orange-600 font-black\">3.1.</span> Đại Chiến Arsenal vs Manchester City (23h30 | 29/11): Đỉnh Cao Chiến Thuật\n</h3>\n<p class=\"text-slate-800 leading-relaxed text-base\">\n  Cuộc so tài tại thánh địa Emirates xứng đáng là trận chung kết sớm của mùa giải. <strong>Arsenal</strong> dưới sự chỉ đạo của Mikel Arteta sở hữu khối phòng ngự chắc chắn nhất giải đấu với cặp trung vệ thép William Saliba và Gabriel Magalhães. Trong khi đó, <strong>Manchester City</strong> của Pep Guardiola mang đến hỏa lực đáng sợ nhất châu Âu với cỗ máy săn bàn Erling Haaland. Trận đấu hứa hẹn màn đọ trí đỉnh cao, nghẹt thở từ phút đầu tiên tới giây cuối cùng.\n</p>\n<div class=\"my-4 p-4 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 text-sm text-slate-900 font-semibold italic\">\n  &ldquo;Cuộc so tài giữa hàng thủ thép Arsenal và sát thủ Erling Haaland chính là bài toán cân não của hai bộ óc chiến thuật kiệt xuất nhất thế giới hiện nay.&rdquo;\n</div>\n\n<!-- TIÊU ĐỀ CHẤM 3.2 -->\n<h3 class=\"text-lg sm:text-xl font-black text-slate-900 border-l-4 border-orange-500 pl-3.5 py-1 my-4\">\n  <span class=\"text-orange-600 font-black\">3.2.</span> Everton vs Liverpool (19h00 | 29/11): Rực Lửa Derby Merseyside\n</h3>\n<p class=\"text-slate-800 leading-relaxed text-base\">\n  Trận <strong>Derby Merseyside</strong> giữa Everton và Liverpool chưa từng khoan nhượng dù trong bất kỳ hoàn cảnh nào. Goodison Park chắc chắn sẽ là chảo lửa cuồng nhiệt khi The Toffees luôn thi đấu với hơn 200% sức mạnh mỗi khi chạm trán sắc đỏ thành phố cảng.\n</p>\n\n<!-- TIÊU ĐỀ CHẤM 3.3 -->\n<h3 class=\"text-lg sm:text-xl font-black text-slate-900 border-l-4 border-orange-500 pl-3.5 py-1 my-4\">\n  <span class=\"text-orange-600 font-black\">3.3.</span> Manchester United vs Brentford (22h00 | 28/11): Thử Thách Quỷ Đỏ\n</h3>\n<p class=\"text-slate-800 leading-relaxed text-base\">\n  Tại Old Trafford, <strong>Manchester United</strong> đặt mục tiêu tối thượng là 3 điểm trọn vẹn để bám đuổi nhóm dự Champions League. Tuy nhiên, lối chơi áp sát và phản công chớp nhoáng của Brentford luôn là bài toán khó giải cho mọi đội bóng lớn.\n</p>\n\n<h2 class=\"text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3 pt-6 pb-2.5 border-b-2 border-orange-100\">\n  <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shrink-0 shadow-xs\">4</span>\n  <span>Tại Sao Nên Thưởng Thức Ngoại Hạng Anh Trên FPT Play?</span>\n</h2>\n\n<div class=\"grid grid-cols-1 sm:grid-cols-2 gap-4 my-6\">\n  <div class=\"p-5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs space-y-2\">\n    <div class=\"text-orange-600 font-black text-base flex items-center gap-2\">\n      📺 Bản Quyền 100% Trọn Vẹn\n    </div>\n    <p class=\"text-sm text-slate-700 leading-relaxed font-medium\">\n      FPT Play sở hữu bản quyền chính thức trọn vẹn toàn bộ 380 trận đấu mỗi mùa. Nói không với chặn link, link lậu hay gián đoạn giữa chừng.\n    </p>\n  </div>\n  <div class=\"p-5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs space-y-2\">\n    <div class=\"text-orange-600 font-black text-base flex items-center gap-2\">\n      🌟 Chuẩn Siêu Nét 4K Ultra HD\n    </div>\n    <p class=\"text-sm text-slate-700 leading-relaxed font-medium\">\n      Trải nghiệm từng đường bóng với độ phân giải siêu nét 4K sắc sảo gấp 4 lần Full HD, khung hình 60fps mượt mà trên Smart TV màn hình lớn.\n    </p>\n  </div>\n  <div class=\"p-5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs space-y-2\">\n    <div class=\"text-orange-600 font-black text-base flex items-center gap-2\">\n      ⚡ Mạng Wi-Fi 6 Siêu Tốc\n    </div>\n    <p class=\"text-sm text-slate-700 leading-relaxed font-medium\">\n      Kết hợp hạ tầng cáp quang FPT Wi-Fi 6 thế hệ mới, độ trễ cực thấp (Ping &lt; 10ms), cam kết không giật lag ngay cả trong khung giờ cao điểm triệu người xem.\n    </p>\n  </div>\n  <div class=\"p-5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs space-y-2\">\n    <div class=\"text-orange-600 font-black text-base flex items-center gap-2\">\n      📱 Xem Mọi Lúc, Mọi Thiết Bị\n    </div>\n    <p class=\"text-sm text-slate-700 leading-relaxed font-medium\">\n      Đăng nhập và xem đồng thời trên Smart TV, Smartphone, iPad, Máy tính hoặc đầu thu FPT Play Box mà không phát sinh thêm chi phí.\n    </p>\n  </div>\n</div>\n\n<h2 class=\"text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3 pt-6 pb-2.5 border-b-2 border-orange-100\">\n  <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shrink-0 shadow-xs\">5</span>\n  <span>Bảng Giá Đăng Ký Combo Internet FPT + Ngoại Hạng Anh Ưu Đãi Nhất 2026</span>\n</h2>\n<p class=\"text-slate-800 leading-relaxed text-base\">\n  FPT Telecom áp dụng bảng giá ưu đãi đặc biệt dành cho khách hàng đăng ký trọn gói Internet Wi-Fi 6 kết hợp bản quyền FPT Play:\n</p>\n\n<div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 my-6\">\n  <div class=\"p-5 rounded-2xl bg-white border-2 border-orange-500 shadow-sm space-y-3 relative overflow-hidden\">\n    <div class=\"absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider\">\n      ĐƯỢC ĐĂNG KÝ NHIỀU NHẤT\n    </div>\n    <span class=\"text-xs font-bold text-slate-500 uppercase tracking-wider block\">Gói Hộ Gia Đình</span>\n    <h4 class=\"text-2xl font-black text-slate-900\">Combo GIGA (EPL)</h4>\n    <div class=\"text-3xl font-black text-orange-600\">\n      220.000đ <span class=\"text-xs font-normal text-slate-500\">/tháng (đã gồm VAT)</span>\n    </div>\n    <ul class=\"text-xs text-slate-800 space-y-2 pt-3 border-t border-slate-100 font-semibold\">\n      <li>✓ <strong>Tốc độ cao:</strong> 150 Mbps cáp quang FTTH ổn định</li>\n      <li>✓ <strong>Ngoại Hạng Anh:</strong> Xem trọn vẹn 10 trận/vòng bản quyền FPT Play</li>\n      <li>✓ <strong>Truyền hình:</strong> Gần 170 kênh truyền hình đặc sắc</li>\n      <li>✓ <strong>Thiết bị:</strong> Miễn phí Modem Wi-Fi 6 hai băng tần</li>\n      <li>✓ <strong>Quà tặng:</strong> Tặng kèm Camera AI an ninh thông minh 0đ</li>\n    </ul>\n    <a href=\"/combo-ngoai-hang-anh\" class=\"block w-full py-2.5 text-center rounded-xl bg-orange-600 text-white font-black text-xs hover:bg-orange-700 transition-colors mt-2 shadow-xs\">\n      ĐĂNG KÝ GÓI COMBO GIGA 220K\n    </a>\n  </div>\n\n  <div class=\"p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-sm space-y-3 relative overflow-hidden\">\n    <div class=\"absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider\">\n      TỐC ĐỘ 1 GBPS\n    </div>\n    <span class=\"text-xs font-bold text-slate-500 uppercase tracking-wider block\">Gói Quán Cafe &amp; Doanh Nghiệp</span>\n    <h4 class=\"text-2xl font-black text-slate-900\">Combo SKY (EPL)</h4>\n    <div class=\"text-3xl font-black text-slate-900\">\n      250.000đ <span class=\"text-xs font-normal text-slate-500\">/tháng (đã gồm VAT)</span>\n    </div>\n    <ul class=\"text-xs text-slate-800 space-y-2 pt-3 border-t border-slate-100 font-semibold\">\n      <li>✓ <strong>Tốc độ cực đại:</strong> 1 Gbps (1000 Mbps) tải trang tức thì</li>\n      <li>✓ <strong>Màn hình lớn:</strong> Chuẩn 4K Ultra HD mượt mà cho quán cafe, phòng chiếu</li>\n      <li>✓ <strong>Đa nền tảng:</strong> Phục vụ 20 - 40 người xem cùng lúc</li>\n      <li>✓ <strong>Trang bị:</strong> Modem Wi-Fi 6 công suất phát sóng xuyên tường</li>\n      <li>✓ <strong>Lắp đặt:</strong> Kỹ thuật viên hỗ trợ tận nơi trong 24 giờ</li>\n    </ul>\n    <a href=\"/combo-ngoai-hang-anh\" class=\"block w-full py-2.5 text-center rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-colors mt-2 shadow-xs\">\n      ĐĂNG KÝ GÓI COMBO SKY 250K\n    </a>\n  </div>\n</div>\n\n<h2 class=\"text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3 pt-6 pb-2.5 border-b-2 border-orange-100\">\n  <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shrink-0 shadow-xs\">6</span>\n  <span>Câu Hỏi Thường Gặp Khi Xem Ngoại Hạng Anh Trên FPT Play</span>\n</h2>\n<div class=\"space-y-3 my-6\">\n  <div class=\"p-4 rounded-xl bg-slate-50 border-2 border-slate-200\">\n    <h4 class=\"font-black text-sm text-slate-900 mb-1.5 flex items-center gap-2\">\n      <span class=\"text-orange-600 font-black\">Q1:</span> FPT Play có chiếu đầy đủ tất cả các trận đấu Vòng 12 không?\n    </h4>\n    <p class=\"text-xs sm:text-sm text-slate-700 leading-relaxed font-medium\">\n      Có. FPT Play là đơn vị phát sóng độc quyền trọn vẹn 10/10 trận đấu mỗi vòng của giải Ngoại Hạng Anh tại Việt Nam, bao gồm đầy đủ các khung giờ sớm, khung giờ vàng và trận muộn.\n    </p>\n  </div>\n  <div class=\"p-4 rounded-xl bg-slate-50 border-2 border-slate-200\">\n    <h4 class=\"font-black text-sm text-slate-900 mb-1.5 flex items-center gap-2\">\n      <span class=\"text-orange-600 font-black\">Q2:</span> Tôi có thể xem Ngoại Hạng Anh trên mấy thiết bị cùng lúc?\n    </h4>\n    <p class=\"text-xs sm:text-sm text-slate-700 leading-relaxed font-medium\">\n      Một tài khoản FPT Play cho phép đăng nhập và xem đồng thời trên 3 - 5 thiết bị khác nhau (Smart TV trong phòng khách, điện thoại di động, máy tính bảng cá nhân).\n    </p>\n  </div>\n  <div class=\"p-4 rounded-xl bg-slate-50 border-2 border-slate-200\">\n    <h4 class=\"font-black text-sm text-slate-900 mb-1.5 flex items-center gap-2\">\n      <span class=\"text-orange-600 font-black\">Q3:</span> Thủ tục đăng ký lắp mạng FPT xem bóng đá gồm những gì?\n    </h4>\n    <p class=\"text-xs sm:text-sm text-slate-700 leading-relaxed font-medium\">\n      Khách hàng chỉ cần chuẩn bị ảnh chụp 2 mặt Căn cước công dân (CCCD). Chuyên viên FPT sẽ hoàn tất hợp đồng điện tử và kỹ thuật viên triển khai lắp đặt hoàn tất trong vòng 24 giờ.\n    </p>\n  </div>\n</div>\n\n<h2 class=\"text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3 pt-6 pb-2.5 border-b-2 border-orange-100\">\n  <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shrink-0 shadow-xs\">7</span>\n  <span>Thông Tin Liên Hệ &amp; Đăng Ký Lắp Mạng FPT Hỏa Tốc</span>\n</h2>\n<p class=\"text-slate-800 leading-relaxed text-base\">\n  Để không bỏ lỡ những trận cầu siêu kinh điển cuối tuần này, quý khách hàng hãy liên hệ ngay với FPT Telecom qua các kênh chính thức sau:\n</p>\n\n<!-- KHỐI LIÊN HỆ: CHUẨN THÔNG TIN CỐ ĐỊNH, CHỮ ĐẬM SẮC NÉT -->\n<div class=\"p-6 rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/50 border-2 border-orange-300 text-slate-900 my-4 space-y-3 shadow-xs\">\n  <p class=\"text-sm sm:text-base font-semibold\">📍 <strong>Địa chỉ trung tâm:</strong> Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ</p>\n  <p class=\"text-sm sm:text-base font-semibold\">📞 <strong>Hotline tư vấn 24/7:</strong> <a href=\"tel:0878800400\" class=\"text-orange-600 font-black text-lg hover:underline\">0878 800 400</a> (Tư vấn miễn phí)</p>\n  <p class=\"text-sm sm:text-base font-semibold\">💬 <strong>Zalo hỗ trợ trực tiếp:</strong> <a href=\"https://zalo.me/0878800400\" target=\"_blank\" class=\"text-blue-600 font-black hover:underline\">0878 800 400 (FPT Siêu Tốc)</a></p>\n  <p class=\"text-sm sm:text-base font-semibold\">✉️ <strong>Email tiếp nhận:</strong> <a href=\"mailto:PhucNT51@fpt.com\" class=\"text-slate-900 font-bold hover:underline\">PhucNT51@fpt.com</a></p>\n  <p class=\"text-sm sm:text-base font-semibold\">🌐 <strong>Cổng thông tin chính thức:</strong> <a href=\"https://gofpt.vn\" class=\"text-orange-600 font-black hover:underline\">https://gofpt.vn</a></p>\n</div>\n",
  "category": "tin-tuc",
  "categoryName": "Tin Tức FPT",
  "thumbnail": "/images/banners/ngoai-hang-anh-vong-12-fpt-play.jpg",
  "author": "FPT Telecom Cần Thơ",
  "published": true,
  "featured": true,
  "views": 95,
  "readTimeMinutes": 4,
  "createdAt": "2026-11-25T15:00:00.000Z",
  "updatedAt": "2026-11-25T15:23:34.807Z"
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
