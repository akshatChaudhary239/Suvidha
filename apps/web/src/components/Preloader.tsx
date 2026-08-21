"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink text-base select-none"
        >
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-5xl md:text-7xl tracking-widest text-accent mb-2"
            >
              FASHIONSK
            </motion.h1>
            <p className="font-sans text-xs tracking-widest uppercase text-base/70 mb-8">
              Heritage · Royal Craftsmanship · Elegance
            </p>
            <div className="w-48 h-0.5 bg-base/20 mx-auto overflow-hidden relative">
              <motion.div
                className="h-full bg-accent"
                style={{ width: `${counter}%` }}
              />
            </div>
            <p className="font-serif text-sm text-accent mt-3">{counter}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
