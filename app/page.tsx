'use client';

import Hero from "@/app/components/Hero";
import Slideshow from "@/app/components/Slideshow";
import { motion } from "framer-motion";
import { Trophy, Users, HandHeart } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import GrainyGradient from "@/components/ui/gradient-shader-card";
import { useRef, useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  startTime: number;
}

export default function Home() {
  const [ripples, setRipples] = useState<{[key: number]: Ripple[]}>({});
  const rippleId = useRef(0);
  
  const handleCardClick = (index: number, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const newRipple = {
      id: rippleId.current++,
      x: x * rect.width,
      y: y * rect.height,
      startTime: Date.now() / 1000
    };
    
    setRipples(prev => ({
      ...prev,
      [index]: [...(prev[index] || []), newRipple]
    }));
  };
  return (
    <div className="w-full">
      <Hero />

      <section id="about" className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl text-[#00205B] font-medium">Who We Are</h2>
            <p className="mt-2 text-sm text-[#00205B]/80">
              A CTSO that teaches business and leadership skills to students. Campbell High School FBLA empowers students to become community-minded business leaders through academic competitions, leadership development, career exploration, and service. We welcome all students interested in business, entrepreneurship, technology, and finance.
            </p>
            <div className="mt-4 flex gap-3">
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href="/membership" className="text-sm px-3 py-1.5 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A]">Become a Member</motion.a>
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href="/about" className="text-sm px-3 py-1.5 rounded-md border border-[#003DA5]/30 text-[#00205B] hover:bg-[#003DA5]/10">Learn More</motion.a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }}>
            <Slideshow />
          </motion.div>
        </div>

        {/* Gradient Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Compete",
              description: "Excel in events from Accounting to Marketing and Entrepreneurship.",
              icon: <Trophy className="w-6 h-6 text-white" />,
              colors: {
                color1: "#1E5BD6",
                color2: "#4A90E2",
                color3: "#7FB3FF",
                color4: "#FFD700"
              }
            },
            {
              title: "Lead",
              description: "Develop leadership skills and serve in officer roles and committees.",
              icon: <Users className="w-6 h-6 text-white" />,
              colors: {
                color1: "#1E5BD6",
                color2: "#4A90E2",
                color3: "#7FB3FF",
                color4: "#FFD700"
              }
            },
            {
              title: "Serve",
              description: "Make an impact through community service and fundraising.",
              icon: <HandHeart className="w-6 h-6 text-white" />,
              colors: {
                color1: "#1E5BD6",
                color2: "#4A90E2",
                color3: "#7FB3FF",
                color4: "#FFD700"
              }
            }
          ].map((card, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="h-48 w-full rounded-xl overflow-hidden relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleCardClick(index, e)}
            >
              <Canvas
                camera={{ position: [0, 0, 1] }}
                gl={{ preserveDrawingBuffer: true }}
                className="absolute inset-0 cursor-pointer"
              >
                <GrainyGradient 
                  ripples={ripples[index] || []}
                  onTimeUpdate={(time) => {
                    // Clean up old ripples
                    setRipples(prev => ({
                      ...prev,
                      [index]: (prev[index] || []).filter(r => time - (r.startTime / 1000) < 2.0)
                    }));
                  }}
                  colors={card.colors}
                />
              </Canvas>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-white/90 text-sm">{card.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}