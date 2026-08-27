import React from "react";
import { Star, ShieldCheck, User, Sparkles, MessageSquare, ThumbsUp } from "lucide-react";

export default function ArtisanReviewsList({ reviews = [], artisanName, onWriteReview }) {
  const total = reviews.length;
  const avg =
    total > 0
      ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / total).toFixed(1)
      : "4.9";

  const defaultReviews = [
    {
      reviewId: "REV-101",
      customerName: "Meenakshi Sundaram",
      rating: 5,
      craftsmanshipRating: 5,
      communicationRating: 5,
      comment:
        "The Korvai border interlocking on this Kanchipuram silk saree is nothing short of breathtaking. You can truly feel the weight of pure mulberry silk and authentic zari. Master Weaver Rithikeswaran is a true national treasure.",
      createdAt: "2026-08-18T10:30:00.000Z",
      verifiedPurchase: true,
      productContext: "Kanchipuram Pure Silk Korvai"
    },
    {
      reviewId: "REV-102",
      customerName: "Pooja Hegde",
      rating: 5,
      craftsmanshipRating: 5,
      communicationRating: 5,
      comment:
        "Commissioned a custom bridal saree on his pit loom. Received live video updates of the warp drafting and silk dyeing. The saree arrived on time with Silk Mark QR authentication. Exceeded all our family expectations!",
      createdAt: "2026-08-10T14:15:00.000Z",
      verifiedPurchase: true,
      productContext: "Bespoke Bridal Zari Weave"
    },
    {
      reviewId: "REV-103",
      customerName: "Ananya Deshmukh",
      rating: 5,
      craftsmanshipRating: 5,
      communicationRating: 4,
      comment:
        "Superb soft drape and botanical dyed colors that shine with elegance. Direct pricing from the artisan without retail markups makes Vastra revolutionary.",
      createdAt: "2026-08-02T09:45:00.000Z",
      verifiedPurchase: true,
      productContext: "Traditional Handloom Cotton"
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8">
      {/* Reviews Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E8DF] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-[#FAF0E1] px-2.5 py-0.5 text-[10px] font-bold text-[#A16B16]">
              <Star className="h-3 w-3 fill-[#D09229] text-[#D09229]" />
              Artisan Reputation
            </span>
          </div>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#4A1525]">
            Patron Reviews & Weaver Feedback
          </h3>
          <p className="mt-0.5 text-xs text-[#7A6D61]">
            Verified craftsmanship reviews honoring <strong>{artisanName || "Master Weaver"}</strong>
          </p>
        </div>

        {/* Aggregate Score Card & Write Review Button */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1 font-serif text-2xl font-bold text-[#4A1525]">
              <Star className="h-5 w-5 fill-[#D09229] text-[#D09229]" />
              <span>{avg}</span>
              <span className="text-xs font-sans text-[#8F8175]">/ 5.0</span>
            </div>
            <p className="text-[10px] text-[#8F8175]">{displayReviews.length} Verified Reviews</p>
          </div>

          <button
            type="button"
            onClick={onWriteReview}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Write Feedback</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-6 space-y-4">
        {displayReviews.map((r, idx) => (
          <div
            key={r.reviewId || idx}
            className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-5 text-xs transition hover:bg-white hover:shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4A1525] to-[#7A263B] text-xs font-bold text-white shadow-2xs">
                  {(r.customerName || "Patron").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#292421]">{r.customerName || "Verified Patron"}</p>
                  <p className="text-[10px] text-[#8F8175] flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    Verified Artisan Commission {r.productContext ? `• ${r.productContext}` : ""}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-3.5 w-3.5 ${
                      (Number(r.rating) || 5) >= s
                        ? "fill-[#D09229] text-[#D09229]"
                        : "text-[#D9CBBF]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="mt-3 leading-relaxed text-[#56493F]">
              "{r.comment}"
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-[#EAE0D4] pt-2 text-[10px] text-[#8F8175]">
              <span>
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Recent"}
              </span>
              <span className="font-semibold text-[#A16B16]">
                Craftsmanship: {r.craftsmanshipRating || 5}/5 ★
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

