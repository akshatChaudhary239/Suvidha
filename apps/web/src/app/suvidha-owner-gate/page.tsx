"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, KeyRound, ArrowRight, Lock, Sparkles } from "lucide-react";

export default function OwnerGateLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send passcode");
      }

      setMessage(data.message || "Passcode sent to authorized email address.");
      if (data.devOtp) {
        setOtp(data.devOtp);
      }
      setStep("OTP");
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid passcode");
      }

      if (data.token) {
        localStorage.setItem("suvidha_admin_token", data.token);
      }

      router.push("/suvidha-owner-dashboard");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-[#FAF6F0] flex items-center justify-center p-6 paisley-bg">
        <div className="w-full max-w-md bg-white p-8 rounded-md shadow-2xl border-2 border-[#C9A227] space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-[#5B1420] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-[#C9A227]">
              <Shield className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#C9A227]/50 text-[#5B1420] text-[10px] font-sans uppercase font-bold tracking-widest">
              <Lock className="w-3 h-3 text-[#C9A227]" /> Private Owner Gate
            </div>
            <h1 className="font-serif text-3xl text-[#5B1420] font-bold tracking-wide">
              Suvidha Owner Access
            </h1>
            <p className="text-xs text-[#231A15]/70 font-sans font-medium">
              Restricted identity passcode verification
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-800 text-xs font-semibold rounded border border-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-100 text-green-800 text-xs font-semibold rounded border border-green-200">
              {message}
            </div>
          )}

          {step === "EMAIL" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-[#231A15] font-bold mb-1.5">
                  Authorized Admin Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium border-2 border-[#C9A227]/40 rounded bg-[#FAF6F0] text-[#231A15] focus:outline-none focus:border-[#5B1420] transition-colors"
                  placeholder="owner@suvidhaclothing.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#5B1420] text-[#D4AF37] font-sans text-xs uppercase tracking-widest rounded-sm hover:bg-[#0E4D3C] transition-colors font-bold shadow-lg flex items-center justify-center gap-2 border border-[#C9A227]"
              >
                {loading ? "Checking Allowlist..." : "Send Passcode"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-[#231A15] font-bold mb-1.5">
                  Enter 6-Digit Passcode *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-center tracking-[0.5em] text-lg font-bold border-2 border-[#C9A227]/50 rounded bg-[#FAF6F0] text-[#5B1420] focus:outline-none focus:border-[#5B1420]"
                    placeholder="000000"
                  />
                  <KeyRound className="w-4 h-4 text-[#5B1420]/50 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#5B1420] text-[#D4AF37] font-sans text-xs uppercase tracking-widest rounded-sm hover:bg-[#0E4D3C] transition-colors font-bold shadow-lg border border-[#C9A227]"
              >
                {loading ? "Verifying..." : "Authenticate & Access"}
              </button>

              <button
                type="button"
                onClick={() => setStep("EMAIL")}
                className="w-full text-center text-xs text-[#231A15]/70 hover:text-[#5B1420] font-semibold mt-2"
              >
                ← Re-enter email address
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
