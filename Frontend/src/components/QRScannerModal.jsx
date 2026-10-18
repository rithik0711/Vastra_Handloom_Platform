import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  Camera,
  X,
  Upload,
  QrCode,
  Sparkles,
  ShieldCheck,
  Search,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

export default function QRScannerModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("camera"); // "camera" | "upload" | "manual"
  const [manualId, setManualId] = useState("");
  const [scanError, setScanError] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef(null);
  const containerId = "vastra-qr-reader-region";

  const handleScanSuccess = (decodedText) => {
    stopCamera();
    onClose();

    // Parse the scanned content
    let targetId = decodedText.trim();

    // If it's a URL like http://.../product/VASTRA-SIL-... or http://.../verify/123
    if (targetId.includes("/product/")) {
      targetId = targetId.split("/product/")[1].split("?")[0].split("#")[0];
    } else if (targetId.includes("/verify/")) {
      targetId = targetId.split("/verify/")[1].split("?")[0].split("#")[0];
    } else if (targetId.startsWith("{") && targetId.endsWith("}")) {
      try {
        const parsed = JSON.parse(targetId);
        targetId = parsed.uniqueId || parsed.code || parsed.id || parsed._id || targetId;
      } catch (e) {
        console.warn("JSON parse err in QR:", e);
      }
    }

    // Navigate to public mobile product view
    navigate(`/product/${targetId}`);
  };

  const startCamera = async () => {
    setScanError("");
    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
      };

      await html5QrCode.start(
        { facingMode: "environment" }, // prefer rear smartphone camera
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // ignore continuous scanning frame errors
        }
      );
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Camera start error:", err);
      setIsCameraActive(false);
      setScanError("Camera access was not granted or not available. Please allow camera permissions or upload an image of the QR code.");
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (e) {
        console.warn("Camera stop error:", e);
      }
      scannerRef.current = null;
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "camera") {
      const timer = setTimeout(() => {
        startCamera();
      }, 300);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, activeTab]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError("");
    try {
      const html5QrCode = new Html5Qrcode("vastra-file-scan-temp");
      const decodedText = await html5QrCode.scanFile(file, true);
      handleScanSuccess(decodedText);
    } catch (err) {
      console.error("File QR scan error:", err);
      setScanError("Could not detect a clear QR Code in the uploaded image. Please try another photo.");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    onClose();
    let target = manualId.trim();
    if (target.includes("/product/")) {
      target = target.split("/product/")[1];
    }
    navigate(`/product/${target}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E5DCD0] bg-[#FAF8F4] shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5DCD0] bg-gradient-to-r from-[#4A1525] to-[#7A263B] px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs">
              <QrCode className="h-4 w-4 text-[#FCDA8B]" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white leading-tight">
                Scan Saree Authenticity Tag
              </h3>
              <p className="text-[10px] text-[#FCDA8B] font-semibold">
                Instant Silk Mark & Origin Verification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E8DEC8] bg-white text-xs font-bold text-[#7A6D61]">
          <button
            type="button"
            onClick={() => setActiveTab("camera")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-3 transition cursor-pointer ${
              activeTab === "camera"
                ? "border-b-2 border-[#4A1525] text-[#4A1525] bg-[#FAF8F4]"
                : "hover:text-[#292421]"
            }`}
          >
            <Camera size={14} />
            <span>Live Camera</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-3 transition cursor-pointer ${
              activeTab === "upload"
                ? "border-b-2 border-[#4A1525] text-[#4A1525] bg-[#FAF8F4]"
                : "hover:text-[#292421]"
            }`}
          >
            <Upload size={14} />
            <span>Upload Image</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-3 transition cursor-pointer ${
              activeTab === "manual"
                ? "border-b-2 border-[#4A1525] text-[#4A1525] bg-[#FAF8F4]"
                : "hover:text-[#292421]"
            }`}
          >
            <Search size={14} />
            <span>Enter UID</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5">
          {activeTab === "camera" && (
            <div className="text-center">
              <div className="relative mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-[#D09229] bg-black min-h-[260px] flex items-center justify-center">
                <div id={containerId} className="w-full max-w-full overflow-hidden" />
                
                {!isCameraActive && !scanError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#292421]/90 text-white p-4">
                    <Camera className="h-8 w-8 text-[#FCDA8B] animate-pulse" />
                    <p className="mt-2 text-xs font-bold">Initializing Camera...</p>
                    <p className="text-[10px] text-white/70 mt-1">Please allow camera permissions if prompted</p>
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-[#7A6D61] leading-relaxed">
                Align the QR code on the saree authenticity tag within the frame to verify origin automatically.
              </p>

              {scanError && (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-left text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Camera Unavailable</p>
                    <p className="text-[11px] text-rose-700 mt-0.5">{scanError}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("upload")}
                      className="mt-2 font-bold text-[#4A1525] underline cursor-pointer"
                    >
                      Switch to Image Upload tab →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "upload" && (
            <div className="text-center">
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D09229] bg-white p-8 cursor-pointer hover:bg-[#FAF0E1]/40 transition group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF0E1] text-[#A16B16] group-hover:scale-110 transition">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="mt-3 font-serif text-sm font-bold text-[#4A1525]">
                  Select Saree Tag Photo / Screenshot
                </p>
                <p className="mt-1 text-[11px] text-[#7A6D61]">
                  Supports PNG, JPG, JPEG taken from mobile or camera roll
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <div id="vastra-file-scan-temp" className="hidden" />

              {scanError && (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-left text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>{scanError}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#4A1525]">
                  Unique Product Identification Code (UID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VASTRA-SIL-MTCNKFZK-700191 or KW-SIL-001"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E0D3C1] bg-white p-3 font-mono text-xs font-bold text-[#4A1525] placeholder:font-sans placeholder:font-normal placeholder:text-[#9B8068] focus:border-[#4A1525] focus:outline-hidden"
                />
              </div>

              <p className="text-[11px] text-[#7A6D61] leading-relaxed">
                You can find this unique 16-character code printed under the QR Code on any certified Vastra Saree tag.
              </p>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A1525] py-3 text-xs font-bold text-white shadow-md hover:bg-[#6A1F35] cursor-pointer"
              >
                <span>Verify & View Product Details</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="border-t border-[#E8DEC8] bg-[#F2ECE1]/60 px-5 py-3 text-center text-[10px] text-[#7A6D61] flex items-center justify-center gap-1.5">
          <ShieldCheck size={13} className="text-[#2E7D32]" />
          <span>Official Silk Mark Organization of India Verified Reader</span>
        </div>
      </div>
    </div>
  );
}
