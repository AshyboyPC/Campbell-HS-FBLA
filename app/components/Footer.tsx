"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#003DA5]/15 bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-2 mb-3">
            <img 
              src="/FBLA-Symbol.png" 
              alt="FBLA Logo" 
              className="h-8 w-auto"
            />
            <span className="text-sm text-[#00205B] ml-1">Campbell HS FBLA</span>
          </div>
          <p className="text-sm text-[#00205B]/70 max-w-xs">Future Business Leaders of America – Campbell High School Chapter.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }}>
          <h4 className="text-sm text-[#00205B] mb-2">Quick Links</h4>
          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/about" className="text-[#003DA5] hover:underline">About</Link>
            <Link href="/events" className="text-[#003DA5] hover:underline">Events</Link>
            <Link href="/gallery" className="text-[#003DA5] hover:underline">Gallery</Link>
            <Link href="/contact" className="text-[#003DA5] hover:underline">Contact</Link>
          </nav>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
          <h4 className="text-sm text-[#00205B] mb-3">Connect</h4>
          <div className="flex gap-4">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/campbell_fbla" 
              target="_blank" 
              rel="noopener noreferrer"
              className="socialContainer containerOne"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 16 16" className="socialSvg" fill="white">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path>
              </svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@chs.fbla" 
              target="_blank" 
              rel="noopener noreferrer"
              className="socialContainer containerTwo"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" className="socialSvg" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3.03.6.06.9.08v-3.2a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.5z"/>
              </svg>
            </a>

            {/* Remind */}
            <a 
              href="https://www.remind.com/join/chs4fbla" 
              target="_blank" 
              rel="noopener noreferrer"
              className="socialContainer containerThree"
              aria-label="Remind"
            >
              <svg viewBox="0 0 24 24" className="socialSvg" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.5-12.5H12c-1.38 0-2.5 1.12-2.5 2.5v5c0 .28.22.5.5.5h1v-5.5c0-.28.22-.5.5-.5h2.5v-1.5z"/>
              </svg>
            </a>
          </div>
          <style jsx>{`
            .socialContainer {
              width: 52px;
              height: 52px;
              border-radius: 50%;
              background-color: rgb(44, 44, 44);
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              transition-duration: 0.3s;
            }
            
            .socialContainer:hover {
              background: linear-gradient(45deg, #00205B, #003DA5, #FFD700, #FFC72C);
              background-size: 200% 200%;
              animation: gradientBG 3s ease infinite;
              transform: scale(1.1);
              transition: all 0.3s ease;
            }
            
            @keyframes gradientBG {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
            
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            .socialContainer:active {
              transform: scale(0.9);
              transition-duration: 0.3s;
            }
            
            .socialSvg {
              width: 17px;
              height: 17px;
              fill: white;
            }
            
            .socialContainer:hover .socialSvg {
              animation: slide-in-top 0.3s both;
            }
            
            @keyframes slide-in-top {
              0% {
                transform: translateY(-50px);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}</style>
        </motion.div>
      </div>
      <div className="border-t border-[#003DA5]/10 py-4">
        <p className="text-xs text-center text-[#00205B]/60">© {new Date().getFullYear()} Campbell High School FBLA. All rights reserved.</p>
      </div>
    </footer>
  );
}