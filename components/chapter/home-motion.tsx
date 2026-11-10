"use client";

import {useRef} from "react";
import gsap from "gsap";
import {useAfterPageMotion} from "@/components/chapter/use-after-page-motion";
import {CustomEase} from "gsap/CustomEase";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(CustomEase,ScrollTrigger);

export default function HomeMotion({children}:{children:React.ReactNode}){
 const root=useRef<HTMLDivElement>(null);
 useAfterPageMotion(root,()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ease=CustomEase.create('home-editorial-ease','M0,0 C0.12,0.78 0.22,1 1,1');
  const reveal=(section:HTMLElement,targets:Element[],from:gsap.TweenVars,to:gsap.TweenVars={})=>{
   if(!targets.length)return;
   gsap.fromTo(targets,from,{...to,ease:to.ease||ease,stagger:to.stagger??0.075,scrollTrigger:{trigger:section,start:'top 82%',once:true}});
  };

  root.current?.querySelectorAll<HTMLElement>('[data-home-reveal]').forEach(section=>{
   const style=section.dataset.homeReveal;
   if(style==='story'){
    reveal(section,Array.from(section.querySelectorAll('.v2-story-copy > *')),{x:-28,autoAlpha:0},{x:0,autoAlpha:1,stagger:0.09,duration:0.68});
    reveal(section,Array.from(section.querySelectorAll('.v2-ownership > div')),{x:34,autoAlpha:0},{x:0,autoAlpha:1,stagger:0.1,duration:0.65});
   }else if(style==='events'){
    reveal(section,Array.from(section.querySelectorAll('.v2-event-card')),{x:-26,autoAlpha:0},{x:0,autoAlpha:1,stagger:{each:0.09,from:'start'},duration:0.58});
    gsap.from(section.querySelectorAll('.v2-date'),{scale:0.74,rotation:-7,duration:0.5,ease:'back.out(1.7)',stagger:0.08,scrollTrigger:{trigger:section,start:'top 82%',once:true}});
   }else if(style==='committees'){
    reveal(section,Array.from(section.querySelectorAll('.v2-committee-card')),{y:38,scale:0.92,autoAlpha:0},{y:0,scale:1,autoAlpha:1,stagger:{each:0.1,from:'center'},duration:0.72});
   }else if(style==='archive'){
    reveal(section,Array.from(section.querySelectorAll('.v2-card-heading')),{x:-22,autoAlpha:0},{x:0,autoAlpha:1,duration:0.6});
    gsap.from(section.querySelectorAll('.v2-archive-art > div'),{y:34,rotation:(index)=>[-3,2,-2][index],scale:0.94,autoAlpha:0,duration:0.68,ease:'back.out(1.25)',stagger:0.1,scrollTrigger:{trigger:section,start:'top 82%',once:true}});
   }else if(style==='final'){
    reveal(section,Array.from(section.querySelectorAll('.v2-final-art')),{xPercent:-22,scale:0.93,autoAlpha:0},{xPercent:0,scale:1,autoAlpha:1,duration:0.78});
    reveal(section,Array.from(section.querySelectorAll('.v2-final-copy')),{x:28,autoAlpha:0},{x:0,autoAlpha:1,duration:0.68});
    gsap.from(section.querySelectorAll('.v2-final-actions .v2-button'),{y:16,autoAlpha:0,duration:0.48,ease:'back.out(1.4)',stagger:0.1,scrollTrigger:{trigger:section,start:'top 82%',once:true}});
   }
  });
 });
 return <div ref={root} className="home-v2">{children}</div>;
}
