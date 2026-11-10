"use client";

import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import type {RefObject} from "react";
import {isPageMotionReady, PAGE_MOTION_READY_EVENT} from "@/lib/page-motion-ready";

gsap.registerPlugin(useGSAP);

export function useAfterPageMotion(scope: RefObject<HTMLElement | null>, setup: () => void | (() => void)) {
  useGSAP((_context, contextSafe) => {
    let started = false;
    let dispose: void | (() => void);
    const start = contextSafe(() => {
      const pathname = window.location.pathname;
      if (!started && isPageMotionReady(pathname)) {
        started = true;
        dispose = setup();
      }
    });
    if (isPageMotionReady(window.location.pathname)) start();
    else document.addEventListener(PAGE_MOTION_READY_EVENT, start);
    return () => {
      document.removeEventListener(PAGE_MOTION_READY_EVENT, start);
      if (typeof dispose === "function") dispose();
    };
  }, {scope});
}
