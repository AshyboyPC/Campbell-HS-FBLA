"use client";

import {useMemo,useRef} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useAfterPageMotion} from "@/components/chapter/use-after-page-motion";
import "./word-shutter-reveal.css";

type WordShutterRevealProps={text:string;className?:string;cover?:"navy"|"blue"|"sky"|"gold"|"ivory"};

export default function WordShutterReveal({text,className="",cover="blue"}:WordShutterRevealProps){
 const root=useRef<HTMLParagraphElement>(null);
 const parts=useMemo(()=>text.split(/(\s+)/),[text]);

 useAfterPageMotion(root,()=>{
  const element=root.current;
  if(!element)return;
  gsap.registerPlugin(ScrollTrigger);
  const overlays=element.querySelectorAll<HTMLElement>("[data-word-shutter]");
  if(!overlays.length)return;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){gsap.set(overlays,{scaleY:0});return;}
  gsap.set(overlays,{scaleY:1,transformOrigin:"bottom"});
  gsap.to(overlays,{scaleY:0,transformOrigin:"bottom",duration:.48,ease:"expo.out",stagger:.032,scrollTrigger:{trigger:element,start:"top 82%",once:true}});
 });

 return <p ref={root} className={`word-shutter word-shutter-${cover} ${className}`.trim()} aria-label={text}><span className="word-shutter-visual" aria-hidden="true">{parts.map((part,index)=>/^\s+$/.test(part)?part:<span className="word-shutter-word" key={`${part}-${index}`}><span>{part}</span><i data-word-shutter/></span>)}</span></p>;
}
