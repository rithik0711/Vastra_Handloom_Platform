import React from "react";
import { CheckCircle2, ShieldCheck, Sparkles, Award, Layers, Ruler } from "lucide-react";

export default function ProductSpecsTable({ product }) {
  const specs = [
    { label: "Fabric & Material", value: product.fabric || "100% Pure Mulberry Silk" },
    { label: "Weave Technique", value: product.weave || "Traditional Korvai Handloom" },
    { label: "Warp Yarn Spec", value: product.warp || "2-Ply Twisted Mulberry Silk (20/22 Denier)" },
    { label: "Weft Yarn Spec", value: product.weft || "3-Ply High-Twist Natural Silk" },
    { label: "Zari Purity", value: product.zari || "Tested Half-Fine Gold Zari (Silver Electroplated)" },
    { label: "Reed Count / Density", value: product.reedCount || "96 Dents Per Inch (High Density)" },
    { label: "Dimensions & Length", value: product.length || "6.3 Meters (Including 0.8m Blouse Piece)" },
    { label: "Border & Pallu", value: product.borderStyle || "Temple Gopuram Korvai Contrast Border" },
    { label: "Origin & Heritage Hub", value: product.origin || "Kanchipuram, Tamil Nadu, India" },
    { label: "Certification", value: product.tag || "GI Tag & Silk Mark Certified" }
  ];

  return (
    <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-serif text-xl font-bold text-[#4A1525]">
              Technical Weave Specifications
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#7A6D61]">
            Verified handloom artisan metrics according to Textile Committee Silk Mark standards.
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#EAF6ED] px-3 py-1 text-[11px] font-bold text-[#2E7D32]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          100% Handloom Certified
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-3 gap-x-8 sm:grid-cols-2">
        {specs.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between rounded-xl bg-[#FAF6F0] p-3 text-xs"
          >
            <span className="font-medium text-[#7C6E61]">{item.label}</span>
            <span className="font-bold text-[#4A1525] text-right ml-2">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Authenticity Guarantee Callout */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#FAF0E1] to-[#F5ECE0] p-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4A1525] text-[#FCDA8B]">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-[#4A1525]">Authenticity & GI Tag Guarantee</p>
            <p className="text-[11px] text-[#7A6D61]">
              Every weave comes with an artisan QR Certificate of Authenticity and direct GI trace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

