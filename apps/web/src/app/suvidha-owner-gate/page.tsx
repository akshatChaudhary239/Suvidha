"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, KeyRound, ArrowRight, Lock, CheckCircle2 } from "lucide-react";

export default function OwnerGateLoginPage() {
  const router = useRouter();
  const [secretKey, setSecretKey] = useState("SUVIDHA_OWNER_ROYAL_KEY_2026");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerifySecretKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-secret-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid Owner Secret Key");
      }

      if (data.token) {
        localStorage.setItem("suvidha_admin_token", data.token);
      }

      setMessage("Owner Key Authenticated! Redirecting to Dashboard...");
      setTimeout(() => {
        router.push("/suvidha-owner-dashboard");
      }, 500);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
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
              <Lock className="w-3 h-3 text-[#C9A227]" /> Owner Master Key Gate
            </div>
            <h1 className="font-serif text-3xl text-[#5B1420] font-bold tracking-wide">
              Suvidha Owner Access
            </h1>
            <p className="text-xs text-[#231A15]/70 font-sans font-medium">
              Single-step Master Key authentication
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-800 text-xs font-semibold rounded border border-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-100 text-green-800 text-xs font-semibold rounded border border-green-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
              {message}
            </div>
          )}

          <form onSubmit={handleVerifySecretKey} className="space-y-4">
            <div>
              <label className="block text-xs font-sans text-[#231A15] font-bold mb-1.5">
                Owner Secret Key *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full px-3.5 py-3 text-xs font-mono font-bold border-2 border-[#C9A227]/50 rounded bg-[#FAF6F0] text-[#5B1420] focus:outline-none focus:border-[#5B1420]"
                  placeholder="Enter Secret Key"
                />
                <KeyRound className="w-4 h-4 text-[#5B1420]/50 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#5B1420] text-[#D4AF37] font-sans text-xs uppercase tracking-widest rounded-sm hover:bg-[#0E4D3C] transition-colors font-bold shadow-lg flex items-center justify-center gap-2 border border-[#C9A227]"
            >
              {loading ? "Authenticating Key..." : "Enter Owner Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
