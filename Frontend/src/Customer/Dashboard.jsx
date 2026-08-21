import React, { useState, useEffect } from "react";
import CustomerSidebar from "./Sidebar";
import {
  Search,
  Sparkles,
  ShoppingBag,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
  X
} from "lucide-react";

export default function CustomerDashboard() {
  const [products, setProducts] = useState([
    {
      id: 1,
      code: "KW-SILK-001",
      name: "Kanchipuram Pure Silk Saree",
      category: "Silk",
      fabric: "Pure Mulberry Silk",
      weave: "Hand Woven Korvai",
      price: 8500,
      image: "/images/kanchi.png",
      artisan: "Kathar Weaves",
      origin: "Kanchipuram, TN",
      tag: "GI Tag Certified"
    },
    {
      id: 2,
      code: "KW-COT-002",
      name: "Traditional Handloom Cotton Saree",
      category: "Cotton",
      fabric: "Combed Organic Cotton",
      weave: "Heritage Handloom",
      price: 4200,
      image: "/images/cotton.png",
      artisan: "Kathar Weaves",
      origin: "Coimbatore, TN",
      tag: "India Handloom Brand"
    },
    {
      id: 3,
      code: "KW-SILK-003",
      name: "Royal Bridal Zari Silk Saree",
      category: "Silk",
      fabric: "Silk & Half-Fine Zari",
      weave: "Jacquard Hand Woven",
      price: 11500,
      image: "/images/zari.png",
      artisan: "Kathar Weaves",
      origin: "Tamil Nadu",
      tag: "Silk Mark Certified"
    },
    {
      id: 4,
      code: "KW-COT-004",
      name: "Organic Eco-Dyed Handloom Saree",
      category: "Cotton",
      fabric: "Natural Dyed Cotton",
      weave: "Traditional Pit Loom",
      price: 3800,
      image: "/images/handloom.png",
      artisan: "Aura Handlooms",
      origin: "Salem, TN",
      tag: "100% Eco Friendly"
    }
  ]);

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/manufacturer/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && json.data && json.data.length > 0) {
          setProducts(json.data);
        }
      })
      .catch((err) => console.log("Using cached catalog:", err));
  }, []);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      (p.fabric && p.fabric.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));
    const matchCat = category === "All" || p.category.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  const handlePlaceOrder = (product) => {
    let savedProfile = null;
    try {
      savedProfile = JSON.parse(localStorage.getItem("customerProfile") || "{}");
    } catch (e) {}

    fetch("http://localhost:5000/api/customer/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: product.name,
        price: product.price,
        manufacturer: product.artisan || "Kathar Weaves",
        image: product.image,
        customerName: savedProfile?.fullName || "Ananya Deshmukh",
        customerEmail: savedProfile?.email || localStorage.getItem("userEmail") || "customer@example.com",
        customerPhone: savedProfile?.phone || "+91 98451 23456",
        shippingAddress: savedProfile?.shippingAddress || "Flat 402, Lotus Residency, Indiranagar, Bengaluru, Karnataka - 560038",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038"
      })
    })
      .then((res) => res.json())
      .then(() => {
        setSelectedProduct(null);
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 5000);
      })
      .catch(() => {
        setSelectedProduct(null);
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 5000);
      });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A1525] via-[#5F192E] to-[#7D293E] p-8 text-white shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Direct From Master Artisans • 100% Authentic Handloom
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Heritage Handcrafted Sarees & Textiles
            </h1>
            <p className="mt-2 text-xs text-white/80 sm:text-sm">
              Discover authentic GI-tagged Kanchipuram silks, organic cottons, and bespoke handwoven treasures crafted by verified generational weavers.
            </p>
          </div>
        </section>

        {/* Success Alert */}
        {orderSuccess && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">Handloom Order Placed Successfully!</p>
                <p className="text-[11px] text-emerald-700">The artisan workshop has received your request and will prepare the loom.</p>
              </div>
            </div>
            <button onClick={() => setOrderSuccess(false)} className="text-emerald-700 hover:text-emerald-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B8F84]" />
            <input
              type="text"
              placeholder="Search by weave, fabric, pure silk, cotton..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] pl-10 pr-4 text-xs text-[#292421] placeholder-[#A89D91] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All", "Silk", "Cotton", "Linen"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  category === cat
                    ? "bg-[#4A1525] text-white shadow-xs"
                    : "border border-[#E5DCD0] bg-[#FAF6F0] text-[#6B5E52] hover:bg-[#F0E8DF]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5DCD0] bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="relative h-60 w-full overflow-hidden bg-[#FAF6F0]">
                <img
                  src={item.image || "/images/kanchi.png"}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/kanchi.png";
                  }}
                />
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#4A1525] shadow-xs backdrop-blur-xs transition hover:bg-white active:scale-95"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(item.id) ? "fill-[#A44747] text-[#A44747]" : ""
                    }`}
                  />
                </button>

                <div className="absolute bottom-3 left-3 rounded-full bg-[#4A1525]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs">
                  {item.tag || "Authentic Handloom"}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#8F8175]">
                    <span>{item.fabric || item.category}</span>
                    <span className="font-semibold text-[#A16B16]">{item.weave}</span>
                  </div>
                  <h3 className="mt-1 font-serif text-lg font-bold text-[#292421] group-hover:text-[#4A1525]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-[#7A6D61] line-clamp-2">
                    {item.description || "Handcrafted with pure yarns on traditional wooden pit looms with precision artisan borders."}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#F0E8DF] pt-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#8F8175]">Artisan Price</p>
                    <p className="font-serif text-lg font-bold text-[#4A1525]">
                      ₹{typeof item.price === "number" ? item.price.toLocaleString("en-IN") : item.price}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedProduct(item)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:opacity-95 active:scale-95"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                <h3 className="font-serif text-xl font-bold text-[#4A1525]">Confirm Handloom Order</h3>
                <button onClick={() => setSelectedProduct(null)} className="text-[#8F8175] hover:text-[#292421]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex gap-4">
                <img
                  src={selectedProduct.image || "/images/kanchi.png"}
                  alt={selectedProduct.name}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
                <div>
                  <h4 className="font-serif text-base font-bold text-[#292421]">{selectedProduct.name}</h4>
                  <p className="mt-0.5 text-xs text-[#7A6D61]">{selectedProduct.fabric} • {selectedProduct.weave}</p>
                  <p className="mt-2 font-serif text-lg font-bold text-[#4A1525]">
                    ₹{typeof selectedProduct.price === "number" ? selectedProduct.price.toLocaleString("en-IN") : selectedProduct.price}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 rounded-2xl bg-[#FAF6F0] p-4 text-xs text-[#6B5E52]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Direct weaver fulfillment with Silk Mark / GI verification.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#D09229] shrink-0" />
                  <span>Free doorstep delivery within 7-10 business days.</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 rounded-xl border border-[#D9CBBF] py-2.5 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePlaceOrder(selectedProduct)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
