import React from "react";
import {
  Sparkles,
  Layers,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  User,
  Palette,
  Ruler
} from "lucide-react";

export default function CustomLoomOrderTracker({ booking, onReviewArtisan }) {
  const currentStage = booking.currentStage || (booking.status === "Delivered" ? 7 : booking.status === "In Weaving" ? 4 : 2);
  const isDelivered = currentStage >= 7 || booking.status === "Delivered";

  const defaultStages = [
    { name: "Custom Confirmed", desc: "Warp draft planned", completed: currentStage >= 1, date: currentStage >= 1 ? booking.bookingDate || "Day 1" : "Upcoming" },
    { name: "Silk Dyeing", desc: "Natural organic dyes", completed: currentStage >= 2, date: currentStage >= 2 ? "Completed" : "Upcoming" },
    { name: "Loom Setup & Warping", desc: "104 reed count draft", completed: currentStage >= 3, date: currentStage >= 3 ? "Completed" : "Upcoming" },
    { name: "Artisan Weaving", desc: "Korvai zari interlocking", completed: currentStage >= 4, date: currentStage >= 4 ? "Completed" : "Upcoming" },
    { name: "Finishing & Loom Cut", desc: "Quality audit & press", completed: currentStage >= 5, date: currentStage >= 5 ? "Completed" : "Upcoming" },
    { name: "Silk Mark Dispatch", desc: "Heirloom packing", completed: currentStage >= 6, date: currentStage >= 6 ? "Completed" : "Upcoming" },
    { name: "Delivered", desc: "Master artisan handover", completed: currentStage >= 7, date: isDelivered ? "Delivered" : "Upcoming" }
  ];

  const stages = booking.stages && booking.stages.length === 7 ? booking.stages : defaultStages;

  return (
    <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition hover:shadow-md sm:p-8">
      {/* Booking Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#F0E8DF] pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#4A1525] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FCDA8B] flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#D09229]" />
              Bespoke Loom Order
            </span>
            <span className="text-[11px] font-bold text-[#8F8175]">
              #{booking.bookingId || booking.id} • Booked on {booking.bookingDate}
            </span>
          </div>

          <h3 className="mt-1 font-serif text-xl font-bold text-[#4A1525]">
            {booking.fabricChoice || "Custom Heirloom Saree"}
          </h3>
          <p className="text-xs text-[#7A6D61] mt-0.5">
            Dedicated Master Weaver: <strong className="text-[#292421]">{booking.artisanName || "Rithikeswaran M"}</strong> ({booking.manufacturer || "Kathar Weaves"})
          </p>
        </div>

        <div className="flex items-center gap-4 sm:text-right">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#8F8175]">Advance Paid</p>
            <p className="font-serif text-lg font-bold text-[#2E7D32]">{booking.advancePaid || "₹3,000"}</p>
            <p className="text-[10px] text-[#8F8175]">Est Total: {booking.estimatedPrice || "₹14,500"}</p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isDelivered
                ? "bg-[#EAF6ED] text-[#2E7D32] border border-[#C8E6C9]"
                : "bg-[#FAF0E1] text-[#A16B16] border border-[#F2DEBF]"
            }`}
          >
            {booking.status || (isDelivered ? "Delivered" : "On Loom")}
          </span>
        </div>
      </div>

      {/* Bespoke Specification Cards Grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-xs">
          <span className="text-[10px] font-bold uppercase text-[#8F8175]">Loom Type</span>
          <p className="mt-0.5 font-bold text-[#292421] truncate">{booking.loomType || "Traditional Pit Loom"}</p>
        </div>

        <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-xs">
          <span className="text-[10px] font-bold uppercase text-[#8F8175]">Zari Specification</span>
          <p className="mt-0.5 font-bold text-[#A16B16] truncate">{booking.zariType || "Tested Half-Fine Zari"}</p>
        </div>

        <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-xs">
          <span className="text-[10px] font-bold uppercase text-[#8F8175]">Custom Motif</span>
          <p className="mt-0.5 font-bold text-[#4A1525] truncate">{booking.customPattern || "Peacock & Temple Motif"}</p>
        </div>

        <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3 text-xs">
          <span className="text-[10px] font-bold uppercase text-[#8F8175]">Color Palette</span>
          <p className="mt-0.5 font-bold text-[#292421] truncate">
            {booking.bodyColor || "Crimson"} / {booking.borderColor || "Gold Border"}
          </p>
        </div>
      </div>

      {/* 7-Stage Bespoke Loom Stepper */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9B8068] flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-[#4A1525]" />
            <span>7-Stage Dedicated Pit Loom Weaving Journey</span>
          </p>
          <span className="text-[11px] text-[#7A6D61]">
            Target Completion: <strong>{booking.targetCompletion || "In 3-4 Weeks"}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-7">
          {stages.map((stage, idx) => {
            const isCompleted = stage.completed || idx + 1 <= currentStage;
            const isCurrent = idx + 1 === currentStage && !isDelivered;

            return (
              <div
                key={idx}
                className={`relative flex flex-col rounded-2xl border p-2.5 transition ${
                  isCompleted
                    ? "border-emerald-200 bg-emerald-50/60"
                    : isCurrent
                    ? "border-[#4A1525] bg-[#FAF0E1]/60 shadow-2xs"
                    : "border-[#EFE5DB] bg-[#FAF6F0]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-[#4A1525] text-white animate-pulse"
                        : "bg-[#E0D4C7] text-[#7A6D61]"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-[9px] text-[#8F8175]">{stage.date || ""}</span>
                </div>

                <p
                  className={`mt-1.5 text-[11px] font-bold ${
                    isCompleted
                      ? "text-emerald-900"
                      : isCurrent
                      ? "text-[#4A1525]"
                      : "text-[#8F8175]"
                  }`}
                >
                  {stage.name}
                </p>
                <p className="mt-0.5 text-[9px] text-[#7A6D61] leading-tight line-clamp-2">
                  {stage.desc || ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta Footer & Review CTA */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#F0E8DF] pt-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-[#7A6D61]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[#B8AAA0]" />
            <span>Delivery Address: <strong>{booking.deliveryAddress || "Indiranagar, Bengaluru"}</strong></span>
          </span>
          <span className="text-[#D9CBBF]">|</span>
          <span>Txn ID: <strong className="font-mono text-[#4A1525]">{booking.transactionId || "TXN-BESPOKE-901"}</strong></span>
        </div>

        {/* Review Action (Active when Delivered) */}
        {isDelivered && (
          <div>
            {booking.isReviewed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF6ED] px-3.5 py-1.5 text-xs font-bold text-[#2E7D32] border border-[#C8E6C9]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Master Weaver Feedback Submitted</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onReviewArtisan?.({
                    artisanName: booking.artisanName || "Rithikeswaran M",
                    manufacturer: booking.manufacturer || "Kathar Weaves",
                    orderId: booking.bookingId || booking.id,
                    productContext: `Custom Loom Weave (${booking.fabricChoice})`
                  })
                }
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D09229] to-[#E5A43A] px-4 py-2 text-xs font-bold text-[#3B1502] shadow-xs hover:opacity-95 transition cursor-pointer"
              >
                <Star className="h-3.5 w-3.5 fill-[#3B1502]" />
                <span>Review Master Weaver</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

