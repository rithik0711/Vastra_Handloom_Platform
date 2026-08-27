import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import ProductFilterBar from "./components/ProductFilterBar";
import ProductCard from "./components/ProductCard";
import OrderModal from "./components/OrderModal";
import {
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
      origin: "Kanchipuram, TN",
      tag: "GI Tag Certified",
      description: "Authentic pure mulberry silk saree with Korvai contrast borders and 3-shuttle interlocking zari motifs."
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
      origin: "Coimbatore, TN",
      tag: "India Handloom Brand",
      description: "Lightweight and breathable handwoven organic cotton saree with authentic hand-extracted botanical dyes."
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
      description: "Heirloom bridal masterpiece featuring dense gold zari floral jaal and grand traditional temple borders."
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
      origin: "Salem, TN",
      tag: "100% Eco Friendly",
      description: "Crafted on wooden pit looms with organic chemical-free yarn processing for maximum softness."
    }
  ];

  const [products, setProducts] = useState(defaultCatalog);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [weaveType, setWeaveType] = useState("all");
  const [certification, setCertification] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Favorites state synced with localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vastra_customer_favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/manufacturer/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        }
      })
      .catch((err) => console.log("Using cached catalog:", err));
  }, []);

  const toggleFavorite = (productId) => {
    const stringId = String(productId);
    let updated;
    if (favorites.includes(stringId)) {
      updated = favorites.filter((id) => id !== stringId);
    } else {
      updated = [...favorites, stringId];
    }
    setFavorites(updated);
    localStorage.setItem("vastra_customer_favorites", JSON.stringify(updated));
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("featured");
    setPriceRange("all");
    setWeaveType("all");
    setCertification("all");
    setInStockOnly(false);
  };

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        const q = search.toLowerCase().trim();
        const matchesSearch =
          !q ||
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.weave && p.weave.toLowerCase().includes(q)) ||
          (p.artisan && p.artisan.toLowerCase().includes(q)) ||
          (p.origin && p.origin.toLowerCase().includes(q));

        const matchesCat =
          category === "All" ||
          (p.category && p.category.toLowerCase() === category.toLowerCase()) ||
          (p.fabric && p.fabric.toLowerCase().includes(category.toLowerCase()));

        // Price range
        const priceNum = typeof p.price === "number" ? p.price : Number(p.price) || 0;
        let matchesPrice = true;
        if (priceRange === "under-5k") matchesPrice = priceNum < 5000;
        else if (priceRange === "5k-10k") matchesPrice = priceNum >= 5000 && priceNum <= 10000;
        else if (priceRange === "10k-20k") matchesPrice = priceNum > 10000 && priceNum <= 20000;
        else if (priceRange === "above-20k") matchesPrice = priceNum > 20000;

        // Weave type
        let matchesWeave = true;
        if (weaveType === "korvai") matchesWeave = (p.weave || "").toLowerCase().includes("korvai");
        else if (weaveType === "pit-loom") matchesWeave = (p.weave || "").toLowerCase().includes("pit");
        else if (weaveType === "jacquard") matchesWeave = (p.weave || "").toLowerCase().includes("jacquard");
        else if (weaveType === "heritage") matchesWeave = (p.weave || "").toLowerCase().includes("heritage") || (p.weave || "").toLowerCase().includes("hand");

        // Certification
        let matchesCert = true;
        if (certification === "gi") matchesCert = (p.tag || "").toLowerCase().includes("gi");
        else if (certification === "silk-mark") matchesCert = (p.tag || "").toLowerCase().includes("silk mark");
        else if (certification === "india-handloom") matchesCert = (p.tag || "").toLowerCase().includes("brand");
        else if (certification === "eco") matchesCert = (p.tag || "").toLowerCase().includes("eco");

        // In-Stock
        const matchesStock = !inStockOnly || (p.stock === undefined || Number(p.stock) > 0);

        return matchesSearch && matchesCat && matchesPrice && matchesWeave && matchesCert && matchesStock;
      })
      .sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : Number(a.price) || 0;
        const priceB = typeof b.price === "number" ? b.price : Number(b.price) || 0;

        if (sortBy === "price-low") return priceA - priceB;
        if (sortBy === "price-high") return priceB - priceA;
        if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
        if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return 0; // "featured"
      });
  }, [products, search, category, sortBy, priceRange, weaveType, certification, inStockOnly]);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Banner Section */}
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

        {/* Order Success Alert */}
        {orderSuccess && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">Handloom Order Placed Successfully!</p>
                <p className="text-[11px] text-emerald-700">
                  The artisan workshop has received your request and will prepare the loom.
                </p>
              </div>
            </div>
            <Link to="/customer/orders" className="text-xs font-bold text-emerald-800 underline">
              View My Orders
            </Link>
          </div>
        )}

        {/* Modular Filter & Search Bar */}
        <div className="mt-6">
          <ProductFilterBar
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            weaveType={weaveType}
            onWeaveTypeChange={setWeaveType}
            certification={certification}
            onCertificationChange={setCertification}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
            onResetFilters={handleResetFilters}
            totalResults={products.length}
            filteredCount={filteredAndSortedProducts.length}
          />
        </div>

        {/* Product Catalog Grid assembled with ProductCard */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((item) => {
              const pId = item.id || item._id || item.code;
              return (
                <ProductCard
                  key={pId}
                  product={item}
                  isFavorite={favorites.includes(String(pId))}
                  onToggleFavorite={toggleFavorite}
                  onQuickOrder={(p) => setSelectedProduct(p)}
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-[#E5DCD0] bg-white p-12 text-center shadow-xs">
            <h3 className="font-serif text-2xl font-bold text-[#4A1525]">
              No Matching Handloom Weaves Found
            </h3>
            <p className="mt-2 max-w-md text-xs text-[#7A6D61]">
              Try adjusting your search criteria or resetting filters to browse all available artisan silks and cottons.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 rounded-xl bg-[#FAF0E1] px-5 py-2.5 text-xs font-bold text-[#4A1525] hover:bg-[#F3E5D0] transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Order Modal Component */}
        {selectedProduct && (
          <OrderModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onSuccess={() => {
              setSelectedProduct(null);
              setOrderSuccess(true);
              setTimeout(() => setOrderSuccess(false), 5000);
            }}
          />
        )}
      </main>
    </div>
  );
}
