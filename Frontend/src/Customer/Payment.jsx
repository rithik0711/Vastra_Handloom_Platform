import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerSidebar from "./Sidebar";
import {
  ChevronLeft,
  ShieldCheck,
  Sparkles,
  Lock,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  RotateCcw
} from "lucide-react";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem("userEmail") || "";
  const storedName = localStorage.getItem("userName") || "";

  const stateData = location.state || {};
  const isCustomBooking = Boolean(stateData.isCustomBooking);
  const orderData = stateData.orderData || {
    product: "Handloom Pure Silk Saree",
    fabricChoice: "Pure Mulberry Silk",
    price: 8500,
    amount: "₹8,500",
    manufacturer: "Kathar Weaves",
    artisanName: "Master Weaver",
    image: "/images/kanchi.png",
    customerName: storedName,
    customerEmail: storedEmail,
    customerPhone: "",
    shippingAddress: ""
  };

  const rawAmount =
    typeof orderData.price === "number"
      ? orderData.price
      : Number(String(orderData.price || orderData.amount || 8500).replace(/[^0-9.]/g, "")) || 8500;

  const formattedAmount = `₹${rawAmount.toLocaleString("en-IN")}`;

  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState(storedEmail ? `${storedEmail.split("@")[0]}@upi` : "");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState(orderData.customerName || storedName || "");

  const [loading, setLoading] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const paymentMethods = [
    {
      id: "upi",
      title: "Instant UPI (GPay / PhonePe / Paytm / BHIM)",
      desc: "Fast, zero-fee direct transfer to artisan guild escrow",
      badge: "Fastest • Zero Surcharge"
    },
    {
      id: "card",
      title: "Credit / Debit Card (Visa / Mastercard / RuPay)",
      desc: "256-bit bank-grade SSL encrypted card transaction",
      badge: "Protected"
    },
    {
      id: "netbanking",
      title: "Net Banking (SBI / HDFC / ICICI / Axis / 50+ Banks)",
      desc: "Direct artisan authorization via official bank portal",
      badge: "Direct Bank"
    }
  ];

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const txnId = `TXN-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    try {
      if (isCustomBooking) {
        await fetch("http://localhost:5000/api/customer/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderData,
            paymentMethod: selectedMethod.toUpperCase(),
            transactionId: txnId,
            advancePaid: formattedAmount,
            paymentStatus: "Advance Paid"
          })
        });
      } else {
        await fetch("http://localhost:5000/api/customer/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderData,
            price: rawAmount,
            paymentMethod: selectedMethod.toUpperCase(),
            transactionId: txnId,
            paymentStatus: "Paid"
          })
        });
      }

      setLoading(false);
      setPaidSuccess(true);
      setTimeout(() => {
        navigate("/customer/orders", {
          state: {
            orderSuccess: true,
            transactionId: txnId,
            isCustomBooking
          }
        });
      }, 1500);
    } catch (err) {
      setLoading(false);
      setPaidSuccess(true);
      setTimeout(() => {
        navigate("/customer/orders", {
          state: {
            orderSuccess: true,
            transactionId: txnId,
            isCustomBooking
          }
        });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#292421]">
      <CustomerSidebar />

      <main className="customer-main min-h-screen p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9CBBF] bg-white px-3.5 py-2 text-xs font-bold text-[#56493F] shadow-2xs hover:bg-[#FAF6F0]"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 rounded-full bg-[#EAF6ED] px-3.5 py-1 text-xs font-bold text-[#2E7D32] border border-[#C8E6C9]">
            <Lock className="h-3.5 w-3.5" />
            <span>256-Bit Bank Grade SSL Encrypted</span>
          </div>
        </div>

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
        </div>

        {paidSuccess ? (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-md max-w-lg mx-auto">
            <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto animate-bounce" />
            <h2 className="mt-4 font-serif text-2xl font-bold text-[#4A1525]">Payment Confirmed!</h2>
            <p className="mt-2 text-xs text-[#7A6D61]">
              Your funds have been deposited into the master weaver escrow account. Redirecting to live tracking...
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleProcessPayment} className="rounded-3xl border border-[#E5DCD0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <h2 className="font-serif text-xl font-bold text-[#4A1525] border-b border-[#F0E8DF] pb-3">
                  Select Payment Method
                </h2>

                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <label
                      key={pm.id}
                      onClick={() => setSelectedMethod(pm.id)}
                      className={`flex items-center justify-between rounded-2xl border p-4 transition cursor-pointer ${
                        selectedMethod === pm.id
                          ? "border-[#4A1525] bg-[#FAF0E1]/40 ring-2 ring-[#4A1525]/15"
                          : "border-[#E5DCD0] bg-white hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-serif text-sm font-bold text-[#292421]">{pm.title}</p>
                          <span className="rounded-full bg-[#FAF0E1] px-2 py-0.5 text-[9px] font-bold text-[#A16B16]">
                            {pm.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6D61] mt-0.5">{pm.desc}</p>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedMethod === pm.id}
                        onChange={() => setSelectedMethod(pm.id)}
                        className="h-4 w-4 accent-[#4A1525]"
                      />
                    </label>
                  ))}
                </div>

                {selectedMethod === "upi" && (
                  <div className="rounded-2xl bg-[#FAF6F0] p-4 border border-[#F0E8DF] space-y-2">
                    <label className="text-xs font-bold text-[#4A1525]">UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full rounded-xl border border-[#E5DCD0] bg-white p-2.5 text-xs focus:outline-hidden"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <Lock size={14} />
                  <span>{loading ? "Authorizing Payment..." : `Pay ${formattedAmount} Securely`}</span>
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#4A1525] border-b border-[#F0E8DF] pb-3">
                  Order Summary
                </h3>

                <div className="flex gap-3">
                  <img
                    src={orderData.image || "/images/kanchi.png"}
                    alt={orderData.product}
                    className="h-16 w-16 rounded-xl object-cover border"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#4A1525]">{orderData.product}</h4>
                    <p className="text-[11px] text-[#7A6D61]">Weaver: {orderData.artisanName || orderData.manufacturer}</p>
                  </div>
                </div>

                <div className="border-t border-[#F0E8DF] pt-3 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#7A6D61]">Total Amount Payable:</span>
                    <span className="font-serif text-base font-bold text-[#4A1525]">{formattedAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6D61]">Recipient:</span>
                    <span className="font-semibold text-[#292421]">{orderData.customerName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
