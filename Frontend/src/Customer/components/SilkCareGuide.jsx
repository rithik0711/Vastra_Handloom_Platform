import React from "react";
import { Sparkles, Check, AlertCircle, Droplets, Sun, Wind } from "lucide-react";

export default function SilkCareGuide() {
  const guidelines = [
    {
      icon: <Droplets className="h-4 w-4 text-[#A16B16]" />,
      title: "Dry Clean Only",
      desc: "For the first 2-3 cleanings, strictly dry clean pure silks and heavy zari sarees to preserve the organic luster and prevent dye bleeding."
    },
    {
      icon: <Wind className="h-4 w-4 text-[#2E7D32]" />,
      title: "Pure Muslin Cloth Wrap",
      desc: "Store wrapped in breathable unbleached pure cotton or muslin fabric. Never store authentic silk sarees in airtight plastic covers."
    },
    {
      icon: <Sun className="h-4 w-4 text-[#704C91]" />,
      title: "Crease Care Rotation",
      desc: "Unfold and refold along different lines every 3 to 4 months to prevent metallic zari threads from snapping along sharp creases."
    },
    {
      icon: <Sparkles className="h-4 w-4 text-[#4A1525]" />,
      title: "Zari Protection",
      desc: "Avoid direct contact with water, deodorants, or perfumes on zari borders. Air the saree in mild shade after wearing before repacking."
    }
  ];

  return (
    <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center gap-2 border-b border-[#F0E8DF] pb-4">
        <Sparkles className="h-5 w-5 text-[#D09229]" />
        <h3 className="font-serif text-xl font-bold text-[#4A1525]">
          Heirloom Care & Silk Preservation Guide
        </h3>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {guidelines.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 rounded-2xl border border-[#F0E8DF] bg-[#FAF6F0] p-4 text-xs"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs">
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold text-[#292421]">{item.title}</h4>
              <p className="mt-1 leading-relaxed text-[#7A6D61]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

