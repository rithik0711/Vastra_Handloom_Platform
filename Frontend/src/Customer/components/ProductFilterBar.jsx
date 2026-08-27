import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Sparkles,
  Check,
  RotateCcw
} from "lucide-react";

export default function ProductFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  weaveType,
  onWeaveTypeChange,
  certification,
  onCertificationChange,
  inStockOnly,
  onInStockOnlyChange,
  onResetFilters,
  totalResults,
  filteredCount
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = ["All", "Silk", "Cotton", "Linen", "Brocade"];
  const sortOptions = [
    { value: "featured", label: "Featured & Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "newest", label: "Newest Arrivals" }
  ];

  const priceOptions = [
    { value: "all", label: "All Prices" },
    { value: "under-5k", label: "Under ₹5,000" },
    { value: "5k-10k", label: "₹5,000 - ₹10,000" },
    { value: "10k-20k", label: "₹10,000 - ₹20,000" },
    { value: "above-20k", label: "Above ₹20,000" }
  ];

  const weaveOptions = [
    { value: "all", label: "All Weave Techniques" },
    { value: "korvai", label: "Korvai Handloom" },
    { value: "pit-loom", label: "Traditional Pit Loom" },
    { value: "jacquard", label: "Jacquard Brocade" },
    { value: "heritage", label: "Heritage Handloom" }
  ];

  const certOptions = [
    { value: "all", label: "All Certifications" },
    { value: "gi", label: "GI Tag Certified" },
    { value: "silk-mark", label: "Silk Mark Certified" },
    { value: "india-handloom", label: "India Handloom Brand" },
    { value: "eco", label: "100% Eco Friendly" }
  ];

  const hasActiveFilters =
    category !== "All" ||
    search.trim() !== "" ||
    priceRange !== "all" ||
    weaveType !== "all" ||
    certification !== "all" ||
    inStockOnly;

  return (
    <div className="space-y-3">
      {/* Primary Bar: Search, Category Chips, Sort, Filter Toggle */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5DCD0] bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B8F84]" />
          <input
            type="text"
            placeholder="Search by saree name, pure silk, weaver, motif..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] pl-10 pr-9 text-xs text-[#292421] placeholder-[#A89D91] focus:border-[#4A1525] focus:bg-white focus:outline-hidden transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8F84] hover:text-[#4A1525]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                category === cat
                  ? "bg-[#4A1525] text-white shadow-xs"
                  : "border border-[#E5DCD0] bg-[#FAF6F0] text-[#6B5E52] hover:bg-[#F0E8DF]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Filter Toggle Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 h-3.5 w-3.5 text-[#8F8175] pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-10 rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] pl-8 pr-8 text-xs font-semibold text-[#56493F] focus:border-[#4A1525] focus:bg-white focus:outline-hidden appearance-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold transition cursor-pointer ${
              showAdvanced || hasActiveFilters
                ? "border-[#4A1525] bg-[#FAF0E1] text-[#4A1525]"
                : "border-[#E5DCD0] bg-[#FAF6F0] text-[#56493F] hover:bg-[#F0E8DF]"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#4A1525] text-[9px] font-bold text-white">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filters Tray */}
      {showAdvanced && (
        <div className="rounded-2xl border border-[#EADFD2] bg-white p-5 shadow-xs animate-fadeIn">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Price Range */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8F8175]">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] px-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              >
                {priceOptions.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Weave Type */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8F8175]">
                Weave Technique
              </label>
              <select
                value={weaveType}
                onChange={(e) => onWeaveTypeChange(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] px-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              >
                {weaveOptions.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Certifications */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8F8175]">
                GI / Authenticity
              </label>
              <select
                value={certification}
                onChange={(e) => onCertificationChange(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] px-3 text-xs text-[#292421] focus:border-[#4A1525] focus:bg-white focus:outline-hidden"
              >
                {certOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* In Stock & Reset */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer py-1.5 text-xs font-semibold text-[#4A1525]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => onInStockOnlyChange(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#4A1525]"
                />
                <span>In-Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#7A6D61]">
        <div className="flex flex-wrap items-center gap-2">
          <span>
            Showing <strong>{filteredCount}</strong> of {totalResults} authentic weaves
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-full bg-[#FAF0E1] px-2.5 py-0.5 text-[11px] font-bold text-[#4A1525] hover:bg-[#F4E3CB] transition cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset All</span>
            </button>
          )}

          {category !== "All" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E5DCD0] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#56493F]">
              Category: {category}
              <X
                onClick={() => onCategoryChange("All")}
                className="h-3 w-3 cursor-pointer hover:text-[#A44747]"
              />
            </span>
          )}

          {priceRange !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E5DCD0] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#56493F]">
              Price: {priceOptions.find((p) => p.value === priceRange)?.label}
              <X
                onClick={() => onPriceRangeChange("all")}
                className="h-3 w-3 cursor-pointer hover:text-[#A44747]"
              />
            </span>
          )}

          {weaveType !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E5DCD0] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#56493F]">
              Weave: {weaveOptions.find((w) => w.value === weaveType)?.label}
              <X
                onClick={() => onWeaveTypeChange("all")}
                className="h-3 w-3 cursor-pointer hover:text-[#A44747]"
              />
            </span>
          )}

          {certification !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E5DCD0] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#56493F]">
              Cert: {certOptions.find((c) => c.value === certification)?.label}
              <X
                onClick={() => onCertificationChange("all")}
                className="h-3 w-3 cursor-pointer hover:text-[#A44747]"
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

