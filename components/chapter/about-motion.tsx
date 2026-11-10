"use client";

import {useRef} from "react";
import gsap from "gsap";
import {useAfterPageMotion} from "@/components/chapter/use-after-page-motion";
import {CustomEase} from "gsap/CustomEase";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(CustomEase, ScrollTrigger);

export default function AboutMotion({children}: {children: React.ReactNode}) {
  const root = useRef<HTMLDivElement>(null);

  useAfterPageMotion(root,() => {
    const motion = gsap.matchMedia(root.current);
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const ease = CustomEase.create("about-editorial-ease", "M0,0 C0.18,0.72 0.2,1 1,1");
      gsap.timeline({defaults: {ease}})
        .from(".about-fold-title > span", {y: 24, rotationX: -68, transformOrigin: "50% 0%", autoAlpha: 0, duration: 0.62, stagger: 0.07, ease: "power3.out"})
        .from(".about-hero-copy > .about-label", {y: 16, autoAlpha: 0, duration: 0.45})
        .from(".about-hero-copy > p", {y: 22, autoAlpha: 0, duration: 0.65}, "-=0.12")
        .from(".about-jump a", {y: 14, autoAlpha: 0, duration: 0.45, stagger: 0.08}, "-=0.24")
        .from(".about-hero-mark", {x: 34, scale: 0.97, autoAlpha: 0, duration: 0.8}, "-=0.55");

      gsap.set(".about-officer-grid", {perspective: 1100});
      const reveals = [
        {trigger: ".about-levels", selector: ".about-level-list > article", from: {x: -32, autoAlpha: 0}, stagger: 0.12},
        {trigger: ".about-record", selector: ".about-record-list > article", from: {y: 36, scale: 0.93, autoAlpha: 0}, stagger: 0.13, ease: "back.out(1.25)"},
        {trigger: ".about-leadership", selector: ".about-officer-grid > article", from: {rotationX: 9, y: 22, autoAlpha: 0}, stagger: {each: 0.08, from: "center" as const}},
        {trigger: ".about-structure", selector: ".about-committee-grid > article", from: {clipPath: "inset(0 0 100% 0)", autoAlpha: 0}, stagger: 0.1},
        {trigger: ".about-membership", selector: ".about-opportunity-list > article", from: {x: 28, autoAlpha: 0}, stagger: 0.1},
        {trigger: ".about-next", selector: ".about-next-grid > a", from: {scale: 0.94, y: 20, autoAlpha: 0}, stagger: {each: 0.09, from: "center" as const}, ease: "back.out(1.35)"},
        {trigger: ".about-advisers", selector: ".about-adviser-names > span", from: {x: (index: number) => index % 2 ? 20 : -20, autoAlpha: 0}, stagger: 0.08},
        {trigger: ".about-final", selector: ".about-final-actions > a", from: {y: 18, scale: 0.94, autoAlpha: 0}, stagger: 0.1, ease: "back.out(1.3)"},
      ];

      reveals.forEach(({trigger, selector, from, stagger, ease: itemEase}) => {
        const section = root.current?.querySelector(trigger);
        const targets = gsap.utils.toArray<HTMLElement>(selector, root.current);
        if (!section || !targets.length) return;
        gsap.fromTo(targets, from, {
          x: 0, y: 0, scale: 1, rotationX: 0, clipPath: "inset(0 0 0% 0)", autoAlpha: 1,
          duration: 0.68, ease: itemEase || ease, stagger,
          scrollTrigger: {trigger: section, start: "top 84%", once: true},
        });
      });
    });
    return () => motion.revert();
  });

  return <div ref={root}>{children}</div>;
}
