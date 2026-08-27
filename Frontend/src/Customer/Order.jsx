import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import ReadyMadeOrderTracker from "./components/ReadyMadeOrderTracker";
import CustomLoomOrderTracker from "./components/CustomLoomOrderTracker";
import ArtisanReviewModal from "./components/ArtisanReviewModal";
import {
  Package,
  Sparkles,
  CheckCircle2,
  Layers,
  ShoppingBag,
  Clock,
  RotateCcw,
  ArrowRight
} from "lucide-react";

export default function CustomerOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    location.state?.isCustomBooking ? "custom" : "ready_made"
  );

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewContext, setReviewContext] = useState(null);
  const [reviewSuccessAlert, setReviewSuccessAlert] = useState(false);
  const [reviewedArtisanName, setReviewedArtisanName] = useState("");

  const defaultOrders = [
    {
      id: "ORD-9821",
      orderId: "ORD-9821",
      product: "Kanchipuram Pure Silk Korvai Saree",
      manufacturer: "Kathar Weaves",
      artisanName: "Rithikeswaran M",
      price: 8500,
      amount: "₹8,500",
      orderDate: "12 Aug 2026",
      status: "Dispatched",
      estimatedDelivery: "25 Aug 2026",
      image: "/images/kanchi.png",
      currentStage: 4,
      deliveryAddress: "Flat 402, Lotus Residency, Indiranagar, Bengaluru",
      transactionId: "TXN-849201",
      isReviewed: false
    },
    {
      id: "ORD-8430",
      orderId: "ORD-8430",
      product: "Traditional Handloom Cotton Saree",
      manufacturer: "Kathar Weaves",
      artisanName: "Rithikeswaran M",
      price: 4200,
      amount: "₹4,200",
      orderDate: "28 Jul 2026",
      status: "Delivered",
      estimatedDelivery: "08 Aug 2026",
      image: "/images/cotton.png",
      currentStage: 5,
      deliveryAddress: "Flat 402, Lotus Residency, Indiranagar, Bengaluru",
      transactionId: "TXN-719342",
      isReviewed: false
    }
  ];

  const defaultBookings = [
    {
      id: "BK-501",
      bookingId: "BK-501",
      manufacturer: "Kathar Weaves",
      artisanName: "Rithikeswaran M",
      loomType: "Traditional Pit Loom",
      fabricChoice: "Pure Mulberry Silk & Gold Zari",
      zariType: "Tested Half-Fine Gold Zari",
      customPattern: "Peacock Motif with Contrast Pallu",
      bodyColor: "Crimson Red",
      borderColor: "Temple Gold Border",
      bookingDate: "14 Aug 2026",
      targetCompletion: "10 Sep 2026",
      status: "Artisan Weaving",
      currentStage: 4,
      advancePaid: "₹3,000",
      estimatedPrice: "₹14,500",
      deliveryAddress: "Flat 402, Lotus Residency, Indiranagar, Bengaluru",
      transactionId: "TXN-BESPOKE-901",
      isReviewed: false
    }
  ];

  const fetchData = () => {
    setLoading(true);
    const userEmail = localStorage.getItem("userEmail") || "customer@example.com";

    Promise.all([
      fetch(`http://localhost:5000/api/customer/orders?email=${encodeURIComponent(userEmail)}`),
      fetch(`http://localhost:5000/api/customer/bookings?email=${encodeURIComponent(userEmail)}`)
    ])
      .then(async ([ordersRes, bookingsRes]) => {
        const ordersJson = await ordersRes.json();
        const bookingsJson = await bookingsRes.json();

        if (ordersJson.status === "success" && Array.isArray(ordersJson.data) && ordersJson.data.length > 0) {
          setOrders(ordersJson.data);
        } else {
          setOrders(defaultOrders);
        }

        if (bookingsJson.status === "success" && Array.isArray(bookingsJson.data) && bookingsJson.data.length > 0) {
          setBookings(bookingsJson.data);
        } else {
          setBookings(defaultBookings);
        }
      })
      .catch(() => {
        setOrders(defaultOrders);
        setBookings(defaultBookings);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReviewSuccess = (reviewResult) => {
    setReviewedArtisanName(reviewResult.artisanName || "Master Weaver");
    setReviewSuccessAlert(true);
    setTimeout(() => setReviewSuccessAlert(false), 6000);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
                Customer Portal
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
              Orders & Weaving Tracker
            </h1>
            <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
              Live tracking for ready-made handloom dispatches and bespoke custom pit-loom commissions.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchData}
            className="flex items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3.5 py-2 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0] transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Payment / Order Success Notice */}
        {location.state?.orderSuccess && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">Transaction Authorized Successfully!</p>
                <p className="text-[11px] text-emerald-700">
                  Transaction ID: <strong className="font-mono">{location.state.transactionId}</strong>. The weaver has received your order.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Review Submitted Banner */}
        {reviewSuccessAlert && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Review Submitted for Master Weaver {reviewedArtisanName}!</p>
              <p className="text-[11px] text-emerald-700">
                Your rating and craftsmanship feedback is now recorded and published on their artisan profile.
              </p>
            </div>
          </div>
        )}

        {/* Segmented Dual Tracker Switcher */}
        <div className="mt-8 flex rounded-2xl bg-[#EFE6DB] p-1.5 max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab("ready_made")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "ready_made"
                ? "bg-[#4A1525] text-white shadow-xs"
                : "text-[#6B5E52] hover:text-[#4A1525]"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Ready-Made Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "custom"
                ? "bg-[#4A1525] text-white shadow-xs"
                : "text-[#6B5E52] hover:text-[#4A1525]"
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#D09229]" />
            <span>Custom Loom Orders ({bookings.length})</span>
          </button>
        </div>

        {/* Trackers List */}
        <div className="mt-6 space-y-6">
          {activeTab === "ready_made" ? (
            /* Ready-Made Orders Section */
            orders.length > 0 ? (
              orders.map((order) => (
                <ReadyMadeOrderTracker
                  key={order.orderId || order.id || order._id}
                  order={order}
                  onReviewArtisan={(ctx) => setReviewContext(ctx)}
                />
              ))
            ) : (
              <div className="mt-8 rounded-3xl border border-[#E5DCD0] bg-white p-12 text-center shadow-xs">
                <Package className="h-10 w-10 text-[#A16B16] mx-auto" />
                <h3 className="mt-3 font-serif text-xl font-bold text-[#4A1525]">
                  No Ready-Made Orders Found
                </h3>
                <p className="mt-1 text-xs text-[#7A6D61]">
                  Explore our authentic handloom collection and order directly from master artisans.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/customer")}
                  className="mt-5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
                >
                  Browse Handloom Weaves
                </button>
              </div>
            )
          ) : (
            /* Bespoke Custom Loom Orders Section */
            bookings.length > 0 ? (
              bookings.map((booking) => (
                <CustomLoomOrderTracker
                  key={booking.bookingId || booking.id || booking._id}
                  booking={booking}
                  onReviewArtisan={(ctx) => setReviewContext(ctx)}
                />
              ))
            ) : (
              <div className="mt-8 rounded-3xl border border-[#E5DCD0] bg-white p-12 text-center shadow-xs">
                <Sparkles className="h-10 w-10 text-[#D09229] mx-auto" />
                <h3 className="mt-3 font-serif text-xl font-bold text-[#4A1525]">
                  No Custom Loom Bookings Yet
                </h3>
                <p className="mt-1 text-xs text-[#7A6D61]">
                  Commission a bridal or heirloom saree customized to your unique colors, zari, and motifs.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/customer/booking")}
                  className="mt-5 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 transition cursor-pointer"
                >
                  Book Dedicated Loom Slot
                </button>
              </div>
            )
          )}
        </div>

        {/* Master Weaver Review Modal */}
        {reviewContext && (
          <ArtisanReviewModal
            reviewContext={reviewContext}
            onClose={() => setReviewContext(null)}
            onSubmitSuccess={handleReviewSuccess}
          />
        )}
      </main>
    </div>
  );
}
