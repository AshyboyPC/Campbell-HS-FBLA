'use client';

import { motion } from "framer-motion";

const posts = [
  { title: "Regionals Results", excerpt: "Congratulations to our qualifiers!", date: "2025-02-10" },
  { title: "Fundraiser Update", excerpt: "Halfway to our SLC travel goal.", date: "2025-01-22" },
  { title: "Officer Spotlight: Mia", excerpt: "Meet our Vice President.", date: "2024-12-12" },
];

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl text-[#00205B]">News & Blog</motion.h1>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {posts.map((p) => (
          <div key={p.title} className="rounded-xl bg-white/70 backdrop-blur border border-[#003DA5]/15 p-5">
            <div className="text-xs text-[#00205B]/60">{new Date(p.date).toLocaleDateString()}</div>
            <h3 className="mt-1 text-lg text-[#00205B]">{p.title}</h3>
            <p className="text-sm text-[#00205B]/80">{p.excerpt}</p>
            <a href="#" className="mt-3 inline-block text-xs text-[#003DA5] hover:underline">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
}