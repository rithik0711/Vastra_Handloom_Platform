import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import PaymentCheckout from "./components/PaymentCheckout";
import { ChevronLeft, ShieldCheck, Sparkles, Lock } from "lucide-react";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve passed payload from navigation state
  const stateData = location.state || {};
  const isCustomBooking = Boolean(stateData.isCustomBooking);
  const orderData = stateData.orderData || {
    product: "Kanchipuram Pure Silk Korvai Saree",
    fabricChoice: "Pure Mulberry Silk & Gold Zari",
    price: 8500,
    amount: "₹8,500",
    manufacturer: "Kathar Weaves",
    artisanName: "Rithikeswaran M",
    image: "/images/kanchi.png",
    customerName: "Ananya Deshmukh",
    customerEmail: localStorage.getItem("userEmail") || "customer@example.com",
    customerPhone: "+91 98451 23456",
    shippingAddress: "Flat 402, Lotus Residency, Indiranagar, Bengaluru, Karnataka - 560038"
  };

  const handlePaymentSuccess = (paymentResult) => {
    navigate("/customer/orders", {
      state: {
        orderSuccess: true,
        transactionId: paymentResult.transactionId,
        isCustomBooking
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="manufacturer-main min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3.5 py-2 text-xs font-bold text-[#56493F] shadow-2xs hover:bg-[#FAF6F0] hover:text-[#4A1525] transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 rounded-full bg-[#EAF6ED] px-3.5 py-1 text-xs font-bold text-[#2E7D32] border border-[#C8E6C9]">
            <Lock className="h-3.5 w-3.5" />
            <span>256-Bit Bank Grade SSL Encrypted</span>
          </div>
        </div>

        {/* Title */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D09229] ring-4 ring-[#D09229]/20" />
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B8068]">
              Checkout & Payment
            </p>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#4A1525] sm:text-4xl">
            {isCustomBooking ? "Authorize Bespoke Loom Advance" : "Handloom Artisan Checkout"}
          </h1>
          <p className="mt-1 text-xs text-[#7A6D61] sm:text-sm">
            Complete your order payment safely. Funds go directly to verified master weavers without intermediary cuts.
          </p>
        </div>

        {/* Modular Payment Component */}
        <div className="mt-8">
          <PaymentCheckout
            orderData={orderData}
            isCustomBooking={isCustomBooking}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={() => navigate(-1)}
          />
        </div>
      </main>
    </div>
  );
}

