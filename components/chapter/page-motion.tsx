"use client";

import Image from "next/image";
import {useEffect,useRef} from "react";
import {usePathname,useRouter} from "next/navigation";
import gsap from "gsap";

const TICK_COUNT=48;

export default function PageMotion(){
 const curtain=useRef<HTMLDivElement>(null);
 const ring=useRef<HTMLDivElement>(null);
 const disc=useRef<HTMLDivElement>(null);
 const number=useRef<HTMLSpanElement>(null);
 const timeline=useRef<gsap.core.Timeline|null>(null);
 const pathname=usePathname();
 const router=useRouter();
 const busy=useRef(false);

 useEffect(()=>{
  if(pathname.startsWith("/points"))return;
  if(!curtain.current||!ring.current||!disc.current||!number.current)return;
  timeline.current?.kill();
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ticks=ring.current.querySelectorAll(".loader-tick span");
  const counter={value:0};
  gsap.set(curtain.current,{yPercent:0,borderRadius:"0 0 34px 34px",pointerEvents:"all"});
  gsap.set(disc.current,{scale:reduced?1:.82,opacity:1});
  gsap.set(ticks,{scaleY:reduced?1:.14,opacity:reduced?1:.12,transformOrigin:"50% 100%"});
  number.current.textContent=reduced?"100":"0";
  if(reduced){
   timeline.current=gsap.timeline({onComplete:()=>{busy.current=false}}).to(curtain.current,{yPercent:-105,duration:.01,delay:.12,pointerEvents:"none"});
   return()=>{timeline.current?.kill();};
  }
  timeline.current=gsap.timeline({onComplete:()=>{busy.current=false}})
   .to(disc.current,{scale:1,duration:.52,ease:"back.out(1.75)"},0)
   .to(counter,{value:100,duration:1.3,ease:"power1.inOut",onUpdate:()=>{if(number.current)number.current.textContent=String(Math.round(counter.value))}},0)
   .to(ticks,{scaleY:1,opacity:1,duration:.16,stagger:.024,ease:"back.out(3)"},.05)
   .to(curtain.current,{yPercent:-105,borderRadius:"0 0 52px 52px",duration:.72,ease:"power4.inOut",pointerEvents:"none"},1.42);
  const main=document.getElementById("main");
  if(main)gsap.fromTo(main,{y:24,opacity:.55},{y:0,opacity:1,duration:.85,delay:1.7,ease:"power3.out",clearProps:"transform,opacity"});
  return()=>{timeline.current?.kill();};
 },[pathname]);

 useEffect(()=>{
  if(pathname.startsWith("/points"))return;
  const follow=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=(event.target as Element)?.closest("a");
   if(!link||link.target||link.hasAttribute("download"))return;
   const destination=new URL(link.href,location.href);
   if(destination.origin!==location.origin||destination.pathname===location.pathname)return;
   event.preventDefault();
   if(busy.current||!curtain.current||!ring.current||!number.current)return;
   busy.current=true;
   timeline.current?.kill();
   const ticks=ring.current.querySelectorAll(".loader-tick span");
   gsap.set(ticks,{scaleY:.14,opacity:.12});
   gsap.set(disc.current,{scale:.82});
   number.current.textContent="0";
   gsap.fromTo(curtain.current,{yPercent:105,borderRadius:"34px 34px 0 0"},{yPercent:0,borderRadius:"0",duration:.48,ease:"power4.inOut",pointerEvents:"all",onComplete:()=>router.push(destination.pathname+destination.search+destination.hash)});
  };
  document.addEventListener("click",follow,true);
  return()=>document.removeEventListener("click",follow,true);
 },[router,pathname]);

 if(pathname.startsWith("/points"))return null;
 return <div ref={curtain} className="page-curtain" aria-live="polite" aria-label="Loading Campbell FBLA page">
  <div className="chapter-loader">
   <div ref={ring} className="loader-ring" aria-hidden="true">
    {Array.from({length:TICK_COUNT},(_,index)=><i className={`loader-tick loader-tick-${Math.floor(index/16)}`} style={{transform:`rotate(${index*(360/TICK_COUNT)}deg) translateY(-132px)`}} key={index}><span/></i>)}
    <div ref={disc} className="loader-logo-disc"><Image src="/campbell-georgia-fbla-lockup.png" alt="" width={1288} height={1264} priority/></div>
   </div>
   <p className="loader-progress"><span ref={number}>0</span><small>%</small></p>
  </div>
 </div>;
}
