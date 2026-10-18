import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
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
  ArrowRight,
  X,
  Heart,
  Eye,
  Image as ImageIcon,
  User,
  SlidersHorizontal,
  Search,
  Filter
} from "lucide-react";

export default function ArtisanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTabParam = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(activeTabParam); // "profile" | "gallery" | "products"

  const [artisan, setArtisan] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState(null);
  const [galleryCategory, setGalleryCategory] = useState("All");

  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    craftsmanshipRating: 5,
    communicationRating: 5,
    comment: ""
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vastra_customer_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  useEffect(() => {
    fetchArtisanAllData();
  }, [id]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  const fetchArtisanAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Artisan Profile
      const resArt = await fetch(`http://localhost:5000/api/customer/manufacturers/${id || "kathar_weaves"}`);
      const jsonArt = await resArt.json();
      let artisanData = null;
      if (jsonArt.status === "success" && jsonArt.data) {
        artisanData = jsonArt.data;
        setArtisan(jsonArt.data);
      }

      const mfrName = artisanData?.name || artisanData?.businessName || id || "Kathar Weaves";

      // 2. Fetch Manufacturer's Own Products
      const resProd = await fetch(
        `http://localhost:5000/api/customer/products?manufacturerId=${encodeURIComponent(mfrName)}`
      );
      const jsonProd = await resProd.json();
      if (jsonProd.status === "success" && Array.isArray(jsonProd.data)) {
        if (jsonProd.data.length > 0) {
          setArtisanProducts(jsonProd.data);
        } else {
          // Fallback to all products if specific manufacturer has none yet
          const allRes = await fetch("http://localhost:5000/api/customer/products");
          const allJson = await allRes.json();
          if (allJson.status === "success" && Array.isArray(allJson.data)) {
            setArtisanProducts(allJson.data);
          }
        }
      }

      // 3. Fetch Manufacturer Gallery
      const resGal = await fetch(
        `http://localhost:5000/api/manufacturer/gallery?manufacturerId=${encodeURIComponent(mfrName)}`
      );
      const jsonGal = await resGal.json();
      if (jsonGal.status === "success" && Array.isArray(jsonGal.data) && jsonGal.data.length > 0) {
        setGalleryItems(jsonGal.data);
      } else {
        const allGal = await fetch("http://localhost:5000/api/manufacturer/gallery");
        const allGalJson = await allGal.json();
        if (allGalJson.status === "success" && Array.isArray(allGalJson.data)) {
          setGalleryItems(allGalJson.data);
        }
      }

      // 4. Fetch Reviews
      const resRev = await fetch(`http://localhost:5000/api/customer/reviews?manufacturer=${encodeURIComponent(mfrName)}`);
      const jsonRev = await resRev.json();
      if (jsonRev.status === "success" && Array.isArray(jsonRev.data)) {
        setReviews(jsonRev.data);
      }
    } catch (err) {
      console.warn("Artisan full data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/api/customer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisanName: artisan?.artisanName || artisan?.ownerName || "Master Weaver",
          manufacturer: artisan?.name || artisan?.businessName || "Handloom Guild",
          customerName: userName || "Patron",
          customerEmail: userEmail,
          rating: reviewFormData.rating,
          craftsmanshipRating: reviewFormData.craftsmanshipRating,
          communicationRating: reviewFormData.communicationRating,
          comment: reviewFormData.comment,
          verifiedPurchase: true
        })
      });
      setIsReviewModalOpen(false);
      setReviewFormData({ rating: 5, craftsmanshipRating: 5, communicationRating: 5, comment: "" });
      fetchArtisanAllData();
    } catch (err) {
      setIsReviewModalOpen(false);
    }
  };

  const toggleFavorite = (productId) => {
    const stringId = String(productId);
    let updated;
    if (favorites.includes(stringId)) {
      updated = favorites.filter((item) => item !== stringId);
    } else {
      updated = [...favorites, stringId];
    }
    setFavorites(updated);
    localStorage.setItem("vastra_customer_favorites", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
        <CustomerSidebar />
        <main className="customer-main min-h-screen flex items-center justify-center p-8">
          <p className="font-serif text-base font-bold text-[#4A1525]">Loading Master Weaver Guild...</p>
        </main>
      </div>
    );
  }

  const art = artisan || {
    name: "Master Handloom Guild",
    artisanName: "Master Weaver",
    location: "Tamil Nadu, India",
    rating: 4.9,
    experience: "Generational Heritage",
    activeLooms: 18,
    specialization: "Pure Silk & Korvai Brocade",
    description: "Preserving ancient pit-loom handloom weaving techniques with certified Silk Mark pure mulberry silks."
  };

  const filteredGallery = galleryItems.filter((item) => {
    if (galleryCategory === "All") return true;
    return item.category?.toLowerCase() === galleryCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/customer/manufacturers")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3.5 py-2 text-xs font-bold text-[#56493F] shadow-2xs hover:bg-[#FAF6F0]"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>All Master Weavers</span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/customer/booking", {
                state: { initialManufacturer: art.name, initialArtisan: art.artisanName }
              })
            }
            className="rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#6A1F35] transition"
          >
            Book Loom Slot with {art.artisanName || art.name}
          </button>
        </div>

        {/* Hero Guild Header */}
        <div className="mt-6 rounded-3xl border border-[#E5DCD0] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={art.image || "/images/kathar.png"}
                alt={art.name}
                className="h-24 w-24 rounded-2xl object-cover border border-[#E5DCD0] shadow-xs"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/kathar.png";
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1525]">{art.name}</h1>
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-xs font-semibold text-[#8F8175] mt-0.5">
                  Lead Master Craftsman: <strong>{art.artisanName || art.ownerName}</strong>
                </p>
                <p className="text-xs text-[#7A6D61] flex items-center gap-1 mt-1">
                  <MapPin size={13} className="text-[#D09229]" />
                  <span>{art.location}</span>
                  <span className="mx-1">•</span>
                  <span>{art.experience}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#FAF0E1] px-4 py-2.5 text-center border border-[#EFE4D6]">
                <div className="flex items-center justify-center gap-1 text-[#A16B16] font-bold text-sm">
                  <Star size={14} className="fill-[#A16B16]" />
                  <span>{art.rating || 4.9}</span>
                </div>
                <p className="text-[10px] text-[#8F8175] mt-0.5">Patron Rating</p>
              </div>

              <div className="rounded-2xl bg-[#FAF8F4] px-4 py-2.5 text-center border border-[#EFE7DC]">
                <p className="font-serif text-base font-bold text-[#4A1525]">{art.activeLooms || 18}</p>
                <p className="text-[10px] text-[#8F8175] mt-0.5">Active Pit Looms</p>
              </div>
            </div>
          </div>

          {/* Master Weaving Multi-View Navigation Tabs */}
          <div className="mt-8 flex items-center gap-2 border-t border-[#F0E8DF] pt-4">
            <button
              type="button"
              onClick={() => handleTabChange("profile")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#4A1525] text-white shadow-xs"
                  : "bg-[#FAF8F4] text-[#6B5E52] hover:bg-[#F3ECE3]"
              }`}
            >
              <Award size={15} />
              <span>Guild Profile & Heritage</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("gallery")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-[#4A1525] text-white shadow-xs"
                  : "bg-[#FAF8F4] text-[#6B5E52] hover:bg-[#F3ECE3]"
              }`}
            >
              <ImageIcon size={15} />
              <span>Loom & Workshop Gallery ({galleryItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("products")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === "products"
                  ? "bg-[#4A1525] text-white shadow-xs"
                  : "bg-[#FAF8F4] text-[#6B5E52] hover:bg-[#F3ECE3]"
              }`}
            >
              <ShoppingBag size={15} />
              <span>Guild Products & Sarees ({artisanProducts.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: GUILD PROFILE & HERITAGE */}
        {activeTab === "profile" && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-200">
            {/* Bio & Credentials */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#4A1525]">Artisan Guild Story & Heritage</h2>
                <p className="mt-3 text-xs sm:text-sm text-[#5C534B] leading-relaxed">
                  {art.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-[#F0E8DF]">
                <div className="rounded-xl bg-[#FAF8F4] border border-[#EFE7DC] p-3.5 text-center">
                  <p className="text-[10px] uppercase font-bold text-[#9B8068]">Generational Legacy</p>
                  <p className="font-serif text-base font-bold text-[#4A1525] mt-0.5">{art.experience}</p>
                </div>
                <div className="rounded-xl bg-[#FAF8F4] border border-[#EFE7DC] p-3.5 text-center">
                  <p className="text-[10px] uppercase font-bold text-[#9B8068]">Specialization</p>
                  <p className="font-serif text-sm font-bold text-[#4A1525] mt-0.5">{art.specialization}</p>
                </div>
                <div className="rounded-xl bg-[#FAF8F4] border border-[#EFE7DC] p-3.5 text-center">
                  <p className="text-[10px] uppercase font-bold text-[#9B8068]">Active Pit Looms</p>
                  <p className="font-serif text-base font-bold text-[#4A1525] mt-0.5">{art.activeLooms || 18} Looms</p>
                </div>
                <div className="rounded-xl bg-[#FAF8F4] border border-[#EFE7DC] p-3.5 text-center">
                  <p className="text-[10px] uppercase font-bold text-[#9B8068]">Certification</p>
                  <p className="font-serif text-sm font-bold text-emerald-700 mt-0.5">Silk Mark & GI Tag</p>
                </div>
              </div>
            </div>

            {/* Patron Reviews */}
            <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#4A1525]">Patron Verified Reviews ({reviews.length})</h2>
                  <p className="text-xs text-[#7A6D61] mt-0.5">Direct feedback from patrons who received handloom sarees.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="rounded-xl border border-[#4A1525] px-4 py-2 text-xs font-bold text-[#4A1525] hover:bg-[#FAF3E8] transition"
                >
                  Write Review
                </button>
              </div>

              <div className="mt-6 space-y-3.5">
                {reviews.length === 0 ? (
                  <p className="text-xs text-[#8F8175] text-center py-6">No patron reviews yet for this artisan guild. Be the first to review!</p>
                ) : (
                  reviews.map((r, i) => (
                    <div key={r._id || r.reviewId || i} className="rounded-2xl bg-[#FAF8F4] border border-[#EFE7DC] p-4 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#4A1525]">{r.customerName || "Verified Patron"}</p>
                          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            Verified Patron
                          </span>
                        </div>
                        <p className="text-[#A16B16] font-bold">{"★".repeat(r.rating || 5)}</p>
                      </div>
                      <p className="text-[#5C534B] leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOOM & WORKSHOP GALLERY */}
        {activeTab === "gallery" && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            {/* Gallery Category Filter */}
            <div className="flex items-center justify-between rounded-2xl border border-[#E5DCD0] bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#4A1525]">Filter Workshop Photos:</span>
                {["All", "Workshop", "Looms", "Silk Dyeing", "Weaving", "Finished"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGalleryCategory(cat)}
                    className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
                      galleryCategory === cat
                        ? "bg-[#4A1525] text-white"
                        : "bg-[#FAF8F4] text-[#6B5E52] hover:bg-[#F3ECE3]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-[#8F8175]">{filteredGallery.length} Workshop Captures</span>
            </div>

            {filteredGallery.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D8CCBD] bg-white/70 p-12 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-[#D09229]" />
                <p className="font-serif text-base font-bold text-[#4A1525] mt-2">No Gallery Photos in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item) => (
                  <div
                    key={item.id || item._id}
                    onClick={() => setSelectedGalleryPhoto(item)}
                    className="group overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-xs cursor-pointer hover:shadow-md transition"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-[#FAF6F0]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute bottom-3 left-3 rounded-full bg-[#4A1525]/90 px-3 py-1 text-[10px] font-bold text-[#FCDA8B] backdrop-blur-xs">
                        {item.category || "Workshop"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-sm font-bold text-[#4A1525] group-hover:text-[#A16B16] transition">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-xs text-[#7A6D61] line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GUILD PRODUCTS & SAREES */}
        {activeTab === "products" && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between rounded-2xl border border-[#E5DCD0] bg-white p-4">
              <div>
                <h2 className="font-serif text-base font-bold text-[#4A1525]">
                  Authentic Sarees Crafted by {art.name} ({artisanProducts.length})
                </h2>
                <p className="text-xs text-[#7A6D61] mt-0.5">Woven on pit looms and ready for direct patron purchase.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artisanProducts.map((p) => {
                const priceNum = typeof p.price === "number" ? p.price : Number(p.price) || 0;
                const formattedPrice = `₹${priceNum.toLocaleString("en-IN")}`;
                const isFav = favorites.includes(String(p.id || p._id || p.code));

                return (
                  <div
                    key={p.id || p._id || p.code}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5DCD0] bg-white shadow-xs transition hover:shadow-md"
                  >
                    <div className="relative h-60 w-full overflow-hidden bg-[#FAF6F0]">
                      <img
                        src={p.image || "/images/kanchi.png"}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(p.id || p._id || p.code);
                        }}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#4A1525] shadow-xs"
                      >
                        <Heart
                          className={`h-4 w-4 ${isFav ? "fill-[#A44747] text-[#A44747]" : "text-[#7A6D61]"}`}
                        />
                      </button>
                      <span className="absolute bottom-3 left-3 rounded-full bg-[#4A1525]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCDA8B]">
                        {p.tag || p.category || "Silk Mark Certified"}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#A16B16] uppercase">{p.fabric || p.category}</span>
                        <h3 className="font-serif text-sm font-bold text-[#292421] mt-0.5 line-clamp-1">{p.name}</h3>
                        <p className="mt-1 text-[11px] text-[#7A6D61] line-clamp-2">{p.description}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#F0E8DF] pt-3">
                        <p className="font-serif text-base font-bold text-[#4A1525]">{formattedPrice}</p>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate(`/customer/products/${p.id || p._id || p.code}`)}
                            className="rounded-xl border border-[#D9CBBF] px-2.5 py-1.5 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0]"
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
                                    manufacturer: art.name,
                                    artisanName: art.artisanName,
                                    image: p.image || "/images/kanchi.png"
                                  }
                                }
                              })
                            }
                            className="rounded-xl bg-[#4A1525] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#6A1F35]"
                          >
                            Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gallery Photo Lightbox Modal */}
        {selectedGalleryPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <button
                type="button"
                onClick={() => setSelectedGalleryPhoto(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
              >
                <X size={18} />
              </button>
              <img
                src={selectedGalleryPhoto.image}
                alt={selectedGalleryPhoto.title}
                className="max-h-[65vh] w-full object-contain bg-black/90"
              />
              <div className="p-6 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A16B16]">
                  {selectedGalleryPhoto.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#4A1525]">{selectedGalleryPhoto.title}</h3>
                {selectedGalleryPhoto.description && (
                  <p className="text-xs text-[#7A6D61] leading-relaxed">{selectedGalleryPhoto.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Review Submission Modal */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
            <form onSubmit={handleReviewSubmit} className="w-full max-w-md rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-3">
                <h3 className="font-serif text-base font-bold text-[#4A1525]">Review {art.name}</h3>
                <button type="button" onClick={() => setIsReviewModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A1525]">Rating (1 to 5 Stars)</label>
                <select
                  value={reviewFormData.rating}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, rating: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border p-2 text-xs"
                >
                  <option value={5}>5 Stars - Outstanding Craftsmanship</option>
                  <option value={4}>4 Stars - Very Good Weave</option>
                  <option value={3}>3 Stars - Average Quality</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A1525]">Your Review / Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={reviewFormData.comment}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                  placeholder="Share details about the fabric feel, border precision, zari shine..."
                  className="mt-1 w-full rounded-xl border p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-bold text-[#7A6D61]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#4A1525] px-5 py-2 text-xs font-bold text-white hover:bg-[#6A1F35]"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
