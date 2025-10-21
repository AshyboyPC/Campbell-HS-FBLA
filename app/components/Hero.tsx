"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Countdown from "@/app/components/Countdown";
import { motion } from "framer-motion";
import { Trophy, Users, HandHeart } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import GrainyGradient from "@/components/ui/gradient-shader-card";

interface Ripple {
  id: number;
  x: number;
  y: number;
  startTime: number;
}

const GradientCard = ({ title, description, icon, colors }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
      startTime: currentTime,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 2000);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative h-48 w-full overflow-hidden rounded-xl cursor-pointer"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ preserveDrawingBuffer: true }}
        className="absolute inset-0"
      >
        <GrainyGradient 
          ripples={ripples} 
          onTimeUpdate={handleTimeUpdate}
          colors={colors}
        />
      </Canvas>
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-white/90 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">
      {/* Playful blue/yellow glow orbs */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.7, y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-10 top-20 size-40 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,199,44,0.35), transparent 60%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 w-full flex justify-between items-center">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-[#00205B] leading-tight mb-6 font-display"
          >
            Future Business Leaders of America
          </motion.h1>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFC72C]/80 border border-[#00205B]/10 px-3 py-1.5 text-[#00205B] text-xs font-body">
            Campbell High School
          </div>
          <p className="mt-6 text-[#00205B]/80 text-sm sm:text-base max-w-xl font-body">
            Building leadership, careers, and community through competition, service, and professional development.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.03, rotate: -0.5 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/membership"
                className="text-sm px-4 py-2 rounded-md bg-[#FFC72C] text-[#00205B] hover:bg-[#E6B220] transition-colors"
              >
                Join Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, rotate: 0.5 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/events"
                className="text-sm px-4 py-2 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A] transition-colors"
              >
                Upcoming Events
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="text-sm px-4 py-2 rounded-md bg-white text-[#003DA5] border border-[#003DA5]/30 hover:bg-[#003DA5]/5"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
          <div className="mt-8">
            <Countdown />
          </div>
        </div>
        
        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block absolute right-[-5%] top-[40%] -translate-y-1/2 w-1/2 max-w-2xl"
        >
          <Image
            src="/image-removebg-preview (14).png"
            alt="FBLA Hero"
            width={800}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}