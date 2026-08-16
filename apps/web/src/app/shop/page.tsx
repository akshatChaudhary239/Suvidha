"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider, useCart } from "@/context/CartContext";
import { ShoppingBag, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  category: string;
  coverImage?: string | null;
  images: string[];
  variants: { id: string; size: string; color: string; stock: number }[];
}

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Noor Jahan Crimson Anarkali",
    description: "Flowing pure silk floor-length Anarkali set with zardozi embroidery on neckline and dupatta.",
    price: 4999,
    salePrice: 4299,
    category: "Anarkali Suits",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
    variants: [
      { id: "v1-m", size: "M", color: "Crimson Red", stock: 10 },
      { id: "v1-l", size: "L", color: "Crimson Red", stock: 5 },
    ],
  },
  {
    id: "prod-2",
    name: "Emerald Zari Palazzo Suit",
    description: "Deep peacock green Chanderi cotton straight kurta paired with wide flare palazzo trousers.",
    price: 3899,
    salePrice: 3299,
    category: "Palazzo Suits",
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"],
    variants: [
      { id: "v2-s", size: "S", color: "Peacock Green", stock: 8 },
      { id: "v2-m", size: "M", color: "Peacock Green", stock: 12 },
    ],
  },
  {
    id: "prod-3",
    name: "Rani Pink Gota Sharara Set",
    description: "Festive tiered Sharara with heavy gota-patti border and matching organza dupatta.",
    price: 5499,
    salePrice: 4799,
    category: "Sharara Sets",
    coverImage: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"],
    variants: [{ id: "v3-l", size: "L", color: "Rani Pink", stock: 6 }],
  },
  {
    id: "prod-4",
    name: "Chanderi Silk Straight Suit",
    description: "Classic straight-cut kurta with hand block prints and thread-work embroidery.",
    price: 3199,
    salePrice: 2799,
    category: "Straight/A-Line Suits",
    coverImage: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80"],
    variants: [{ id: "v4-xl", size: "XL", color: "Mustard Gold", stock: 15 }],
  },
  {
    id: "prod-5",
    name: "Pastel Mint Floral Kurta Set",
    description: "Breathable daily-wear cotton kurta set with lacework details and printed dupatta.",
    price: 2499,
    salePrice: 1999,
    category: "Kurta Sets",
    coverImage: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80"],
    variants: [{ id: "v5-m", size: "M", color: "Mint Green", stock: 20 }],
  },
];

function ShopContent() {
  const { addToCart } = useCart();
  const [products] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Anarkali Suits",
    "Palazzo Suits",
    "Sharara Sets",
    "Straight/A-Line Suits",
    "Kurta Sets",
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-accent font-sans font-bold">
          Authentic Heritage
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-ink mt-2">Traditional Suit Catalog</h1>
        <p className="text-xs text-ink/70 font-sans mt-3">
          Filter by silhouette and discover pure chanderi silk and zari-embroidered suit sets.
        </p>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 text-xs font-sans rounded-full tracking-wider transition-all ${
              selectedCategory === cat
                ? "bg-ink text-accent font-semibold shadow-md border border-accent/40"
                : "bg-white/80 text-ink-dark border border-accent/20 hover:border-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const firstVariant = product.variants[0];
          const displayCover = product.coverImage || product.images[0];
          return (
            <div
              key={product.id}
              className="bg-base border border-accent/20 rounded-sm overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-96 overflow-hidden bg-ink/5">
                <Image
                  src={displayCover}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.salePrice && (
                  <span className="absolute top-3 left-3 bg-ink text-accent text-[10px] uppercase font-sans tracking-widest px-2.5 py-1 rounded font-bold shadow">
                    Sale
                  </span>
                )}

                <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <button
                    onClick={() =>
                      addToCart({
                        productId: product.id,
                        variantId: firstVariant.id,
                        productName: product.name,
                        category: product.category,
                        size: firstVariant.size,
                        color: firstVariant.color,
                        image: displayCover,
                        price: product.salePrice || product.price,
                        quantity: 1,
                      })
                    }
                    className="w-full py-3 bg-accent text-ink-dark font-sans font-bold text-xs uppercase tracking-widest rounded shadow-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Quick Add to Bag
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-accent font-mono font-bold">
                    {product.category}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-ink mt-1">{product.name}</h2>
                  <p className="text-xs text-ink/70 font-sans mt-2 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t flex items-center justify-between">
                  <div>
                    <span className="font-serif text-2xl font-bold text-royal">
                      ₹{(product.salePrice || product.price).toFixed(2)}
                    </span>
                    {product.salePrice && (
                      <span className="font-sans text-xs text-ink/40 line-through ml-2">
                        ₹{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        productId: product.id,
                        variantId: firstVariant.id,
                        productName: product.name,
                        category: product.category,
                        size: firstVariant.size,
                        color: firstVariant.color,
                        image: displayCover,
                        price: product.salePrice || product.price,
                        quantity: 1,
                      })
                    }
                    className="px-4 py-2.5 bg-ink text-accent font-sans text-xs uppercase tracking-widest rounded hover:bg-royal transition-colors flex items-center gap-1.5 font-bold"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen">
        <ShopContent />
      </main>
      <Footer />
    </>
  );
}
