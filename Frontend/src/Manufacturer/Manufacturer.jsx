import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import RAG from "./RAG";
import {
  Package,
  Clock,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Plus,
  Box,
  CheckCircle2,
  Calendar,
  User,
  Loader2,
  ArrowUpRight
} from "lucide-react";

const Manufacturer = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userEmail =
    localStorage.getItem("userEmail") ||
    "rithikeswaran.it23@bitsathy.ac.in";

  // Fetch live collections directly as like Revenue.jsx
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ordersRes, productsRes, profileRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/manufacturer/orders?manufacturerId=${encodeURIComponent(
              userEmail
            )}`
          ),
          fetch(
            `http://localhost:5000/api/manufacturer/products?manufacturerId=${encodeURIComponent(
              userEmail
            )}`
          ),
          fetch(
            `http://localhost:5000/api/manufacturer/profile?email=${encodeURIComponent(
              userEmail
            )}`
          )
        ]);

        const [ordersData, productsData, profileData] = await Promise.all([
          ordersRes.json(),
          productsRes.json(),
          profileRes.json()
        ]);

        if (ordersData.status === "success" && Array.isArray(ordersData.data)) {
          setOrders(ordersData.data);
        } else {
          setOrders([]);
        }

        if (productsData.status === "success" && Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        } else {
          setProducts([]);
        }

        if (profileData.status === "success" && profileData.data) {
          setProfile(profileData.data);
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  // Amount parsing helper matching Revenue.jsx
  const getAmount = (amount) => {
    if (typeof amount === "number") return amount;
    if (!amount) return 0;
    return (
      Number(
        String(amount)
          .replace(/₹/g, "")
          .replace(/,/g, "")
          .replace(/[^\d.]/g, "")
      ) || 0
    );
  };

  // Date parser matching Revenue.jsx
  const parseDate = (date) => {
    if (!date) return null;
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) return parsed;

    const parts = String(date).split(" ");
    if (parts.length === 3) {
      const months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      const day = Number(parts[0]);
      const month = months[parts[1]];
      const year = Number(parts[2]);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  };

  // Total Products
  const totalProducts = products.length;

  // Total Orders
  const totalOrders = orders.length;

  // Pending & In Production Orders
  const pendingOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "In Production" ||
        o.status === "Quality Check"
    ).length;
  }, [orders]);

  // Completed Orders
  const completedOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status === "Completed" || o.status === "Delivered"
    ).length;
  }, [orders]);

  // Total Revenue from Paid or Completed Orders
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.payment === "Paid" || o.status === "Completed")
      .reduce((total, order) => total + getAmount(order.amount), 0);
  }, [orders]);

  // Formatted Revenue
  const formattedRevenue = useMemo(() => {
    if (totalRevenue >= 100000) {
      return `₹${(totalRevenue / 100000).toFixed(2)}L`;
    }
    return `₹${totalRevenue.toLocaleString("en-IN")}`;
  }, [totalRevenue]);

  // Monthly Revenue Chart Data
  const monthlyRevenue = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const map = {};
    months.forEach((m) => {
      map[m] = 0;
    });

    orders
      .filter((o) => o.payment === "Paid" || o.status === "Completed")
      .forEach((order) => {
        const date = parseDate(order.date);
        if (date) {
          const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const mStr = mNames[date.getMonth()];
          if (map[mStr] !== undefined) {
            map[mStr] += getAmount(order.amount);
          }
        }
      });

    const maxRev = Math.max(...Object.values(map), 1);

    return months.map((month) => ({
      month,
      revenue: map[month],
      value: map[month] > 0 ? Math.max(Math.round((map[month] / maxRev) * 100), 15) : 8
    }));
  }, [orders]);

  // Order Status Breakdown
  const statusBreakdown = useMemo(() => {
    const inProd = orders.filter((o) => o.status === "In Production").length;
    const qc = orders.filter((o) => o.status === "Quality Check").length;
    const pend = orders.filter((o) => o.status === "Pending").length;
    const comp = orders.filter((o) => o.status === "Completed" || o.status === "Delivered").length;

    const calcPct = (cnt) =>
      totalOrders > 0 ? `${Math.round((cnt / totalOrders) * 100)}%` : "0%";

    return [
      { label: "Completed", count: comp, percentage: calcPct(comp), color: "bg-[#4A1525]" },
      { label: "In Production", count: inProd, percentage: calcPct(inProd), color: "bg-[#D09229]" },
      { label: "Quality Check", count: qc, percentage: calcPct(qc), color: "bg-[#8B6C98]" },
      { label: "Pending", count: pend, percentage: calcPct(pend), color: "bg-[#DDD2C6]" }
    ];
  }, [orders, totalOrders]);

  // Recent 4 Orders
  const recentOrders = useMemo(() => {
    return orders.slice(0, 4);
  }, [orders]);

  // Production Progress Items
  const productionItems = useMemo(() => {
    const active = orders.filter(
      (o) =>
        o.status === "In Production" ||
        o.status === "Quality Check" ||
        o.status === "Completed"
    );

    if (active.length === 0) {
      return [
        { label: "Kanchipuram Silk Batch #12", value: "85%", progress: "85%", completed: false },
        { label: "Pure Zari Wedding Collection", value: "100%", progress: "100%", completed: true }
      ];
    }

    return active.slice(0, 4).map((o) => {
      let pct = "85%";
      let isDone = false;
      if (o.status === "Completed") {
        pct = "100%";
        isDone = true;
      } else if (o.status === "Quality Check") {
        pct = "75%";
      } else if (o.status === "In Production") {
        pct = "60%";
      }
      return {
        label: o.product || "Handloom Weave",
        value: pct,
        progress: pct,
        completed: isDone
      };
    });
  }, [orders]);

  const businessName = profile?.businessName || "Kathar Weaves";
  const initials =
    businessName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "KW";

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <Sidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* =================================================
            HEADER
        ================================================= */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Manufacturer Dashboard
              </p>
            </div>

            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              {businessName}
            </h1>

            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Live handloom metrics, orders, revenue, and production tracking directly from MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/manufacturer/products")}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#D9CBBF] bg-white px-4 text-xs font-bold text-[#56493F] shadow-xs transition hover:border-[#4A1525] hover:text-[#4A1525] active:scale-95"
            >
              <Box className="h-4 w-4" />
              <span>Products ({totalProducts})</span>
            </button>

            <button
              onClick={() => navigate("/manufacturer/products")}
              className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] px-4 text-xs font-bold text-white shadow-[0_4px_16px_rgba(74,21,37,0.22)] transition hover:opacity-95 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4A1525] to-[#D09229] font-serif text-xs font-bold text-white shadow-xs sm:flex">
              {initials}
            </div>
          </div>
        </header>

        {/* =================================================
            HERO BANNER
        ================================================= */}
        <section className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#411220] via-[#5F192E] to-[#7D293E] p-6 text-white shadow-[0_12px_36px_rgba(74,21,37,0.18)] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[#D09229]/15 blur-2xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FCDA8B] backdrop-blur-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FCDA8B] animate-pulse" />
                Authentic Handloom • Crafted With Tradition
              </div>

              <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Grow your craft. Manage your handloom enterprise.
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                Real-time tracking of weaving production, live dispatch addresses, customer relationships, and revenue.
              </p>
            </div>

            <button
              onClick={() => navigate("/manufacturer/orders")}
              className="flex w-fit items-center gap-2 rounded-xl bg-[#D09229] px-5 py-3 text-xs font-bold text-[#3B1502] shadow-md transition hover:bg-[#E5A43A] active:scale-95"
            >
              <span>Manage Orders ({totalOrders})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#4A1525]" />
            <p className="text-xs text-[#8F8175]">Loading live dashboard data from MongoDB...</p>
          </div>
        ) : (
          <>
            {/* =================================================
                KPI CARDS
            ================================================= */}
            <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <KpiCard
                icon={<Box className="h-5 w-5" />}
                title="Total Products"
                value={String(totalProducts)}
                trend="8%"
                subtitle="in catalog"
                iconBg="bg-[#F6EDF1]"
                iconColor="text-[#4A1525]"
                onClick={() => navigate("/manufacturer/products")}
              />

              <KpiCard
                icon={<Package className="h-5 w-5" />}
                title="Total Orders"
                value={String(totalOrders)}
                trend="12%"
                subtitle="from customers"
                iconBg="bg-[#FAF0E1]"
                iconColor="text-[#A16B16]"
                onClick={() => navigate("/manufacturer/orders")}
              />

              <KpiCard
                icon={<Clock className="h-5 w-5" />}
                title="Pending & In Production"
                value={String(pendingOrders)}
                trendText="Needs dispatch"
                subtitle="active orders"
                iconBg="bg-[#F8EEE4]"
                iconColor="text-[#A96832]"
                onClick={() => navigate("/manufacturer/orders")}
              />

              <KpiCard
                icon={<IndianRupee className="h-5 w-5" />}
                title="Total Revenue"
                value={formattedRevenue}
                trend="15%"
                subtitle="gross earnings"
                iconBg="bg-[#F0EADB]"
                iconColor="text-[#806020]"
                onClick={() => navigate("/manufacturer/revenue")}
              />
            </section>

            {/* =================================================
                REVENUE + ORDER STATUS
            ================================================= */}
            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
              {/* REVENUE CHART */}
              <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition duration-200 hover:shadow-md">
                <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F6EDF1] text-[#4A1525]">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#403A35]">
                        Revenue Overview
                      </h3>
                      <p className="text-[11px] text-[#8F8175]">
                        Live earnings distribution
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/manufacturer/revenue")}
                    className="rounded-full bg-[#FAF5EE] px-3 py-1 text-[11px] font-bold text-[#705D4E] border border-[#EBE1D6] hover:bg-[#F0E8DF]"
                  >
                    View Revenue Page
                  </button>
                </div>

                <div className="pt-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
                        Total Sales Value
                      </p>
                      <p className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525]">
                        {formattedRevenue}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span>↑ 15.4%</span>
                    </div>
                  </div>

                  {/* BAR CHART */}
                  <div className="mt-6 flex h-48 items-end gap-3 border-b border-[#EFE6DB] pb-2 sm:gap-4">
                    {monthlyRevenue.map((item, index, arr) => {
                      const isLatest = index === arr.length - 1;
                      return (
                        <div
                          key={item.month}
                          className="group relative flex h-full flex-1 flex-col justify-end items-center cursor-pointer"
                        >
                          <div className="absolute -top-10 hidden rounded-lg bg-[#2E121B] px-2.5 py-1 text-[10px] font-bold text-[#F7D896] shadow-md group-hover:block pointer-events-none z-20">
                            ₹{(item.revenue || 0).toLocaleString("en-IN")}
                          </div>

                          <div className="relative flex h-full w-full items-end justify-center">
                            <div
                              className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 group-hover:scale-y-[1.03] ${
                                isLatest
                                  ? "bg-gradient-to-t from-[#4A1525] via-[#681E34] to-[#D09229] shadow-xs"
                                  : "bg-[#E6DBD1] group-hover:bg-[#D9CCC0]"
                              }`}
                              style={{
                                height: `${Math.max(item.value, 8)}%`
                              }}
                            />
                          </div>

                          <p className="mt-2 text-center text-[11px] font-semibold text-[#8F8175] group-hover:text-[#4A1525]">
                            {item.month}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ORDER STATUS DISTRIBUTION */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition duration-200 hover:shadow-md">
                <div>
                  <div className="border-b border-[#F0E8DF] pb-4">
                    <h3 className="font-serif text-lg font-bold text-[#403A35]">
                      Order Status
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#8F8175]">
                      Live stage breakdown
                    </p>
                  </div>

                  <div className="pt-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
                      {/* DONUT TOTAL */}
                      <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#4A1525_0deg_120deg,#D09229_120deg_200deg,#8B6C98_200deg_260deg,#DDD2C6_260deg_360deg)] shadow-inner">
                        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                          <span className="font-serif text-3xl font-bold text-[#4A1525]">
                            {totalOrders}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#8F8175]">
                            Orders
                          </span>
                        </div>
                      </div>

                      {/* BREAKDOWN ROWS */}
                      <div className="flex flex-1 flex-col gap-2.5 w-full">
                        {statusBreakdown.map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between rounded-xl bg-[#FAF5EE] px-3 py-2 text-xs font-semibold"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.color}`} />
                              <span className="text-[#4A1525]">{row.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#4A1525]">{row.count}</span>
                              <span className="text-[10px] text-[#8F8175]">({row.percentage})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/manufacturer/orders")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9CBBF] bg-[#FAF7F2] py-2.5 text-xs font-bold text-[#56493F] transition hover:border-[#4A1525] hover:bg-[#F2EAE0] hover:text-[#4A1525] active:scale-95"
                >
                  <span>Manage All Orders</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>

            {/* =================================================
                RECENT ORDERS + PRODUCTION
            ================================================= */}
            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
              {/* RECENT ORDERS */}
              <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition duration-200 hover:shadow-md">
                <div className="flex items-center justify-between border-b border-[#F0E8DF] pb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#403A35]">
                      Recent Orders
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#8F8175]">
                      Latest customer purchases from MongoDB
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/manufacturer/orders")}
                    className="flex items-center gap-1 text-xs font-bold text-[#D09229] hover:underline"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-2 divide-y divide-[#F4ECE2]">
                  {recentOrders && recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div
                        key={order.id || order._id || order.orderId}
                        onClick={() => navigate("/manufacturer/orders")}
                        className="flex items-center justify-between gap-3 py-3 px-2 transition hover:bg-[#FAF6F0] rounded-xl cursor-pointer"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F6EEE5] to-[#EAE0D4] font-serif text-xs font-bold text-[#4A1525] border border-[#E5D9CC]">
                            <User className="h-4 w-4 text-[#4A1525]" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[#292421]">
                              {order.product}
                            </p>
                            <p className="mt-0.5 truncate text-[10px] text-[#8F8175]">
                              #{order.orderId || order.id} • {order.customer} {order.date ? `• ${order.date}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="font-serif text-xs font-bold text-[#4A1525]">
                            {order.amount}
                          </p>
                          <span
                            className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                              order.statusClass || "bg-[#FFF4DF] text-[#A16B16] border-[#F5DEC0]"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-xs text-[#8F8175]">No recent orders found.</p>
                  )}
                </div>
              </div>

              {/* PRODUCTION */}
              <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition duration-200 hover:shadow-md">
                <div className="border-b border-[#F0E8DF] pb-4">
                  <h3 className="font-serif text-lg font-bold text-[#403A35]">
                    Production Overview
                  </h3>
                  <p className="mt-0.5 text-[11px] text-[#8F8175]">
                    Current loom and weave stages
                  </p>
                </div>

                <div className="pt-5 space-y-4">
                  {productionItems.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#292421] line-clamp-1">{item.label}</span>
                        <span className="text-[#4A1525] font-bold">{item.value}</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#FAF0E1]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#4A1525] to-[#D09229] transition-all duration-500"
                          style={{ width: item.progress }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAction
            icon={<Plus className="h-4 w-4" />}
            title="Add Product"
            subtitle="Catalog saree"
            onClick={() => navigate("/manufacturer/products")}
          />
          <QuickAction
            icon={<Package className="h-4 w-4" />}
            title="View Orders"
            subtitle="Fulfill requests"
            onClick={() => navigate("/manufacturer/orders")}
          />
          <QuickAction
            icon={<Box className="h-4 w-4" />}
            title="Inventory"
            subtitle="Stock control"
            onClick={() => navigate("/manufacturer/products")}
          />
          <QuickAction
            icon={<CheckCircle2 className="h-4 w-4" />}
            title="Profile"
            subtitle="Weaver details"
            onClick={() => navigate("/manufacturer/profile")}
          />
        </section>

        {/* =================================================
            VERIFIED MANUFACTURER
        ================================================= */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#E5DCD0] bg-gradient-to-r from-[#FAF6EE] to-[#F5ECE0] p-4 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4A1525] to-[#7B253C] text-white shadow-xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#4A1525]">
                Verified Handloom Producer
              </p>
              <p className="mt-0.5 text-[11px] text-[#7C6E61]">
                {businessName} • Active Looms: {profile?.loomsActive || 18} • Authentic handloom business
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/manufacturer/profile")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-4 py-2 text-xs font-bold text-[#56493F] transition hover:border-[#4A1525] hover:text-[#4A1525] shadow-2xs"
          >
            <span>View Profile</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>

      <RAG />
    </div>
  );
};

const KpiCard = ({
  icon,
  title,
  value,
  trend,
  trendText,
  subtitle,
  iconBg,
  iconColor,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-[#E5DCD0] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
    >
      <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#FAF5EE] pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor} shadow-2xs`}
        >
          {icon}
        </div>

        {trend && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ↑ {trend}
          </span>
        )}

        {trendText && (
          <span className="text-[11px] font-bold text-[#A96832] bg-[#FAF0E1] px-2 py-0.5 rounded-full border border-[#F2E0C7]">
            {trendText}
          </span>
        )}
      </div>

      <p className="relative mt-4 text-[11px] font-bold uppercase tracking-wider text-[#8F8175]">
        {title}
      </p>

      <h3 className="relative mt-0.5 font-serif text-2xl font-bold tracking-tight text-[#4A1525] sm:text-3xl">
        {value}
      </h3>

      {subtitle && (
        <p className="relative mt-0.5 text-[10px] font-medium text-[#7C6E61]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

const QuickAction = ({ icon, title, subtitle, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-[#E5DCD0] bg-white p-3.5 text-left transition hover:border-[#4A1525] hover:bg-[#FAF6F0] shadow-xs active:scale-95"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F6EDF1] text-[#4A1525]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-[#292421]">{title}</p>
        <p className="truncate text-[10px] text-[#8F8175]">{subtitle}</p>
      </div>
    </button>
  );
};

export default Manufacturer;