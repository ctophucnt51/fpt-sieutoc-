"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { AreaOption } from "@/config/siteConfig";
import { Search, ChevronDown, Check, X, MapPin } from "lucide-react";

interface SearchableAreaSelectProps {
  areas: AreaOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

// Helper: Strip Vietnamese diacritics for fast, typo-friendly search
function removeVietnameseTones(str: string): string {
  let s = str.toLowerCase();
  s = s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  s = s.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  s = s.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  s = s.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  s = s.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  s = s.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  s = s.replace(/đ/g, "d");
  return s.trim();
}

export default function SearchableAreaSelect({
  areas,
  value,
  onChange,
  required = false,
}: SearchableAreaSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter areas based on query (accent-insensitive & case-insensitive)
  const filteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return areas;
    const normalizedQuery = removeVietnameseTones(searchQuery);

    return areas.filter((item) => {
      const normalizedName = removeVietnameseTones(item.name);
      const normalizedCode = item.code.toLowerCase();
      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedCode.includes(normalizedQuery) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [areas, searchQuery]);

  // Group filtered results: 31 Phường, Các Xã, Khu Vực Khác
  const phuongList = useMemo(
    () => filteredAreas.filter((a) => a.code.startsWith("CT-P-")),
    [filteredAreas]
  );
  const xaList = useMemo(
    () => filteredAreas.filter((a) => a.code.startsWith("CT-X-")),
    [filteredAreas]
  );
  const otherList = useMemo(
    () => filteredAreas.filter((a) => a.code === "OTHER" || (!a.code.startsWith("CT-P-") && !a.code.startsWith("CT-X-"))),
    [filteredAreas]
  );

  const handleSelect = (item: AreaOption) => {
    onChange(item.name);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for HTML form validation */}
      <input
        type="hidden"
        name="area"
        value={value}
        required={required}
      />

      {/* Main Trigger / Search Input - Clean & Minimal */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-xl border transition-all cursor-pointer bg-slate-50/70 hover:bg-white focus-within:bg-white ${
          isOpen
            ? "border-fpt-orange ring-4 ring-orange-500/10 bg-white"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MapPin className="w-4 h-4 text-fpt-orange/80 shrink-0" />
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Gõ tên phường / xã / quận / huyện..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 font-normal"
              autoFocus
            />
          ) : (
            <span className="text-sm font-medium text-slate-900 truncate">
              {value || "Chọn khu vực lắp đặt..."}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {isOpen && searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-slate-900" : ""
            }`}
          />
        </div>
      </div>

      {/* Floating Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Quick Notice */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Gõ tên phường/xã để lọc nhanh:</span>
            </span>
            <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              {filteredAreas.length} địa bàn
            </span>
          </div>

          {/* Empty state */}
          {filteredAreas.length === 0 ? (
            <div className="p-5 text-center text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Không tìm thấy xã/phường &quot;{searchQuery}&quot;</p>
              <p className="text-[11px] text-slate-400">
                Nếu địa bàn của quý khách ở ngoài danh sách, quý khách có thể chọn mục bên dưới:
              </p>
              <button
                type="button"
                onClick={() => handleSelect({ code: "OTHER", name: "Các Tỉnh / Thành Phố Khác (Toàn Quốc)", isPopular: false })}
                className="mt-2 text-xs font-bold text-fpt-orange underline"
              >
                Chọn: Các Tỉnh / Thành Phố Khác (Toàn Quốc)
              </button>
            </div>
          ) : (
            <div className="p-1 space-y-2">
              {/* Group 1: 31 Phường */}
              {phuongList.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 rounded-lg">
                    31 Phường Trực Thuộc TP. Cần Thơ (Sau sáp nhập 07/2025 - Bỏ cấp Quận)
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {phuongList.map((item) => {
                      const isSelected = item.name === value;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] flex items-center justify-between transition-colors ${
                            isSelected
                              ? "bg-orange-50 font-bold text-fpt-dark"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-fpt-orange shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Group 2: 72 Xã */}
              {xaList.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 rounded-lg">
                    72 Xã Trực Thuộc TP. Cần Thơ (Sau sáp nhập 07/2025 - Bỏ cấp Huyện)
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {xaList.map((item) => {
                      const isSelected = item.name === value;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] flex items-center justify-between transition-colors ${
                            isSelected
                              ? "bg-orange-50 font-bold text-fpt-dark"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-fpt-orange shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Group 3: Ngoài thành phố */}
              {otherList.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 rounded-lg">
                    Khu Vực Khác
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {otherList.map((item) => {
                      const isSelected = item.name === value;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] flex items-center justify-between transition-colors ${
                            isSelected
                              ? "bg-orange-50 font-bold text-fpt-dark"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-fpt-orange shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
