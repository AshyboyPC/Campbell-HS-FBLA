"use client";

import {useEffect} from "react";

export default function FooterVisibility(){
 useEffect(()=>{
  const footer=document.querySelector<HTMLElement>(".chapter-footer");
  if(!footer)return;

  const setFooterState=(visible:boolean)=>{
   document.body.toggleAttribute("data-footer-visible",visible);
  };

  const observer=new IntersectionObserver(([entry])=>setFooterState(entry.isIntersecting),{threshold:0.01});
  observer.observe(footer);
  return()=>{
   observer.disconnect();
   document.body.removeAttribute("data-footer-visible");
  };
 },[]);

 return null;
}
