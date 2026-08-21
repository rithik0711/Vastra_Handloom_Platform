import React, { useState, useEffect } from "react";
import CustomerSidebar from "./Sidebar";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Calendar,
  IndianRupee,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function CustomerOrder() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-9821",
      product: "Kanchipuram Pure Silk Saree",
      manufacturer: "Kathar Weaves",
      price: 8500,
      amount: "₹8,500",
      orderDate: "12 Aug 2026",
      status: "In Weaving Stage",
      estimatedDelivery: "25 Aug 2026",
      image: "/images/kanchi.png",
      currentStage: 3,
      stages: [
        { name: "Yarn Dyeing", completed: true, date: "13 Aug" },
        { name: "Loom Setup & Warping", completed: true, date: "15 Aug" },
        { name: "Artisan Weaving (60%)", completed: false, date: "In Progress" },
        { name: "Quality Check & Polishing", completed: false, date: "Pending" },
        { name: "Dispatched", completed: false, date: "Pending" }
      ]
    },
    {
      id: "ORD-8430",
      product: "Traditional Handloom Cotton Saree",
      manufacturer: "Kathar Weaves",
      price: 4200,
      amount: "₹4,200",
      orderDate: "28 Jul 2026",
      status: "Delivered",
      estimatedDelivery: "08 Aug 2026",
      image: "/images/cotton.png",
      currentStage: 5,
      stages: [
        { name: "Yarn Dyeing", completed: true, date: "29 Jul" },
        { name: "Loom Setup", completed: true, date: "31 Jul" },
        { name: "Artisan Weaving", completed: true, date: "04 Aug" },
        { name: "Quality Check", completed: true, date: "06 Aug" },
        { name: "Delivered", completed: true, date: "08 Aug" }
      ]
    }
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/api/customer/orders")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success" && json.data) {
          setOrders(json.data);
        }
      })
      .catch((err) => console.log("Using cached customer orders:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
              Customer Portal
            </p>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
            My Handloom Orders
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Track the live weaving journey and craftsmanship stages of your sarees.
          </p>
        </div>

        {/* Orders List */}
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs transition hover:shadow-md sm:p-8"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-[#F0E8DF] pb-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={order.image || "/images/kanchi.png"}
                    alt={order.product}
                    className="h-16 w-16 rounded-2xl object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/kanchi.png";
                    }}
                  />
                  <div>
                    <span className="text-[11px] font-bold text-[#A16B16]">
                      #{order.id} • Ordered on {order.orderDate}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#292421]">
                      {order.product}
                    </h3>
                    <p className="text-xs text-[#7A6D61]">Woven by {order.manufacturer}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#8F8175]">Total Amount</p>
                    <p className="font-serif text-lg font-bold text-[#4A1525]">{order.amount}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      order.status === "Delivered"
                        ? "bg-[#EAF6ED] text-[#2E7D32] border border-[#C8E6C9]"
                        : "bg-[#FFF4DF] text-[#A16B16] border border-[#F5DEC0]"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#9B8068]">
                  Artisan Production Journey
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-5">
                  {order.stages &&
                    order.stages.map((stage, idx) => {
                      const isComplete = stage.completed;
                      const isCurrent = idx + 1 === order.currentStage;
                      return (
                        <div
                          key={stage.name}
                          className={`relative flex flex-col rounded-2xl border p-3.5 transition ${
                            isComplete
                              ? "border-emerald-200 bg-emerald-50/50"
                              : isCurrent
                              ? "border-[#D09229] bg-[#FAF0E1]/40"
                              : "border-[#EFE5DB] bg-[#FAF6F0]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                isComplete
                                  ? "bg-emerald-600 text-white"
                                  : isCurrent
                                  ? "bg-[#D09229] text-white animate-pulse"
                                  : "bg-[#E0D4C7] text-[#7A6D61]"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-[10px] text-[#8F8175]">{stage.date}</span>
                          </div>
                          <p
                            className={`mt-2 text-xs font-bold ${
                              isComplete
                                ? "text-emerald-900"
                                : isCurrent
                                ? "text-[#4A1525]"
                                : "text-[#8F8175]"
                            }`}
                          >
                            {stage.name}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
