"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider, useCart } from "@/context/CartContext";
import { ArrowRight, Star, Sparkles, ShoppingBag, Eye, ShieldCheck, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const sampleCategories = [
  {
    name: "Anarkali Suits",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    href: "/shop?category=Anarkali+Suits",
    tagline: "Flowing floor-length silhouettes in chanderi & silk",
    count: "42 items",
  },
  {
    name: "Palazzo Suits",
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
    href: "/shop?category=Palazzo+Suits",
    tagline: "Effortless grace with wide-leg embroidered bottoms",
    count: "28 items",
  },
  {
    name: "Sharara Sets",
    coverImage: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
    href: "/shop?category=Sharara+Sets",
    tagline: "Festive tiered flares with heavy gota-patti accents",
    count: "35 items",
  },
  {
    name: "Straight / A-Line",
    coverImage: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1000&q=80",
    href: "/shop?category=Straight%2FA-Line+Suits",
    tagline: "Tailored elegance for formal soirees & workdays",
    count: "19 items",
  },
  {
    name: "Kurta Sets",
    coverImage: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
    href: "/shop?category=Kurta+Sets",
    tagline: "Hand-printed cotton & silk sets for daily comfort",
    count: "50 items",
  },
];

const bilyznaStyleProducts = [
  {
    id: "p1",
    name: "Noor Jahan Crimson Anarkali",
    category: "Anarkali Suits",
    price: 4999,
    salePrice: 4299,
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    size: "M",
    color: "Crimson Red",
  },
  {
    id: "p2",
    name: "Emerald Zari Palazzo Suit",
    category: "Palazzo Suits",
    price: 3899,
    salePrice: 3299,
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    badge: "New Arrival",
    size: "L",
    color: "Peacock Green",
  },
  {
    id: "p3",
    name: "Rani Pink Gota Sharara Set",
    category: "Sharara Sets",
    price: 5499,
    salePrice: 4799,
    coverImage: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    badge: "-15% OFF",
    size: "S",
    color: "Rani Pink",
  },
  {
    id: "p4",
    name: "Chanderi Silk Straight Suit",
    category: "Straight/A-Line Suits",
    price: 3199,
    salePrice: 2799,
    coverImage: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
    size: "XL",
    color: "Mustard Gold",
  },
];

function HomeMain() {
  const { addToCart } = useCart();
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <main className="flex-1 bg-base text-ink-dark font-sans">
      {/* 1. HERO SECTION — Editorial Cream & Gold Royal Layout */}
      <section ref={heroRef} className="relative min-h-[90vh] bg-base text-ink-dark overflow-hidden flex flex-col justify-between border-b border-accent/30">
        <div className="absolute inset-0 z-0 opacity-90">
          <Image
            src="/hero-banner.jpg"
            alt="Suvidha Royal Ethnic Wear Collection"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Soft warm ivory vignette instead of heavy dark maroon overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-base/95 via-base/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-base/40 z-10" />

        {/* Top Floating Promo Bar */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex justify-between items-center text-xs text-ink uppercase font-sans tracking-widest font-bold">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            Suvidha Festive Heritage 2026
          </span>
          <span className="hidden sm:inline text-royal font-semibold">Handcrafted Silk, Zari & Chanderi Suits</span>
        </div>

        {/* Hero Central Content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-accent/50 text-ink text-xs font-mono uppercase font-bold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" /> High-End Royal Couture
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-5xl sm:text-7xl md:text-8xl text-ink tracking-wide font-bold leading-[1.05]"
            >
              Visual Depth & <br />
              <span className="italic font-normal gold-gradient-text">Royal Elegance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-ink-dark/90 text-sm sm:text-base font-medium max-w-xl leading-relaxed bg-white/60 backdrop-blur-sm p-4 rounded-sm border border-accent/20"
            >
              Clarity sharpens true beauty. Style reflects simplicity and confidence. Discover handcrafted Anarkalis, Sharara sets, and Palazzo ensembles designed with timeless Indian heritage.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                href="/shop"
                className="px-8 py-4 bg-ink text-accent font-sans font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-royal transition-all shadow-xl inline-flex items-center gap-2 group border border-accent/40"
              >
                Shop Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?category=Anarkali+Suits"
                className="px-8 py-4 bg-white/90 text-ink font-sans text-xs uppercase tracking-widest rounded-sm border-2 border-ink hover:bg-ink hover:text-accent transition-all font-bold shadow-md"
              >
                Explore Anarkalis
              </Link>
            </motion.div>
          </div>

          {/* Side Editorial Highlight Card */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-sm border-2 border-accent/40 text-ink-dark space-y-4 shadow-2xl">
              <div className="relative h-64 w-full rounded overflow-hidden border border-accent/30">
                <Image
                  src="/hero-banner.jpg"
                  alt="Spotlight Suit Ensemble"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 bg-ink text-accent text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
                  Spotlight
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-ink">Heritage Zari Suit Ensemble</h3>
              <p className="text-xs text-ink-dark/70">Pure Chanderi silk with intricate floral zari borders.</p>
              <div className="flex justify-between items-center pt-2 border-t border-accent/30">
                <span className="font-serif font-bold text-lg text-royal">₹3,499.00</span>
                <Link href="/shop" className="text-xs uppercase font-bold text-ink hover:text-royal hover:underline">
                  Quick View →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Pill Row */}
        <div className="relative z-20 border-t border-accent/30 bg-white/80 backdrop-blur-md py-3.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-xs text-ink-dark font-sans font-bold gap-4">
            <span className="flex items-center gap-2 text-royal">✓ Zero Customer Account Required (Guest Checkout)</span>
            <span className="flex items-center gap-2 text-royal">✓ Cash on Delivery & Razorpay Online Payment</span>
            <span className="flex items-center gap-2 text-royal">✓ Pure Handcrafted Indian Fabrics</span>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES EDITORIAL SHOWCASE (Bilyzna-Shop Dual Layout) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 border-b border-accent/20 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-sans font-bold">
              Collections
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink mt-1">Shop by Suit Silhouette</h2>
          </div>
          <p className="text-xs text-ink/70 max-w-xs mt-2 md:mt-0">
            Discover tailored suit sets arranged by royal design language.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {sampleCategories.map((cat, idx) => {
            const isLarge = idx === 0 || idx === 3;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className={`group relative rounded-sm overflow-hidden border border-accent/20 shadow-md transition-all duration-500 hover:shadow-2xl ${
                  isLarge ? "md:col-span-7 h-[420px]" : "md:col-span-5 h-[420px]"
                }`}
              >
                <Image
                  src={cat.coverImage}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-dark via-ink-dark/20 to-transparent" />

                <div className="absolute top-4 right-4 bg-ink/90 text-accent text-[10px] uppercase font-bold px-2.5 py-1 rounded border border-accent/30">
                  {cat.count}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-base">
                  <span className="text-[10px] uppercase tracking-widest text-accent font-mono font-bold block mb-1">
                    Silhouette 0{idx + 1}
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-base group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-base/80 font-sans mt-1 max-w-md font-light">{cat.tagline}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-accent uppercase font-sans tracking-widest mt-4 font-bold border-b border-accent/40 pb-0.5">
                    View Catalog →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. BILYZNA-STYLE PRODUCT GRID CARDS */}
      <section className="py-20 bg-white/6 border-y border-accent/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-sans font-bold">
                Featured Drops
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink mt-1">Trending Suit Ensembles</h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 md:mt-0 px-6 py-2.5 border border-ink text-ink font-sans text-xs uppercase tracking-widest hover:bg-ink hover:text-accent transition-all font-bold rounded-sm"
            >
              Browse All Products ({bilyznaStyleProducts.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bilyznaStyleProducts.map((item) => (
              <div
                key={item.id}
                className="bg-base border border-accent/20 rounded-sm overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col relative"
              >
                {/* Cover Image Container */}
                <div className="relative h-96 overflow-hidden bg-ink/5">
                  <Image
                    src={item.coverImage}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-ink text-accent text-[10px] uppercase font-sans tracking-widest px-2.5 py-1 rounded font-bold shadow">
                    {item.badge}
                  </span>

                  {/* Quick Action Overlay button */}
                  <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <button
                      onClick={() =>
                        addToCart({
                          productId: item.id,
                          variantId: `v-${item.id}`,
                          productName: item.name,
                          category: item.category,
                          size: item.size,
                          color: item.color,
                          image: item.coverImage,
                          price: item.salePrice || item.price,
                          quantity: 1,
                        })
                      }
                      className="w-full py-3 bg-accent text-ink-dark font-sans font-bold text-xs uppercase tracking-widest rounded shadow-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Quick Add to Bag
                    </button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-accent font-mono font-bold">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-ink mt-1 line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-xl font-bold text-royal">
                        ₹{item.salePrice.toFixed(2)}
                      </span>
                      <span className="font-sans text-xs text-ink/40 line-through">
                        ₹{item.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          productId: item.id,
                          variantId: `v-${item.id}`,
                          productName: item.name,
                          category: item.category,
                          size: item.size,
                          color: item.color,
                          image: item.coverImage,
                          price: item.salePrice || item.price,
                          quantity: 1,
                        })
                      }
                      className="p-2.5 bg-ink text-accent rounded hover:bg-royal transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Header />
      <CartDrawer />
      <HomeMain />
      <Footer />
    </>
  );
}
