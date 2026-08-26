import React from "react";
import ProductCard from "./ProductCard";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RelatedProducts({
  currentProductId,
  products = [],
  favorites = [],
  onToggleFavorite,
  onQuickOrder
}) {
  const navigate = useNavigate();

  const related = products
    .filter((p) => String(p.id || p._id || p.code) !== String(currentProductId))
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D09229]" />
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
              More Handloom Creations
            </p>
          </div>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#4A1525]">
            Curated Artisan Weaves
          </h3>
        </div>

        <button
          type="button"
          onClick={() => navigate("/customer")}
          className="flex items-center gap-1 text-xs font-bold text-[#D09229] hover:underline cursor-pointer"
        >
          <span>View All Catalog</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((product) => {
          const pId = product.id || product._id || product.code;
          return (
            <ProductCard
              key={pId}
              product={product}
              isFavorite={favorites.includes(pId)}
              onToggleFavorite={onToggleFavorite}
              onQuickOrder={onQuickOrder}
            />
          );
        })}
      </div>
    </div>
  );
}

