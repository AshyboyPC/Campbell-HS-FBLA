"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const entryRoutes = new Set(["/points", "/points/login", "/points/onboarding"]);
export const portalEase = "power3.out";

export function PortalMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const router = useRouter();
  const { contextSafe } = useGSAP({ scope: root });

  const follow = contextSafe((event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey
        || event.altKey || event.shiftKey || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;
    const destination = new URL(link.href);
    const current = new URL(location.href);
    if (destination.origin !== current.origin || !entryRoutes.has(destination.pathname)
        || (destination.pathname === current.pathname && destination.search === current.search)) return;

    const page = link.closest<HTMLElement>("[data-portal-view]");
    const content = page?.querySelector<HTMLElement>("[data-portal-content]");
    if (!content) return;
    event.preventDefault();
    if (leaving.current) return;
    leaving.current = true;

    gsap.to(content, {
      y: -9, opacity: .25, duration: .16, ease: "power2.in", overwrite: "auto",
      onComplete: () => {
        leaving.current = false;
        router.push(destination.pathname + destination.search + destination.hash);
      },
    });
    // Keep the form readable if a route request is slow or fails.
    gsap.to(content, { y: 0, opacity: 1, delay: .65, duration: .24, ease: portalEase, clearProps: "transform,opacity" });
  });

  return <div ref={root} onClickCapture={follow}>{children}</div>;
}

export function PortalStage({ children, stage }: { children: ReactNode; stage: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!root.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.current, { y: 13, opacity: 0 }, {
      y: 0, opacity: 1, duration: .34, ease: portalEase, clearProps: "transform,opacity",
    });
  }, { scope: root, dependencies: [stage], revertOnUpdate: true });
  return <div className="portal-stage" ref={root}>{children}</div>;
}
