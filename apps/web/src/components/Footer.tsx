import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, Award, Heart } from "lucide-react";

export default function Footer() {
  const trustBadges = [
    { icon: ShieldCheck, title: "100% Original Guarantee", desc: "Handcrafted Authentic Fabrics" },
    { icon: Truck, title: "Free Shipping", desc: "Across India on Prepaid Orders" },
    { icon: RefreshCw, title: "Hassle-Free Returns", desc: "Easy 7-Day Return Policy" },
    { icon: Award, title: "Made in India", desc: "Supporting Local Artisans" },
  ];

  return (
    <footer className="bg-ink-dark text-base border-t border-accent/30 mt-auto">
      {/* Trust Badges Bar */}
      <div className="border-b border-accent/20 bg-ink/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex items-center space-x-4 p-4 rounded-sm bg-white/5 border border-accent/10">
                <Icon className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h4 className="font-serif text-lg font-semibold text-accent">{badge.title}</h4>
                  <p className="text-xs text-base/70 font-sans">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Blurb */}
        <div className="space-y-4 md:col-span-1">
          <span className="font-serif text-3xl tracking-widest text-accent block">SUVIDHA</span>
          <p className="text-xs text-base/70 leading-relaxed font-sans">
            Suvidha is dedicated to preserving the regal splendor of Indian ethnic wear. From majestic Anarkalis to contemporary Sharara sets, every piece is stitched with timeless elegance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-lg text-accent mb-4 tracking-wide border-b border-accent/20 pb-2">
            Categories
          </h4>
          <ul className="space-y-2.5 text-xs text-base/80 font-sans">
            <li><Link href="/shop?category=Anarkali+Suits" className="hover:text-accent transition-colors">Anarkali Suits</Link></li>
            <li><Link href="/shop?category=Palazzo+Suits" className="hover:text-accent transition-colors">Palazzo Suits</Link></li>
            <li><Link href="/shop?category=Sharara+Sets" className="hover:text-accent transition-colors">Sharara Sets</Link></li>
            <li><Link href="/shop?category=Straight%2FA-Line+Suits" className="hover:text-accent transition-colors">Straight / A-Line Suits</Link></li>
            <li><Link href="/shop?category=Kurta+Sets" className="hover:text-accent transition-colors">Kurta Sets</Link></li>
          </ul>
        </div>

        {/* Customer Care Policies */}
        <div>
          <h4 className="font-serif text-lg text-accent mb-4 tracking-wide border-b border-accent/20 pb-2">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-xs text-base/80 font-sans">
            <li><Link href="#" className="hover:text-accent transition-colors">Returns & Cancellations</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Shipping & Delivery</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/admin/login" className="hover:text-accent transition-colors font-semibold text-accent">Admin Portal</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-serif text-lg text-accent mb-4 tracking-wide border-b border-accent/20 pb-2">
            Connect With Us
          </h4>
          <div className="space-y-3 text-xs text-base/80 font-sans">
            <p><strong>Email:</strong> support@suvidhaclothing.com</p>
            <p><strong>WhatsApp:</strong> +91 98765 43210</p>
            <p><strong>Hours:</strong> Mon – Sat: 10:00 AM – 7:00 PM IST</p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-accent/20 py-6 text-center text-xs text-base/50 font-sans">
        <p className="flex items-center justify-center gap-1">
          © 2026 Suvidha Ethnic Wear. Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for Indian Heritage.
        </p>
      </div>
    </footer>
  );
}
