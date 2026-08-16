import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Suvidha — Royal Traditional Indian Suits & Ethnic Wear",
  description:
    "Explore Suvidha's exquisite collection of handcrafted Anarkali suits, Palazzo sets, Sharara ensembles, and ethnic suit sets. Pure silk, intricate zari, and royal craftsmanship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-base text-ink-dark flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
