import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import ProductSpecsTable from "./components/ProductSpecsTable";
import ArtisanInfoCard from "./components/ArtisanInfoCard";
import SilkCareGuide from "./components/SilkCareGuide";
import RelatedProducts from "./components/RelatedProducts";
import OrderModal from "./components/OrderModal";
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
  Check
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Favorites in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vastra_customer_favorites") || "[]");
    } catch {
      return [];
    }
  });

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
      artisanName: "Rithikeswaran M",
      origin: "Kanchipuram, Tamil Nadu",
      tag: "GI Tag Certified",
      warp: "2-Ply Mulberry Silk (20/22 Denier)",
      weft: "3-Ply High-Twist Silk",
      zari: "Tested Half-Fine Gold Zari",
      reedCount: "104 Dents Per Inch",
      length: "6.3 Meters (With 0.8m Blouse)",
      borderStyle: "Korvai Contrast Temple Border",
      description:
        "Handcrafted on traditional pit looms in Kanchipuram, this heirloom saree features interlocking Korvai borders woven with three shuttles and authentic gold zari floral motifs."
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
      artisanName: "Rithikeswaran M",
      origin: "Coimbatore, Tamil Nadu",
      tag: "India Handloom Brand",
      warp: "80s Combed Organic Cotton",
      weft: "80s Count Cotton Yarn",
      zari: "Pure Cotton Threadwork",
      reedCount: "88 Dents Per Inch",
      length: "6.2 Meters (With Blouse)",
      borderStyle: "Traditional Zari Thread Border",
      description:
        "Breathable, lightweight organic cotton handwoven with natural herbal dyes for maximum comfort and understated elegance."
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
      artisanName: "Rithikeswaran M",
      origin: "Tamil Nadu",
      tag: "Silk Mark Certified",
      warp: "Mulberry Silk (22 Denier)",
      weft: "Heavy Silk with Gold Brocade",
      zari: "24k Electroplated Gold Zari",
      reedCount: "112 Dents Per Inch",
      length: "6.3 Meters",
      borderStyle: "Heavy Bridal Kadwa Pallu",
      description:
        "An opulent bridal masterwork with rich gold kadwa motifs and intricately woven pallu designed for grand weddings and celebrations."
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
      artisanName: "Senthil Kumar",
      origin: "Salem, Tamil Nadu",
      tag: "100% Eco Friendly",
      warp: "60s Natural Cotton",
      weft: "60s Natural Cotton",
      zari: "Natural Indigo & Madder Dye",
      reedCount: "80 Dents Per Inch",
      length: "6.2 Meters",
      borderStyle: "Minimal Geometric Border",
      description:
        "Woven by master weavers in Salem using 100% organic cotton and hand-extracted herbal dyes without harmful synthetic chemicals."
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/manufacturer/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setAllProducts(json.data);
          const found = json.data.find(
            (p) => String(p.id || p._id || p.code) === String(id)
          );
          if (found) {
            setProduct(found);
            setSelectedImage(found.image || "/images/kanchi.png");
          } else {
            const fallback = defaultCatalog.find(
              (p) => String(p.id || p._id || p.code) === String(id)
            ) || defaultCatalog[0];
            setProduct(fallback);
            setSelectedImage(fallback.image || "/images/kanchi.png");
          }
        } else {
          setAllProducts(defaultCatalog);
          const fallback = defaultCatalog.find(
            (p) => String(p.id || p._id || p.code) === String(id)
          ) || defaultCatalog[0];
          setProduct(fallback);
          setSelectedImage(fallback.image || "/images/kanchi.png");
        }
      })
      .catch(() => {
        setAllProducts(defaultCatalog);
        const fallback = defaultCatalog.find(
          (p) => String(p.id || p._id || p.code) === String(id)
        ) || defaultCatalog[0];
        setProduct(fallback);
        setSelectedImage(fallback.image || "/images/kanchi.png");
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
        <CustomerSidebar />
        <main className="manufacturer-main min-h-screen p-8 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="h-8 w-8 animate-spin text-[#4A1525] mx-auto" />
            <p className="mt-3 text-xs text-[#8F8175]">Loading authentic handloom weave specifications...</p>
          </div>
        </main>
      </div>
    );
  }

  const pId = String(product.id || product._id || product.code);
  const isFav = favorites.includes(pId);
  const formattedPrice =
    typeof product.price === "number"
      ? product.price.toLocaleString("en-IN")
      : product.price || "0";

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Navigation Breadcrumbs & Back */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/customer")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3 py-1.5 text-xs font-bold text-[#56493F] shadow-2xs hover:bg-[#FAF6F0] hover:text-[#4A1525] transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Handloom Catalog</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3 text-xs font-semibold text-[#56493F] hover:bg-[#FAF6F0] transition cursor-pointer"
              title="Copy share link"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
              <span>{copiedLink ? "Copied" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleFavorite(pId)}
              className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition cursor-pointer ${
                isFav
                  ? "border-[#A44747] bg-[#FBEEEE] text-[#A44747]"
                  : "border-[#D9CBBF] bg-white text-[#56493F] hover:bg-[#FAF6F0]"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-[#A44747]" : ""}`} />
              <span>{isFav ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Order Success Alert */}
        {orderSuccess && (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
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

        {/* Product Hero: Image Gallery & Purchase Area */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Showcase */}
          <div className="space-y-4">
            <div className="relative h-96 sm:h-[480px] w-full overflow-hidden rounded-3xl border border-[#E5DCD0] bg-white shadow-xs">
              <img
                src={selectedImage || product.image || "/images/kanchi.png"}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/kanchi.png";
                }}
              />

              <div className="absolute top-4 left-4 rounded-full bg-[#4A1525]/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D09229]" />
                <span>{product.tag || product.category || "Authentic Handloom"}</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {[
                product.image || "/images/kanchi.png",
                "/images/kathar.png",
                "/images/zari.png",
                "/images/cotton.png"
              ].map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition cursor-pointer ${
                    selectedImage === img
                      ? "border-[#4A1525] ring-2 ring-[#4A1525]/20"
                      : "border-[#E5DCD0] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Angle" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info & Action Card */}
          <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-[#E5DCD0] bg-white p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#A16B16]">
                <span>{product.category} Saree</span>
                <span>•</span>
                <span>{product.weave}</span>
                <span>•</span>
                <span className="text-[#2E7D32] flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Silk Mark Certified
                </span>
              </div>

              <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-1 text-xs text-[#7A6D61]">
                Product Code: <strong className="text-[#292421]">{product.code || `KW-SILK-001`}</strong> | Handcrafted in {product.origin || "Tamil Nadu, India"}
              </p>

              {/* Price Display */}
              <div className="mt-5 flex items-baseline gap-3 border-b border-[#F0E8DF] pb-5">
                <span className="font-serif text-3xl font-bold text-[#4A1525]">
                  ₹{formattedPrice}
                </span>
                <span className="text-xs text-[#8F8175]">Direct artisan price (All taxes included)</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs leading-relaxed text-[#56493F]">
                {product.description ||
                  "A timeless handloom creation meticulously woven on generational pit looms. Characterized by high-twist pure mulberry silk yarns and interlocking contrast Korvai borders with authentic gold zari."}
              </p>

              {/* Highlights List */}
              <div className="mt-5 space-y-2 rounded-2xl bg-[#FAF6F0] p-4 text-xs text-[#56493F]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Genuine Handloom with GI Tag & Silk Mark Certification.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#A16B16] shrink-0" />
                  <span>Free insured shipping across India in 7-10 business days.</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-[#4A1525] shrink-0" />
                  <span>7-Day handloom artisan return & exchange guarantee.</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-[#F0E8DF]">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-95 transition cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Order Now (₹{formattedPrice})</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/customer/booking?manufacturer=${encodeURIComponent(
                        product.artisan || product.manufacturerId || "Kathar Weaves"
                      )}&fabricChoice=${encodeURIComponent(product.fabric || "Pure Mulberry Silk")}`
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#4A1525] bg-[#FAF0E1] px-5 py-3.5 text-xs font-bold text-[#4A1525] hover:bg-[#F3E5D0] active:scale-95 transition cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[#D09229]" />
                  <span>Custom Weave Request</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Component */}
        <div className="mt-8">
          <ProductSpecsTable product={product} />
        </div>

        {/* Master Weaver Profile Component */}
        <div className="mt-8">
          <ArtisanInfoCard
            artisan={{
              name: product.artisan || product.manufacturerId || "Kathar Weaves",
              masterWeaver: product.artisanName || "Rithikeswaran M",
              location: product.origin || "Coimbatore & Kanchipuram, Tamil Nadu",
              experience: "15+ Years Generational Heritage",
              loomsActive: 18,
              specialization: product.fabric || "Pure Mulberry Silk & Korvai Weaving"
            }}
            onBookCustomOrder={(artisanData) => {
              navigate(
                `/customer/booking?manufacturer=${encodeURIComponent(
                  artisanData.name
                )}&fabricChoice=${encodeURIComponent(product.fabric || "Pure Silk")}`
              );
            }}
          />
        </div>

        {/* Silk Care Guide Component */}
        <div className="mt-8">
          <SilkCareGuide />
        </div>

        {/* Related Products Component */}
        <RelatedProducts
          currentProductId={pId}
          products={allProducts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onQuickOrder={(p) => {
            setProduct(p);
            setIsOrderModalOpen(true);
          }}
        />

        {/* Order Modal */}
        {isOrderModalOpen && (
          <OrderModal
            product={product}
            onClose={() => setIsOrderModalOpen(false)}
            onSuccess={() => {
              setOrderSuccess(true);
              setTimeout(() => setOrderSuccess(false), 6000);
            }}
          />
        )}
      </main>
    </div>
  );
}

