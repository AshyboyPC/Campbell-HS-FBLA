"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft } from "@/components/icons";
import { portalEase } from "./portal-motion";
import styles from "./auth.module.css";

gsap.registerPlugin(useGSAP);

export function AuthFrame({ children, mode }: { children: ReactNode; mode?: "signin" | "signup" }) {
  const scope = useRef<HTMLElement>(null);
  const photo = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!photo.current || !panel.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap.timeline({ defaults: { ease: portalEase } });
    if (matchMedia("(min-width: 761px)").matches) {
      tl.fromTo(photo.current, { clipPath: "inset(0 0 0 9%)" }, {
        clipPath: "inset(0 0 0 0%)", duration: .65, clearProps: "clipPath",
      }, 0);
    }
    tl.fromTo(panel.current, { y: 16, opacity: 0 }, {
      y: 0, opacity: 1, duration: .44, clearProps: "transform,opacity",
    }, .06);
  }, { scope });

  return (
    <section ref={scope} className={styles.frame} data-portal-view aria-label="Campbell FBLA member access">
      <div className={styles.panel}>
        <header className={styles.header}>
          <Link className={styles.brand} href="/points">
            <Image src="/FBLA-Symbol.png" alt="" width={35} height={35} />
            <span>Campbell FBLA</span>
          </Link>
          <Link className={styles.back} href="/points"><ArrowLeft size={15} /> Portal home</Link>
        </header>
        <div className={styles.content} ref={panel} data-portal-content>
          {mode && <nav className={styles.tabs} aria-label="Account access">
            <Link href="/points/login" aria-current={mode === "signin" ? "page" : undefined}>Sign in</Link>
            <Link href="/points/login?mode=signup" aria-current={mode === "signup" ? "page" : undefined}>Sign up</Link>
          </nav>}
          {children}
        </div>
      </div>
      <figure className={styles.photo} ref={photo}>
        <Image src="/RLC%20Winners.jpg" alt="Campbell FBLA members wearing their competition medals" fill sizes="(max-width: 760px) 1px, 50vw" />
        <figcaption><span>Campbell FBLA</span><span>Region Leadership Conference</span></figcaption>
      </figure>
    </section>
  );
}
