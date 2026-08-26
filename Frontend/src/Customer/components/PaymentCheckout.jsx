import React, { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  Lock,
  CheckCircle2,
  Sparkles,
  Truck,
  ArrowRight,
  Receipt,
  RotateCcw
} from "lucide-react";

export default function PaymentCheckout({
  orderData,
  isCustomBooking = false,
  onPaymentSuccess,
  onCancel
}) {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("ananya@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("721");
  const [cardHolder, setCardHolder] = useState("Ananya Deshmukh");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [loading, setLoading] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [generatedTxn, setGeneratedTxn] = useState("");

  if (!orderData) return null;

  const rawAmount =
    typeof orderData.price === "number"
      ? orderData.price
      : isCustomBooking
      ? 3000
      : Number(String(orderData.price || orderData.amount || "8500").replace(/[^0-9.]/g, "")) || 8500;

  const formattedAmount = `₹${rawAmount.toLocaleString("en-IN")}`;

  const paymentMethods = [
    {
      id: "upi",
      title: "UPI Instant Payment",
      desc: "Google Pay, PhonePe, Paytm, BHIM QR",
      badge: "Instant & Recommended",
      icon: <Smartphone className="h-5 w-5 text-[#2E7D32]" />
    },
    {
      id: "card",
      title: "Credit / Debit Card",
      desc: "Visa, MasterCard, RuPay, Amex",
      badge: "256-Bit Encrypted",
      icon: <CreditCard className="h-5 w-5 text-[#4A1525]" />
    },
    {
      id: "netbanking",
      title: "Net Banking",
      desc: "HDFC, SBI, ICICI, Axis, Kotak",
      badge: "All Indian Banks",
      icon: <Building className="h-5 w-5 text-[#A16B16]" />
    },
    {
      id: "escrow",
      title: "Vastra Artisan Escrow",
      desc: "Held in escrow until loom stage verification",
      badge: "100% Buyer Protected",
      icon: <ShieldCheck className="h-5 w-5 text-[#704C91]" />
    }
  ];

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const txnId = `TXN-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedTxn(txnId);

    try {
      // Step 1: Verify payment simulation on backend
      await fetch("http://localhost:5000/api/customer/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType: isCustomBooking ? "custom_loom" : "ready_made",
          amount: formattedAmount,
          paymentMethod: selectedMethod.toUpperCase(),
          customerEmail: orderData.customerEmail || "customer@example.com",
          orderDetails: orderData
        })
      });

      // Step 2: Create either ready-made order or custom booking in MongoDB
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
        onPaymentSuccess?.({
          transactionId: txnId,
          amount: formattedAmount,
          method: selectedMethod
        });
      }, 1500);
    } catch (err) {
      console.error("Payment error:", err);
      setLoading(false);
      setPaidSuccess(true);
      setTimeout(() => {
        onPaymentSuccess?.({
          transactionId: txnId,
          amount: formattedAmount,
          method: selectedMethod
        });
      }, 1500);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left Column: Payment Methods & Inputs (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-2 border-b border-[#F0E8DF] pb-4">
            <Lock className="h-5 w-5 text-emerald-600" />
            <div>
              <h2 className="font-serif text-xl font-bold text-[#4A1525]">
                Select Secure Payment Method
              </h2>
              <p className="text-xs text-[#7A6D61]">
                End-to-end 256-bit encrypted handloom artisan transaction
              </p>
            </div>
          </div>

          {/* Payment Method Cards */}
          <div className="mt-5 space-y-3">
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
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs border border-[#E5DCD0]">
                    {pm.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-serif text-sm font-bold text-[#292421]">
                        {pm.title}
                      </p>
                      <span className="rounded-full bg-[#FAF0E1] px-2 py-0.5 text-[9px] font-bold text-[#A16B16]">
                        {pm.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6D61] mt-0.5">{pm.desc}</p>
                  </div>
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

          {/* Method Specific Form Details */}
          <div className="mt-6 rounded-2xl bg-[#FAF6F0] p-5 border border-[#F0E8DF]">
            {selectedMethod === "upi" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#4A1525]">Virtual Payment Address (UPI ID)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank / mobile@upi"
                  className="w-full rounded-xl border border-[#E5DCD0] bg-white p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:outline-hidden"
                />
                <p className="text-[11px] text-[#7A6D61]">
                  A payment request will be triggered to your UPI app (GPay / PhonePe / Paytm).
                </p>
              </div>
            )}

            {selectedMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#4A1525]">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-white p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-white p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4A1525]">CVV Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E5DCD0] bg-white p-2.5 text-xs text-[#292421] focus:border-[#4A1525] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "netbanking" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#4A1525]">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-xl border border-[#E5DCD0] bg-white p-3 text-xs text-[#292421] focus:border-[#4A1525] focus:outline-hidden"
                >
                  <option>HDFC Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {selectedMethod === "escrow" && (
              <div className="text-xs text-[#56493F] space-y-1">
                <p className="font-bold text-[#4A1525]">Vastra Artisan Escrow Protection</p>
                <p className="leading-relaxed">
                  Your funds remain locked in a safe government-compliant escrow vault. The master weaver receives payment only after quality stage confirmation and Silk Mark tagging.
                </p>
              </div>
            )}
          </div>

          {/* Pay Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[#D9CBBF] px-5 py-3 text-xs font-bold text-[#56493F] hover:bg-[#FAF6F0] transition cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleProcessPayment}
              disabled={loading || paidSuccess}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-[#FCDA8B]" />
                  <span>Authorizing Artisan Transaction...</span>
                </>
              ) : paidSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Payment Authorized! Redirecting...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-[#FCDA8B]" />
                  <span>
                    Pay & Confirm {isCustomBooking ? "Loom Advance" : "Order"} ({formattedAmount})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary & Price Breakdown (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-3xl border border-[#E5DCD0] bg-white p-6 shadow-xs sm:p-8 space-y-6">
          <div className="border-b border-[#F0E8DF] pb-4">
            <h3 className="font-serif text-xl font-bold text-[#4A1525]">
              {isCustomBooking ? "Custom Loom Order Summary" : "Handloom Order Summary"}
            </h3>
            <p className="text-xs text-[#7A6D61]">Direct artisan checkout</p>
          </div>

          {/* Item Snapshot */}
          <div className="flex gap-4 items-start">
            <img
              src={orderData.image || "/images/kanchi.png"}
              alt="Saree"
              className="h-20 w-20 rounded-2xl object-cover border border-[#E5DCD0]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/kanchi.png";
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-sm font-bold text-[#292421] truncate">
                {orderData.product || orderData.fabricChoice || "Kanchipuram Silk Saree"}
              </h4>
              <p className="text-xs text-[#7A6D61] mt-0.5">
                Master Weaver: <strong>{orderData.artisanName || "Rithikeswaran M"}</strong>
              </p>
              <p className="text-[11px] text-[#A16B16] font-medium mt-0.5">
                {orderData.manufacturer || "Kathar Weaves"} • {orderData.weave || orderData.loomType || "Hand Woven"}
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 border-t border-[#F0E8DF] pt-4 text-xs">
            <div className="flex justify-between text-[#56493F]">
              <span>{isCustomBooking ? "Bespoke Loom Advance Deposit" : "Handloom Base Price"}</span>
              <span className="font-bold">{formattedAmount}</span>
            </div>

            {isCustomBooking && (
              <div className="flex justify-between text-[#8F8175]">
                <span>Balance Due Upon Loom Cut & Dispatch</span>
                <span>₹11,500</span>
              </div>
            )}

            <div className="flex justify-between text-[#56493F]">
              <span>Insured Handloom Shipping</span>
              <span className="font-bold text-emerald-700">FREE</span>
            </div>

            <div className="flex justify-between text-[#56493F]">
              <span>Silk Mark & GI QR Authentication</span>
              <span className="font-bold text-emerald-700">INCLUDED</span>
            </div>

            <div className="flex justify-between border-t border-[#EAE0D4] pt-3 text-sm font-bold text-[#4A1525]">
              <span>Amount Payable Now</span>
              <span className="font-serif text-xl">{formattedAmount}</span>
            </div>
          </div>

          {/* Value Props */}
          <div className="space-y-2 rounded-2xl bg-[#FAF6F0] p-4 text-[11px] text-[#6B5E52]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Direct weaver payout without middleman deductions.</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#A16B16] shrink-0" />
              <span>Insured delivery with real-time stage tracking.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

