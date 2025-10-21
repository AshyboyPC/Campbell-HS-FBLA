"use client";

import { motion } from "framer-motion";

const tiers = [
  { name: "Bronze", amount: "$100+", color: "#CD7F32" },
  { name: "Silver", amount: "$250+", color: "#C0C0C0" },
  { name: "Gold", amount: "$500+", color: "#FFC72C" },
];

export default function SponsorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl text-[#00205B]">Sponsors & Partners</motion.h1>

      <section className="mt-6">
        <h2 className="text-xl text-[#00205B] mb-3">Thank You to Our Supporters</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-white/70 backdrop-blur border border-[#003DA5]/15 flex items-center justify-center text-sm text-[#00205B]/70">
              Sponsor Logo #{i}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl text-[#00205B] mb-3">Sponsorship Levels</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-xl border border-[#003DA5]/15 p-5 bg-[#F5F5F5]">
              <div className="text-lg" style={{ color: t.color }}>{t.name}</div>
              <div className="text-sm text-[#00205B]/80">{t.amount}</div>
              <ul className="mt-2 text-xs text-[#00205B]/70 list-disc pl-5 space-y-1">
                <li>Website recognition</li>
                <li>Social media shoutouts</li>
                <li>Certificate of appreciation</li>
              </ul>
            </div>
          ))}
        </div>
        <a href="/contact" className="inline-block mt-4 text-sm px-3 py-1.5 rounded-md bg-[#FFC72C] text-[#00205B] hover:bg-[#E6B220]">Become a Sponsor</a>
      </section>
    </div>
  );
}