"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { UserRound } from "@/components/icons";
import { navItems, chapter } from "@/data/chapter";
export default function Navigation(){
 const pathname=usePathname(); const [open,setOpen]=useState(false); const [progress,setProgress]=useState(0); const panel=useRef(null); const toggle=useRef(null); const header=useRef(null); const homeRail=useRef(null); const innerRail=useRef(null);
 const isHome=pathname==='/';
 const shelfItems=navItems;
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{const update=()=>{const height=document.documentElement.scrollHeight-innerHeight;setProgress(height>0?Math.round(scrollY/height*100):0)};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[pathname]);
 useEffect(()=>{if(!open)return;const close=e=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus()}else if(e.type==='pointerdown'&&!panel.current?.contains(e.target))setOpen(false)};document.addEventListener('keydown',close);document.addEventListener('pointerdown',close);return()=>{document.removeEventListener('keydown',close);document.removeEventListener('pointerdown',close)}},[open]);
 useEffect(()=>{
  if(pathname.startsWith('/points')||!isHome)return;
  const root=header.current;
  if(!root)return;
  let frame=0;
  const rgb=value=>{const match=value.match(/rgba?\((\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)(?:[, /]+(\d*(?:\.\d+)?))?\)/);return match?{r:+match[1],g:+match[2],b:+match[3],a:match[4]===undefined?1:+match[4]}:null};
  const surfaceAt=(x,y)=>{
   const stack=document.elementsFromPoint(x,y);
   let element=stack.find(item=>!item.closest('.chapter-header')&&!item.closest('.page-curtain'));
   while(element){
    const color=rgb(getComputedStyle(element).backgroundColor);
    if(color&&color.a>.18)return color;
    element=element.parentElement;
   }
   return {r:255,g:255,b:255,a:1};
  };
  const classify=color=>{
   if(color.r>205&&color.g>155&&color.b<115)return 'gold';
   if(color.b>170&&color.g>155&&color.r<205)return 'sky';
   const linear=[color.r,color.g,color.b].map(channel=>{const value=channel/255;return value<=.03928?value/12.92:((value+.055)/1.055)**2.4});
   const luminance=.2126*linear[0]+.7152*linear[1]+.0722*linear[2];
   return luminance<.32?'dark':'light';
  };
  const update=()=>{
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    const y=Math.min(innerHeight-1,isHome?102:82);
    const tones=[.18,.5,.82].map(part=>classify(surfaceAt(innerWidth*part,y)));
    const tone=tones.sort((a,b)=>tones.filter(item=>item===b).length-tones.filter(item=>item===a).length)[0];
    if(root.dataset.navTone!==tone)root.dataset.navTone=tone;
   });
  };
  update();
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)};
 },[pathname,isHome]);
 useLayoutEffect(()=>{
  if(pathname.startsWith('/points'))return;
  const containers=[homeRail.current,innerRail.current].filter(Boolean);
  const cleanups=containers.map(container=>{
   const targets=[...container.querySelectorAll('[data-nav-target]')];
   const indicator=container.querySelector('[data-nav-indicator]');
   if(!indicator||!targets.length)return()=>{};
   let active=targets.find(item=>item.getAttribute('aria-current')==='page')||(container===homeRail.current?targets[0]:null);
   const move=target=>{
    targets.forEach(item=>item.classList.toggle('is-nav-highlighted',item===target));
    if(!target){indicator.style.opacity='0';return}
    const parentBox=container.getBoundingClientRect(),box=target.getBoundingClientRect();
    if(box.width===0){indicator.style.opacity='0';return}
    indicator.style.setProperty('--nav-pill-x',`${box.left-parentBox.left}px`);
    indicator.style.setProperty('--nav-pill-width',`${box.width}px`);
    indicator.style.opacity='1';
   };
   const listeners=[];
   targets.forEach(target=>{
    const enter=()=>move(target);
    target.addEventListener('pointerenter',enter);
    target.addEventListener('focus',enter);
    listeners.push([target,enter]);
   });
   const leave=()=>move(active);
   const resize=()=>move(active);
   const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(resize);
   container.addEventListener('pointerleave',leave);
   window.addEventListener('resize',resize);
   observer?.observe(container);
   move(active);
   const frame=requestAnimationFrame(()=>move(active));
   return()=>{cancelAnimationFrame(frame);observer?.disconnect();listeners.forEach(([target,enter])=>{target.removeEventListener('pointerenter',enter);target.removeEventListener('focus',enter)});container.removeEventListener('pointerleave',leave);window.removeEventListener('resize',resize)};
  });
  return()=>cleanups.forEach(cleanup=>cleanup());
 },[pathname,isHome]);
 if(pathname.startsWith('/points'))return null;
 if(isHome)return <header ref={header} className="chapter-header is-home" data-nav-tone="light"><Link href="/" className="chapter-brand" aria-label="Campbell FBLA home"><Image src="/FBLA-Symbol.png" alt="" width={44} height={44}/><span>Campbell<br/><b>FBLA</b></span></Link><div ref={panel} className={`chapter-menu ${open?'is-open':''}`}><div ref={homeRail} className="chapter-capsule"><span className="nav-hover-pill" data-nav-indicator aria-hidden="true"/><button data-nav-target ref={toggle} className="chapter-menu-toggle" aria-expanded={open} aria-controls="chapter-navigation" onClick={()=>setOpen(!open)}><span className="chapter-menu-lines" aria-hidden="true"/>{open?'Close':'Menu'}</button><button data-nav-target className="chapter-top" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>↑</button><span data-nav-target className="chapter-progress" aria-label={`${progress}% of page read`}>{progress}%</span></div><nav id="chapter-navigation" hidden={!open} aria-label="Primary navigation"><span className="chapter-menu-label">Explore Campbell</span>{navItems.map(item=><Link key={item.href} href={item.href} onClick={()=>setOpen(false)} aria-current={pathname===item.href?'page':undefined}>{item.label}<span>↗</span></Link>)}<div className="chapter-menu-secondary"><span className="chapter-menu-label">Connect</span><Link href="/contact" onClick={()=>setOpen(false)}>Contact us ↗</Link>{chapter.socials.map(item=><a key={item.label} href={item.href}>{item.label} ↗</a>)}</div></nav></div><div className="chapter-header-actions"><Link className="chapter-account" href="/points" aria-label="Member Portal"><UserRound size={18} strokeWidth={1.9} aria-hidden="true"/></Link><Link className="chapter-join" href="/get-involved">Get involved <span>↗</span></Link></div></header>;
 return <header ref={header} className="chapter-header is-inner" data-nav-tone="light"><div ref={panel} className={`inner-nav-shelf ${open?'is-open':''}`}><Link href="/" className="inner-nav-brand" aria-label="Campbell FBLA home"><Image src="/FBLA-Symbol.png" alt="" width={31} height={31}/><span>Campbell FBLA</span></Link><nav ref={innerRail} className="inner-nav-links" aria-label="Primary navigation"><span className="nav-hover-pill" data-nav-indicator aria-hidden="true"/>{shelfItems.map(item=><Link data-nav-target key={item.href} href={item.href} aria-current={pathname===item.href?'page':undefined}>{item.label}</Link>)}</nav><Link className="inner-nav-portal" href="/points"><span>Member Portal</span><b aria-hidden="true">↗</b></Link><button ref={toggle} className="inner-nav-toggle" aria-expanded={open} aria-controls="inner-mobile-navigation" onClick={()=>setOpen(!open)}><span className="chapter-menu-lines" aria-hidden="true"/>{open?'Close':'Menu'}</button><nav id="inner-mobile-navigation" className="inner-mobile-navigation" hidden={!open} aria-label="Mobile navigation">{navItems.map(item=><Link key={item.href} href={item.href} onClick={()=>setOpen(false)} aria-current={pathname===item.href?'page':undefined}>{item.label}<span>↗</span></Link>)}<Link href="/contact" onClick={()=>setOpen(false)}>Contact us <span>↗</span></Link></nav></div></header>;
}
export function ExploreNav({section,groups}){
 void section; void groups;
 return null;
}
