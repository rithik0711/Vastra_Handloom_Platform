import React from "react";
import {
  X,
  MapPin,
  Star,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Phone,
  Mail
} from "lucide-react";

export default function ArtisanProfileModal({ artisan, onClose, onBookCustomOrder }) {
  if (!artisan) return null;

  const artisanName = artisan.artisanName || artisan.ownerName || "Master Weaver";
  const guildName = artisan.name || artisan.businessName || "Kathar Weaves";
  const location = artisan.location || "Tamil Nadu, India";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-2xl">
        {/* Header Hero */}
        <div className="relative bg-gradient-to-r from-[#4A1525] via-[#5F192E] to-[#7D293E] p-6 sm:p-8 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#D09229] to-[#FCDA8B] font-serif text-2xl font-bold text-[#4A1525] shadow-lg">
              {guildName.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs">
                <ShieldCheck className="h-3 w-3" />
                Verified Master Weaver Guild
              </div>

              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl text-white">
                {guildName}
              </h2>
              <p className="flex items-center gap-1 text-xs text-white/80 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-[#FCDA8B]" />
                {location}
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Master Weaver bio */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#4A1525]">
              Artisan Lineage & Craftsmanship Story
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#56493F]">
              Led by master craftsman <strong>{artisanName}</strong>, this guild has practiced traditional handloom weaving for over {artisan.experience || "15+ years"}. Specializing in authentic {artisan.specialization || "Kanchipuram Silks and Fine Organic Cotton"}, every saree is woven on wooden pit looms with precision Korvai warp interlocking and Silk Mark certified botanical dyed yarn.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-center">
              <p className="text-[10px] font-bold uppercase text-[#8F8175]">Active Looms</p>
              <p className="mt-1 font-serif text-lg font-bold text-[#4A1525]">
                {artisan.activeLooms || 18}
              </p>
            </div>

            <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-center">
              <p className="text-[10px] font-bold uppercase text-[#8F8175]">Customer Rating</p>
              <p className="mt-1 font-serif text-lg font-bold text-[#A16B16] flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-[#D09229] text-[#D09229]" />
                {artisan.rating || 4.9}
              </p>
            </div>

            <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-center">
              <p className="text-[10px] font-bold uppercase text-[#8F8175]">Experience</p>
              <p className="mt-1 font-serif text-lg font-bold text-[#292421]">
                {artisan.experience || "15+ Yrs"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-center">
              <p className="text-[10px] font-bold uppercase text-[#8F8175]">Certification</p>
              <p className="mt-1 text-xs font-bold text-emerald-700">Silk Mark / GI</p>
            </div>
          </div>

          {/* Specialities & Techniques */}
          <div className="rounded-2xl bg-[#FAF6F0] p-4 text-xs space-y-2">
            <p className="font-bold text-[#4A1525]">Guild Specialties:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Korvai 3-Shuttle Weaving",
                "Pure Mulberry Silk (20/22 Denier)",
                "Tested Gold/Silver Zari",
                "Peacock & Temple Gopuram Motifs",
                "Organic Herbal Dyeing"
              ].map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-[#E5DCD0] bg-white px-3 py-1 text-[11px] font-semibold text-[#56493F]"
                >
                  ✓ {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#D9CBBF] py-3 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0] transition cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onBookCustomOrder?.(artisan);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-3 text-xs font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#FCDA8B]" />
              <span>Place Custom Order with {artisanName}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

