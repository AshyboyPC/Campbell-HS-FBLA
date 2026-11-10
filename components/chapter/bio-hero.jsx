"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import {useAfterPageMotion} from "@/components/chapter/use-after-page-motion";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { chapter } from "@/data/chapter";
import { ArrowIcon, MeetingOrbit } from "@/components/chapter/hero-artwork";

gsap.registerPlugin(CustomEase, DrawSVGPlugin, MotionPathPlugin, ScrollTrigger, SplitText);

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

  useAfterPageMotion(root,() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const editorialEase = CustomEase.create("bio-editorial-ease", "M0,0 C0.16,0.8 0.2,1 1,1");
    const split = SplitText.create(".bio-editorial-line > span:not(.bio-inline-visual)", {
      type: "words",
      wordsClass: "bio-word++",
      aria: "auto",
    });
    gsap.from(split.words, {
      yPercent: 115,
      autoAlpha: 0,
      duration: 0.78,
      stagger: 0.035,
      ease: editorialEase,
    });

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".bio-clean-copy, .bio-clean-actions", { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, 0)
      .from(".bio-clean-card:not(.bio-clean-card-3)", { y: 38, scale: 0.96, opacity: 0, duration: 0.72, stagger: 0.08, ease: editorialEase }, 0.06)
      .from(".bio-inline-visual", { scale: 0.78, rotation: -5, opacity: 0, duration: 0.62, stagger: 0.08, ease: "back.out(1.6)" }, 0)
      .from(".bio-card-orbit", { scale: 0.78, rotation: -12, opacity: 0, duration: 0.68, ease: "back.out(1.5)" }, 0.06);

    const connector = root.current?.querySelector(".bio-card-connector-line");
    if (connector && window.matchMedia("(min-width: 981px)").matches) {
      gsap.fromTo(connector, { drawSVG: "0%" }, {
        drawSVG: "100%",
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".bio-clean-grid", start: "top 70%", once: true },
      });
    }

    gsap.to(".meeting-orbit-marker", {
      duration: 18,
      repeat: -1,
      ease: "none",
      motionPath: { path: "#meeting-orbit-path", align: "#meeting-orbit-path", alignOrigin: [0.5, 0.5] },
    });

    return () => split.revert();
  });

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
