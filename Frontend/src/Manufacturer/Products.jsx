import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Products() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const products = [
    {
      id: 1,
      code: "KW-SILK-001",
      name: "Kanchipuram Silk Saree",
      category: "Silk",
      fabric: "Pure Silk",
      weave: "Hand Woven",
      price: "₹8,500",
      stock: 12,
      maxStock: 20,
      status: "In Stock",
      image: "/images/kanchi.png",
      featured: true,
    },
    {
      id: 2,
      code: "KW-COT-002",
      name: "Traditional Cotton Saree",
      category: "Cotton",
      fabric: "Pure Cotton",
      weave: "Hand Woven",
      price: "₹4,200",
      stock: 24,
      maxStock: 30,
      status: "In Stock",
      image: "/images/cotton.png",
      featured: false,
    },
    {
      id: 3,
      code: "KW-SILK-003",
      name: "Zari Silk Saree",
      category: "Silk",
      fabric: "Silk & Zari",
      weave: "Hand Woven",
      price: "₹11,500",
      stock: 6,
      maxStock: 20,
      status: "Low Stock",
      image: "/images/zari.png",
      featured: true,
    },
    {
      id: 4,
      code: "KW-COT-004",
      name: "Handloom Cotton Saree",
      category: "Cotton",
      fabric: "Organic Cotton",
      weave: "Handloom",
      price: "₹3,800",
      stock: 18,
      maxStock: 25,
      status: "In Stock",
      image: "/images/handloom.png",
      featured: false,
    },
    {
      id: 5,
      code: "KW-SILK-005",
      name: "Banarasi Handloom Saree",
      category: "Silk",
      fabric: "Banarasi Silk",
      weave: "Hand Woven",
      price: "₹9,800",
      stock: 0,
      maxStock: 20,
      status: "Out of Stock",
      image: "/images/saree5.jpg",
      featured: true,
    },
    {
      id: 6,
      code: "KW-LIN-006",
      name: "Linen Handloom Saree",
      category: "Linen",
      fabric: "Pure Linen",
      weave: "Handloom",
      price: "₹5,600",
      stock: 9,
      maxStock: 20,
      status: "In Stock",
      image: "/images/saree6.jpg",
      featured: false,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.fabric.toLowerCase().includes(searchText) ||
      product.weave.toLowerCase().includes(searchText) ||
      product.code.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const getStatusStyle = (status) => {
    if (status === "In Stock") {
      return "bg-[#eaf6ed] text-[#34794b] border-[#d5ebda]";
    }

    if (status === "Low Stock") {
      return "bg-[#fff4df] text-[#a16b16] border-[#f2dfb7]";
    }

    return "bg-[#fbeeee] text-[#a44747] border-[#f0d2d2]";
  };

  const getStockWidth = (stock, maxStock) => {
    if (stock === 0) return "0%";

    return `${Math.min((stock / maxStock) * 100, 100)}%`;
  };

  const getStockColor = (status) => {
    if (status === "Low Stock") return "bg-[#d09229]";
    if (status === "Out of Stock") return "bg-[#a44747]";

    return "bg-[#4f8a5e]";
  };

  const SearchIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" strokeLinecap="round" />
    </svg>
  );

  const FilterIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[17px] w-[17px]"
    >
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );

  const PlusIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-[17px] w-[17px]"
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );

  const EyeIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );

  const EditIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
    >
      <path
        d="M12 20h9"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
    >
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const HeartIcon = ({ filled = false }) => (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
    >
      <path
        d="M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const HandIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[13px] w-[13px]"
    >
      <path
        d="M7 11V6a1.5 1.5 0 0 1 3 0v4V4.5a1.5 1.5 0 0 1 3 0V10V6a1.5 1.5 0 0 1 3 0v5.5V8a1.5 1.5 0 0 1 3 0v6c0 3.9-2.5 6.5-6.5 6.5h-1.2c-2.2 0-4.1-1-5.3-2.8L4 13.8a1.7 1.7 0 0 1 2.8-2L7 13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const BoxIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[15px] w-[15px]"
    >
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="M4 7v10l8 4 8-4V7M12 11v10" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#f7f4ee]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="ml-[78px] min-h-screen px-[18px] py-[22px] transition-all duration-300 sm:px-[24px] sm:py-[26px] lg:ml-[250px] lg:px-[38px] lg:py-[30px]">

        {/* Header */}
        <div className="flex flex-col gap-[18px] md:flex-row md:items-center md:justify-between">

          <div>
            <div className="flex items-center gap-[7px]">

              <span className="h-[6px] w-[6px] rounded-full bg-[#D09229]" />

              <p className="text-[10px] font-semibold uppercase tracking-[1.8px] text-[#9a826c]">
                Kathar Weaves
              </p>

            </div>

            <h1 className="mt-[5px] text-[29px] font-semibold tracking-[-1px] text-[#4A1525]">
              Saree Collection
            </h1>

            <p className="mt-[5px] text-[12px] text-[#746b62] sm:text-[13px]">
              Curate and manage your handcrafted handloom collection.
            </p>
          </div>

          {/* Add Product */}
          <button
            onClick={() => navigate("/manufacturer/products/add")}
            className="group flex h-[44px] items-center justify-center gap-[8px] self-start rounded-[11px] bg-gradient-to-r from-[#4A1525] via-[#6B1D33] to-[#9d6230] px-[17px] text-[12px] font-semibold text-white shadow-[0_7px_20px_rgba(74,21,37,0.18)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_10px_25px_rgba(74,21,37,0.22)] active:scale-[0.98] md:self-center"
          >
            <PlusIcon />
            Add New Product
          </button>

        </div>

        {/* Stats */}
        <div className="mt-[24px] grid grid-cols-2 gap-[10px] sm:grid-cols-4 sm:gap-[12px]">

          <StatCard
            title="Total Products"
            value="24"
            subtitle="Active collection"
            icon={<BoxIcon />}
          />

          <StatCard
            title="Silk Collection"
            value="12"
            subtitle="Premium sarees"
            icon={<BoxIcon />}
          />

          <StatCard
            title="Cotton Collection"
            value="08"
            subtitle="Everyday handloom"
            icon={<BoxIcon />}
          />

          <StatCard
            title="Low Stock"
            value="04"
            subtitle="Needs attention"
            warning
            icon={<BoxIcon />}
          />

        </div>

        {/* Search */}
        <div className="mt-[22px] rounded-[15px] border border-[#e5dcd2] bg-white p-[10px] shadow-[0_5px_20px_rgba(60,35,20,0.04)]">

          <div className="flex flex-col gap-[9px] sm:flex-row">

            <div className="relative flex-1">

              <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#9a9086]">
                <SearchIcon />
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sarees, fabric, weave or product ID..."
                className="box-border h-[43px] w-full rounded-[10px] border border-[#ddd4ca] bg-[#fdfbf8] pl-[39px] pr-[12px] text-[12px] text-[#403a35] outline-none transition placeholder:text-[#aaa098] focus:border-[#8b5b24] focus:ring-2 focus:ring-[#c08a35]/10"
              />

            </div>

            <div className="relative sm:w-[175px]">

              <span className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#8e847b]">
                <FilterIcon />
              </span>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="box-border h-[43px] w-full appearance-none rounded-[10px] border border-[#ddd4ca] bg-[#fdfbf8] pl-[37px] pr-[10px] text-[12px] text-[#403a35] outline-none focus:border-[#8b5b24]"
              >
                <option value="All">All Categories</option>
                <option value="Silk">Silk</option>
                <option value="Cotton">Cotton</option>
                <option value="Linen">Linen</option>
              </select>

            </div>

          </div>

        </div>

        {/* Collection Heading */}
        <div className="mt-[25px] flex items-end justify-between">

          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.2px] text-[#403a35]">
              Handloom Collection
            </h2>

            <p className="mt-[3px] text-[11px] text-[#958c83]">
              {filteredProducts.length} handcrafted products
            </p>
          </div>

          <div className="hidden items-center gap-[6px] rounded-full bg-[#f4eee7] px-[10px] py-[6px] text-[9px] font-medium text-[#78675b] sm:flex">
            <span className="h-[5px] w-[5px] rounded-full bg-[#4f8a5e]" />
            Authentic Handloom
          </div>

        </div>

        {/* Product Grid */}
        <div className="mt-[14px] grid grid-cols-1 gap-[15px] sm:grid-cols-2 xl:grid-cols-3">

          {filteredProducts.map((product) => (

            <div
              key={product.id}
              className="group relative overflow-hidden rounded-[17px] border border-[#e5dcd2] bg-white shadow-[0_5px_20px_rgba(60,35,20,0.055)] transition duration-300 hover:-translate-y-[4px] hover:shadow-[0_16px_35px_rgba(60,35,20,0.11)]"
            >

              {/* Product Image */}
              <div className="relative h-[230px] overflow-hidden bg-[#eee7df] sm:h-[245px]">

                <img
                  src={product.image}
                  alt={product.name}
                  className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.07] ${
                    product.status === "Out of Stock"
                      ? "grayscale-[20%]"
                      : ""
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Image Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-[90px] bg-gradient-to-t from-black/[0.35] to-transparent opacity-70" />

                {/* Category Badge */}
                <div className="absolute left-[12px] top-[12px] flex items-center gap-[5px] rounded-full border border-white/[0.65] bg-white/[0.88] px-[10px] py-[5px] text-[9px] font-bold text-[#5b4035] shadow-[0_3px_10px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                  {product.category}
                </div>

                {/* Featured */}
                {product.featured && (
                  <div className="absolute left-[12px] top-[45px] flex items-center gap-[4px] rounded-full bg-[#4A1525]/[0.92] px-[9px] py-[5px] text-[9px] font-semibold text-white shadow-sm">
                    <span className="text-[#D09229]">✦</span>
                    Featured
                  </div>
                )}

                {/* Wishlist */}
                <button
                  type="button"
                  className="absolute right-[12px] top-[12px] flex h-[31px] w-[31px] items-center justify-center rounded-full border border-white/[0.7] bg-white/[0.88] text-[#6b273b] shadow-sm backdrop-blur-sm transition hover:scale-105 hover:bg-white"
                >
                  <HeartIcon filled={product.featured} />
                </button>

                {/* Status */}
                <span
                  className={`absolute bottom-[12px] right-[12px] rounded-full border px-[9px] py-[5px] text-[9px] font-semibold shadow-sm ${getStatusStyle(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>

              </div>

              {/* Card Body */}
              <div className="p-[15px]">

                {/* Product ID */}
                <div className="flex items-center justify-between">

                  <span className="text-[9px] font-medium uppercase tracking-[1px] text-[#aaa097]">
                    {product.code}
                  </span>

                  <div className="flex items-center gap-[4px] text-[9px] text-[#8c8178]">
                    <HandIcon />
                    Handcrafted
                  </div>

                </div>

                {/* Name + Price */}
                <div className="mt-[8px] flex items-start justify-between gap-[10px]">

                  <div className="min-w-0">

                    <h3 className="truncate text-[15px] font-semibold tracking-[-0.2px] text-[#3f3934]">
                      {product.name}
                    </h3>

                    <p className="mt-[4px] text-[10px] text-[#91877e]">
                      {product.fabric}
                    </p>

                  </div>

                  <p className="shrink-0 text-[15px] font-bold text-[#4A1525]">
                    {product.price}
                  </p>

                </div>

                {/* Product Tags */}
                <div className="mt-[10px] flex flex-wrap gap-[5px]">

                  <span className="rounded-[6px] bg-[#f7f1ea] px-[7px] py-[4px] text-[9px] font-medium text-[#755f50]">
                    {product.weave}
                  </span>

                  <span className="rounded-[6px] bg-[#f7f1ea] px-[7px] py-[4px] text-[9px] font-medium text-[#755f50]">
                    {product.category}
                  </span>

                </div>

                {/* Stock */}
                <div className="mt-[14px]">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.5px] text-[#9a9086]">
                        Available Stock
                      </p>

                      <p className="mt-[2px] text-[11px] font-semibold text-[#403a35]">
                        {product.stock} pieces
                      </p>
                    </div>

                    <p
                      className={`text-[9px] font-semibold ${
                        product.status === "Low Stock"
                          ? "text-[#a16b16]"
                          : product.status === "Out of Stock"
                          ? "text-[#a44747]"
                          : "text-[#4f8a5e]"
                      }`}
                    >
                      {product.stock === 0
                        ? "Restock needed"
                        : `${product.stock}/${product.maxStock}`}
                    </p>

                  </div>

                  <div className="mt-[7px] h-[5px] overflow-hidden rounded-full bg-[#eee8e1]">

                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getStockColor(
                        product.status
                      )}`}
                      style={{
                        width: getStockWidth(
                          product.stock,
                          product.maxStock
                        ),
                      }}
                    />

                  </div>

                </div>

                {/* Actions */}
                <div className="mt-[14px] flex items-center justify-between border-t border-[#eee7df] pt-[12px]">

                  <button
                    type="button"
                    className="flex h-[34px] items-center gap-[6px] rounded-[8px] border border-[#e1d7cc] bg-[#fcfaf7] px-[10px] text-[10px] font-semibold text-[#655950] transition hover:border-[#cdbcae] hover:bg-[#f7f1e9] hover:text-[#4A1525]"
                  >
                    <EyeIcon />
                    View
                  </button>

                  <div className="flex items-center gap-[5px]">

                    <button
                      type="button"
                      title="Edit Product"
                      className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#e4dbd1] bg-[#fcfaf7] text-[#756d65] transition hover:bg-[#f5eee5] hover:text-[#4A1525]"
                    >
                      <EditIcon />
                    </button>

                    <button
                      type="button"
                      title="Delete Product"
                      className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#eadada] bg-[#fffafa] text-[#966d6d] transition hover:border-[#e3bebe] hover:bg-[#fbeeee] hover:text-[#a44747]"
                    >
                      <DeleteIcon />
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="mt-[20px] rounded-[17px] border border-dashed border-[#d8cec3] bg-white px-[20px] py-[65px] text-center">

            <div className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#f5eee7] text-[#8f8175]">
              <BoxIcon />
            </div>

            <h3 className="mt-[12px] text-[17px] font-semibold text-[#403a35]">
              No products found
            </h3>

            <p className="mt-[5px] text-[11px] text-[#958c83]">
              Try changing your search or category filter.
            </p>

          </div>
        )}

      </main>
    </div>
  );
}


/* Statistics Card */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  warning = false,
}) {
  return (
    <div className="group relative overflow-hidden rounded-[15px] border border-[#e6ddd3] bg-white p-[14px] shadow-[0_5px_18px_rgba(60,35,20,0.035)] transition duration-200 hover:-translate-y-[2px] hover:shadow-[0_9px_23px_rgba(60,35,20,0.07)]">

      <div className="absolute right-[-15px] top-[-18px] h-[65px] w-[65px] rounded-full bg-[#f8f0e8] opacity-60" />

      <div className="relative flex items-start justify-between">

        <div>
          <p className="text-[10px] text-[#91877e]">
            {title}
          </p>

          <h2
            className={`mt-[5px] text-[23px] font-semibold tracking-[-0.5px] ${
              warning ? "text-[#a16b16]" : "text-[#403a35]"
            }`}
          >
            {value}
          </h2>

          <p
            className={`mt-[2px] text-[9px] ${
              warning ? "text-[#a16b16]" : "text-[#3d8154]"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-[31px] w-[31px] items-center justify-center rounded-[9px] ${
            warning
              ? "bg-[#fff4df] text-[#a16b16]"
              : "bg-[#f6ecef] text-[#6b273b]"
          }`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}