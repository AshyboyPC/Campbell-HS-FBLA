"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { PearlButton } from "@/components/ui/pearl-button";
import { useAuth } from "@/app/contexts/AuthContext";

const links: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/community", label: "Community" },
  { href: "/resources", label: "Resources" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/points", label: "Points" },
];

export default function Navbar() {
  const { isAuthenticated, user, signIn, signOut, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <div
        className={`mx-auto max-w-6xl px-4 ${scrolled ? "py-2" : "py-3"}`}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`rounded-xl bg-white/70 backdrop-blur-md border border-[#003DA5]/15 ${
            scrolled ? "shadow-md" : "shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src="/FBLA-Symbol.png" 
                alt="FBLA Logo" 
                className="h-8 w-auto transition-transform group-hover:scale-[1.05]"
              />
              <span className="text-sm text-[#00205B] ml-2">Campbell HS FBLA</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative text-sm text-[#00205B] hover:text-[#003DA5] transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#FFC72C] after:transition-all hover:after:w-full"
                >
                  {l.label}
                </Link>
              ))}
              <div className="ml-2 flex items-center gap-2">
                {!loading && !isAuthenticated && (
                  <Link href="/login">
                    <button className="text-sm px-4 py-2 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A] transition-colors">
                      Sign In
                    </button>
                  </Link>
                )}
                {!loading && isAuthenticated && (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-white/50 border border-[#003DA5]/20 text-[#00205B] hover:bg-[#003DA5]/10 transition-colors"
                    >
                      <Icon icon="mdi:account-circle" className="h-5 w-5" />
                      <span className="hidden md:inline">{user?.displayName?.split(' ')[0] || 'Account'}</span>
                      <Icon icon="mdi:chevron-down" className="h-4 w-4" />
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-[#003DA5]/15 shadow-lg overflow-hidden z-50"
                        >
                          <Link 
                            href="/points/dashboard" 
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#00205B] hover:bg-[#003DA5]/5 transition-colors"
                          >
                            <Icon icon="mdi:chart-line" className="h-4 w-4" />
                            My Dashboard
                          </Link>
                          <Link 
                            href="/admin/dashboard" 
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#00205B] hover:bg-[#003DA5]/5 transition-colors border-t border-[#003DA5]/10"
                          >
                            <Icon icon="mdi:shield-account" className="h-4 w-4" />
                            Admin Panel
                          </Link>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              signOut();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#00205B] hover:bg-[#003DA5]/5 transition-colors border-t border-[#003DA5]/10"
                          >
                            <Icon icon="mdi:logout" className="h-4 w-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <Link href="/membership" className="hidden md:block">
                  <PearlButton>
                    <span className="flex items-center gap-2">
                      <Icon icon="heroicons:arrow-right" className="h-4 w-4" />
                      Join Now
                    </span>
                  </PearlButton>
                </Link>
              </div>
            </nav>
            <button
              className="md:hidden rounded-md p-2 text-[#00205B] hover:bg-[#003DA5]/10"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <Icon icon="material-symbols:menu" width={22} height={22} />
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-[#003DA5]/15 px-4"
              >
                <div className="grid grid-cols-2 gap-2 py-3">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="text-sm text-[#00205B] hover:text-[#003DA5]"
                    >
                      {l.label}
                    </Link>
                  ))}
                  {!loading && !isAuthenticated && (
                    <div className="col-span-2">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <button className="w-full text-sm px-4 py-2 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A]">
                          Sign In
                        </button>
                      </Link>
                    </div>
                  )}
                  {!loading && isAuthenticated && (
                    <>
                      <Link href="/points/dashboard" className="col-span-2 text-sm text-[#00205B] hover:text-[#003DA5]" onClick={() => setOpen(false)}>
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-[#003DA5]/5">
                          <Icon icon="mdi:chart-line" className="h-5 w-5" />
                          My Dashboard
                        </div>
                      </Link>
                      <Link href="/admin/dashboard" className="col-span-2 text-sm text-[#00205B] hover:text-[#003DA5]" onClick={() => setOpen(false)}>
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-[#003DA5]/5">
                          <Icon icon="mdi:shield-account" className="h-5 w-5" />
                          Admin Panel
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          setOpen(false);
                          signOut();
                        }}
                        className="col-span-2 text-sm text-[#00205B] hover:text-[#003DA5] text-left"
                      >
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-[#003DA5]/5">
                          <Icon icon="mdi:logout" className="h-5 w-5" />
                          Sign Out
                        </div>
                      </button>
                    </>
                  )}
                  <div className="col-span-2">
                    <Link href="/membership" className="w-full block" onClick={() => setOpen(false)}>
                      <PearlButton className="w-full">
                        <span className="flex items-center justify-center gap-2">
                          <Icon icon="heroicons:arrow-right" className="h-4 w-4" />
                          Join Now
                        </span>
                      </PearlButton>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}