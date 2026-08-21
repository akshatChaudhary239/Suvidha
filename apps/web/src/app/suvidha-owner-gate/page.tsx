"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, KeyRound, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-ink-dark text-base flex items-center justify-center p-4 paisley-bg">
      <div className="w-full max-w-md bg-base text-ink-dark p-8 rounded-sm shadow-2xl border border-accent/40">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-ink text-accent rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl text-ink font-bold">Owner Access Portal</h1>
          <p className="text-xs text-ink/60 font-sans mt-1">Private identity authentication</p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-800 text-xs rounded mb-6 border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-100 text-green-800 text-xs rounded mb-6 border border-green-200">
            {message}
          </div>
        )}

        {step === "EMAIL" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-sans text-ink-dark font-semibold mb-1">
                Authorized Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-accent/30 rounded bg-white focus:outline-none focus:border-ink"
                placeholder="owner@suvidhaclothing.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ink text-accent font-sans text-xs uppercase tracking-widest rounded hover:bg-royal transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {loading ? "Checking Allowlist..." : "Send Passcode"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-sans text-ink-dark font-semibold mb-1">
                Enter 6-Digit Passcode
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2.5 text-center tracking-[0.5em] text-lg font-bold border border-accent/30 rounded bg-white focus:outline-none focus:border-ink"
                  placeholder="000000"
                />
                <KeyRound className="w-4 h-4 text-ink/40 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ink text-accent font-sans text-xs uppercase tracking-widest rounded hover:bg-royal transition-colors font-semibold"
            >
              {loading ? "Verifying..." : "Authenticate & Access"}
            </button>

            <button
              type="button"
              onClick={() => setStep("EMAIL")}
              className="w-full text-center text-xs text-ink/60 hover:text-ink mt-2"
            >
              ← Re-enter email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
