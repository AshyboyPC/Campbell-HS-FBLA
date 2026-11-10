"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CalendarSync, ChevronRight, ClipboardCheck, Gauge, LayoutDashboard, Settings2, ShieldCheck, Users } from "@/components/icons";
import { PortalSignOut } from "./portal-actions";

type NavItem = { label:string; note:string; href:string; icon:React.ComponentType<{ size?:number; strokeWidth?:number }> };
const active = (pathname:string, href:string) => pathname === href || pathname.startsWith(`${href}/`);

export function PortalNavigation({ adviser, officer, year, displayName, roleLabel }: { adviser:boolean; staff:boolean; admin:boolean; officer:boolean; year?:string; displayName:string; roleLabel:string }) {
  const pathname=usePathname();
  const sidebarRef=useRef<HTMLElement>(null);
  const memberItems:NavItem[]=[
    {label:"Overview",note:"Your chapter snapshot",href:"/points/dashboard",icon:LayoutDashboard},
    {label:"Activity",note:"Points, attendance, rank, and rules",href:"/points/activity",icon:Gauge},
    {label:"Requests",note:"Submit work or fix a record",href:"/points/requests",icon:ClipboardCheck},
    ...(officer?[{label:"Officer center",note:"Status, meetings, and absence notice",href:"/points/officer",icon:ShieldCheck}]:[]),
    ...(officer?[{label:"Review points",note:"Approve submitted member evidence",href:"/points/manage/review",icon:ClipboardCheck}]:[]),
  ];
  const adviserItems:NavItem[]=[
    {label:"Overview",note:"Portal queues and health",href:"/points/admin/dashboard",icon:LayoutDashboard},
    {label:"Members",note:"Roster, access, and member records",href:"/points/manage/members",icon:Users},
    {label:"Review",note:"Claims, attendance, and corrections",href:"/points/manage/review",icon:ClipboardCheck},
    {label:"Events & sync",note:"Events, Form, and adviser Sheet",href:"/points/manage/events",icon:CalendarSync},
    {label:"Settings",note:"Rules, reports, policy, and audit",href:"/points/admin/settings",icon:Settings2},
  ];
  const items=adviser?adviserItems:memberItems;

  useEffect(()=>{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const context=gsap.context(()=>{gsap.from(".portal-brand, .portal-nav-direct, .portal-user",{x:-16,opacity:0,duration:.5,stagger:.045,ease:"power3.out"});},sidebarRef);
    return()=>context.revert();
  },[]);
  useEffect(()=>{
    if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)gsap.fromTo(".portal-main > *",{y:12,opacity:0},{y:0,opacity:1,duration:.45,stagger:.03,ease:"power3.out",overwrite:true});
  },[pathname]);

  return <aside className="portal-sidebar portal-sidebar-energy" ref={sidebarRef}>
    <Link className="portal-brand" href={adviser?"/points/admin/dashboard":"/points/dashboard"}><span>CF</span><b>{adviser?"Adviser Console":"Member Portal"}<small>{year}</small></b></Link>
    <nav className="portal-nav-stack" aria-label="Member Portal navigation">
      {items.map(item=>{const Icon=item.icon;return <Link className={`portal-nav-direct ${active(pathname,item.href)?"is-active":""}`} href={item.href} key={item.href}><Icon size={18} strokeWidth={1.8}/><span><b>{item.label}</b><small>{item.note}</small></span><ChevronRight size={15}/></Link>})}
    </nav>
    <div className="portal-user"><span>{displayName}</span><small>{roleLabel}</small><PortalSignOut/></div>
  </aside>;
}
