"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { isOpen, closeCart, cart, removeFromCart, updateQuantity, totalAmount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-base text-ink-dark flex flex-col shadow-2xl border-l border-accent/20"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-accent/20 flex items-center justify-between bg-ink text-base">
              <div>
                <h2 className="font-serif text-2xl tracking-wide text-accent">Your Shopping Bag</h2>
                <p className="text-xs font-sans text-base/70">Guest checkout — zero account creation</p>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-accent hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-ink/60 space-y-4">
                  <span className="font-serif text-6xl">🛍️</span>
                  <p className="font-serif text-2xl text-ink">Your bag is empty</p>
                  <p className="text-xs font-sans max-w-xs">
                    Explore our royal collection of Anarkalis, Palazzo sets, and Sharara suits.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-6 py-2.5 bg-ink text-accent font-sans text-xs uppercase tracking-widest rounded-sm hover:bg-royal transition-colors"
                  >
                    Explore Suits
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-4 p-3 bg-white/60 rounded-md border border-accent/10 relative"
                  >
                    <div className="w-20 h-24 relative rounded overflow-hidden bg-base/50 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif font-bold text-lg text-ink line-clamp-1">
                            {item.productName}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.variantId)}
                            className="text-ink/40 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-ink/60 font-sans">
                          Size: <span className="font-semibold text-ink">{item.size}</span> | Color:{" "}
                          <span className="font-semibold text-ink">{item.color}</span>
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center border border-accent/30 rounded">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-accent/10 text-ink"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-accent/10 text-ink"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-serif font-bold text-base text-ink">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-accent/20 bg-white/40 space-y-4">
                <div className="flex justify-between items-center font-serif text-xl text-ink">
                  <span>Subtotal</span>
                  <span className="font-bold text-royal">₹{totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-ink/60 font-sans">
                  Taxes and shipping calculated at checkout. Free shipping on all prepaid orders.
                </p>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-4 bg-ink text-accent font-sans font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-royal transition-all flex items-center justify-center gap-2 group shadow-lg"
                >
                  Proceed to Guest Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
