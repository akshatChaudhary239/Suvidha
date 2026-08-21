"use client";

import React, { useState, useEffect, useRef } from "react";
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
    coverImage: "/categories/sil-anarkali.png",
    href: "/shop?category=Anarkali+Suits",
    tagline: "Flowing floor-length silhouettes in chanderi & silk",
    count: "42 items",
  },
  {
    name: "Palazzo Suits",
    coverImage: "/categories/sil-palazzo.png",
    href: "/shop?category=Palazzo+Suits",
    tagline: "Effortless grace with wide-leg embroidered bottoms",
    count: "28 items",
  },
  {
    name: "Sharara Sets",
    coverImage: "/categories/sil-sharara.png",
    href: "/shop?category=Sharara+Sets",
    tagline: "Festive tiered flares with heavy gota-patti accents",
    count: "35 items",
  },
  {
    name: "Straight / A-Line",
    coverImage: "/categories/sil-straight.png",
    href: "/shop?category=Straight%2FA-Line+Suits",
    tagline: "Tailored elegance for formal soirees & workdays",
    count: "19 items",
  },
  {
    name: "Kurta Sets",
    coverImage: "/categories/sil-kurta.jpg",
    href: "/shop?category=Kurta+Sets",
    tagline: "Hand-printed cotton & silk sets for daily comfort",
    count: "50 items",
  },
];

const bilyznaStyleProducts = [
  {
    id: "p1",
    name: "Lavender Floral Chiffon Suit Set",
    category: "Anarkali Suits",
    price: 4999,
    salePrice: 4299,
    coverImage: "/products/prod-real-1.png",
    badge: "Bestseller",
    size: "M",
    color: "Soft Lavender",
  },
  {
    id: "p2",
    name: "Ivory Resham Threadwork Ensemble",
    category: "Straight/A-Line Suits",
    price: 3899,
    salePrice: 3399,
    coverImage: "/products/prod-real-2.png",
    badge: "New Arrival",
    size: "L",
    color: "Cream Gold",
  },
  {
    id: "p3",
    name: "Dusty Rose Heritage Silk Suit",
    category: "Palazzo Suits",
    price: 5499,
    salePrice: 4799,
    coverImage: "/products/prod-real-3.png",
    badge: "-15% OFF",
    size: "S",
    color: "Dusty Rose",
  },
  {
    id: "p4",
    name: "Sky Blue Botanical Silk Set",
    category: "Kurta Sets",
    price: 3999,
    salePrice: 3499,
    coverImage: "/products/prod-real-4.png",
    badge: "Trending",
    size: "XL",
    color: "Sky Blue",
  },
  {
    id: "p5",
    name: "Mustard Gold Royal Zari Ensemble",
    category: "Sharara Sets",
    price: 5999,
    salePrice: 5199,
    coverImage: "/products/prod-real-5.png",
    badge: "Heritage",
    size: "M",
    color: "Mustard Gold",
  },
];

function HomeMain() {
  const { addToCart } = useCart();
  const heroRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const dbProducts = data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            salePrice: p.salePrice,
            coverImage: p.coverImage || p.images?.[0] || "/products/prod-real-1.png",
            badge: p.featured ? "Featured" : "New Arrival",
            size: p.variants?.[0]?.size || "M",
            color: p.variants?.[0]?.color || "Standard",
          }));
          setProducts(dbProducts);
        }
      } catch (err) {
        console.warn("Failed to fetch live homepage products:", err);
      }
    }
    loadLiveProducts();
  }, []);

  return (
    <main className="flex-1 bg-base text-ink-dark font-sans">
      {/* 1. HERO SECTION — Royal White & Gold Side-by-Side Magazine Layout */}
      <section ref={heroRef} className="relative min-h-[85vh] bg-[#FAF6F0] text-ink-dark overflow-hidden flex flex-col justify-between border-b-2 border-accent/30 paisley-bg">
        
        {/* Top Announcement Bar */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex justify-between items-center text-xs uppercase font-sans tracking-widest font-bold">
          <span className="flex items-center gap-2 text-ink">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            Suvidha Heritage Couture 2026
          </span>
          <span className="hidden sm:inline text-royal font-extrabold">Handcrafted Pure Silk & Zari Collection</span>
        </div>

        {/* Hero Central Content Container (Side-by-Side) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Royal Typography & High-Contrast Text */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-accent text-ink text-xs font-sans uppercase font-bold shadow-md"
            >
              <Sparkles className="w-4 h-4 text-accent font-bold" /> Royal Ethnic Collection
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl text-ink tracking-tight font-bold leading-[1.08] royal-title-shadow"
            >
              Heritage Craftsmanship & <br />
              <span className="italic font-normal gold-gradient-text drop-shadow-sm">Royal Elegance</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-md border-2 border-[#C9A227] text-[#231A15] shadow-xl space-y-3"
            >
              <p className="text-base sm:text-lg font-bold leading-relaxed text-black" style={{ color: "#1E1713" }}>
                Experience pure silk Anarkalis, intricate Sharara sets, and Palazzo ensembles designed for timeless grace. Handcrafted with traditional gold threadwork.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs font-extrabold text-[#0E4D3C] border-t-2 border-[#C9A227]/30">
                <span className="flex items-center gap-1">✦ Guest Checkout Only</span>
                <span className="flex items-center gap-1">✦ Free Shipping Across India</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                href="/shop"
                className="px-8 py-4 bg-ink text-accent font-sans font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-royal transition-all shadow-xl inline-flex items-center gap-2.5 group border-2 border-accent"
              >
                Explore All Suits
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?category=Anarkali+Suits"
                className="px-8 py-4 bg-white text-ink font-sans text-xs uppercase tracking-widest rounded-sm border-2 border-ink hover:bg-ink hover:text-accent transition-all font-bold shadow-md"
              >
                View Anarkalis
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Crisp Gold-Framed Hero Banner Image Showcase */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-3 rounded-md border-2 border-accent shadow-2xl relative gold-border"
            >
              <div className="relative w-full aspect-[4/3] rounded overflow-hidden">
                <Image
                  src="/hero-banner.jpg"
                  alt="Suvidha Royal Ethnic Wear Catalogue"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Caption Bar */}
              <div className="mt-3 pt-3 border-t border-accent/30 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-serif font-bold text-ink text-sm">Festive Suit Ensembles</span>
                </div>
                <span className="font-sans font-bold text-accent uppercase text-[10px] bg-ink px-3 py-1 rounded">
                  2026 Heritage Edition
                </span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Bottom Guarantee Banner */}
        <div className="relative z-20 border-t-2 border-accent/30 bg-white py-4 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-xs text-ink font-sans font-bold gap-4">
            <span className="flex items-center gap-2 text-royal">✓ Guest Checkout — Zero Account Registration Required</span>
            <span className="flex items-center gap-2 text-royal">✓ Cash on Delivery (COD) & Razorpay Online Payment</span>
            <span className="flex items-center gap-2 text-royal">✓ 100% Authentic Handcrafted Indian Silk & Zari</span>
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
              Browse All Products ({products.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((item) => (
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
