"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowLeft, ArrowRight } from "@/components/icons";
import { useAfterPageMotion } from "@/components/chapter/use-after-page-motion";
import styles from "./portal-entry.module.css";

gsap.registerPlugin(ScrollTrigger);

export function PortalEntry({ signedIn }: { signedIn: boolean }) {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLElement>(null);
  const guide = useRef<HTMLElement>(null);
  useAfterPageMotion(root, () => {
    if (!root.current || !photo.current || !guide.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lead = root.current.querySelectorAll("[data-entry-reveal]");
    const rows = guide.current.querySelectorAll("[data-guide-row]");
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(photo.current, { clipPath: "inset(0 10% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", duration: .78, clearProps: "clipPath",
      }, 0)
      .fromTo(lead, { y: 19, opacity: 0 }, { y: 0, opacity: 1, duration: .46, stagger: .065, clearProps: "transform,opacity" }, .09);
    gsap.fromTo(rows, { x: 16, opacity: .25 }, {
      x: 0, opacity: 1, duration: .45, stagger: .085, ease: "power3.out",
      scrollTrigger: { trigger: guide.current, start: "top 82%", once: true },
      clearProps: "transform,opacity",
    });
  });

  return (
    <section className={styles.page} ref={root} data-portal-view aria-label="Campbell FBLA member portal">
      <header className={styles.top}>
        <Link className={styles.brand} href="/">
          <Image src="/FBLA-Symbol.png" alt="" width={35} height={35} /> Campbell FBLA
        </Link>
        <Link href="/" className={styles.utility}><ArrowLeft size={15} /> Chapter website</Link>
      </header>
      <div className={styles.hero} data-portal-content>
        <div className={styles.intro}>
          <p className={styles.label} data-entry-reveal>Member portal</p>
          <h1 data-entry-reveal>Your work<br />adds up.</h1>
          <p className={styles.summary} data-entry-reveal>Check your FBLA points, see which activities counted, and track your progress toward a graduation cord.</p>
          <div className={styles.actions} data-entry-reveal>
            <Link className={styles.primary} href={signedIn ? "/points/onboarding" : "/points/login"}>
              {signedIn ? "Open my portal" : "Sign in"}<ArrowRight size={18} />
            </Link>
            {!signedIn && <Link className={styles.secondary} href="/points/login?mode=signup">Sign up<ArrowRight size={16} /></Link>}
          </div>
          <a className={styles.utility} href="#portal-guide" data-entry-reveal>How it works <ArrowDown size={16} /></a>
        </div>
        <figure className={styles.photo} ref={photo}>
          <Image src="/RLC%20Winners.jpg" alt="Campbell FBLA members wearing medals at the Region Leadership Conference" fill priority sizes="(max-width: 800px) 100vw, 54vw" />
          <figcaption>Campbell FBLA · Region Leadership Conference</figcaption>
        </figure>
      </div>
      <section className={styles.guide} id="portal-guide" ref={guide} aria-labelledby="portal-guide-heading">
        <h2 id="portal-guide-heading">Using the portal</h2>
        <dl>
          <div data-guide-row><dt>Find your record</dt><dd>Use the personal email from FBLA Connect. If the chapter already recorded your points, sign-up helps you connect to that record.</dd></div>
          <div data-guide-row><dt>See what counted</dt><dd>Open your history to see the activities behind your total. Submit a correction if a sign-in is missing.</dd></div>
          <div data-guide-row><dt>Track your cord</dt><dd>Your dashboard shows your official points and the graduation cord target for your class.</dd></div>
        </dl>
      </section>
    </section>
  );
}
