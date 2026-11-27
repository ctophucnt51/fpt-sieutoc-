"use client";

import { useState } from "react";
import {
  Camera,
  Cloud,
  ShieldCheck,
  Check,
  Mic,
  Droplets,
  Cpu,
  PhoneCall,
  Gift,
} from "lucide-react";
import { useLeadModal } from "@/context/LeadModalContext";

interface CameraModel {
  id: string;
  name: string;
  tag: string;
  environment: "outdoor" | "indoor" | "both";
  twoWayAudio: boolean;
  resolution: string;
  lens: string;
  durability: string;
  nightVision: string;
  storage: string;
  aiFeatures: string[];
  image: string;
}

const CAMERA_MODELS: CameraModel[] = [
  {
    id: "iq-4s",
    name: "FPT Camera AI IQ 4S",
    tag: "Chủ lực ngoài trời • IP67",
    environment: "outdoor",
    twoWayAudio: true,
    resolution: "3MP sắc nét",
    lens: "4.0mm, góc quan sát rộng",
    durability: "Kháng nước, bụi IP67, chịu nhiệt ngoài trời",
    nightVision: "Hồng ngoại 30m + đèn rọi & còi hú cảnh báo",
    storage: "Cloud Video Full 24/7, cài đặt Bluetooth nhanh",
    aiFeatures: ["Đàm thoại 2 chiều", "Báo động đèn & còi", "Phát hiện người AI"],
    image: "/images/camera-ai/camera-iq-4s.jpg",
  },
  {
    id: "play-4",
    name: "FPT Camera AI Play 4",
    tag: "Chủ lực trong nhà • Xoay 315°",
    environment: "indoor",
    twoWayAudio: true,
    resolution: "3MP",
    lens: "4.0mm, xoay ngang 315°, dọc 75°",
    durability: "Thiết kế nhỏ gọn lắp trong nhà",
    nightVision: "Hồng ngoại 10m không chói mắt",
    storage: "Cloud Video Full 24/7, cài đặt nhanh qua Bluetooth",
    aiFeatures: ["Đàm thoại 2 chiều chủ động", "Phát hiện người", "Nút gọi đa năng"],
    image: "/images/camera-ai/camera-play-4.jpg",
  },
  {
    id: "bullet-5",
    name: "FPT Camera AI Bullet 5",
    tag: "Ngoài trời • 5MP PoE",
    environment: "outdoor",
    twoWayAudio: false,
    resolution: "5MP sắc nét",
    lens: "3.6mm, khẩu độ F/1.0, góc nhìn 107.7°",
    durability: "Kháng nước, bụi chuẩn IP67",
    nightVision: "Hồng ngoại IR 30m + đèn Floodlight ghi hình có màu",
    storage: "Hỗ trợ Cloud FPT / NVR, cấp nguồn PoE 1 cáp",
    aiFeatures: ["Phát hiện người", "Phân biệt người & vật", "Khoanh vùng cảnh báo"],
    image: "/images/camera-ai/camera-bullet-5.jpg",
  },
  {
    id: "dome-5i",
    name: "FPT Camera AI Dome 5i",
    tag: "Nhận diện khuôn mặt • 5MP",
    environment: "both",
    twoWayAudio: false,
    resolution: "5MP sắc nét",
    lens: "3.6mm, khẩu độ F/1.6, góc nhìn 110°",
    durability: "Kháng nước IP67 & chống va đập IK10",
    nightVision: "Đèn hồng ngoại quan sát ban đêm tới 30m",
    storage: "Tích hợp bộ nhớ trong eMMC 32GB + Cloud / NVR",
    aiFeatures: ["Nhận diện khuôn mặt AI", "Phát hiện người", "Ghi hình có âm thanh"],
    image: "/images/camera-ai/camera-dome-5i.jpg",
  },
  {
    id: "bullet-5i",
    name: "FPT Camera AI Bullet 5i",
    tag: "Ngoài trời • Báo động kép",
    environment: "outdoor",
    twoWayAudio: true,
    resolution: "5MP sắc nét",
    lens: "3.6mm, khẩu độ F/1.6, góc nhìn 110°",
    durability: "Kháng nước IP67 & chống va đập IK10",
    nightVision: "Hồng ngoại + LED trợ sáng tới 30m",
    storage: "Cloud FPT / NVR, cảnh báo tức thì qua App",
    aiFeatures: ["Đàm thoại 2 chiều", "Đèn rọi & loa hú cảnh báo", "Phân biệt người & xe"],
    image: "/images/camera-ai/camera-bullet-5i.jpg",
  },
  {
    id: "dome-iq-4w",
    name: "FPT Camera AI Dome IQ 4W",
    tag: "Trong nhà & Ngoài trời • 4MP",
    environment: "both",
    twoWayAudio: false,
    resolution: "4MP",
    lens: "4.0mm, góc quan sát 89.5°",
    durability: "Kháng nước IP67 & chống va đập IK10",
    nightVision: "Hồng ngoại 30m",
    storage: "Cloud FPT / NVR, tích hợp Mic thu âm",
    aiFeatures: ["Phát hiện người", "Phân biệt người & vật", "Lắp trần / tường linh hoạt"],
    image: "/images/camera-ai/camera-dome-iq-4w.jpg",
  },
  {
    id: "se-3s",
    name: "FPT Camera SE 3S",
    tag: "Ngoài trời • Sẵn bộ nhớ 32GB",
    environment: "outdoor",
    twoWayAudio: true,
    resolution: "3MP (2304×1296)",
    lens: "4.0mm, góc nhìn 101°",
    durability: "Mái che mưa + mặt kính phủ Nano kỵ nước",
    nightVision: "Hồng ngoại & trợ sáng ban đêm",
    storage: "Bộ nhớ trong 32GB (lưu ~5 ngày) + nâng cấp Cloud",
    aiFeatures: ["Đàm thoại 2 chiều 5–7m", "Khử tiếng vang", "Phân biệt người & vật"],
    image: "/images/camera-ai/camera-se-3s.jpg",
  },
];

const CLOUD_PLANS = [
  {
    name: "Cloud 7 Ngày (1 Thiết Bị)",
    retention: "Lưu trữ 7 ngày (168h) • 1 Camera",
    price: "35.000đ",
    unit: "/ tháng",
    note: "Gói tiêu chuẩn cho gia đình lắp 1 mắt camera, đầy đủ cảnh báo AI & xem lại 7 ngày",
    highlight: true,
  },
  {
    name: "Cloud 7 Ngày (Từ 2 Thiết Bị)",
    retention: "Lưu trữ 7 ngày (168h) • ≥ 2 Camera",
    price: "50.000đ",
    unit: "/ tháng",
    note: "Tiết kiệm tối đa khi lắp từ 2 camera trở lên cho nhà nhiều tầng, cửa hàng, văn phòng",
    highlight: true,
  },
  {
    name: "Cloud IQ14+",
    retention: "Lưu trữ 14 ngày",
    price: "165.000đ",
    unit: "/ tháng",
    note: "Phù hợp shop kinh doanh, văn phòng, kho nhỏ cần xem lại 2 tuần",
    highlight: false,
  },
  {
    name: "Cloud IQ30+",
    retention: "Lưu trữ 30 ngày",
    price: "245.000đ",
    unit: "/ tháng",
    note: "Lưu trữ trọn tháng tại Data Center Tier III Việt Nam",
    highlight: false,
  },
];

type FilterType = "all" | "outdoor" | "indoor" | "audio";

export default function CameraCatalogSection() {
  const { openLeadModal } = useLeadModal();
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredModels = CAMERA_MODELS.filter((m) => {
    if (filter === "outdoor") return m.environment === "outdoor" || m.environment === "both";
    if (filter === "indoor") return m.environment === "indoor" || m.environment === "both";
    if (filter === "audio") return m.twoWayAudio;
    return true;
  });

  return (
    <section id="san-pham-camera" className="py-10 sm:py-14 bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading + Filter */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#C44D06] border border-orange-200 font-bold text-xs uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Danh Mục Thiết Bị Chính Hãng FPT</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Các Dòng FPT Camera AI Phổ Biến
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Chọn mẫu camera phù hợp vị trí lắp đặt trong nhà, ngoài trời hoặc kết hợp Combo Internet FPT.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "Tất cả (7)" },
                { id: "outdoor", label: "Ngoài trời (IP67)" },
                { id: "indoor", label: "Trong nhà / Xoay" },
                { id: "audio", label: "Đàm thoại 2 chiều" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  filter === tab.id
                    ? "bg-fpt-orange text-white border-fpt-orange shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {filteredModels.map((cam) => (
            <div
              key={cam.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={cam.image}
                  alt={cam.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 text-white text-[11px] font-bold backdrop-blur-xs">
                  {cam.tag}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-slate-900">{cam.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Cpu className="w-3.5 h-3.5 text-fpt-orange shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800">Độ phân giải:</strong> {cam.resolution} • {cam.lens}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800">Độ bền &amp; Đêm:</strong> {cam.durability}; {cam.nightVision}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800">Lưu trữ:</strong> {cam.storage}
                    </span>
                  </div>
                  {cam.twoWayAudio && (
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      <Mic className="w-3.5 h-3.5 shrink-0" />
                      <span>Hỗ trợ đàm thoại 2 chiều trực tiếp</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4 mb-5">
                  {cam.aiFeatures.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-[#B84505] border border-orange-200/70 text-[11px] font-semibold"
                    >
                      <Check className="w-3 h-3" />
                      {feat}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openLeadModal(`Camera AI - ${cam.name}`)}
                    className="w-full py-2.5 px-4 rounded-xl bg-fpt-orange hover:bg-orange-600 text-white text-xs font-extrabold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Nhận Báo Giá &amp; Tư Vấn Lắp Đặt</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cloud Storage Pricing Section */}
        <div className="rounded-3xl bg-[#F4F6FB] border border-slate-200 p-6 sm:p-8">
          <div className="max-w-3xl mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cloud Server Đặt Tại Việt Nam (Tier III)</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Bảng Giá Tham Khảo Gói Lưu Trữ Cloud FPT Camera
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Dữ liệu mã hóa lưu trữ trên hệ thống Data Center FPT Telecom tại Việt Nam, xem lại mượt mà trên điện thoại và hỗ trợ kỹ thuật 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLOUD_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-5 flex flex-col border transition-all ${
                  plan.highlight
                    ? "bg-white border-fpt-orange shadow-md ring-1 ring-fpt-orange/30"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-black text-sm text-slate-900">{plan.name}</span>
                  {plan.highlight && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#C44D06] text-[10px] font-bold">
                      Ưu đãi
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-blue-700 mb-3">{plan.retention}</div>
                <div className="mb-3">
                  <span className="text-2xl font-black text-fpt-orange">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium"> {plan.unit}</span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed mb-4 flex-1">
                  {plan.note}
                </p>
                <button
                  type="button"
                  onClick={() => openLeadModal(`Gói ${plan.name} (${plan.retention})`)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Đăng Ký Gói Này
                </button>
              </div>
            ))}
          </div>

          {/* Combo Internet FPT + Gift 1 Camera Promo */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50/70 to-white border border-orange-200 p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-fpt-orange text-white flex items-center justify-center shrink-0 shadow-xs">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-900">
                  Ưu Đãi Đặc Biệt: Lắp Internet FPT Được Tặng 1 Camera AI (Miễn Phí Lưu Trữ)
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Áp dụng cho khách hàng đăng ký mới gói Internet Wi-Fi 6 FPT theo chương trình khuyến mãi hiện hành. Tặng kèm 1 Camera FPT AI và miễn phí gói lưu trữ Cloud theo điều kiện gói cước &amp; kỳ thanh toán.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openLeadModal("Combo Internet FPT + Tặng 1 Camera (Miễn phí lưu trữ)")}
              className="shrink-0 px-5 py-3 rounded-xl bg-fpt-orange hover:bg-orange-600 text-white text-xs font-extrabold uppercase tracking-wide shadow-xs transition-colors cursor-pointer"
            >
              Nhận Ưu Đãi Combo Ngay
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
            * Lưu ý minh bạch: Gói lưu trữ Cloud 7 ngày áp dụng mức 35.000đ/tháng cho 1 thiết bị hoặc 50.000đ/tháng cho từ 2 thiết bị trở lên. Điều kiện áp dụng ưu đãi tặng 1 Camera (miễn phí lưu trữ) và chi phí lắp đặt cụ thể sẽ được nhân viên tư vấn báo chi tiết trước khi ký hợp đồng.
          </p>
        </div>
      </div>
    </section>
  );
}
