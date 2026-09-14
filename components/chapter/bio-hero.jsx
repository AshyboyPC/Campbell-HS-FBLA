"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { chapter } from "@/data/chapter";
import { ArrowIcon, MeetingOrbit } from "@/components/chapter/hero-artwork";

gsap.registerPlugin(useGSAP);

const cards = [
  {
    eyebrow: "YOUR FIRST WEDNESDAY",
    title: "Start with the room.",
    copy: `Meet us after school at ${chapter.meetingStart} in ${chapter.room}. Come once, look around, and see if it feels like your place.`,
    href: "/events",
    link: "See upcoming dates",
    image: "/hero-start-v2.png",
    alt: "Illustration of a student taking her first step through an open doorway"
  },
  {
    eyebrow: "MEMBERSHIP",
    title: "Choose your way in.",
    copy: "$35 for FBLA, or $45 for FBLA + DECA. One simple choice opens the year to meetings, projects, conferences, and more.",
    href: "/get-involved",
    link: "How to join",
    image: "/hero-meeting-v2.png",
    alt: "Illustration of three students sharing ideas at a chapter meeting"
  },
  {
    eyebrow: "MEMBER UPDATES",
    title: "Keep it together.",
    copy: "Use BAND for chapter updates, then open the Member Portal for your points, attendance, and progress.",
    href: "/points",
    link: "Open Member Portal",
    image: "/hero-portal-v2.png",
    alt: "Illustration of a member profile with progress checks and an award"
  }
];

export default function BioHero() {
  const root = useRef(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".bio-editorial-line", { yPercent: 70, opacity: 0, duration: 0.78, stagger: 0.09 })
      .from(".bio-clean-copy, .bio-clean-actions", { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.3)
      .from(".bio-clean-card", { y: 38, opacity: 0, duration: 0.72, stagger: 0.08 }, 0.46)
      .from(".bio-inline-visual", { scale: 0.78, opacity: 0, duration: 0.52, stagger: 0.08 }, 0.28);
  }, { scope: root });

  return <>
    <section ref={root} className="bio-intro bio-clean bio-editorial" aria-labelledby="home-title">
      <div className="bio-clean-layout">
        <header className="bio-editorial-wordmark">
          <h1 id="home-title" aria-label="Campbell FBLA builds future business leaders">
            <span className="bio-editorial-line bio-editorial-line-1">
              <span>Campbell</span>
              <span className="bio-inline-visual bio-inline-teamwork"><Image src="/hero-inline-teamwork-v1.png" alt="" width={1942} height={809} priority /></span>
              <span>FBLA</span>
            </span>
            <span className="bio-editorial-line bio-editorial-line-2">
              <span>Builds Future</span>
              <span className="bio-inline-visual bio-inline-direction"><Image src="/hero-inline-direction-v1.png" alt="" width={1254} height={1254} priority /></span>
            </span>
            <span className="bio-editorial-line bio-editorial-line-3">
              <span>Business</span>
              <span className="bio-inline-visual bio-inline-leadership"><Image src="/hero-inline-leadership-v1.png" alt="" width={1860} height={845} priority /></span>
              <span>Leaders</span>
            </span>
          </h1>
        </header>

        <div className="bio-clean-intro">
          <p className="bio-clean-copy">A student-led place to meet people, try something ambitious, and leave high school knowing more about what you can do next.</p>
          <div className="bio-clean-actions"><Link href="/about">Meet the chapter <span>↗</span></Link></div>
        </div>

        <div className="bio-clean-grid">
          <div className="bio-card-orbit"><MeetingOrbit time={chapter.meetingStart} room={chapter.room} /></div>
          {cards.map((card, index) => <Link className={`bio-clean-card bio-clean-card-${index + 1}`} href={card.href} key={card.title}>
            <div className="bio-clean-card-top"><span>{card.eyebrow}</span><i><ArrowIcon /></i></div>
            <div className="bio-clean-art"><Image src={card.image} alt={card.alt} width={1024} height={1536} sizes="(max-width: 680px) 100vw, 33vw" priority /></div>
            <div className="bio-clean-card-copy"><strong>{card.title}</strong><p>{card.copy}</p><span>{card.link} →</span></div>
          </Link>)}
          <svg className="bio-card-connector" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="bio-card-connector-halo" d="M30.7 57H33.1 M33.9 57H36.3 M63.7 57H66.1 M66.9 57H69.3" />
            <path className="bio-card-connector-line" d="M30.7 57H33.1 M33.9 57H36.3 M63.7 57H66.1 M66.9 57H69.3" />
          </svg>
        </div>
      </div>
    </section>
  </>;
}
