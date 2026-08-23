import React from "react";
import { Award, MapPin, Star, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";

export default function ArtisanCard({ artisan, onSelectArtisan, onDirectCustomOrder }) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#2E7D32]">
            <ShieldCheck className="h-3 w-3" />
            Verified Master Weaver
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-[#A16B16]">
            <Star className="h-3.5 w-3.5 fill-[#D09229] text-[#D09229]" />
            <span>{artisan.rating || 4.9}</span>
            <span className="text-[10px] text-[#8F8175]">
              ({artisan.reviewsCount || 120}+)
            </span>
          </div>
        </div>

        {/* Guild & Weaver Title */}
        <h3
          onClick={() => onSelectArtisan?.(artisan)}
          className="mt-4 font-serif text-2xl font-bold text-[#4A1525] hover:text-[#7A263B] cursor-pointer transition"
        >
          {artisan.name}
        </h3>
        <p className="text-xs font-semibold text-[#8F8175] flex items-center gap-1 mt-0.5">
          <MapPin className="h-3 w-3 text-[#B8AAA0]" />
          {artisan.location}
        </p>

        <p className="mt-3 text-xs leading-relaxed text-[#56493F] line-clamp-3">
          {artisan.description ||
            "Generational master weavers preserving traditional pit-loom and frame-loom heritage."}
        </p>

        {/* Key Stats Table */}
        <div className="mt-4 space-y-2 rounded-2xl bg-[#FAF6F0] p-3.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#8F8175]">Master Weaver:</span>
            <span className="font-semibold text-[#4A1525]">
              {artisan.artisanName || artisan.ownerName || "Master Weaver"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8F8175]">Specialization:</span>
            <span className="font-semibold text-[#292421]">{artisan.specialization}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8F8175]">Experience:</span>
            <span className="font-semibold text-[#292421]">{artisan.experience}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8F8175]">Active Looms:</span>
            <span className="font-semibold text-[#A16B16]">
              {artisan.activeLooms || 18} Looms Spinning
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-2 border-t border-[#F0E8DF] pt-4">
        <button
          type="button"
          onClick={() => onSelectArtisan?.(artisan)}
          className="flex items-center justify-center gap-1 rounded-xl border border-[#D9CBBF] bg-white py-2 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0] hover:text-[#4A1525] transition cursor-pointer"
        >
          <span>View Bio & Looms</span>
        </button>

        <button
          type="button"
          onClick={() => onDirectCustomOrder?.(artisan)}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
        >
          <Sparkles className="h-3 w-3 text-[#FCDA8B]" />
          <span>Custom Order</span>
        </button>
      </div>
    </div>
  );
}

