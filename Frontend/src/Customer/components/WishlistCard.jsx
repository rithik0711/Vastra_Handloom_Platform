import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Eye, Trash2, Sparkles } from "lucide-react";

export default function WishlistCard({ product, onRemove, onOrder }) {
  const navigate = useNavigate();

  const formattedPrice =
    typeof product.price === "number"
      ? product.price.toLocaleString("en-IN")
      : product.price || "0";

  const productId = product.id || product._id || product.code;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5DCD0] bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-60 w-full overflow-hidden bg-[#FAF6F0]">
        <img
          src={product.image || "/images/kanchi.png"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/kanchi.png";
          }}
        />

        {/* Remove from Wishlist button */}
        <button
          type="button"
          onClick={() => onRemove?.(productId)}
          title="Remove from saved weaves"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#A44747] shadow-xs backdrop-blur-xs hover:bg-white active:scale-90 transition cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <div className="absolute bottom-3 left-3 rounded-full bg-[#4A1525]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs">
          {product.tag || product.category || "Authentic Handloom"}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#8F8175]">
            <span>{product.fabric || product.category}</span>
            <span className="font-semibold text-[#A16B16]">{product.weave}</span>
          </div>

          <h3
            onClick={() => navigate(`/customer/products/${productId}`)}
            className="mt-1 font-serif text-lg font-bold text-[#292421] group-hover:text-[#4A1525] cursor-pointer transition"
          >
            {product.name}
          </h3>

          <p className="mt-1 text-[11px] text-[#7A6D61] line-clamp-2">
            {product.description || "Handcrafted pure silk weave by master artisans."}
          </p>

          <p className="mt-2 text-[11px] text-[#8F8175]">
            Artisan: <strong className="text-[#4A1525]">{product.artisan || product.manufacturerId || "Kathar Weaves"}</strong>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#F0E8DF] pt-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#8F8175]">Direct Price</p>
            <p className="font-serif text-lg font-bold text-[#4A1525]">
              ₹{formattedPrice}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate(`/customer/products/${productId}`)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#D9CBBF] bg-[#FAF6F0] text-[#56493F] hover:border-[#4A1525] hover:text-[#4A1525] transition cursor-pointer"
              title="Full specifications"
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onOrder?.(product)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 active:scale-95 transition cursor-pointer"
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

