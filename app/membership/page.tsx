'use client';

import { motion } from "framer-motion";

export default function MembershipPage() {
  const formId = "1ryGGAnrdaG6KFNVn_ncWStRQzzsApXGUHbFmgAHQ1GQ";
  const formUrl = `https://docs.google.com/forms/d/${formId}/viewform`;
  const embedUrl = `${formUrl}?embedded=true`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl text-[#00205B]">Membership</motion.h1>

      <section className="mt-6 grid md:grid-cols-2 gap-8">
        <div className="rounded-xl bg-[#F5F5F5] p-6 border border-[#003DA5]/15">
          <h2 className="text-xl text-[#00205B]">How to Join</h2>
          <ul className="mt-2 text-sm text-[#00205B]/80 list-disc pl-5 space-y-1">
            <li>Open to all Campbell HS students</li>
            <li>Dues: $<span className="tabular-nums">25</span> (covers state/national)</li>
            <li>Deadline: September 30</li>
            <li>Submit membership form and payment to the FBLA office</li>
          </ul>
          <a href="#form" className="mt-4 inline-block text-sm px-3 py-1.5 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A]">Fill Out Form</a>
        </div>
        <div className="rounded-xl bg-[#F5F5F5] p-6 border border-[#003DA5]/15">
          <h2 className="text-xl text-[#00205B]">Benefits</h2>
          <ul className="mt-2 text-sm text-[#00205B]/80 list-disc pl-5 space-y-1">
            <li>Competitive events at Regional, State (SLC), and Nationals</li>
            <li>Leadership roles, training, and conferences</li>
            <li>Networking with peers and business professionals</li>
            <li>Scholarships and recognition opportunities</li>
          </ul>
        </div>
      </section>

      <section id="form" className="mt-10">
        <h2 className="text-xl text-[#00205B]">Membership Form</h2>
        <p className="mt-1 text-xs text-[#00205B]/70">Complete it below or open it in a new tab.</p>
        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm px-3 py-1.5 rounded-md bg-[#FFC72C] text-[#00205B] hover:bg-[#E6B220]"
        >
          Open Form in New Tab
        </a>
        <div className="mt-4 rounded-xl bg-white/70 backdrop-blur border border-[#003DA5]/15 p-2">
          <iframe
            title="FBLA Membership Form"
            src={embedUrl}
            className="w-full h-[1600px] rounded-lg"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl text-[#00205B]">Deadlines</h2>
        <div className="mt-3 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { t: "Membership Dues", d: "Sept 30" },
            { t: "Event Registration", d: "Nov 10" },
            { t: "SLC Travel Forms", d: "Jan 20" },
          ].map((x) => (
            <div key={x.t} className="rounded-xl bg-white/70 backdrop-blur border border-[#003DA5]/15 p-4">
              <div className="text-sm text-[#00205B]">{x.t}</div>
              <div className="text-xs text-[#00205B]/70">{x.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}