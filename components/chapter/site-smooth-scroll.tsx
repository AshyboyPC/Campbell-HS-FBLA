"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {isPageMotionReady,PAGE_MOTION_READY_EVENT} from "@/lib/page-motion-ready";

gsap.registerPlugin(ScrollTrigger);

const smoothScrollPages = new Set(["/", "/about", "/get-involved"]);

export default function SiteSmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!smoothScrollPages.has(pathname)) return;
    let lenis: Lenis | null = null;
    let refreshFrame = 0;
    const start = () => {
      if (window.location.pathname !== pathname || !isPageMotionReady(pathname) || lenis) return;
      lenis = new Lenis({
        anchors: true,
        lerp: 0.055,
        wheelMultiplier: 0.95,
        respectReducedMotion: true,
        stopInertiaOnNavigate: true,
      });
      const syncScrollTrigger = () => ScrollTrigger.update();
      const tick = (time: number) => lenis?.raf(time * 1000);
      lenis.on("scroll", syncScrollTrigger);
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(tick);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      cleanup = () => {
        cancelAnimationFrame(refreshFrame);
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis?.destroy();
        lenis = null;
      };
    };
    let cleanup = () => {};
    if (isPageMotionReady(pathname)) start();
    else document.addEventListener(PAGE_MOTION_READY_EVENT, start);
    return () => {
      document.removeEventListener(PAGE_MOTION_READY_EVENT, start);
      cleanup();
    };
  }, [pathname]);

  return null;
}
