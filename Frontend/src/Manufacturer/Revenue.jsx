import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import RAG from "./RAG";

import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Search,
  ArrowUpRight,
  CalendarDays,
  Package,
  CreditCard,
  Loader2,
  Copy,
  Check,
  Building2,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink
} from "lucide-react";

export const Revenue = () => {
  const { id: routeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryId = searchParams.get("id") || searchParams.get("manufacturerId");

  // Determine active identifier (route :id -> query ?id -> localStorage -> default)
  const activeId = useMemo(() => {
    return (
      routeId ||
      queryId ||
      localStorage.getItem("manufacturerId") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("id") ||
      localStorage.getItem("userEmail") ||
      "rithikeswaran.it23@bitsathy.ac.in"
    );
  }, [routeId, queryId]);

  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [manufacturer, setManufacturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("All");
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch live revenue data for the active ID from the database
  const fetchRevenueData = async () => {
    try {
      setLoading(true);

      const targetId = encodeURIComponent(activeId.trim());

      // 1. Fetch from dedicated Revenue endpoint by ID
      const response = await fetch(
        `http://localhost:5000/api/manufacturer/revenue/${targetId}`
      );

      const resData = await response.json();

      if (resData.status === "success" && resData.data) {
        setOrders(resData.data.orders || []);
        setSummary(resData.data.summary || null);
        setManufacturer(resData.data.manufacturer || null);
      } else {
        // Fallback to orders endpoint by manufacturerId
        const fallbackRes = await fetch(
          `http://localhost:5000/api/manufacturer/orders?manufacturerId=${targetId}`
        );
        const fallbackData = await fallbackRes.json();

        if (fallbackData.status === "success" && Array.isArray(fallbackData.data)) {
          setOrders(fallbackData.data);
        } else {
          setOrders([]);
        }
      }
    } catch (error) {
      console.error("Revenue fetch error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [activeId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRevenueData();
  };

  const handleCopyId = () => {
    const idToCopy = manufacturer?._id || manufacturer?.id || activeId;
    navigator.clipboard.writeText(String(idToCopy));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Filter orders by search text & period
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const text = search.toLowerCase();

      const matchesSearch =
        !text ||
        order.orderId?.toLowerCase().includes(text) ||
        order.customer?.toLowerCase().includes(text) ||
        order.product?.toLowerCase().includes(text) ||
        order.category?.toLowerCase().includes(text) ||
        order.payment?.toLowerCase().includes(text) ||
        order.status?.toLowerCase().includes(text);

      if (!matchesSearch) return false;

      if (period === "All") return true;

      const date = parseDate(order.date);
      if (!date) return true;

      const now = new Date();

      if (period === "This Month") {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }

      if (period === "Last 3 Months") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return date >= threeMonthsAgo;
      }

      return true;
    });
  }, [orders, search, period]);

  const revenueOrders = useMemo(() => {
    return filteredOrders.filter(
      (order) =>
        order.payment === "Paid" ||
        order.payment === "Advance Paid" ||
        order.status === "Completed" ||
        order.status === "Delivered"
    );
  }, [filteredOrders]);

  const totalRevenue = useMemo(() => {
    return revenueOrders.reduce(
      (total, order) => total + getAmount(order.amount),
      0
    );
  }, [revenueOrders]);

  const completedRevenue = useMemo(() => {
    return filteredOrders
      .filter((order) => order.status === "Completed" || order.status === "Delivered")
      .reduce((total, order) => total + getAmount(order.amount), 0);
  }, [filteredOrders]);

  const pendingRevenue = useMemo(() => {
    return filteredOrders
      .filter(
        (order) =>
          order.status !== "Completed" &&
          order.status !== "Delivered" &&
          order.payment !== "Paid"
      )
      .reduce((total, order) => total + getAmount(order.amount), 0);
  }, [filteredOrders]);

  const averageOrderValue =
    revenueOrders.length > 0
      ? Math.round(totalRevenue / revenueOrders.length)
      : 0;

  const productRevenue = useMemo(() => {
    const map = {};

    revenueOrders.forEach((order) => {
      const product = order.product || "Handloom Silk Saree";

      if (!map[product]) {
        map[product] = {
          name: product,
          category: order.category || "Silk",
          revenue: 0,
          quantity: 0
        };
      }

      map[product].revenue += getAmount(order.amount);
      map[product].quantity += Number(order.quantity) || 1;
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [revenueOrders]);

  const monthlyRevenue = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const map = {};
    months.forEach((month) => {
      map[month] = 0;
    });

    revenueOrders.forEach((order) => {
      const date = parseDate(order.date);
      if (date) {
        const month = months[date.getMonth()];
        map[month] += getAmount(order.amount);
      }
    });

    return months.map((month) => ({
      month,
      revenue: map[month]
    }));
  }, [revenueOrders]);

  const maxRevenue = Math.max(
    ...monthlyRevenue.map((item) => item.revenue),
    1
  );

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const displayId = manufacturer?._id || manufacturer?.id || activeId;

  return (
    <>
      <Sidebar />

      <main className="manufacturer-main min-h-screen bg-[#F8F5EF] px-4 py-6 text-[#292421] sm:px-8 lg:px-10">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Financial Overview
              </p>

              {/* Manufacturer ID Pill */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E5DCD0] bg-white px-3 py-1 shadow-sm">
                <Building2 size={12} className="text-[#A16B16]" />
                <span className="text-[11px] font-semibold text-[#7A6D61]">
                  ID:
                </span>
                <span className="font-mono text-[11px] font-bold text-[#4A1525]">
                  {String(displayId).slice(0, 10)}
                  {String(displayId).length > 10 ? "..." : ""}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy full Manufacturer ID"
                  className="ml-1 text-[#9B8068] transition hover:text-[#4A1525]"
                >
                  {copied ? (
                    <Check size={12} className="text-emerald-600" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-3xl font-bold text-[#4A1525] sm:text-4xl">
                Revenue
              </h1>
              {manufacturer?.businessName && (
                <span className="rounded-lg bg-[#F6EDF1] px-2.5 py-1 text-xs font-bold text-[#4A1525]">
                  {manufacturer.businessName}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Live handloom sales and earnings fetched from database for{" "}
              <span className="font-semibold text-[#4A1525]">
                {manufacturer?.ownerName || manufacturer?.businessName || activeId}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DCD0] bg-white px-3 py-2 text-xs font-semibold text-[#7A6D61] shadow-sm transition hover:bg-[#FAF6F0]"
              title="Refresh database records"
            >
              <RefreshCw
                size={13}
                className={isRefreshing ? "animate-spin text-[#4A1525]" : ""}
              />
              Refresh
            </button>

            <div className="flex items-center gap-1 rounded-xl border border-[#E5DCD0] bg-white p-1 shadow-sm">
              {["All", "This Month", "Last 3 Months"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    period === item
                      ? "bg-[#4A1525] text-white shadow-sm"
                      : "text-[#7A6D61] hover:bg-[#FAF6F0]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#4A1525]" />
              <p className="text-xs font-medium text-[#8F8175]">
                Fetching revenue data by ID from database...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* 4 Financial Stat Cards */}
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Total Revenue */}
              <div className="rounded-2xl border border-[#E5DCD0] bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6EDF1] text-[#4A1525]">
                    <IndianRupee size={19} />
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-[#EAF6ED] px-2 py-1 text-[10px] font-bold text-[#2E7D32]">
                    <ArrowUpRight size={11} />
                    Verified
                  </span>
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Total Revenue
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#4A1525]">
                  {formatCurrency(totalRevenue)}
                </h2>

                <p className="mt-1 text-[11px] text-[#8F8175]">
                  From {revenueOrders.length} paid orders
                </p>
              </div>

              {/* Completed Revenue */}
              <div className="rounded-2xl border border-[#E5DCD0] bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6ED] text-[#2E7D32]">
                    <CheckCircle2 size={19} />
                  </div>
                  <span className="rounded-full bg-[#FAF6F0] px-2 py-1 text-[10px] font-bold text-[#7A6D61]">
                    Delivered
                  </span>
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Completed Revenue
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#2E7D32]">
                  {formatCurrency(completedRevenue)}
                </h2>

                <p className="mt-1 text-[11px] text-[#8F8175]">
                  Successfully fulfilled handlooms
                </p>
              </div>

              {/* Pending Revenue */}
              <div className="rounded-2xl border border-[#E5DCD0] bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF0E1] text-[#A16B16]">
                    <Clock size={19} />
                  </div>
                  <span className="rounded-full bg-[#FAF6F0] px-2 py-1 text-[10px] font-bold text-[#A16B16]">
                    In Pipeline
                  </span>
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Pending Revenue
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#A16B16]">
                  {formatCurrency(pendingRevenue)}
                </h2>

                <p className="mt-1 text-[11px] text-[#8F8175]">
                  In production or awaiting settlement
                </p>
              </div>

              {/* Average Order Value */}
              <div className="rounded-2xl border border-[#E5DCD0] bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F4FA] text-[#1E6589]">
                    <ShoppingBag size={19} />
                  </div>
                  <span className="rounded-full bg-[#E6F4FA] px-2 py-1 text-[10px] font-bold text-[#1E6589]">
                    Per Order
                  </span>
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-[#9B8068]">
                  Average Order Value
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#1E6589]">
                  {formatCurrency(averageOrderValue)}
                </h2>

                <p className="mt-1 text-[11px] text-[#8F8175]">
                  Avg amount per completed order
                </p>
              </div>
            </div>

            {/* Visual Analytics Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
              {/* Monthly Revenue Bar Chart */}
              <div className="rounded-3xl border border-[#E5DCD0] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#4A1525]">
                      Monthly Revenue Trend
                    </h2>
                    <p className="mt-1 text-[11px] text-[#8F8175]">
                      Visual timeline of receipts for active manufacturer ID
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F6EDF1] text-[#4A1525]">
                    <TrendingUp size={17} />
                  </div>
                </div>

                <div className="mt-8 flex h-64 items-end gap-2 sm:gap-4">
                  {monthlyRevenue.map((item) => {
                    const height =
                      item.revenue > 0
                        ? Math.max(
                            (item.revenue / maxRevenue) * 100,
                            10
                          )
                        : 4;

                    return (
                      <div
                        key={item.month}
                        className="group flex h-full flex-1 flex-col justify-end"
                      >
                        <div className="relative flex flex-1 items-end">
                          <div
                            className="w-full rounded-t-lg bg-[#7A2140] transition-all duration-300 group-hover:bg-[#A16B16]"
                            style={{
                              height: `${height}%`
                            }}
                            title={`${item.month}: ${formatCurrency(
                              item.revenue
                            )}`}
                          />
                        </div>

                        <p className="mt-2 text-center text-[9px] font-bold text-[#9B8068]">
                          {item.month}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#F0E8DF] pt-4">
                  <div className="flex items-center gap-2 text-[10px] text-[#8F8175]">
                    <span className="h-2 w-2 rounded-full bg-[#7A2140]" />
                    Realized Revenue
                  </div>

                  <p className="font-serif text-sm font-bold text-[#4A1525]">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
              </div>

              {/* Product Revenue Leaderboard */}
              <div className="rounded-3xl border border-[#E5DCD0] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#4A1525]">
                      Product Performance
                    </h2>
                    <p className="mt-1 text-[11px] text-[#8F8175]">
                      Top weaving patterns by sales volume
                    </p>
                  </div>

                  <Package size={18} className="text-[#A16B16]" />
                </div>

                <div className="mt-5 space-y-4">
                  {productRevenue.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-xs text-[#8F8175]">
                        No completed sales recorded for this period.
                      </p>
                    </div>
                  ) : (
                    productRevenue.slice(0, 5).map((product) => {
                      const percentage =
                        totalRevenue > 0
                          ? Math.round((product.revenue / totalRevenue) * 100)
                          : 0;

                      return (
                        <div key={product.name}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-[#292421]">
                                {product.name}
                              </p>
                              <p className="mt-0.5 text-[10px] text-[#9B8068]">
                                {product.category} • {product.quantity} unit(s)
                              </p>
                            </div>

                            <p className="whitespace-nowrap font-serif text-sm font-bold text-[#4A1525]">
                              {formatCurrency(product.revenue)}
                            </p>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0E8DF]">
                            <div
                              className="h-full rounded-full bg-[#7A2140]"
                              style={{
                                width: `${percentage}%`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Transaction Table */}
            <div className="mt-6 rounded-3xl border border-[#E5DCD0] bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-[#F0E8DF] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#4A1525]">
                    Revenue Transactions
                  </h2>
                  <p className="mt-1 text-[11px] text-[#8F8175]">
                    All recorded booking & order transactions from database for ID:{" "}
                    <span className="font-mono font-medium text-[#4A1525]">
                      {String(displayId)}
                    </span>
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8F84]"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by order, customer, product..."
                    className="h-9 w-full rounded-xl border border-[#E5DCD0] bg-[#FAF6F0] pl-9 pr-3 text-xs outline-none focus:border-[#4A1525]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#F0E8DF] bg-[#FAF6F0] text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
                      <th className="px-5 py-3">Order</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F5EFE8]">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id || order.id || order.orderId}
                        className="transition hover:bg-[#FAF6F0]/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F6EDF1] text-[#4A1525]">
                              <CreditCard size={14} />
                            </div>
                            <span className="font-bold text-[#4A1525]">
                              {order.orderId}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs font-semibold">
                          <div>
                            <p className="text-[#292421]">{order.customer}</p>
                            {order.customerEmail && (
                              <p className="text-[10px] text-[#9B8068]">
                                {order.customerEmail}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="max-w-[220px] px-5 py-4">
                          <p className="truncate text-xs font-semibold text-[#292421]">
                            {order.product}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#9B8068]">
                            {order.category || "Silk"} • {order.quantity || 1}{" "}
                            unit(s)
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-[11px] text-[#7A6D61]">
                          <div className="flex items-center gap-1">
                            <CalendarDays size={12} />
                            {order.date}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              order.payment === "Paid" || order.payment === "Advance Paid"
                                ? "bg-[#EAF6ED] text-[#2E7D32]"
                                : "bg-[#FFF4DF] text-[#A16B16]"
                            }`}
                          >
                            {order.payment || "Pending"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <span className="font-serif text-sm font-bold text-[#4A1525]">
                            {order.amount}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredOrders.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-12 text-center text-xs text-[#8F8175]"
                        >
                          No transactions found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <RAG />
      </main>
    </>
  );
};

export default Revenue;