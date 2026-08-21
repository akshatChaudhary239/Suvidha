"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Menu, X, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { openCart, itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Anarkali Suits", href: "/shop?category=Anarkali+Suits" },
    { name: "Palazzo Suits", href: "/shop?category=Palazzo+Suits" },
    { name: "Sharara Sets", href: "/shop?category=Sharara+Sets" },
    { name: "Straight / A-Line", href: "/shop?category=Straight%2FA-Line+Suits" },
    { name: "Kurta Sets", href: "/shop?category=Kurta+Sets" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-base/90 backdrop-blur-md border-b border-accent/20">
      {/* 1. Announcement Bar */}
      <div className="bg-ink text-accent text-center text-xs py-2 tracking-wider uppercase font-sans font-medium px-4">
        ✨ Festival Season Sale — Flat 10% Off on Heritage Collections | Code: FESTIVE10 ✨
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-ink hover:text-accent transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex flex-col items-center group">
          <span className="font-serif text-3xl md:text-4xl tracking-widest text-ink group-hover:text-royal transition-colors">
            FASHIONSK
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-sans font-semibold -mt-1">
            Royal Ethnic Wear
          </span>
        </Link>

        {/* Desktop Mega-menu style Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="text-sm font-sans tracking-wide text-ink-dark hover:text-ink transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-accent hover:after:w-full after:transition-all after:duration-300"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/shop"
            className="text-sm font-sans tracking-wide font-semibold text-accent hover:text-ink transition-colors"
          >
            All Products
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-5">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-ink hover:text-accent transition-colors"
            title="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>


          {/* Cart Drawer Trigger */}
          <button
            onClick={openCart}
            className="relative p-2 text-ink hover:text-accent transition-colors flex items-center gap-1.5"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-ink text-accent font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-accent">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-base border-t border-accent/20 px-4 py-3"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="max-w-3xl mx-auto flex items-center gap-3"
            >
              <Search className="w-5 h-5 text-accent" />
              <input
                type="text"
                placeholder="Search Anarkalis, Palazzo sets, Shararas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-ink text-sm placeholder:text-ink/40 font-sans"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-ink/60 hover:text-ink"
              >
                Cancel
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 bg-ink text-base p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-accent/20">
                <span className="font-serif text-3xl tracking-widest text-accent">FASHIONSK</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-accent">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-2xl tracking-wide text-base hover:text-accent transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-sm uppercase tracking-widest text-accent font-semibold pt-4"
                >
                  View All Products →
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-accent/20 flex items-center justify-center text-xs text-base/60">
              <span>© 2026 FashionSK Clothing. All Rights Reserved.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
