import React from "react";
import { useNavigate } from "react-router-dom";
import { Award, MapPin, Star, ShieldCheck, Sparkles, ArrowRight, Eye } from "lucide-react";

export default function ArtisanInfoCard({ artisan, onBookCustomOrder }) {
  const navigate = useNavigate();

  const artisanData = {
    name: artisan?.name || artisan?.artisanName || "Kathar Weaves",
    masterWeaver: artisan?.ownerName || artisan?.masterWeaver || "Rithikeswaran M",
    location: artisan?.location || "Coimbatore & Kanchipuram, Tamil Nadu",
    experience: artisan?.experience || "15+ Years of Generational Weaving",
    activeLooms: artisan?.loomsActive || artisan?.activeLooms || 18,
    specialization: artisan?.specialization || "Pure Mulberry Silk & Korvai Borders",
    rating: artisan?.rating || 4.9,
    reviewsCount: artisan?.reviewsCount || 142,
    description:
      artisan?.description ||
      "Preserving centuries-old pit-loom techniques, our artisan guild creates heirloom silks dyed with non-toxic certified organic pigments and fine gold zari."
  };

  const artisanId = (artisanData.name || "kathar-weaves").toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4A1525] to-[#7A263B] font-serif text-xl font-bold text-white shadow-md">
            {artisanData.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#2E7D32]">
                <ShieldCheck className="h-3 w-3" />
                Verified Master Guild
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#A16B16]">
                <Star className="h-3.5 w-3.5 fill-[#D09229] text-[#D09229]" />
                <span>{artisanData.rating}</span>
                <span className="text-[10px] text-[#8F8175]">({artisanData.reviewsCount}+)</span>
              </div>
            </div>

            <h3
              onClick={() => navigate(`/customer/artisan/${encodeURIComponent(artisanId)}`)}
              className="mt-1 font-serif text-2xl font-bold text-[#4A1525] hover:text-[#7A263B] cursor-pointer transition"
            >
              {artisanData.name}
            </h3>
            <p className="flex items-center gap-1 text-xs font-medium text-[#7A6D61] mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-[#A16B16]" />
              {artisanData.location}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => navigate(`/customer/artisan/${encodeURIComponent(artisanId)}`)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-4 py-2.5 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0] hover:text-[#4A1525] transition cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span>Artisan Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onBookCustomOrder) {
                onBookCustomOrder(artisanData);
              } else {
                navigate(`/customer/booking?manufacturer=${encodeURIComponent(artisanData.name)}`);
              }
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:opacity-95 active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-[#FCDA8B]" />
            <span>Book Custom Weave</span>
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[#56493F]">
        {artisanData.description}
      </p>

      {/* Workshop Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
            Master Craftsman
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#4A1525]">{artisanData.masterWeaver}</p>
        </div>

        <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
            Experience Lineage
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#292421]">{artisanData.experience}</p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
            Active Loom Capacity
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#A16B16]">
            {artisanData.activeLooms} Looms Spinning
          </p>
        </div>
      </div>
    </div>
  );
}
