import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Eye, Sparkles } from "lucide-react";

export default function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite,
  onQuickOrder
}) {
  const navigate = useNavigate();

  const formattedPrice =
    typeof product.price === "number"
      ? product.price.toLocaleString("en-IN")
      : product.price || "0";

  const productId = product.id || product._id || product.code;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5DCD0] bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image Box */}
      <div className="relative h-64 w-full overflow-hidden bg-[#FAF6F0]">
        <img
          src={product.image || "/images/kanchi.png"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/kanchi.png";
          }}
        />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(productId);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#4A1525] shadow-xs backdrop-blur-xs transition hover:bg-white active:scale-90 cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite ? "fill-[#A44747] text-[#A44747]" : "text-[#7A6D61]"
            }`}
          />
        </button>

        {/* Certification Badge */}
        <div className="absolute bottom-3 left-3 rounded-full bg-[#4A1525]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#D09229]" />
          <span>{product.tag || product.category || "Authentic Handloom"}</span>
        </div>

        {/* Quick View Overlay on hover */}
        <button
          type="button"
          onClick={() => navigate(`/customer/products/${productId}`)}
          className="absolute inset-x-4 bottom-12 hidden md:flex items-center justify-center gap-1.5 rounded-xl bg-white/95 py-2 text-xs font-bold text-[#4A1525] shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View Full Specifications</span>
        </button>
      </div>

      {/* Details Area */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#8F8175]">
            <span className="font-medium text-[#7A6D61]">{product.fabric || product.category}</span>
            <span className="font-semibold text-[#A16B16]">{product.weave || "Hand Woven"}</span>
          </div>

          <h3
            onClick={() => navigate(`/customer/products/${productId}`)}
            className="mt-1 font-serif text-lg font-bold text-[#292421] group-hover:text-[#4A1525] cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          <p className="mt-1 text-[11px] text-[#7A6D61] line-clamp-2">
            {product.description ||
              "Handcrafted with pure yarns on traditional wooden pit looms with precision artisan borders."}
          </p>

          <div className="mt-2 flex items-center gap-1 text-[11px] text-[#8F8175]">
            <span>Weaver:</span>
            <span className="font-semibold text-[#4A1525]">
              {product.artisan || product.manufacturerId || "Kathar Weaves"}
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-[#F0E8DF] pt-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#8F8175]">Artisan Direct Price</p>
            <p className="font-serif text-lg font-bold text-[#4A1525]">
              ₹{formattedPrice}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate(`/customer/products/${productId}`)}
              className="flex items-center justify-center h-8 w-8 rounded-xl border border-[#D9CBBF] bg-[#FAF6F0] text-[#56493F] transition hover:border-[#4A1525] hover:text-[#4A1525] cursor-pointer"
              title="Full Details"
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onQuickOrder?.(product)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:opacity-95 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

