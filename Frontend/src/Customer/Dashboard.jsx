import React, { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import RAG from "../Manufacturer/RAG";
import {
  Sparkles,
  ShoppingBag,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
  X,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  Check,
  Lock,
  Truck,
  QrCode,
  Copy
} from "lucide-react";

// Helper to format weaver name into a clean, human-readable name instead of an email or raw slug
export const formatWeaverName = (val) => {
  if (!val) return "Kathar Weaves";
  const s = String(val).trim();
  if (!s.includes("@") && !s.includes("_")) return s;
  const sLower = s.toLowerCase();
  if (sLower.includes("rithik") || sLower.includes("kathar")) return "Kathar Weaves";
  if (sLower.includes("lakshmi") || sLower.includes("arun")) return "Sri Lakshmi Handlooms";
  if (sLower.includes("annapoorna") || sLower.includes("meenakshi")) return "Annapoorna Weaves";
  if (sLower.includes("kerala") || sLower.includes("suresh")) return "Kerala Loom Crafts";
  if (s.includes("@")) {
    const user = s.split("@")[0];
    return (
      user
        .replace(/[._-]/g, " ")
        .replace(/\d+/g, "")
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ") || "Master Weaver"
    );
  }
  if (s.includes("_") || s.includes("-")) {
    return s
      .replace(/[_-]/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }
  return s;
};

// --- Inlined Sub-Component: OrderModal ---
function OrderModal({ product, onClose }) {
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  const [formData, setFormData] = useState({
    customerName: userName,
    customerEmail: userEmail,
    customerPhone: "",
    shippingAddress: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    if (userEmail) {
      fetch(`${API_BASE_URL}/api/customer/profile?email=${encodeURIComponent(userEmail)}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.status === "success" && j.data) {
            setFormData((prev) => ({
              ...prev,
              customerName: j.data.fullName || prev.customerName,
              customerEmail: j.data.email || userEmail,
              customerPhone: j.data.phone || prev.customerPhone,
              shippingAddress: j.data.deliveryAddress || prev.shippingAddress,
              city: j.data.city || prev.city,
              pincode: j.data.pincode || prev.pincode
            }));
          }
        })
        .catch(() => {});
    }
  }, [userEmail]);

  if (!product) return null;

  const priceNumber =
    typeof product.price === "number"
      ? product.price
      : Number(String(product.price).replace(/[^0-9.]/g, "")) || 8500;

  const formattedPrice = priceNumber.toLocaleString("en-IN");

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    onClose();
    navigate("/customer/payment", {
      state: {
        isCustomBooking: false,
        orderData: {
          product: product.name,
          price: priceNumber,
          amount: `₹${formattedPrice}`,
          manufacturer: formatWeaverName(product.artisanName || product.artisan || product.manufacturerId),
          artisanName: formatWeaverName(product.artisanName || product.artisan || product.manufacturerId),
          image: product.image,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingAddress: formData.shippingAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F0E8DF] bg-[#FAF6F0] px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#4A1525]" />
            <h3 className="font-serif text-xl font-bold text-[#4A1525]">Direct Artisan Order</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#8F8175] hover:bg-[#EAE0D4] hover:text-[#292421] transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-4 p-6 border-b border-[#F0E8DF]">
          <img
            src={product.image || "/images/kanchi.png"}
            alt={product.name}
            className="h-20 w-20 rounded-2xl object-cover border border-[#E5DCD0]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/kanchi.png";
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A16B16]">
              {product.category} • {product.weave}
            </span>
            <h4 className="font-serif text-base font-bold text-[#292421] truncate">{product.name}</h4>
            <p className="text-xs text-[#7A6D61] mt-0.5">
              Woven by <strong>{formatWeaverName(product.artisanName || product.artisan || product.manufacturerId)}</strong>
            </p>
            <p className="mt-1 font-serif text-lg font-bold text-[#4A1525]">₹{formattedPrice}</p>
          </div>
        </div>

        <form onSubmit={handleProceedToPayment} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#4A1525]">Recipient Name</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#4A1525]">Phone Number</label>
              <input
                type="text"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#4A1525]">Delivery Address</label>
            <textarea
              rows={2}
              required
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#FAF0E1] p-3 text-xs text-[#4A1525] font-semibold">
            <span>Total Payable Now:</span>
            <span className="font-serif text-base font-bold">₹{formattedPrice}</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#D9CBBF] bg-white px-4 py-2 text-xs font-bold text-[#7A6D61] hover:bg-[#FAF6F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#6A1F35]"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Inlined Sub-Component: ProductCard ---
function ProductCard({ product, isFavorite, onToggleFavorite, onQuickOrder, onViewQr }) {
  const navigate = useNavigate();
  const formattedPrice =
    typeof product.price === "number" ? product.price.toLocaleString("en-IN") : product.price || "0";
  const productId = product.id || product._id || product.code;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5DCD0] bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg">
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

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(productId);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#4A1525] shadow-xs backdrop-blur-xs transition hover:bg-white active:scale-90 cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite ? "fill-[#A44747] text-[#A44747]" : "text-[#7A6D61]"
            }`}
          />
        </button>

        <div className="absolute bottom-3 left-3 rounded-full bg-[#4A1525]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#D09229]" />
          <span>{product.tag || product.category || "Authentic Handloom"}</span>
        </div>

        {/* QR Code Quick View Button on Image */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewQr?.(product);
          }}
          title="View Authenticity QR Code"
          className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#4A1525] shadow-xs backdrop-blur-xs transition hover:bg-white hover:scale-105 cursor-pointer"
        >
          <QrCode className="h-3 w-3 text-[#D09229]" />
          <span>QR Tag</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/customer/products/${productId}`)}
          className="absolute inset-x-4 bottom-12 hidden md:flex items-center justify-center gap-1.5 rounded-xl bg-white/95 py-2 text-xs font-bold text-[#4A1525] shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View Full Specifications</span>
        </button>
      </div>

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

          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-[#8F8175]">
              Weaver: <strong className="text-[#4A1525]">{formatWeaverName(product.artisanName || product.artisan || product.manufacturerId)}</strong>
            </span>
            <span className="font-mono text-[10px] font-bold text-[#A16B16] bg-[#FAF0E1] px-1.5 py-0.5 rounded border border-[#E8DEC8]">
              {product.uniqueId ? product.uniqueId.slice(0, 12) + "..." : product.code}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#F0E8DF] pt-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#8F8175]">Artisan Direct Price</p>
            <p className="font-serif text-lg font-bold text-[#4A1525]">₹{formattedPrice}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onViewQr?.(product)}
              className="flex items-center justify-center h-8 w-8 rounded-xl border border-[#D09229] bg-[#FAF0E1] text-[#A16B16] transition hover:bg-[#F3E5D0] cursor-pointer"
              title="View QR Code & Authenticity"
            >
              <QrCode className="h-4 w-4" />
            </button>

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

// --- Main Customer Dashboard Component ---
export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQrProduct, setSelectedQrProduct] = useState(null);
  const [copiedUid, setCopiedUid] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vastra_customer_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const userEmail = localStorage.getItem("userEmail") || "";

  const handleCopyUid = (uid) => {
    if (!uid) return;
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  useEffect(() => {
    fetchProducts();
    if (userEmail) {
      fetch(`${API_BASE_URL}/api/customer/wishlist?customerEmail=${encodeURIComponent(userEmail)}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.status === "success" && Array.isArray(j.data)) {
            const ids = j.data.map((item) => String(item.productId));
            setFavorites(ids);
            localStorage.setItem("vastra_customer_favorites", JSON.stringify(ids));
          }
        })
        .catch(() => {});
    }
  }, [userEmail]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer/products`);
      const json = await res.json();
      if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
        setProducts(json.data);
      }
    } catch (err) {
      console.warn("Products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId) => {
    const stringId = String(productId);
    const prodObj = products.find((p) => String(p.id || p._id || p.code) === stringId);

    let updated;
    if (favorites.includes(stringId)) {
      updated = favorites.filter((id) => id !== stringId);
    } else {
      updated = [...favorites, stringId];
    }
    setFavorites(updated);
    localStorage.setItem("vastra_customer_favorites", JSON.stringify(updated));

    if (userEmail) {
      try {
        await fetch(`${API_BASE_URL}/api/customer/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail: userEmail,
            productId: stringId,
            product: prodObj
          })
        });
      } catch (err) {
        console.warn("Wishlist persist error:", err);
      }
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        const q = search.toLowerCase().trim();
        const matchesSearch =
          !q ||
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.artisan && p.artisan.toLowerCase().includes(q));

        const matchesCat =
          category === "All" ||
          (p.category && p.category.toLowerCase() === category.toLowerCase()) ||
          (p.fabric && p.fabric.toLowerCase().includes(category.toLowerCase()));

        const priceNum = typeof p.price === "number" ? p.price : Number(p.price) || 0;
        let matchesPrice = true;
        if (priceRange === "under-5k") matchesPrice = priceNum < 5000;
        else if (priceRange === "5k-10k") matchesPrice = priceNum >= 5000 && priceNum <= 10000;
        else if (priceRange === "10k-20k") matchesPrice = priceNum > 10000 && priceNum <= 20000;
        else if (priceRange === "above-20k") matchesPrice = priceNum > 20000;

        return matchesSearch && matchesCat && matchesPrice;
      })
      .sort((a, b) => {
        const pA = typeof a.price === "number" ? a.price : Number(a.price) || 0;
        const pB = typeof b.price === "number" ? b.price : Number(b.price) || 0;
        if (sortBy === "price-low") return pA - pB;
        if (sortBy === "price-high") return pB - pA;
        if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
        return 0;
      });
  }, [products, search, category, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-[#E5DCD0] bg-gradient-to-r from-[#4A1525] via-[#6A1F35] to-[#7A263B] p-6 sm:p-8 text-white shadow-md">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-[#FCDA8B] backdrop-blur-xs border border-[#FCDA8B]/30">
              <Sparkles className="h-3.5 w-3.5 text-[#D09229]" />
              Authentic Handloom Patron Marketplace
            </span>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Direct from India's Master Handloom Weavers
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
              Explore Silk Mark certified handloom sarees woven on traditional wooden pit looms with authentic GI certification.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 rounded-2xl border border-[#eadfd2] bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5A695]" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search handlooms by fabric, weave, artisan, motif..."
                className="w-full rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] py-2 pl-10 pr-4 text-xs font-semibold text-[#4A1525] placeholder:text-[#B5A695] focus:border-[#D09229] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] px-3 py-2 text-xs font-semibold text-[#4A1525] focus:border-[#D09229] focus:outline-hidden"
              >
                <option value="All">Category: All</option>
                <option value="Silk">Silk Sarees</option>
                <option value="Cotton">Cotton Sarees</option>
                <option value="Linen">Linen</option>
                <option value="Tussar">Tussar Silk</option>
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] px-3 py-2 text-xs font-semibold text-[#4A1525] focus:border-[#D09229] focus:outline-hidden"
              >
                <option value="all">Price: All</option>
                <option value="under-5k">Under ₹5,000</option>
                <option value="5k-10k">₹5,000 - ₹10,000</option>
                <option value="10k-20k">₹10,000 - ₹20,000</option>
                <option value="above-20k">Above ₹20,000</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-[#E0D3C1] bg-[#FAF8F4] px-3 py-2 text-xs font-semibold text-[#4A1525] focus:border-[#D09229] focus:outline-hidden"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#4A1525]">
              Handcrafted Collection ({filteredAndSortedProducts.length})
            </h2>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-[#D8CCBD] bg-white/70 p-12 text-center">
              <p className="font-serif text-lg font-bold text-[#4A1525]">No Handloom Products Found</p>
              <p className="text-xs text-[#7A6D61] mt-1">Try resetting your search query or filter categories.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedProducts.map((prod) => (
                <ProductCard
                  key={prod.id || prod._id || prod.code}
                  product={prod}
                  isFavorite={favorites.includes(String(prod.id || prod._id || prod.code))}
                  onToggleFavorite={toggleFavorite}
                  onQuickOrder={setSelectedProduct}
                  onViewQr={setSelectedQrProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedProduct && (
          <OrderModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {/* Customer QR Authenticity Modal */}
        {selectedQrProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-2xl p-6 text-center animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3 mb-4">
                <div className="flex items-center gap-2 text-[#4A1525]">
                  <QrCode size={18} />
                  <h3 className="font-serif text-base font-bold">Authenticity Certificate</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedQrProduct(null)}
                  className="rounded-lg p-1 text-[#8F8175] hover:bg-[#EAE0D4] hover:text-[#292421] transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {selectedQrProduct.qrCode && (
                <img
                  src={selectedQrProduct.qrCode}
                  alt="Product Authenticity QR"
                  className="mx-auto h-48 w-48 rounded-2xl border border-[#E5DCD0] bg-[#FAF8F4] p-3 shadow-md"
                />
              )}

              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#FAF0E1] border border-[#E8DEC8] px-3 py-1.5">
                <span className="font-mono text-xs font-bold text-[#4A1525]">
                  UID: {selectedQrProduct.uniqueId || selectedQrProduct.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyUid(selectedQrProduct.uniqueId || selectedQrProduct.code)}
                  className="text-[#8F8175] hover:text-[#4A1525] cursor-pointer"
                  title="Copy Unique ID"
                >
                  {copiedUid ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="mt-3 text-xs text-[#7A6D61] space-y-1 text-left bg-[#FAF8F4] p-3 rounded-xl border border-[#EFE7DC]">
                <p><strong>Saree:</strong> {selectedQrProduct.name}</p>
                <p><strong>Craft:</strong> {selectedQrProduct.category} • {selectedQrProduct.weave}</p>
                <p><strong>Artisan:</strong> {formatWeaverName(selectedQrProduct.artisanName || selectedQrProduct.artisan || selectedQrProduct.manufacturerId)}</p>
                <p className="text-emerald-700 font-semibold">✓ 100% Authentic Handloom Verified</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQrProduct(null)}
                className="mt-4 w-full rounded-xl bg-[#4A1525] py-2.5 text-xs font-bold text-white hover:bg-[#6A1F35] cursor-pointer shadow-xs"
              >
                Close Tag
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Vastra Handloom AI ChatBot Assistant */}
      <RAG role="customer" />
    </div>
  );
}
