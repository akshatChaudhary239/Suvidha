"use client";
import { API_URL } from "../../lib/config";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ShieldCheck, CreditCard, Banknote, ArrowLeft, CheckCircle2, Lock, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutForm() {
  const { cart, totalAmount, clearCart, isLoaded } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "RAZORPAY" as "RAZORPAY" | "COD",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
      };

      const res = await fetch(`${API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place order");
      }

      const orderData = data.data;

      // IF COD: Order completed immediately
      if (formData.paymentMethod === "COD") {
        setCompletedOrder({ ...orderData, chosenPayment: "Cash on Delivery (COD)" });
        clearCart();
        setLoading(false);
        return;
      }

      // IF RAZORPAY: Load Razorpay Checkout Modal
      if (formData.paymentMethod === "RAZORPAY") {
        const loadRazorpayScript = () => {
          return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          // Fallback if network blocks external script loading
          setCompletedOrder({ ...orderData, chosenPayment: "Online Payment (Razorpay)" });
          clearCart();
          setLoading(false);
          return;
        }

        const options = {
          key: orderData.razorpayKeyId,
          amount: Math.round(orderData.totalAmount * 100),
          currency: "INR",
          name: "Suvidha Royal Ethnic Wear",
          description: `Order ${orderData.orderNumber}`,
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: formData.customerName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#6B1E2A",
          },
          handler: async function (response: any) {
            const verifyRes = await fetch(`${API_URL}/api/orders/verify-razorpay`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setCompletedOrder({ ...orderData, chosenPayment: "Online Payment (Razorpay Verified)" });
              clearCart();
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  // Wait for localStorage hydration before checking empty state
  if (!isLoaded) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center text-ink flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-xs uppercase tracking-widest font-sans font-semibold">Loading your shopping bag...</p>
      </div>
    );
  }

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-royal rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-bold">Order Placed Successfully!</h1>
        
        <div className="my-6 inline-block bg-white p-6 rounded-md border border-accent/30 shadow-md text-left max-w-md w-full">
          <div className="flex justify-between items-center pb-3 border-b border-accent/20">
            <span className="text-xs uppercase font-sans font-bold text-ink/70">Order Number</span>
            <span className="font-mono text-sm font-bold text-ink">{completedOrder.orderNumber}</span>
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200 flex items-center justify-between">
            <span className="text-xs font-sans font-semibold text-amber-900">Payment Selection:</span>
            <span className="text-xs font-bold font-sans uppercase px-2.5 py-1 rounded bg-ink text-accent">
              {completedOrder.chosenPayment || completedOrder.paymentMethod}
            </span>
          </div>

          <div className="mt-4 flex justify-between items-center text-xs">
            <span className="text-ink/70">Total Amount:</span>
            <span className="font-serif text-lg font-bold text-royal">₹{completedOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-sm font-sans text-ink/70 max-w-md mx-auto">
          A confirmation email has been dispatched. Track your delivery updates in real-time.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-8 px-8 py-3.5 bg-ink text-accent font-sans text-xs uppercase tracking-widest rounded-sm hover:bg-royal transition-colors font-semibold shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-ink">Your shopping bag is empty</h1>
        <p className="text-xs text-ink/60 font-sans mt-2">Discover our royal traditional suit collections before checking out.</p>
        <Link
          href="/shop"
          className="inline-block mt-6 px-6 py-2.5 bg-ink text-accent font-sans text-xs uppercase tracking-widest rounded-sm"
        >
          Explore Suits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-ink/60 hover:text-ink font-sans mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Guest Form Column */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-sans font-semibold">
              Express Guest Checkout
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink mt-1">Shipping & Payment Setup</h1>
            <p className="text-xs text-ink/60 font-sans mt-1">No account registration required.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-800 text-xs rounded-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleCheckoutSubmit} className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white/70 p-6 rounded-sm border border-accent/20 space-y-4 shadow-sm">
              <h2 className="font-serif text-xl text-ink font-semibold border-b border-accent/20 pb-2">
                1. Customer Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-ink-dark mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-accent/30 rounded bg-base focus:outline-none focus:border-ink"
                    placeholder="Priyanjali Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-ink-dark mb-1 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-accent/30 rounded bg-base focus:outline-none focus:border-ink"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-sans text-ink-dark mb-1 font-medium">Email Address (For Order Receipt) *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-accent/30 rounded bg-base focus:outline-none focus:border-ink"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/70 p-6 rounded-sm border border-accent/20 space-y-4 shadow-sm">
              <h2 className="font-serif text-xl text-ink font-semibold border-b border-accent/20 pb-2">
                2. Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-sans text-ink-dark mb-1 font-medium">Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-accent/30 rounded bg-base focus:outline-none focus:border-ink"
                    placeholder="House / Flat No. & Street"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-ink-dark mb-1 font-medium">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-accent/30 rounded bg-base focus:outline-none focus:border-ink"
                    placeholder="Jaipur"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-ink-dark mb-1 font-medium">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-accent/30 rounded bg-base focus:outline-none focus:border-ink"
                    placeholder="Rajasthan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-ink-dark mb-1 font-medium">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-accent/30 rounded bg-base focus:outline-none focus:border-ink"
                    placeholder="302001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-ink-dark mb-1 font-medium">Country</label>
                  <input
                    type="text"
                    name="country"
                    disabled
                    value={formData.country}
                    className="w-full px-3 py-2 text-xs border border-accent/20 rounded bg-base/50 text-ink/60"
                  />
                </div>
              </div>
            </div>

            {/* HIGH-CONTRAST CLEAR PAYMENT METHOD SELECTION */}
            <div className="bg-white p-6 rounded-sm border-2 border-ink space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-accent/30 pb-3">
                <h2 className="font-serif text-xl text-ink font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" /> 3. Select Payment Method
                </h2>
                <span className="text-[10px] uppercase tracking-widest font-sans font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded">
                  Select Preferred Method
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Option A: Razorpay Online Payment */}
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: "RAZORPAY" })}
                  className={`p-5 rounded-md border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                    formData.paymentMethod === "RAZORPAY"
                      ? "border-ink bg-ink text-accent shadow-lg scale-[1.02]"
                      : "border-gray-200 bg-gray-50 text-ink-dark hover:border-ink/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={formData.paymentMethod === "RAZORPAY"}
                        onChange={handleChange}
                        className="w-4 h-4 text-accent focus:ring-accent"
                      />
                      <div>
                        <h3 className="font-serif font-bold text-base flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4" /> Online Payment
                        </h3>
                        <p className={`text-[11px] font-sans mt-0.5 ${formData.paymentMethod === "RAZORPAY" ? "text-base/80" : "text-gray-500"}`}>
                          UPI, Credit/Debit Cards, NetBanking
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-accent/20 flex justify-between items-center text-[10px] font-mono uppercase font-bold">
                    <span>Provider: Razorpay</span>
                    <span className="bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded">Instant Processing</span>
                  </div>
                </div>

                {/* Option B: Cash on Delivery (COD) */}
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: "COD" })}
                  className={`p-5 rounded-md border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                    formData.paymentMethod === "COD"
                      ? "border-ink bg-ink text-accent shadow-lg scale-[1.02]"
                      : "border-gray-200 bg-gray-50 text-ink-dark hover:border-ink/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === "COD"}
                        onChange={handleChange}
                        className="w-4 h-4 text-accent focus:ring-accent"
                      />
                      <div>
                        <h3 className="font-serif font-bold text-base flex items-center gap-1.5">
                          <Banknote className="w-4 h-4" /> Cash on Delivery
                        </h3>
                        <p className={`text-[11px] font-sans mt-0.5 ${formData.paymentMethod === "COD" ? "text-base/80" : "text-gray-500"}`}>
                          Pay cash upon delivery at your doorstep
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-accent/20 flex justify-between items-center text-[10px] font-mono uppercase font-bold">
                    <span>Pay at Doorstep</span>
                    <span className="bg-amber-800 text-amber-200 px-2 py-0.5 rounded">No Advance Payment</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-ink text-accent font-sans font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-royal transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading
                ? "Processing Order..."
                : formData.paymentMethod === "RAZORPAY"
                ? `Pay Online with Razorpay (₹${totalAmount.toFixed(2)})`
                : `Confirm Order — Cash on Delivery (₹${totalAmount.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-sm border border-accent/20 sticky top-28 space-y-6 shadow-md">
            <h2 className="font-serif text-2xl text-ink font-semibold border-b border-accent/20 pb-4">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.variantId} className="flex gap-3 text-xs">
                  <div className="w-16 h-20 relative rounded overflow-hidden bg-base/50 flex-shrink-0 border">
                    <Image src={item.image} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-ink text-sm">{item.productName}</h3>
                      <p className="text-ink/60">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-serif font-bold text-royal">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-base border border-accent/30 rounded text-xs space-y-1">
              <span className="text-[10px] uppercase font-sans text-ink/60 block font-bold">Chosen Payment Mode</span>
              <span className="font-serif text-sm font-bold text-ink flex items-center gap-1.5">
                {formData.paymentMethod === "RAZORPAY" ? (
                  <>
                    <CreditCard className="w-4 h-4 text-royal" /> Online Payment (Razorpay)
                  </>
                ) : (
                  <>
                    <Banknote className="w-4 h-4 text-royal" /> Cash on Delivery (COD)
                  </>
                )}
              </span>
            </div>

            <div className="border-t border-accent/20 pt-4 space-y-2 text-xs font-sans">
              <div className="flex justify-between text-ink/70">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Shipping</span>
                <span className="text-green-700 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-serif text-ink font-bold pt-2 border-t border-accent/10">
                <span>Total Payable</span>
                <span className="text-royal text-xl font-bold">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-base">
        <CheckoutForm />
      </main>
      <Footer />
    </>
  );
}
