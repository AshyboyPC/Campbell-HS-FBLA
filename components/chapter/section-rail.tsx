"use client";

import {usePathname} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {
 Archive,
 BadgeCheck,
 BookOpenText,
 CalendarClock,
 CalendarDays,
 ChartNoAxesCombined,
 CircleHelp,
 ClipboardCheck,
 Clock3,
 CodeXml,
 FileSearch2,
 Files,
 FolderOpen,
 GitCompareArrows,
 GraduationCap,
 IdCard,
 Images,
 Info,
 LayoutGrid,
 LifeBuoy,
 Link2,
 ListChecks,
 Map,
 Medal,
 Megaphone,
 MessageCircle,
 MoveRight,
 Network,
 Presentation,
 Rocket,
 Route,
 School,
 Shapes,
 Signpost,
 Target,
 Trophy,
 UserRoundCheck,
 UsersRound,
 type LucideIcon
} from "@/components/icons";
import "./section-rail.css";

const sectionIcons={
 analytics:ChartNoAxesCombined,
 apps:LayoutGrid,
 archive:Archive,
 badge:BadgeCheck,
 books:BookOpenText,
 info:Info,
 link:Link2,
 school:School,
 podium:Presentation,
 adviser:UserRoundCheck,
 network:Network,
 next:MoveRight,
 people:UsersRound,
 rocket:Rocket,
 member:IdCard,
 comments:MessageCircle,
 "calendar-alt":CalendarDays,
 trophy:Trophy,
 sign:Signpost,
 calendar:CalendarClock,
 clock:Clock3,
 megaphone:Megaphone,
 medal:Medal,
 formats:Shapes,
 "file-search":FileSearch2,
 compare:GitCompareArrows,
 clipboard:ClipboardCheck,
 pathway:Route,
 graduation:GraduationCap,
 laptop:CodeXml,
 checklist:ListChecks,
 documents:Files,
 question:CircleHelp,
 target:Target,
 images:Images,
 folder:FolderOpen,
 map:Map,
 help:LifeBuoy
} satisfies Record<string,LucideIcon>;

type RailIcon=keyof typeof sectionIcons;
type RailItem={label:string;selector:string;icon:RailIcon};
type LiveItem=RailItem&{id:string};

const pageSections:Record<string,RailItem[]>={
 "/about":[
  {label:"About",selector:".about-hero",icon:"books"},{label:"What is FBLA?",selector:".about-start",icon:"info"},
  {label:"How it connects",selector:".about-levels",icon:"link"},{label:"Our chapter",selector:".about-history",icon:"school"},
  {label:"The record",selector:".about-record",icon:"analytics"},{label:"Leadership",selector:".about-leadership",icon:"podium"},
  {label:"Advisers",selector:".about-advisers",icon:"adviser"},{label:"Committees",selector:".about-structure",icon:"network"},
  {label:"Membership",selector:".about-membership",icon:"badge"},{label:"Next move",selector:".about-next",icon:"next"}
 ],
 "/get-involved":[
  {label:"Get involved",selector:".gi-hero",icon:"people"},{label:"Start here",selector:".gi-start",icon:"rocket"},
  {label:"Membership",selector:".gi-membership",icon:"member"},{label:"Connect in BAND",selector:".gi-band",icon:"comments"},
  {label:"Meetings",selector:".gi-meetings",icon:"calendar-alt"},{label:"Committees",selector:".gi-committees",icon:"apps"},
  {label:"Leadership",selector:".gi-leadership",icon:"podium"},{label:"Points",selector:".gi-points",icon:"trophy"},
  {label:"Choose next",selector:".gi-next",icon:"sign"}
 ],
 "/events":[
  {label:"Events",selector:".ev-hero",icon:"calendar"},{label:"Calendar",selector:".ev-calendar",icon:"clock"},
  {label:"Member note",selector:".ev-closing",icon:"megaphone"}
 ],
 "/compete":[
  {label:"Compete",selector:".comp-hero",icon:"medal"},{label:"Choose a format",selector:".comp-format",icon:"formats"},
  {label:"Event directory",selector:".comp-directory",icon:"file-search"},{label:"Compare events",selector:".comp-compare",icon:"compare"},
  {label:"How we prepare",selector:".comp-process",icon:"clipboard"},{label:"RLC + SLC",selector:".comp-pathway",icon:"pathway"},
  {label:"After state",selector:".comp-next",icon:"graduation"},{label:"Tech + coding",selector:".comp-tech",icon:"laptop"},
  {label:"Before you commit",selector:".comp-checks",icon:"checklist"},{label:"Official resources",selector:".comp-resources",icon:"documents"},
  {label:"Quick answers",selector:".comp-faq",icon:"question"},{label:"Choose your event",selector:".comp-final",icon:"target"}
 ],
 "/gallery":[
  {label:"Gallery",selector:".gallery-page-hero",icon:"images"},{label:"Chapter archive",selector:".archive-collection",icon:"archive"}
 ],
 "/resources":[
  {label:"Resources",selector:".resources-hero",icon:"books"},{label:"How to use it",selector:".resources-route-strip",icon:"map"},
  {label:"The library",selector:".resources-library",icon:"folder"},{label:"Need help?",selector:".resources-help",icon:"help"}
 ]
};

function SectionGlyph({icon}:{icon:RailIcon}){
 const Icon=sectionIcons[icon];
 return <Icon aria-hidden="true" absoluteStrokeWidth strokeWidth={1.6}/>;
}

function fallbackSections():RailItem[]{
 const root=document.querySelector<HTMLElement>("#main > :first-child");
 if(!root)return[];
 const nodes=root.matches("section, header")?[root]:Array.from(root.querySelectorAll<HTMLElement>(":scope > header, :scope > section"));
 return nodes.slice(0,10).map((node,index)=>{
  const heading=node.querySelector("h1,h2,h3")?.textContent?.replace(/\s+/g," ").trim();
  return {label:heading?.slice(0,34)||`Section ${index+1}`,selector:`[data-section-rail-fallback=\"${index}\"]`,icon:"apps"};
 });
}

export default function SectionRail(){
 const pathname=usePathname();
 const [items,setItems]=useState<LiveItem[]>([]);
 const [active,setActive]=useState(0);
 const [tone,setTone]=useState<"light"|"dark"|"gold"|"sky">("light");
 const [visible,setVisible]=useState(false);
 const enabled=pathname!=="/"&&!pathname.startsWith("/points");
 const configured=useMemo(()=>pageSections[pathname], [pathname]);

 useEffect(()=>{
  if(!enabled){setItems([]);return}
  let frame=0;
  const generated:HTMLElement[]=[];
  const setup=()=>{
   const definitions=configured||fallbackSections();
   if(!configured){
    const root=document.querySelector<HTMLElement>("#main > :first-child");
    const nodes=root?(root.matches("section, header")?[root]:Array.from(root.querySelectorAll<HTMLElement>(":scope > header, :scope > section"))).slice(0,10):[];
    nodes.forEach((node,index)=>node.dataset.sectionRailFallback=String(index));
   }
   const found=definitions.flatMap((item,index)=>{
    const node=document.querySelector<HTMLElement>(item.selector);
    if(!node)return[];
    if(!node.id){node.id=`section-${pathname.replace(/\W+/g,"-")}-${index+1}`;generated.push(node)}
    node.dataset.sectionRailTarget="";
    return [{...item,id:node.id}];
   });
   setItems(found);
  };
  frame=requestAnimationFrame(setup);
  return()=>{cancelAnimationFrame(frame);generated.forEach(node=>{node.removeAttribute("id");node.removeAttribute("data-section-rail-target")});document.querySelectorAll("[data-section-rail-fallback]").forEach(node=>node.removeAttribute("data-section-rail-fallback"))};
 },[configured,enabled,pathname]);

 useEffect(()=>{
  if(!items.length)return;
  let frame=0;
  const update=()=>{
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    const probe=Math.min(innerHeight*.42,360);
    let current=0;
    items.forEach((item,index)=>{const node=document.getElementById(item.id);if(node&&node.getBoundingClientRect().top<=probe)current=index});
    setActive(current);
   });
  };
  update();
  window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update);window.removeEventListener("resize",update)};
 },[items]);

 useEffect(()=>{
  if(!enabled){setVisible(false);return}
  let frame=0;
  const update=()=>{
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    const header=document.querySelector<HTMLElement>(".chapter-header");
    const footer=document.querySelector<HTMLElement>(".chapter-footer");
    const headerHasLeft=header?header.getBoundingClientRect().bottom<=8:window.scrollY>78;
    const footerHasArrived=footer?footer.getBoundingClientRect().top<=window.innerHeight-18:false;
    setVisible(headerHasLeft&&!footerHasArrived);
   });
  };
  update();
  window.addEventListener("scroll",update,{passive:true});
  window.addEventListener("resize",update);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update);window.removeEventListener("resize",update)};
 },[enabled,pathname,items.length]);

 useEffect(()=>{
  if(!enabled||!items.length)return;
  let frame=0;
  const rgb=(value:string)=>{const match=value.match(/rgba?\((\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)(?:[, /]+(\d*(?:\.\d+)?))?\)/);return match?{r:+match[1],g:+match[2],b:+match[3],a:match[4]===undefined?1:+match[4]}:null};
  const classify=(color:{r:number;g:number;b:number})=>{
   if(color.r>205&&color.g>155&&color.b<125)return "gold" as const;
   if(color.b>170&&color.g>145&&color.r<205)return "sky" as const;
   const channels=[color.r,color.g,color.b].map(channel=>{const value=channel/255;return value<=.03928?value/12.92:((value+.055)/1.055)**2.4});
   return .2126*channels[0]+.7152*channels[1]+.0722*channels[2]<.32?"dark" as const:"light" as const;
  };
  const update=()=>{
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    const stack=document.elementsFromPoint(Math.min(innerWidth-1,36),Math.round(innerHeight*.5));
    let element=stack.find(item=>!item.closest(".section-rail")&&!item.closest(".chapter-header")&&!item.closest(".page-curtain")) as HTMLElement|undefined;
    let color=null;
    while(element&&!color){const candidate=rgb(getComputedStyle(element).backgroundColor);if(candidate&&candidate.a>.18)color=candidate;else element=element.parentElement||undefined}
    setTone(classify(color||{r:255,g:255,b:255}));
   });
  };
  update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update);window.removeEventListener("resize",update)};
 },[enabled,items]);

 if(!enabled||items.length<2)return null;
 const go=(item:LiveItem,index:number)=>{setActive(index);document.getElementById(item.id)?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})};
 return <nav className={`section-rail${visible?" is-visible":""}`} data-rail-tone={tone} aria-label="On this page" aria-hidden={!visible}>
  <div className="section-rail-labels">
   <span className="section-rail-caption">ON THIS PAGE</span>
   {items.map((item,index)=><button key={item.id} type="button" className={active===index?"is-active":""} aria-current={active===index?"location":undefined} onClick={()=>go(item,index)}><span>{item.label}</span></button>)}
  </div>
  <div className="section-rail-icons">
   {items.map((item,index)=><button key={item.id} type="button" className={active===index?"is-active":""} aria-label={`Go to ${item.label}`} aria-current={active===index?"location":undefined} onClick={()=>go(item,index)}><SectionGlyph icon={item.icon}/></button>)}
  </div>
  <div className="section-rail-ticks" aria-hidden="true">{items.map((item,index)=><i key={item.id} className={active===index?"is-active":""}/>)}</div>
 </nav>;
}
