"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Note: Add your own image URLs when available. This slideshow uses colored panels as placeholders to avoid unreliable external images.
const slides: { title: string; caption: string; color: string }[] = [
  {
    title: "Regionals Winners",
    caption: "Congrats to members advancing to State!",
    color: "#003DA5",
  },
  {
    title: "Community Service Day",
    caption: "Volunteering with local partners across Smyrna.",
    color: "#00205B",
  },
  {
    title: "Fundraiser Success",
    caption: "Thank you for helping us reach our travel goal!",
    color: "#FFC72C",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
  }),
};

const transition: { [key: string]: any } = {
  x: { type: "spring", stiffness: 300, damping: 30, duration: 0.5 },
  opacity: { duration: 0.4 },
  scale: { duration: 0.3 },
};

export default function Slideshow() {
  const [[page, direction], setPage] = useState([0, 0]);
  const index = page % slides.length;

  const paginate = useCallback((newDirection: number) => {
    setPage(([page]) => [page + newDirection, newDirection]);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [paginate]);

  return (
    <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-xl border border-[#003DA5]/15">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="absolute inset-0"
          style={{ backgroundColor: slides[index].color }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {/* Animated sheen stripes */}
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(120deg, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 2px, transparent 2px, transparent 12px)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0",
              mixBlendMode: "overlay",
            }}
            animate={{ backgroundPosition: ["0 0", "32px 0"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h3 className="text-base sm:text-lg font-medium">{slides[index].title}</h3>
            <p className="text-xs sm:text-sm opacity-90 mt-1 max-w-md">{slides[index].caption}</p>
          </div>
          
          {/* Navigation Dots */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage([i, i > index ? 1 : -1])}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'bg-white w-6' : 'bg-white/50 w-2'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
