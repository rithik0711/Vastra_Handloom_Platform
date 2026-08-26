import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import WishlistCard from "./components/WishlistCard";
import OrderModal from "./components/OrderModal";
import { Heart, Sparkles, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Wishlist() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vastra_customer_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const defaultCatalog = [
    {
      id: "1",
      code: "KW-SILK-001",
      name: "Kanchipuram Pure Silk Saree",
      category: "Silk",
      fabric: "Pure Mulberry Silk",
      weave: "Hand Woven Korvai",
      price: 8500,
      image: "/images/kanchi.png",
      artisan: "Kathar Weaves",
      tag: "GI Tag Certified"
    },
    {
      id: "2",
      code: "KW-COT-002",
      name: "Traditional Handloom Cotton Saree",
      category: "Cotton",
      fabric: "Combed Organic Cotton",
      weave: "Heritage Handloom",
      price: 4200,
      image: "/images/cotton.png",
      artisan: "Kathar Weaves",
      tag: "India Handloom Brand"
    },
    {
      id: "3",
      code: "KW-SILK-003",
      name: "Royal Bridal Zari Silk Saree",
      category: "Silk",
      fabric: "Silk & Half-Fine Zari",
      weave: "Jacquard Hand Woven",
      price: 11500,
      image: "/images/zari.png",
      artisan: "Kathar Weaves",
      tag: "Silk Mark Certified"
    },
    {
      id: "4",
      code: "KW-COT-004",
      name: "Organic Eco-Dyed Handloom Saree",
      category: "Cotton",
      fabric: "Natural Dyed Cotton",
      weave: "Traditional Pit Loom",
      price: 3800,
      image: "/images/handloom.png",
      artisan: "Aura Handlooms",
      tag: "100% Eco Friendly"
    }
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/manufacturer/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        } else {
          setProducts(defaultCatalog);
        }
      })
      .catch(() => setProducts(defaultCatalog));
  }, []);

  const handleRemoveFavorite = (prodId) => {
    const stringId = String(prodId);
    const updated = favorites.filter((id) => id !== stringId);
    setFavorites(updated);
    localStorage.setItem("vastra_customer_favorites", JSON.stringify(updated));
  };

  const favoriteProducts = products.filter((p) =>
    favorites.includes(String(p.id || p._id || p.code))
  );

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#A44747] ring-4 ring-[#A44747]/20" />
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
              Customer Portal
            </p>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
            Liked Handloom Weaves
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Your saved authentic silks, organic cottons, and artisan heritage pieces.
          </p>
        </div>

        {/* Success Alert */}
        {orderSuccess && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">Order Placed Successfully!</p>
                <p className="text-[11px] text-emerald-700">
                  The artisan workshop has received your request and will initiate loom setup.
                </p>
              </div>
            </div>
            <Link to="/customer/orders" className="text-xs font-bold text-emerald-800 underline">
              Track Order
            </Link>
          </div>
        )}

        {/* Wishlist Content */}
        {favoriteProducts.length > 0 ? (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold text-[#7A6D61]">
                <strong>{favoriteProducts.length}</strong> saved {favoriteProducts.length === 1 ? "weave" : "weaves"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteProducts.map((product) => {
                const pId = product.id || product._id || product.code;
                return (
                  <WishlistCard
                    key={pId}
                    product={product}
                    onRemove={handleRemoveFavorite}
                    onOrder={(p) => setSelectedProduct(p)}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-[#E5DCD0] bg-white p-12 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF0E1] text-[#A44747]">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-serif text-2xl font-bold text-[#4A1525]">
              No Liked Weaves Yet
            </h3>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-[#7A6D61]">
              Explore our curated handloom catalog of GI-tagged Kanchipuram silks, organic cottons, and master artisan creations. Tap the heart icon on any saree to save it here!
            </p>
            <button
              type="button"
              onClick={() => navigate("/customer")}
              className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-6 py-3 text-xs font-bold text-white shadow-md hover:opacity-95 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#FCDA8B]" />
              <span>Explore Handloom Catalog</span>
            </button>
          </div>
        )}

        {/* Order Modal */}
        {selectedProduct && (
          <OrderModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onSuccess={() => {
              setOrderSuccess(true);
              setTimeout(() => setOrderSuccess(false), 5000);
            }}
          />
        )}
      </main>
    </div>
  );
}

