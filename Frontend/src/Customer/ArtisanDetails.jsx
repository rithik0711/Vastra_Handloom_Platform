import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import ArtisanReviewsList from "./components/ArtisanReviewsList";
import ArtisanReviewModal from "./components/ArtisanReviewModal";
import ProductCard from "./components/ProductCard";
import OrderModal from "./components/OrderModal";
import {
  ChevronLeft,
  Award,
  MapPin,
  Star,
  ShieldCheck,
  Sparkles,
  Calendar,
  Layers,
  Phone,
  Mail,
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowRight
} from "lucide-react";

export default function ArtisanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artisan, setArtisan] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSuccessAlert, setReviewSuccessAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vastra_customer_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const defaultArtisan = {
    id: id || "MFR-01",
    name: "Kathar Weaves",
    businessName: "Kathar Weaves",
    artisanName: "Rithikeswaran M",
    ownerName: "Rithikeswaran M",
    location: "Coimbatore & Kanchipuram, Tamil Nadu",
    rating: 4.9,
    reviewsCount: 142,
    specialization: "Pure Mulberry Silk & Korvai Borders",
    experience: "15+ Years Generational Heritage",
    activeLooms: 18,
    artisanCount: 32,
    gstin: "33AABCK1234F1Z9",
    description:
      "Kathar Weaves is a traditional handloom manufacturer dedicated to preserving ancient weaving techniques while producing authentic pure silk and organic cotton sarees of peerless elegance. Led by Master Weaver Rithikeswaran M, the guild practices 3-shuttle Korvai border interlocking on traditional wooden pit looms with botanical dyed mulberry silk."
  };

  const defaultProducts = [
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
      origin: "Kanchipuram, TN",
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
      origin: "Coimbatore, TN",
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
      origin: "Tamil Nadu",
      tag: "Silk Mark Certified"
    }
  ];

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:5000/api/customer/manufacturers/${encodeURIComponent(id || "kathar")}`),
      fetch(`http://localhost:5000/api/customer/reviews?manufacturer=${encodeURIComponent(id || "Kathar Weaves")}`),
      fetch(`http://localhost:5000/api/manufacturer/products`)
    ])
      .then(async ([artisanRes, reviewsRes, productsRes]) => {
        const artisanJson = await artisanRes.json();
        const reviewsJson = await reviewsRes.json();
        const productsJson = await productsRes.json();

        if (artisanJson.status === "success" && artisanJson.data) {
          setArtisan(artisanJson.data);
          if (artisanJson.data.reviews && Array.isArray(artisanJson.data.reviews)) {
            setReviews(artisanJson.data.reviews);
          }
        } else {
          setArtisan(defaultArtisan);
        }

        if (reviewsJson.status === "success" && Array.isArray(reviewsJson.data)) {
          setReviews(reviewsJson.data);
        }

        if (productsJson.status === "success" && Array.isArray(productsJson.data)) {
          const matched = productsJson.data.filter(
            (p) =>
              (p.artisan && p.artisan.toLowerCase().includes((id || "kathar").toLowerCase())) ||
              (p.manufacturerId && p.manufacturerId.toLowerCase().includes((id || "kathar").toLowerCase()))
          );
          setArtisanProducts(matched.length > 0 ? matched : productsJson.data.slice(0, 3));
        } else {
          setArtisanProducts(defaultProducts);
        }
      })
      .catch(() => {
        setArtisan(defaultArtisan);
        setArtisanProducts(defaultProducts);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFavorite = (prodId) => {
    const stringId = String(prodId);
    let updated;
    if (favorites.includes(stringId)) {
      updated = favorites.filter((item) => item !== stringId);
    } else {
      updated = [...favorites, stringId];
    }
    setFavorites(updated);
    localStorage.setItem("vastra_customer_favorites", JSON.stringify(updated));
  };

  const handleReviewSubmitted = (newReview) => {
    if (newReview) {
      setReviews((prev) => [newReview, ...prev]);
      setReviewSuccessAlert(true);
      setTimeout(() => setReviewSuccessAlert(false), 5000);
    }
  };

  if (loading || !artisan) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
        <CustomerSidebar />
        <main className="manufacturer-main min-h-screen p-8 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="h-8 w-8 animate-spin text-[#4A1525] mx-auto" />
            <p className="mt-3 text-xs text-[#8F8175]">Loading Master Weaver profile & workshop metrics...</p>
          </div>
        </main>
      </div>
    );
  }

  const artisanName = artisan.artisanName || artisan.ownerName || "Rithikeswaran M";
  const guildName = artisan.name || artisan.businessName || "Kathar Weaves";

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/customer/manufacturers")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3.5 py-2 text-xs font-bold text-[#56493F] shadow-2xs hover:bg-[#FAF6F0] hover:text-[#4A1525] transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Master Weavers</span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/customer/booking?manufacturer=${encodeURIComponent(
                  guildName
                )}&artisanName=${encodeURIComponent(artisanName)}`
              )
            }
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FCDA8B]" />
            <span>Commission Custom Saree</span>
          </button>
        </div>

        {/* Review Success Alert */}
        {reviewSuccessAlert && (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">Review Submitted Successfully!</p>
                <p className="text-[11px] text-emerald-700">
                  Your feedback honoring Master Weaver <strong>{artisanName}</strong> has been saved and published.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Master Weaver Hero Banner */}
        <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#3D101E] via-[#5F192E] to-[#7D293E] p-6 sm:p-10 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[#D09229]/20 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#D09229] to-[#FCDA8B] font-serif text-3xl font-bold text-[#4A1525] shadow-xl border-2 border-white/30">
                {guildName.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Silk Mark & GI Tag Certified Master Guild
                </div>

                <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {guildName}
                </h1>
                <p className="text-sm font-medium text-white/90 mt-0.5">
                  Master Craftsman: <strong>{artisanName}</strong>
                </p>
                <p className="flex items-center gap-1 text-xs text-white/80 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-[#FCDA8B]" />
                  {artisan.location}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer backdrop-blur-xs"
              >
                <Star className="h-4 w-4 fill-[#FCDA8B] text-[#FCDA8B]" />
                <span>Write Weaver Feedback</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/customer/booking?manufacturer=${encodeURIComponent(
                      guildName
                    )}&artisanName=${encodeURIComponent(artisanName)}`
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#D09229] px-5 py-3 text-xs font-bold text-[#3B1502] shadow-md hover:bg-[#E5A43A] active:scale-95 transition cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#3B1502]" />
                <span>Book Dedicated Pit Loom</span>
              </button>
            </div>
          </div>
        </section>

        {/* Guild Lineage & Workshop Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Biography & Story (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#4A1525]">
                Generational Heritage & Artisan Bio
              </h2>
              <p className="text-xs leading-relaxed text-[#56493F]">
                {artisan.description || defaultArtisan.description}
              </p>

              {/* Specialities */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F8175] mb-2">
                  Specialized Weaving Techniques
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Korvai 3-Shuttle Border Interlocking",
                    "Pure Mulberry Silk (20/22 Denier)",
                    "Tested Half-Fine & 24k Gold Zari",
                    "Traditional Wooden Pit Looms",
                    "Botanical Eco-Friendly Dyes"
                  ].map((spec, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-[#E5DCD0] bg-[#FAF6F0] px-3 py-1 text-[11px] font-semibold text-[#4A1525]"
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ready-Made Sarees by This Artisan */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#4A1525]">
                  Creations Woven by {guildName}
                </h3>
                <span className="text-xs font-semibold text-[#8F8175]">
                  {artisanProducts.length} Authenticated Weaves
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {artisanProducts.map((p) => {
                  const pId = p.id || p._id || p.code;
                  return (
                    <ProductCard
                      key={pId}
                      product={p}
                      isFavorite={favorites.includes(String(pId))}
                      onToggleFavorite={toggleFavorite}
                      onQuickOrder={(item) => setSelectedProduct(item)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Reviews Section Attached to Artisan */}
            <ArtisanReviewsList
              reviews={reviews}
              artisanName={artisanName}
              onWriteReview={() => setIsReviewModalOpen(true)}
            />
          </div>

          {/* Workshop Quick Stats & Contact (1 Col) */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#4A1525]">
                Loom Workshop Capacity
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between rounded-2xl bg-[#FAF6F0] p-3 text-xs">
                  <span className="text-[#8F8175]">Active Looms:</span>
                  <span className="font-bold text-[#A16B16]">
                    {artisan.activeLooms || 18} Pit Looms Spinning
                  </span>
                </div>

                <div className="flex justify-between rounded-2xl bg-[#FAF6F0] p-3 text-xs">
                  <span className="text-[#8F8175]">Guild Artisans:</span>
                  <span className="font-bold text-[#292421]">
                    {artisan.artisanCount || 32} Master Weavers
                  </span>
                </div>

                <div className="flex justify-between rounded-2xl bg-[#FAF6F0] p-3 text-xs">
                  <span className="text-[#8F8175]">Experience:</span>
                  <span className="font-bold text-[#4A1525]">{artisan.experience}</span>
                </div>

                <div className="flex justify-between rounded-2xl bg-[#FAF6F0] p-3 text-xs">
                  <span className="text-[#8F8175]">Rating:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#D09229] text-[#D09229]" />
                    {artisan.rating || 4.9} / 5.0
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0E8DF]">
                <p className="text-[10px] uppercase font-bold text-[#8F8175] mb-1">
                  Workshop Hub Location
                </p>
                <p className="text-xs font-semibold text-[#292421]">{artisan.location}</p>
              </div>
            </div>

            {/* Custom Weave Commission Promo Card */}
            <div className="rounded-3xl border border-[#D9CBBF] bg-gradient-to-br from-[#FAF0E1] to-[#F5ECE0] p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#A16B16]">
                <Sparkles className="h-4 w-4" />
                <span>Bespoke Commission</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#4A1525]">
                Design Your Saree with {artisanName}
              </h4>
              <p className="text-xs leading-relaxed text-[#7A6D61]">
                Pick your custom motifs, zari count, border contrast, and wedding colors. Master Weaver {artisanName} will weave it specifically for your special occasion.
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/customer/booking?manufacturer=${encodeURIComponent(
                      guildName
                    )}&artisanName=${encodeURIComponent(artisanName)}`
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-3 text-xs font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
              >
                <span>Reserve Dedicated Loom Slot</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {isReviewModalOpen && (
          <ArtisanReviewModal
            reviewContext={{
              artisanName: artisanName,
              manufacturer: guildName
            }}
            onClose={() => setIsReviewModalOpen(false)}
            onSubmitSuccess={handleReviewSubmitted}
          />
        )}

        {/* Quick Order Modal */}
        {selectedProduct && (
          <OrderModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onSuccess={() => {
              setSelectedProduct(null);
              navigate("/customer/orders");
            }}
          />
        )}
      </main>
    </div>
  );
}

