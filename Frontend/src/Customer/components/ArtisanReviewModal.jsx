import React, { useState } from "react";
import { X, Star, Sparkles, CheckCircle2, ShieldCheck, User } from "lucide-react";

export default function ArtisanReviewModal({ reviewContext, onClose, onSubmitSuccess }) {
  const savedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem("customerProfile") || "{}");
    } catch {
      return {};
    }
  })();

  const [rating, setRating] = useState(5);
  const [craftsmanshipRating, setCraftsmanshipRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  if (!reviewContext) return null;

  const artisanName = reviewContext.artisanName || "Rithikeswaran M";
  const manufacturer = reviewContext.manufacturer || "Kathar Weaves";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/customer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisanName,
          manufacturer,
          orderId: reviewContext.orderId || "",
          productContext: reviewContext.productContext || "Authentic Handloom Weave",
          rating,
          craftsmanshipRating,
          communicationRating,
          comment: comment.trim(),
          customerName: savedProfile.fullName || "Ananya Deshmukh",
          customerEmail: savedProfile.email || localStorage.getItem("userEmail") || "customer@example.com"
        })
      });

      const data = await response.json();
      setLoading(false);
      onSubmitSuccess?.(data.data || { artisanName, rating, comment });
      onClose();
    } catch (err) {
      console.error("Review submit error:", err);
      setLoading(false);
      onSubmitSuccess?.({ artisanName, rating, comment });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0E8DF] bg-gradient-to-r from-[#4A1525] via-[#5F192E] to-[#7D293E] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF0E1] text-[#4A1525] font-serif font-bold">
              ★
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Review Master Weaver
              </h3>
              <p className="text-[11px] text-white/80">
                Feedback for <strong>{artisanName}</strong> ({manufacturer})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Note that review is attached to artisan */}
          <div className="flex items-center gap-2 rounded-2xl bg-[#FAF6F0] p-3 text-xs text-[#56493F]">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Your review directly honors and empowers <strong>{artisanName}</strong> and their handloom workshop guild.</span>
          </div>

          {/* Overall Star Rating */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8F8175] mb-2">
              Overall Craftsmanship & Satisfaction
            </label>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? "fill-[#D09229] text-[#D09229]"
                        : "text-[#D9CBBF]"
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="mt-1 font-serif text-sm font-bold text-[#4A1525]">
              {rating === 5 ? "Exceptional Heritage Quality ★★★★★" : rating === 4 ? "Very Good Craftsmanship ★★★★" : `${rating} Stars`}
            </p>
          </div>

          {/* Secondary Sub-Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3">
              <label className="block text-[11px] font-bold text-[#4A1525] mb-1.5">
                Weave & Zari Precision
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCraftsmanshipRating(s)}
                    className="p-0.5 cursor-pointer"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        craftsmanshipRating >= s ? "fill-[#D09229] text-[#D09229]" : "text-[#D9CBBF]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-3">
              <label className="block text-[11px] font-bold text-[#4A1525] mb-1.5">
                Loom Punctuality & Updates
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCommunicationRating(s)}
                    className="p-0.5 cursor-pointer"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        communicationRating >= s ? "fill-[#D09229] text-[#D09229]" : "text-[#D9CBBF]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Written Feedback Textarea */}
          <div>
            <label className="block text-xs font-bold text-[#4A1525] mb-1">
              Your Feedback for Master Weaver {artisanName}
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the feel of the silk yarn, the richness of the zari border, the precision of the Korvai interlocking, or words of encouragement for the weaver..."
              className="w-full rounded-2xl border border-[#E5DCD0] bg-[#FAF6F0] p-3.5 text-xs text-[#292421] placeholder-[#A89D91] focus:border-[#4A1525] focus:bg-white focus:outline-hidden transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#D9CBBF] py-2.5 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0] transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? "Submitting Review..." : "Submit Artisan Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

