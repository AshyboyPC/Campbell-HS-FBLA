"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {useAfterPageMotion} from "@/components/chapter/use-after-page-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pathways = [
  {
    label: "SHOW WHAT YOU KNOW",
    name: "COMPETE",
    detail: "Test your skills through FBLA competitive events and prepare for conferences from regional through national levels.",
    href: "/compete",
    link: "Explore Competition"
  },
  {
    label: "TAKE OWNERSHIP",
    name: "LEAD",
    detail: "Take ownership through officer roles, committees, chapter events, and projects that actually need student leadership.",
    href: "/about#leadership",
    link: "Meet Our Leadership"
  },
  {
    label: "MAKE IT COUNT",
    name: "SERVE",
    detail: "Work on meaningful service projects and community partnerships while creating measurable impact.",
    href: "/get-involved#service",
    link: "Explore Service"
  },
  {
    label: "MAKE IT USEFUL",
    name: "BUILD",
    detail: "Use business, technology, design, and problem-solving skills to create tools and projects for the chapter and community.",
    href: "/get-involved#coding",
    link: "Explore Committees"
  }
];

const cardAngles = [-5.5, -1.8, 1.8, 5.5];
const cardLift = [20, 3, 3, 20];

export default function Opportunities() {
  const root = useRef(null);

  useAfterPageMotion(root,() => {
    const media = gsap.matchMedia();

    media.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray(".pathway-flip-card");
      const innerCards = gsap.utils.toArray(".pathway-flip-card-inner");
      const grid = root.current?.querySelector(".pathway-flip-grid");
      const progress = root.current?.querySelector(".pathway-scroll-progress span");

      gsap.set(cards, { xPercent: 0, y: 0, rotation: 0, transformOrigin: "50% 100%" });
      gsap.set(innerCards, { rotationY: 0, transformOrigin: "50% 50%" });
      gsap.set(grid, { columnGap: 0 });
      gsap.set(progress, { scaleX: 0, backgroundColor: "#061a4e" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current?.querySelector(".pathway-scroll-story"),
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
          invalidateOnRefresh: true
        }
      });

      timeline
        .to(progress, { scaleX: 1, duration: 1, ease: "none" }, 0)
        .to(progress, { backgroundColor: "#1769e8", duration: 0.28, ease: "none" }, 0.28)
        .to(progress, { backgroundColor: "#ffc72c", duration: 0.28, ease: "none" }, 0.66)
        .to(grid, { columnGap: 16, duration: 0.2, ease: "power2.inOut" }, 0.19)
        .to(innerCards, {
          rotationY: 180,
          duration: 0.34,
          stagger: 0.035,
          ease: "power2.inOut"
        }, 0.35)
        .to(cards, {
          rotation: (index) => cardAngles[index],
          y: (index) => cardLift[index],
          xPercent: (index) => [-3, -1, 1, 3][index],
         duration: 0.3,
         stagger: 0.025,
         ease: "power3.out"
       }, 0.55);
    });

    return () => media.revert();
  });

  return (
    <section ref={root} className="v2-opportunities pathway-scroll-section">
      <div className="pathway-scroll-story">
        <div className="pathway-scroll-pin">
          <div className="pathway-scroll-heading">
            <span className="v2-tag">GET INVOLVED</span>
            <h2>THIS ISN’T JUST ANOTHER <em>CLUB.</em></h2>
            <p>Choose how you want to get involved. Compete, lead projects, serve your community, or build something new.</p>
          </div>

          <div className="pathway-flip-grid" aria-label="Ways to get involved">
            {pathways.map((pathway, index) => (
              <article className={`pathway-flip-card pathway-flip-card-${index}`} key={pathway.name}>
                <div className="pathway-flip-card-inner">
                  <div
                    className={`pathway-flip-face pathway-flip-front pathway-flip-front-${index}`}
                    aria-hidden="true"
                  />
                  <div className="pathway-flip-face pathway-flip-back">
                    <span className="pathway-card-number">0{index + 1}</span>
                    <span className="pathway-card-label">{pathway.label}</span>
                    <strong>{pathway.name}</strong>
                    <p>{pathway.detail}</p>
                    <Link href={pathway.href}>{pathway.link} <span>→</span></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pathway-scroll-progress" aria-hidden="true"><span /></div>
        </div>
      </div>
    </section>
  );
}
