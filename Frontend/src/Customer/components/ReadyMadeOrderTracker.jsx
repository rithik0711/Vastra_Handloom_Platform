import React from "react";
import {
  Package,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Star,
  Sparkles,
  MapPin,
  FileText
} from "lucide-react";

export default function ReadyMadeOrderTracker({ order, onReviewArtisan }) {
  const currentStage = order.currentStage || (order.status === "Delivered" ? 5 : order.status === "Dispatched" ? 4 : 2);
  const isDelivered = currentStage >= 5 || order.status === "Delivered";

  const defaultStages = [
    { name: "Order Placed", desc: "Received & Confirmed", completed: currentStage >= 1, date: currentStage >= 1 ? order.orderDate || "Day 1" : "Upcoming" },
    { name: "Artisan Inspection", desc: "Handloom Finished", completed: currentStage >= 2, date: currentStage >= 2 ? "Completed" : "Upcoming" },
    { name: "Silk Mark Tagged", desc: "GI & QR Certified", completed: currentStage >= 3, date: currentStage >= 3 ? "Completed" : "Upcoming" },
    { name: "Handloom Dispatch", desc: "Insured Courier", completed: currentStage >= 4, date: currentStage >= 4 ? "Completed" : "Upcoming" },
    { name: "Delivered", desc: "Doorstep Handover", completed: currentStage >= 5, date: isDelivered ? "Delivered" : "Upcoming" }
  ];

  const stages = order.stages && order.stages.length === 5 ? order.stages : defaultStages;

  return (
    <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition hover:shadow-md sm:p-8">
      {/* Order Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#F0E8DF] pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <img
            src={order.image || "/images/kanchi.png"}
            alt={order.product}
            className="h-16 w-16 rounded-2xl object-cover border border-[#E5DCD0]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/kanchi.png";
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#FAF0E1] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#A16B16]">
                Ready-Made Weave
              </span>
              <span className="text-[11px] font-bold text-[#8F8175]">
                #{order.orderId || order.id} • {order.orderDate}
              </span>
            </div>

            <h3 className="mt-1 font-serif text-xl font-bold text-[#292421]">
              {order.product}
            </h3>
            <p className="text-xs text-[#7A6D61]">
              Woven by <strong>{order.manufacturer || "Kathar Weaves"}</strong> (Master Weaver: {order.artisanName || "Rithikeswaran M"})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:text-right">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#8F8175]">Total Paid</p>
            <p className="font-serif text-lg font-bold text-[#4A1525]">{order.amount || `₹${order.price}`}</p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isDelivered
                ? "bg-[#EAF6ED] text-[#2E7D32] border border-[#C8E6C9]"
                : "bg-[#FFF4DF] text-[#A16B16] border border-[#F5DEC0]"
            }`}
          >
            {order.status || (isDelivered ? "Delivered" : "In Fulfillment")}
          </span>
        </div>
      </div>

      {/* 5-Stage Stepper */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9B8068] flex items-center gap-1.5">
            <Package className="h-4 w-4 text-[#D09229]" />
            <span>5-Stage Ready-Made Fulfillment Journey</span>
          </p>
          <span className="text-[11px] text-[#7A6D61]">
            Estimated Delivery: <strong>{order.estimatedDelivery || "In 7-10 Days"}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          {stages.map((stage, idx) => {
            const isCompleted = stage.completed || idx + 1 <= currentStage;
            const isCurrent = idx + 1 === currentStage && !isDelivered;

            return (
              <div
                key={idx}
                className={`relative flex flex-col rounded-2xl border p-3.5 transition ${
                  isCompleted
                    ? "border-emerald-200 bg-emerald-50/60"
                    : isCurrent
                    ? "border-[#D09229] bg-[#FAF0E1]/50 shadow-2xs"
                    : "border-[#EFE5DB] bg-[#FAF6F0]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-[#D09229] text-white animate-pulse"
                        : "bg-[#E0D4C7] text-[#7A6D61]"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-[10px] text-[#8F8175]">{stage.date || ""}</span>
                </div>

                <p
                  className={`mt-2 text-xs font-bold ${
                    isCompleted
                      ? "text-emerald-900"
                      : isCurrent
                      ? "text-[#4A1525]"
                      : "text-[#8F8175]"
                  }`}
                >
                  {stage.name}
                </p>
                <p className="mt-0.5 text-[10px] text-[#7A6D61] leading-tight">
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
            <span>Delivering to: <strong>{order.deliveryAddress || "Indiranagar, Bengaluru"}</strong></span>
          </span>
          <span className="text-[#D9CBBF]">|</span>
          <span>Txn ID: <strong className="font-mono text-[#4A1525]">{order.transactionId || "TXN-849201"}</strong></span>
        </div>

        {/* Review Action (Active when Delivered) */}
        {isDelivered && (
          <div>
            {order.isReviewed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF6ED] px-3.5 py-1.5 text-xs font-bold text-[#2E7D32] border border-[#C8E6C9]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Master Weaver Feedback Submitted</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onReviewArtisan?.({
                    artisanName: order.artisanName || "Rithikeswaran M",
                    manufacturer: order.manufacturer || "Kathar Weaves",
                    orderId: order.orderId || order.id,
                    productContext: order.product
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

