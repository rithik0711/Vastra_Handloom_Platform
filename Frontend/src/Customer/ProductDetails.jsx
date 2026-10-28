import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate, Link } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import {
  ChevronLeft,
  Heart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Check,
  X,
  ArrowRight,
  Info,
  Ruler,
  Layers,
  Clock,
  Sparkle,
  QrCode,
  Copy,
  Download,
  Printer
} from "lucide-react";
import { formatWeaverName } from "./Dashboard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vastra_customer_favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchProductAndCatalog();
  }, [id]);

  const fetchProductAndCatalog = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer/products/${id}`);
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setProduct(json.data);
        setSelectedImage(json.data.image || "/images/kanchi.png");
      }

      const resList = await fetch(`${API_BASE_URL}/api/customer/products`);
      const jsonList = await resList.json();
      if (jsonList.status === "success" && Array.isArray(jsonList.data)) {
        setAllProducts(jsonList.data);
      }
    } catch (err) {
      console.warn("Product error:", err);
    } finally {
      setLoading(false);
    }
  };

  const userEmail = localStorage.getItem("userEmail") || "";

  const toggleFavorite = async (productId) => {
    const stringId = String(productId);
    let updated;
    if (favorites.includes(stringId)) {
      updated = favorites.filter((itemId) => itemId !== stringId);
    } else {
      updated = [...favorites, stringId];
    }
    setFavorites(updated);
    localStorage.setItem("vastra_customer_favorites", JSON.stringify(updated));

    if (userEmail && product) {
      try {
        await fetch(`${API_BASE_URL}/api/customer/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail: userEmail,
            productId: stringId,
            product
          })
        });
      } catch (err) {
        console.warn("Wishlist toggle error:", err);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyUid = (uid) => {
    if (!uid) return;
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
        <CustomerSidebar />
        <main className="min-h-screen pl-0 md:pl-[250px] flex items-center justify-center p-8">
          <p className="font-serif text-base font-bold text-[#4A1525]">Loading Saree Specifications...</p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
        <CustomerSidebar />
        <main className="min-h-screen pl-0 md:pl-[250px] flex flex-col items-center justify-center p-8">
          <p className="font-serif text-xl font-bold text-[#4A1525]">Product Not Found</p>
          <button
            type="button"
            onClick={() => navigate("/customer")}
            className="mt-4 rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white hover:bg-[#6A1F35]"
          >
            ← Back to Explore
          </button>
        </main>
      </div>
    );
  }

  const isFav = favorites.includes(String(product.id || product._id || product.code));
  const formattedPrice =
    typeof product.price === "number" ? product.price.toLocaleString("en-IN") : product.price;

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3.5 py-2 text-xs font-bold text-[#56493F] shadow-2xs hover:bg-[#FAF6F0] hover:text-[#4A1525] transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Collection</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D09229] bg-[#FAF0E1] px-3.5 py-2 text-xs font-bold text-[#A16B16] shadow-2xs hover:bg-[#F3E5D0] transition cursor-pointer"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>View QR Certificate</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3.5 py-2 text-xs font-bold text-[#56493F] shadow-2xs hover:bg-[#FAF6F0] transition cursor-pointer"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? "Copied!" : "Share Saree"}</span>
            </button>
          </div>
        </div>

        {/* Top Product Showcase Grid */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-sm">
              <img
                src={selectedImage || product.image || "/images/kanchi.png"}
                alt={product.name}
                className="h-[420px] w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/kanchi.png";
                }}
              />

              <button
                type="button"
                onClick={() => toggleFavorite(product.id || product._id || product.code)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition hover:bg-white active:scale-90 cursor-pointer"
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isFav ? "fill-[#A44747] text-[#A44747]" : "text-[#7A6D61]"
                  }`}
                />
              </button>

              <div className="absolute bottom-4 left-4 rounded-full bg-[#4A1525]/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D09229]" />
                <span>{product.tag || product.category || "Silk Mark Certified"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Saree Details & Ordering (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#FAF0E1] px-3 py-0.5 text-xs font-bold text-[#A16B16] border border-[#E5DCD0]">
                  {product.category}
                </span>
                
                {/* Unique ID Badge */}
                <button
                  type="button"
                  onClick={() => handleCopyUid(product.uniqueId || product.code)}
                  title="Click to copy Unique Product ID"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F6EDF1] px-3 py-0.5 text-xs font-mono font-bold text-[#4A1525] border border-[#E8DEC8] hover:bg-[#EFE2E7] transition cursor-pointer"
                >
                  <span>UID: {product.uniqueId || product.code}</span>
                  {copiedUid ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                </button>
              </div>

              <h1 className="font-serif text-3xl font-bold text-[#4A1525] sm:text-4xl">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <p className="font-serif text-3xl font-bold text-[#4A1525]">
                  ₹{formattedPrice}
                </p>
                <span className="text-xs text-[#7A6D61] font-medium">
                  Direct artisan price (Taxes & Silk Mark authentication included)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#5C534B] leading-relaxed border-t border-[#F0E8DF] pt-4">
                {product.description ||
                  "Handcrafted with pure mulberry silk and authentic gold zari brocade on traditional handlooms."}
              </p>

              {/* Master Weaver Link Card */}
              <div className="rounded-2xl border border-[#E5DCD0] bg-[#FAF8F4] p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">
                    Master Artisan Guild
                  </p>
                  <p className="font-serif text-sm font-bold text-[#4A1525]">
                    {formatWeaverName(product.artisanName || product.artisan || product.manufacturerId)}
                  </p>
                  <p className="text-[11px] text-[#7A6D61]">Origin: {product.origin || "Kanchipuram, Tamil Nadu"}</p>
                </div>
                <Link
                  to={`/customer/artisan/1`}
                  className="rounded-xl border border-[#E0D3C1] bg-white px-3 py-1.5 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8]"
                >
                  View Artisan ↗
                </Link>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-[#F0E8DF]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>Order Ready-Made Piece</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/customer/booking", { state: { selectedProduct: product } })}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#4A1525] bg-[#FAF3E8] py-3.5 text-xs font-bold text-[#4A1525] hover:bg-[#FAF0E1] cursor-pointer"
                >
                  <Sparkles size={16} className="text-[#D09229]" />
                  <span>Customize on Loom</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Authenticity & Specifications Showcase */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Technical Specs (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl border border-[#E5DCD0] bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[#4A1525]">Technical Textile Specifications</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                <p className="text-[10px] font-bold text-[#9B8068] uppercase">Fabric Composition</p>
                <p className="mt-1 font-semibold text-[#292421]">{product.fabric || "Pure Silk"}</p>
              </div>
              <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                <p className="text-[10px] font-bold text-[#9B8068] uppercase">Weaving Technique</p>
                <p className="mt-1 font-semibold text-[#292421]">{product.weave || "Korvai Handloom"}</p>
              </div>
              <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                <p className="text-[10px] font-bold text-[#9B8068] uppercase">Zari Metallic Grade</p>
                <p className="mt-1 font-semibold text-[#292421]">{product.zari || "Tested Gold Zari"}</p>
              </div>
              <div className="rounded-xl border border-[#EFE7DC] bg-[#FAF8F4] p-3">
                <p className="text-[10px] font-bold text-[#9B8068] uppercase">Standard Dimensions</p>
                <p className="mt-1 font-semibold text-[#292421]">{product.length || "6.3 Meters with Blouse"}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#EAF6ED] p-4 text-[#2E7D32] border border-[#C8E6C9]">
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <div>
                <p className="text-xs font-bold">Silk Mark & Geographical Indication (GI) Authenticated</p>
                <p className="text-[11px] text-[#2E7D32]/80 mt-0.5">
                  Each product carries an immutable unique identification tag and verifiable QR code generated at the loom.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Authentic QR Code Card (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs flex flex-col items-center justify-between text-center">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#A16B16]">
                <QrCode size={14} />
                <span>Authentic QR Tag</span>
              </div>
              <h3 className="mt-1 font-serif text-lg font-bold text-[#4A1525]">Scan to Verify Origin</h3>
            </div>

            <div
              onClick={() => setIsQrModalOpen(true)}
              className="group relative my-4 cursor-pointer rounded-2xl border border-dashed border-[#D9CBBF] bg-[#FAF8F4] p-4 shadow-2xs hover:shadow-md transition"
            >
              {product.qrCode ? (
                <img
                  src={product.qrCode}
                  alt="Product Authenticity QR"
                  className="h-36 w-36 rounded-xl border border-[#E5DCD0] bg-white p-2"
                />
              ) : (
                <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-white text-xs text-stone-400">
                  Loading QR...
                </div>
              )}
              <span className="absolute inset-x-2 bottom-2 rounded-lg bg-[#4A1525]/90 py-1 text-[10px] font-bold text-white opacity-0 backdrop-blur-xs transition group-hover:opacity-100">
                Click to Zoom
              </span>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] font-bold text-[#4A1525] bg-[#FAF0E1] py-1 px-2.5 rounded-lg border border-[#E8DEC8]">
                <span>{product.uniqueId || product.code}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="mt-3 w-full rounded-xl bg-[#4A1525] py-2 text-xs font-bold text-white hover:bg-[#6A1F35] transition cursor-pointer shadow-xs"
              >
                View Full Authenticity Tag
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Zoom Modal */}
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-2xl p-6 text-center animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3 mb-4">
                <div className="flex items-center gap-2 text-[#4A1525]">
                  <QrCode size={18} />
                  <h3 className="font-serif text-base font-bold">Artisan QR Certificate</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  className="rounded-lg p-1 text-[#8F8175] hover:bg-[#EAE0D4] hover:text-[#292421] transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {product.qrCode && (
                <img
                  src={product.qrCode}
                  alt="QR Code"
                  className="mx-auto h-48 w-48 rounded-2xl border border-[#E5DCD0] bg-[#FAF8F4] p-3 shadow-md"
                />
              )}

              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#FAF0E1] border border-[#E8DEC8] px-3 py-1.5">
                <span className="font-mono text-xs font-bold text-[#4A1525]">
                  UID: {product.uniqueId || product.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyUid(product.uniqueId || product.code)}
                  className="text-[#8F8175] hover:text-[#4A1525] cursor-pointer"
                >
                  {copiedUid ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="mt-3 text-xs text-[#7A6D61] space-y-1 text-left bg-[#FAF8F4] p-3 rounded-xl border border-[#EFE7DC]">
                <p><strong>Product:</strong> {product.name}</p>
                <p><strong>Craft:</strong> {product.fabric} ({product.weave})</p>
                <p><strong>Artisan Guild:</strong> {formatWeaverName(product.artisanName || product.artisan || product.manufacturerId)}</p>
                <p><strong>Verification:</strong> 100% Genuine Handloom Certified</p>
              </div>

              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="mt-4 w-full rounded-xl bg-[#4A1525] py-2.5 text-xs font-bold text-white hover:bg-[#6A1F35] cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        )}

        {/* Direct Order Modal */}
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#4A1525]">Confirm Direct Artisan Order</h3>
                <button type="button" onClick={() => setIsOrderModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-[#7A6D61]">
                Ordering <strong>{product.name}</strong> for ₹{formattedPrice}. Proceed to payment to complete order.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-bold text-[#7A6D61]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOrderModalOpen(false);
                    navigate("/customer/payment", {
                      state: {
                        isCustomBooking: false,
                        orderData: {
                          product: product.name,
                          price: product.price,
                          amount: `₹${formattedPrice}`,
                          manufacturer: formatWeaverName(product.artisanName || product.artisan || product.manufacturerId),
                          artisanName: formatWeaverName(product.artisanName || product.artisan || product.manufacturerId),
                          image: product.image || "/images/kanchi.png"
                        }
                      }
                    });
                  }}
                  className="rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white hover:bg-[#6A1F35]"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
