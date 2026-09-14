"use client";

import {useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP,ScrollTrigger);

export default function HomeMotion({children}:{children:React.ReactNode}){
 const root=useRef<HTMLDivElement>(null);
 useGSAP(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.utils.toArray<HTMLElement>('[data-home-reveal]').forEach((section)=>{
   gsap.fromTo(section,{y:42,opacity:0},{y:0,opacity:1,duration:.78,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 86%',once:true}});
  });
  gsap.utils.toArray<HTMLElement>('[data-home-float]').forEach((asset,index)=>{
   gsap.to(asset,{y:index%2?18:-18,rotation:index%2?2:-2,duration:2.8+index*.25,ease:'sine.inOut',repeat:-1,yoyo:true});
  });
 },{scope:root});
 return <div ref={root} className="home-v2">{children}</div>;
}
