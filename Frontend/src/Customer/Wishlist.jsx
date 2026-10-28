import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import { Heart, Sparkles, ShoppingBag, ArrowRight, CheckCircle2, Trash2, X, Eye, Tag } from "lucide-react";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("userEmail") || "";
  const customerId = localStorage.getItem("customerId") || localStorage.getItem("userId") || userEmail;

  useEffect(() => {
    fetchWishlistAndDetails();
  }, [userEmail, customerId]);

  const fetchWishlistAndDetails = async () => {
    setLoading(true);
    try {
      const activeId = customerId || userEmail;
      if (!activeId) {
        setWishlistItems([]);
        return;
      }
      const res = await fetch(
        `${API_BASE_URL}/api/customer/wishlist?customerId=${encodeURIComponent(activeId)}&customerEmail=${encodeURIComponent(userEmail)}`
      );
      const json = await res.json();
      if (json.status === "success" && Array.isArray(json.data)) {
        // Enrich items by fetching live product details by ID where available
        const enrichedItems = await Promise.all(
          json.data.map(async (item) => {
            const pId = item.productId || item.code || item._id;
            try {
              const prodRes = await fetch(`${API_BASE_URL}/api/customer/products/${pId}`);
              const prodJson = await prodRes.json();
              if (prodJson.status === "success" && prodJson.data) {
                return { ...item, ...prodJson.data, productId: pId, _id: item._id };
              }
            } catch {}
            return item;
          })
        );

        setWishlistItems(enrichedItems);
        const ids = enrichedItems.map((item) => String(item.productId || item.code || item._id));
        localStorage.setItem("vastra_customer_favorites", JSON.stringify(ids));
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.warn("Wishlist fetch error:", err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWishlist = async (prodId) => {
    try {
      const activeId = customerId || userEmail;
      await fetch(
        `${API_BASE_URL}/api/customer/wishlist/${encodeURIComponent(prodId)}?customerId=${encodeURIComponent(activeId)}&customerEmail=${encodeURIComponent(userEmail)}`,
        { method: "DELETE" }
      );
      const updated = wishlistItems.filter(
        (item) =>
          String(item.productId) !== String(prodId) &&
          String(item.code) !== String(prodId) &&
          String(item._id) !== String(prodId)
      );
      setWishlistItems(updated);
      const ids = updated.map((item) => String(item.productId || item.code || item._id));
      localStorage.setItem("vastra_customer_favorites", JSON.stringify(ids));
    } catch (err) {
      console.warn("Remove wishlist error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
              Saved Sarees & Patron Wishlist Collection
            </p>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
            My Liked Products ({wishlistItems.length})
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Handcrafted sarees saved in your personal Wishlist collection, fetched by ID directly from master weaver looms.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 text-center">
            <p className="font-serif text-base font-bold text-[#4A1525]">Loading Liked Products Collection...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-[#D8CCBD] bg-white/70 p-12 text-center">
            <Heart className="mx-auto h-12 w-12 text-[#D09229]" />
            <h2 className="mt-3 font-serif text-xl font-bold text-[#4A1525]">Your Wishlist Collection is Empty</h2>
            <p className="mt-1 text-xs text-[#7A6D61]">
              Explore authentic handloom sarees and tap the heart icon on any piece to store it in your Wishlist collection.
            </p>
            <button
              type="button"
              onClick={() => navigate("/customer")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4A1525] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#6A1F35]"
            >
              <span>Explore Saree Collection</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((p) => {
              const pId = p.productId || p.code || p._id || p.id;
              const priceNum = typeof p.price === "number" ? p.price : Number(p.price) || 0;
              const formattedPrice = `₹${priceNum.toLocaleString("en-IN")}`;

              return (
                <div key={p._id || pId} className="rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-[#FAF8F4]">
                      <img src={p.image || "/images/kanchi.png"} alt={p.name} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveWishlist(pId)}
                        className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-700 shadow-xs hover:bg-white transition cursor-pointer"
                        title="Remove from Wishlist collection"
                      >
                        <Trash2 size={14} />
                      </button>
                      <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#4A1525]/90 px-2.5 py-0.5 text-[9px] font-bold text-[#FCDA8B]">
                        {p.tag || "Silk Mark Certified"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#A16B16]">
                        {p.category || "Silk"} • {p.weave || "Hand Woven"}
                      </span>
                      <span className="rounded-md bg-[#FAF8F4] border border-[#EFE7DC] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#8A7A6D]">
                        ID: #{p.code || String(pId).slice(-6)}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-[#4A1525] truncate mt-1">{p.name}</h3>
                    {p.artisanName && (
                      <p className="text-[11px] text-[#7A6D61] mt-0.5">Weaver: <strong>{p.artisanName}</strong></p>
                    )}
                    <p className="text-sm font-bold text-[#4A1525] mt-1.5">{formattedPrice}</p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#F0E8DF] pt-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/customer/products/${pId}`)}
                      className="rounded-xl border border-[#E0D3C1] py-2 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8] transition text-center"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/customer/payment", {
                          state: {
                            isCustomBooking: false,
                            orderData: {
                              product: p.name,
                              price: priceNum,
                              amount: formattedPrice,
                              manufacturer: p.artisan || p.manufacturerId || "Kathar Weaves",
                              artisanName: p.artisanName || "Master Weaver",
                              image: p.image || "/images/kanchi.png"
                            }
                          }
                        })
                      }
                      className="rounded-xl bg-[#4A1525] py-2 text-xs font-bold text-white hover:bg-[#6A1F35] transition text-center"
                    >
                      Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
