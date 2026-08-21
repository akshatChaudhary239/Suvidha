"use client";
import { API_URL } from "../../lib/config";

import React, { useState, useEffect } from "react";
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
    name: "Lavender Floral Chiffon Suit Set",
    description: "Soft lilac pastel suit set with fine floral embroidery and matching chiffon dupatta.",
    price: 4999,
    salePrice: 4299,
    category: "Anarkali Suits",
    coverImage: "/products/prod-real-1.png",
    images: ["/products/prod-real-1.png"],
    variants: [
      { id: "v1-m", size: "M", color: "Soft Lavender", stock: 10 },
      { id: "v1-l", size: "L", color: "Soft Lavender", stock: 5 },
    ],
  },
  {
    id: "prod-2",
    name: "Ivory Resham Threadwork Ensemble",
    description: "Cream gold handcrafted suit set with delicate floral thread embroidery and matching dupatta.",
    price: 3899,
    salePrice: 3399,
    category: "Straight/A-Line Suits",
    coverImage: "/products/prod-real-2.png",
    images: ["/products/prod-real-2.png"],
    variants: [
      { id: "v2-s", size: "S", color: "Cream Gold", stock: 8 },
      { id: "v2-m", size: "M", color: "Cream Gold", stock: 12 },
    ],
  },
  {
    id: "prod-3",
    name: "Dusty Rose Heritage Silk Suit",
    description: "Rich dusty rose silk suit set with intricate paisley motifs and heavy organza dupatta.",
    price: 5499,
    salePrice: 4799,
    category: "Palazzo Suits",
    coverImage: "/products/prod-real-3.png",
    images: ["/products/prod-real-3.png"],
    variants: [{ id: "v3-l", size: "L", color: "Dusty Rose", stock: 6 }],
  },
  {
    id: "prod-4",
    name: "Sky Blue Botanical Silk Set",
    description: "Serene sky blue printed silk suit set with scalloped cuffs and matching printed dupatta.",
    price: 3999,
    salePrice: 3499,
    category: "Kurta Sets",
    coverImage: "/products/prod-real-4.png",
    images: ["/products/prod-real-4.png"],
    variants: [{ id: "v4-xl", size: "XL", color: "Sky Blue", stock: 15 }],
  },
  {
    id: "prod-5",
    name: "Mustard Gold Royal Zari Ensemble",
    description: "Mustard gold traditional suit set with heavy resham neckwork and matching dupatta.",
    price: 5999,
    salePrice: 5199,
    category: "Sharara Sets",
    coverImage: "/products/prod-real-5.png",
    images: ["/products/prod-real-5.png"],
    variants: [{ id: "v5-m", size: "M", color: "Mustard Gold", stock: 10 }],
  },
];

function ShopContent() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Format DB products into Product interface shape
          const dbProducts = data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            salePrice: p.salePrice,
            category: p.category,
            coverImage: p.coverImage || p.images?.[0] || "/products/prod-real-1.png",
            images: p.images && p.images.length > 0 ? p.images : [p.coverImage || "/products/prod-real-1.png"],
            variants: p.variants && p.variants.length > 0 ? p.variants : [{ id: `v-${p.id}`, size: "M", color: "Standard", stock: 10 }],
          }));
          setProducts(dbProducts);
        }
      } catch (err) {
        console.warn("Failed to fetch live database products, showing fallback catalogue:", err);
      }
    }
    loadLiveProducts();
  }, []);

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
