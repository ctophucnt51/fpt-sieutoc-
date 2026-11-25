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
  "content": "\n<!-- BENTO HERO HEADER -->\n<div class=\"not-prose rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border border-slate-800 shadow-md relative overflow-hidden my-6\">\n  <div class=\"absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none\"></div>\n  <div class=\"absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none\"></div>\n  \n  <div class=\"relative z-10 space-y-3\">\n    <div class=\"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/90 border border-red-600/70 text-red-300 font-extrabold text-xs uppercase tracking-wider\">\n      <img src=\"/images/icons/svg/ngoai-hang-anh.svg\" alt=\"EPL\" width=\"16\" height=\"16\" class=\"w-4 h-4 object-contain brightness-0 invert\" />\n      <span>Bản Quyền Trực Tiếp Ngoại Hạng Anh Vòng 12</span>\n    </div>\n    <h2 class=\"text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight\">\n      Cuối Tuần Rực Lửa, <span class=\"text-red-400\">Đại Chiến Bùng Nổ!</span>\n    </h2>\n    <p class=\"text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-normal\">\n      Trọn vẹn 10 trận đấu kịch tính của giải Ngoại Hạng Anh được phát sóng trực tiếp trên <strong>FPT Play</strong> với chất lượng hình ảnh lên tới <strong>4K Ultra HD</strong>. Tâm điểm đại chiến Arsenal vs Man City và rực lửa derby Merseyside Everton vs Liverpool!\n    </p>\n  </div>\n</div>\n\n<!-- SECTION 1: LỊCH THI ĐẤU DẠNG MATCH CARDS (TRỰC QUAN THEO ĐÚNG HÌNH ẢNH BANNER) -->\n<div class=\"not-prose my-8 space-y-6\">\n  <div class=\"flex items-center justify-between border-b-2 border-orange-500/20 pb-3\">\n    <div class=\"flex items-center gap-2.5\">\n      <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shadow-xs\">1</span>\n      <h3 class=\"text-xl sm:text-2xl font-black text-slate-900 tracking-tight\">Lịch Thi Đấu Chi Tiết 10 Trận Đấu Vòng 12</h3>\n    </div>\n    <span class=\"hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-bold text-xs border border-orange-200\">\n      ⚡ 10 Trận Độc Quyền FPT Play\n    </span>\n  </div>\n\n  <!-- NGÀY 28/11 -->\n  <div class=\"space-y-3\">\n    <div class=\"flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider w-fit shadow-xs\">\n      <span>📅 THỨ SÁU &amp; THỨ BẢY | 28.11.2026</span>\n    </div>\n\n    <!-- Match 1: Nottm Forest vs Chelsea (4K) -->\n    <div class=\"rounded-2xl bg-white border border-slate-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group\">\n      <div class=\"flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4 flex-1\">\n        <div class=\"text-right sm:flex-1 font-black text-slate-900 text-sm sm:text-base tracking-tight\">\n          NOTT&apos;M FOREST\n        </div>\n        <div class=\"px-3.5 py-1 rounded-full bg-slate-900 text-white font-black text-xs shrink-0 tracking-wider shadow-2xs group-hover:bg-orange-600 transition-colors\">\n          28.11 • 03:00\n        </div>\n        <div class=\"text-left sm:flex-1 font-black text-slate-900 text-sm sm:text-base tracking-tight\">\n          CHELSEA\n        </div>\n      </div>\n      <div class=\"flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100\">\n        <span class=\"text-xs text-slate-500 font-semibold sm:hidden\">The City Ground</span>\n        <span class=\"px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-2xs\">\n          4K ULTRA HD\n        </span>\n      </div>\n    </div>\n\n    <!-- Match 2: Leeds vs Coventry -->\n    <div class=\"rounded-2xl bg-white border border-slate-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group\">\n      <div class=\"flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4 flex-1\">\n        <div class=\"text-right sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          LEEDS UNITED\n        </div>\n        <div class=\"px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs shrink-0 tracking-wider border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors\">\n          28.11 • 22:00\n        </div>\n        <div class=\"text-left sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          COVENTRY CITY\n        </div>\n      </div>\n      <div class=\"flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100\">\n        <span class=\"px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200\">\n          FPT Play Full HD\n        </span>\n      </div>\n    </div>\n\n    <!-- Match 3: Man Utd vs Brentford (HOT) -->\n    <div class=\"rounded-2xl bg-gradient-to-r from-orange-50/60 via-white to-orange-50/60 border-2 border-orange-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group\">\n      <div class=\"flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4 flex-1\">\n        <div class=\"text-right sm:flex-1 font-black text-slate-900 text-sm sm:text-base tracking-tight\">\n          🔴 MANCHESTER UNITED\n        </div>\n        <div class=\"px-3.5 py-1 rounded-full bg-orange-600 text-white font-black text-xs shrink-0 tracking-wider shadow-2xs\">\n          28.11 • 22:00\n        </div>\n        <div class=\"text-left sm:flex-1 font-black text-slate-900 text-sm sm:text-base tracking-tight\">\n          BRENTFORD 🐝\n        </div>\n      </div>\n      <div class=\"flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100\">\n        <span class=\"px-2.5 py-1 rounded-md bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider shadow-2xs\">\n          🔥 FPT PLAY 1\n        </span>\n      </div>\n    </div>\n  </div>\n\n  <!-- NGÀY 29/11 -->\n  <div class=\"space-y-3 pt-4\">\n    <div class=\"flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-xs uppercase tracking-wider w-fit shadow-xs\">\n      <span>📅 CHỦ NHẬT | 29.11.2026 – NGÀY ĐẠI CHIẾN BÙNG NỔ</span>\n    </div>\n\n    <!-- Match 4: Ipswich vs Aston Villa -->\n    <div class=\"rounded-2xl bg-white border border-slate-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group\">\n      <div class=\"flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4 flex-1\">\n        <div class=\"text-right sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          IPSWICH TOWN\n        </div>\n        <div class=\"px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs shrink-0 tracking-wider border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors\">\n          29.11 • 00:30\n        </div>\n        <div class=\"text-left sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          ASTON VILLA\n        </div>\n      </div>\n      <div class=\"flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100\">\n        <span class=\"px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200\">\n          FPT Play Full HD\n        </span>\n      </div>\n    </div>\n\n    <!-- Match 5: Everton vs Liverpool (Derby Merseyside - 4K) -->\n    <div class=\"rounded-2xl bg-gradient-to-r from-blue-50/60 via-white to-red-50/60 border-2 border-red-300 hover:border-red-500 shadow-xs hover:shadow-md transition-all p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group\">\n      <div class=\"flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4 flex-1\">\n        <div class=\"text-right sm:flex-1 font-black text-blue-900 text-sm sm:text-base tracking-tight\">\n          🔵 EVERTON\n        </div>\n        <div class=\"px-3.5 py-1 rounded-full bg-red-600 text-white font-black text-xs shrink-0 tracking-wider shadow-2xs\">\n          29.11 • 19:00\n        </div>\n        <div class=\"text-left sm:flex-1 font-black text-red-900 text-sm sm:text-base tracking-tight\">\n          LIVERPOOL 🔴\n        </div>\n      </div>\n      <div class=\"flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100\">\n        <span class=\"text-xs text-red-600 font-bold hidden md:inline\">Derby Merseyside</span>\n        <span class=\"px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-2xs\">\n          4K ULTRA HD\n        </span>\n      </div>\n    </div>\n\n    <!-- Match 6: Brighton vs Newcastle -->\n    <div class=\"rounded-2xl bg-white border border-slate-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group\">\n      <div class=\"flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4 flex-1\">\n        <div class=\"text-right sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          BRIGHTON\n        </div>\n        <div class=\"px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs shrink-0 tracking-wider border border-slate-200\">\n          29.11 • 21:05\n        </div>\n        <div class=\"text-left sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          NEWCASTLE\n        </div>\n      </div>\n      <div class=\"flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100\">\n        <span class=\"px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200\">\n          FPT Play Full HD\n        </span>\n      </div>\n    </div>\n\n    <!-- Match 7: Crystal Palace vs Hull -->\n    <div class=\"rounded-2xl bg-white border border-slate-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group\">\n      <div class=\"flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4 flex-1\">\n        <div class=\"text-right sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          CRYSTAL PALACE\n        </div>\n        <div class=\"px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs shrink-0 tracking-wider border border-slate-200\">\n          29.11 • 21:05\n        </div>\n        <div class=\"text-left sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          HULL CITY\n        </div>\n      </div>\n      <div class=\"flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100\">\n        <span class=\"px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200\">\n          FPT Play Full HD\n        </span>\n      </div>\n    </div>\n\n    <!-- Match 8: Fulham vs Bournemouth -->\n    <div class=\"rounded-2xl bg-white border border-slate-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group\">\n      <div class=\"flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4 flex-1\">\n        <div class=\"text-right sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          FULHAM\n        </div>\n        <div class=\"px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs shrink-0 tracking-wider border border-slate-200\">\n          29.11 • 21:05\n        </div>\n        <div class=\"text-left sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          BOURNEMOUTH\n        </div>\n      </div>\n      <div class=\"flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100\">\n        <span class=\"px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200\">\n          FPT Play Full HD\n        </span>\n      </div>\n    </div>\n\n    <!-- Match 9: Sunderland vs Spurs -->\n    <div class=\"rounded-2xl bg-white border border-slate-200 hover:border-orange-500 shadow-2xs hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group\">\n      <div class=\"flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4 flex-1\">\n        <div class=\"text-right sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          SUNDERLAND\n        </div>\n        <div class=\"px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs shrink-0 tracking-wider border border-slate-200\">\n          29.11 • 21:05\n        </div>\n        <div class=\"text-left sm:flex-1 font-bold text-slate-800 text-sm sm:text-base\">\n          TOTTENHAM SPURS\n        </div>\n      </div>\n      <div class=\"flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100\">\n        <span class=\"px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200\">\n          FPT Play Full HD\n        </span>\n      </div>\n    </div>\n\n    <!-- Match 10: ARSENAL VS MAN CITY (SUPER MATCH BENTO - 4K) -->\n    <div class=\"rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 p-1 shadow-lg hover:shadow-xl transition-all\">\n      <div class=\"rounded-[22px] bg-slate-950 text-white p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4\">\n        <div class=\"flex items-center justify-between md:justify-start w-full md:w-auto gap-4 flex-1\">\n          <div class=\"text-right md:flex-1\">\n            <span class=\"text-[11px] text-red-400 font-bold uppercase block\">Đầu Bảng</span>\n            <span class=\"text-lg sm:text-2xl font-black text-white tracking-tight\">ARSENAL</span>\n          </div>\n          <div class=\"text-center px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0\">\n            <div class=\"text-[10px] text-orange-400 font-bold uppercase tracking-wider\">ĐẠI CHIẾN NGÔI VƯƠNG</div>\n            <div class=\"text-base sm:text-lg font-black text-white\">29.11 • 23:30</div>\n          </div>\n          <div class=\"text-left md:flex-1\">\n            <span class=\"text-[11px] text-sky-400 font-bold uppercase block\">Đương Kim Vô Địch</span>\n            <span class=\"text-lg sm:text-2xl font-black text-white tracking-tight\">MAN CITY</span>\n          </div>\n        </div>\n        <div class=\"flex items-center justify-between md:justify-end w-full md:w-auto gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-white/10\">\n          <span class=\"text-xs text-slate-300 font-medium hidden lg:inline\">Sân Emirates</span>\n          <span class=\"px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md animate-pulse\">\n            👑 4K ULTRA HD\n          </span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- SECTION 2: BENTO SPOTLIGHT - 2 TRẬN ĐẠI CHIẾN NẢY LỬA -->\n<div class=\"not-prose my-10 space-y-6\">\n  <div class=\"flex items-center gap-2.5 border-b-2 border-orange-500/20 pb-3\">\n    <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shadow-xs\">2</span>\n    <h3 class=\"text-xl sm:text-2xl font-black text-slate-900 tracking-tight\">Tâm Điểm Đại Chiến: Không Khí Rực Lửa</h3>\n  </div>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-5\">\n    <!-- Card 1: Arsenal vs Man City -->\n    <div class=\"rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between\">\n      <div class=\"space-y-2\">\n        <span class=\"px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider inline-block\">\n          CHUNG KẾT SỚM\n        </span>\n        <h4 class=\"text-xl font-black text-white\">Arsenal vs Man City (23:30 | 29/11)</h4>\n        <p class=\"text-xs sm:text-sm text-slate-300 leading-relaxed font-normal\">\n          Màn đọ trí cân não giữa Mikel Arteta và Pep Guardiola. Hàng thủ thép Saliba - Gabriel sẽ có bài kiểm tra tối thượng trước cỗ máy săn bàn Erling Haaland. 90 phút tại Emirates sẽ quyết định ngôi vương lượt đi!\n        </p>\n      </div>\n      <div class=\"pt-3 border-t border-slate-800 text-xs text-orange-400 font-bold flex items-center justify-between\">\n        <span>📍 Sân Vận Động Emirates</span>\n        <span>📺 Kênh 4K FPT Play</span>\n      </div>\n    </div>\n\n    <!-- Card 2: Everton vs Liverpool -->\n    <div class=\"rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between\">\n      <div class=\"space-y-2\">\n        <span class=\"px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider inline-block\">\n          DERBY MERSEYSIDE\n        </span>\n        <h4 class=\"text-xl font-black text-white\">Everton vs Liverpool (19:00 | 29/11)</h4>\n        <p class=\"text-xs sm:text-sm text-slate-300 leading-relaxed font-normal\">\n          Trận derby rực lửa vùng Merseyside tại chảo lửa Goodison Park. Sức nóng trên khán đài kết hợp tinh thần không khoan nhượng của Sean Dyche sẽ thách thức tham vọng của thầy trò Arne Slot.\n        </p>\n      </div>\n      <div class=\"pt-3 border-t border-slate-800 text-xs text-orange-400 font-bold flex items-center justify-between\">\n        <span>📍 Sân Goodison Park</span>\n        <span>📺 Kênh 4K FPT Play</span>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- SECTION 3: 4 THẺ CÔNG NGHỆ XEM BÓNG ĐÁ ĐỈNH CAO (ĐỒNG BỘ PHONG CÁCH TRANG CHỦ) -->\n<div class=\"not-prose my-10 space-y-6\">\n  <div class=\"flex items-center gap-2.5 border-b-2 border-orange-500/20 pb-3\">\n    <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shadow-xs\">3</span>\n    <h3 class=\"text-xl sm:text-2xl font-black text-slate-900 tracking-tight\">Đặc Quyền Xem Ngoại Hạng Anh Trên FPT Play</h3>\n  </div>\n\n  <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-4\">\n    <div class=\"p-5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs space-y-2.5\">\n      <div class=\"w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center p-2\">\n        <img src=\"/images/icons/svg/ngoai-hang-anh.svg\" alt=\"Bản quyền\" class=\"w-6 h-6 object-contain\" />\n      </div>\n      <h4 class=\"text-base font-black text-slate-900\">Bản Quyền 100% Trọn Vẹn</h4>\n      <p class=\"text-xs text-slate-600 leading-relaxed font-medium\">\n        Xem đầy đủ toàn bộ 380 trận đấu mỗi mùa. Tuyệt đối không lo bị cắt sóng, chặn link hay giật lag.\n      </p>\n    </div>\n\n    <div class=\"p-5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs space-y-2.5\">\n      <div class=\"w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center p-2\">\n        <img src=\"/images/icons/svg/ultra-fast.svg\" alt=\"4K\" class=\"w-6 h-6 object-contain\" />\n      </div>\n      <h4 class=\"text-base font-black text-slate-900\">Chuẩn Siêu Nét 4K Ultra HD</h4>\n      <p class=\"text-xs text-slate-600 leading-relaxed font-medium\">\n        Hình ảnh chân thực từng ngọn cỏ, sắc nét gấp 4 lần Full HD với khung hình 60fps mượt mà trên Smart TV.\n      </p>\n    </div>\n\n    <div class=\"p-5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs space-y-2.5\">\n      <div class=\"w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center p-2\">\n        <img src=\"/images/icons/svg/wifi-6.svg\" alt=\"Wi-Fi 6\" class=\"w-6 h-6 object-contain\" />\n      </div>\n      <h4 class=\"text-base font-black text-slate-900\">Mạng Wi-Fi 6 Siêu Tốc</h4>\n      <p class=\"text-xs text-slate-600 leading-relaxed font-medium\">\n        Đường truyền cáp quang băng rộng thế hệ mới, độ trễ cực thấp (Ping &lt; 10ms), mượt mà giờ cao điểm.\n      </p>\n    </div>\n\n    <div class=\"p-5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-2xs space-y-2.5\">\n      <div class=\"w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center p-2\">\n        <img src=\"/images/icons/svg/smart-tv.svg\" alt=\"Smart TV\" class=\"w-6 h-6 object-contain\" />\n      </div>\n      <h4 class=\"text-base font-black text-slate-900\">Xem Đa Thiết Bị Linh Hoạt</h4>\n      <p class=\"text-xs text-slate-600 leading-relaxed font-medium\">\n        Xem đồng thời trên Smart TV, Smartphone, iPad, Máy tính hoặc đầu thu FPT Play Box tiện lợi.\n      </p>\n    </div>\n  </div>\n</div>\n\n<!-- SECTION 4: BẢNG GIÁ COMBO EPL BÁN CHẠY (CHUẨN BENTO TRANG CHỦ) -->\n<div class=\"not-prose my-10 space-y-6\">\n  <div class=\"flex items-center gap-2.5 border-b-2 border-orange-500/20 pb-3\">\n    <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shadow-xs\">4</span>\n    <h3 class=\"text-xl sm:text-2xl font-black text-slate-900 tracking-tight\">Gói Cước Combo Internet + FPT Play Ưu Đãi Nhất</h3>\n  </div>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-5\">\n    <!-- Gói 1: Combo GIGA 220K -->\n    <div class=\"rounded-3xl bg-white border-2 border-orange-500 p-6 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between\">\n      <div class=\"space-y-3\">\n        <div class=\"flex items-center justify-between\">\n          <span class=\"px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider\">\n            GÓI ĐƯỢC CHỌN NHIỀU NHẤT\n          </span>\n          <span class=\"text-xs font-bold text-slate-400\">Gia Đình</span>\n        </div>\n        <h4 class=\"text-2xl font-black text-slate-900\">Combo GIGA (EPL)</h4>\n        <div class=\"text-3xl font-black text-orange-600\">\n          220.000đ <span class=\"text-xs font-normal text-slate-500\">/tháng (đã gồm VAT)</span>\n        </div>\n        <ul class=\"text-xs sm:text-sm text-slate-700 space-y-2 pt-3 border-t border-slate-100 font-semibold\">\n          <li>✓ Internet Wi-Fi 6 tốc độ 150 Mbps ổn định</li>\n          <li>✓ Trọn vẹn 10 trận/vòng Ngoại Hạng Anh trên FPT Play</li>\n          <li>✓ Gần 170 kênh truyền hình trong nước &amp; quốc tế</li>\n          <li>✓ Miễn phí trang bị Modem Wi-Fi 6 hai băng tần</li>\n          <li>✓ <strong>Tặng thêm Camera FPT AI an ninh thông minh 0đ</strong></li>\n        </ul>\n      </div>\n      <a href=\"/combo-ngoai-hang-anh\" class=\"block w-full py-3 text-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all\">\n        ĐĂNG KÝ GÓI COMBO GIGA 220K\n      </a>\n    </div>\n\n    <!-- Gói 2: Combo SKY 250K -->\n    <div class=\"rounded-3xl bg-white border-2 border-slate-900 p-6 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between\">\n      <div class=\"space-y-3\">\n        <div class=\"flex items-center justify-between\">\n          <span class=\"px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider\">\n            TỐC ĐỘ 1 GBPS\n          </span>\n          <span class=\"text-xs font-bold text-slate-400\">Cafe &amp; Game</span>\n        </div>\n        <h4 class=\"text-2xl font-black text-slate-900\">Combo SKY (EPL)</h4>\n        <div class=\"text-3xl font-black text-slate-900\">\n          250.000đ <span class=\"text-xs font-normal text-slate-500\">/tháng (đã gồm VAT)</span>\n        </div>\n        <ul class=\"text-xs sm:text-sm text-slate-700 space-y-2 pt-3 border-t border-slate-100 font-semibold\">\n          <li>✓ Tốc độ mở rộng không giới hạn lên đến 1 Gbps (1000 Mbps)</li>\n          <li>✓ Chuẩn 4K Ultra HD mượt mà cho Smart TV màn hình lớn</li>\n          <li>✓ Phục vụ từ 20 - 40 người xem cùng lúc tại quán cafe</li>\n          <li>✓ Modem Wi-Fi 6 công suất lớn phát sóng xuyên tường</li>\n          <li>✓ Kỹ thuật viên hỗ trợ lắp đặt hỏa tốc trong 24 giờ</li>\n        </ul>\n      </div>\n      <a href=\"/combo-ngoai-hang-anh\" class=\"block w-full py-3 text-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all\">\n        ĐĂNG KÝ GÓI COMBO SKY 250K\n      </a>\n    </div>\n  </div>\n</div>\n\n<!-- SECTION 5: FAQ & KHUNG LIÊN HỆ CHUẨN CỐ ĐỊNH -->\n<div class=\"not-prose my-10 space-y-6\">\n  <div class=\"flex items-center gap-2.5 border-b-2 border-orange-500/20 pb-3\">\n    <span class=\"w-8 h-8 rounded-xl bg-orange-600 text-white inline-flex items-center justify-center text-sm font-black shadow-xs\">5</span>\n    <h3 class=\"text-xl sm:text-2xl font-black text-slate-900 tracking-tight\">Hỏi - Đáp &amp; Hướng Dẫn Đăng Ký</h3>\n  </div>\n\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-2xl bg-white border border-slate-200\">\n      <h4 class=\"font-black text-sm text-slate-900 mb-1 flex items-center gap-2\">\n        <span class=\"text-orange-600 font-black\">Q:</span> FPT Play có chiếu đầy đủ 10 trận Vòng 12 không?\n      </h4>\n      <p class=\"text-xs sm:text-sm text-slate-600 leading-relaxed font-medium\">\n        Có. FPT Play phát sóng trực tiếp bản quyền chính thức 10/10 trận đấu mỗi vòng của giải Ngoại Hạng Anh tại Việt Nam.\n      </p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white border border-slate-200\">\n      <h4 class=\"font-black text-sm text-slate-900 mb-1 flex items-center gap-2\">\n        <span class=\"text-orange-600 font-black\">Q:</span> Tôi có thể xem Ngoại Hạng Anh trên mấy thiết bị cùng lúc?\n      </h4>\n      <p class=\"text-xs sm:text-sm text-slate-600 leading-relaxed font-medium\">\n        Một tài khoản FPT Play cho phép đăng nhập và xem đồng thời trên 3 - 5 thiết bị (Smart TV phòng khách, điện thoại, máy tính bảng).\n      </p>\n    </div>\n  </div>\n\n  <!-- BENTO BOTTOM CTA (ĐÚNG PHONG CÁCH TRANG CHỦ GOFPT.VN) -->\n  <div class=\"rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/60 border-2 border-orange-300 p-6 sm:p-8 space-y-4 shadow-sm\">\n    <div class=\"flex flex-col sm:flex-row sm:items-center justify-between gap-4\">\n      <div>\n        <span class=\"text-xs font-black uppercase tracking-wider text-orange-600 block mb-1\">TRUNG TÂM TIẾP NHẬN ĐĂNG KÝ HỎA TỐC</span>\n        <h4 class=\"text-xl sm:text-2xl font-black text-slate-900\">Liên Hệ FPT Telecom Cần Thơ</h4>\n        <p class=\"text-xs sm:text-sm text-slate-600 mt-1 font-medium\">Kỹ thuật viên tư vấn tận tình, khảo sát tuyến cáp và triển khai trong 24 giờ</p>\n      </div>\n      <div class=\"flex items-center gap-2.5 shrink-0\">\n        <a href=\"tel:0878800400\" class=\"px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-md transition-all flex items-center gap-2\">\n          <span>Gọi 0878 800 400</span>\n        </a>\n        <a href=\"https://zalo.me/0878800400\" target=\"_blank\" class=\"px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-blue-600 font-black text-sm border-2 border-blue-600 shadow-xs transition-all\">\n          <span>Chat Zalo</span>\n        </a>\n      </div>\n    </div>\n    \n    <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-orange-200/80 text-xs text-slate-700 font-semibold\">\n      <div>📍 <strong>Địa chỉ:</strong> Số 10 Phan Văn Trị, Phường Ninh Kiều, TP. Cần Thơ</div>\n      <div>✉️ <strong>Email:</strong> PhucNT51@fpt.com</div>\n      <div>🌐 <strong>Website:</strong> https://gofpt.vn</div>\n    </div>\n  </div>\n</div>\n",
  "category": "tin-tuc",
  "categoryName": "Tin Tức FPT",
  "thumbnail": "/images/banners/ngoai-hang-anh-vong-12-fpt-play.jpg",
  "author": "FPT Telecom Cần Thơ",
  "published": true,
  "featured": true,
  "views": 97,
  "readTimeMinutes": 4,
  "createdAt": "2026-11-25T15:00:00.000Z",
  "updatedAt": "2026-11-25T15:31:04.661Z"
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
