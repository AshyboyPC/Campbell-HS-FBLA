"use client";

import {useEffect,useLayoutEffect,useMemo,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,ArrowUpRight,Download,RotateCcw,Search,X} from "@/components/icons";
import {gsap} from "gsap";
import {resources,type ChapterResource} from "@/data/resources";
import {SiteIcon,type SiteIconName} from "@/components/chapter/iconography";

const categories=["All","Competition","Dress & Conduct","Membership","Chapter Resources","Official FBLA"];
const tones=["gold","blue","sky","navy","ivory"] as const;

const resourceIcons:Record<string,SiteIconName>={
 membership:"clipboard",
 "membership-options":"map",
 compete:"pathway",
 "dress-code":"dress",
 "rally-dress":"verified",
 interest:"idea",
 flyer:"megaphone",
 testing:"file-search",
 "membership-display":"clipboard",
 "spirit-shirt":"star",
 "state-theme":"star",
 "meeting-skills":"map",
 "fbla-brand":"verified",
 "brand-assets":"folder"
};

function iconFor(resource:ChapterResource){return resourceIcons[resource.id]??"file"}

function actionLabel(type:string){
 if(type==="FORM")return "Open form";
 if(type==="PDF")return "View PDF";
 if(type==="IMAGE")return "View artwork";
 if(type==="BAND FILE")return "Find in BAND";
 return "Open resource";
}

function nearbyIndexes(length:number,selected:number){
 const count=Math.min(5,length);
 const start=Math.max(0,Math.min(selected-Math.floor(count/2),length-count));
 return Array.from({length:count},(_,index)=>start+index);
}

export default function ResourceLibrary(){
 const [category,setCategory]=useState("All");
 const [query,setQuery]=useState("");
 const [selectedId,setSelectedId]=useState<string|null>(null);
 const fanRef=useRef<HTMLDivElement>(null);
 const detailRef=useRef<HTMLElement>(null);
 const pendingRect=useRef<DOMRect|null>(null);

 useEffect(()=>{
  const initial=new URLSearchParams(window.location.search).get("category");
  if(initial&&categories.includes(initial))setCategory(initial);
 },[]);

 const filtered=useMemo(()=>resources.filter(resource=>{
  const matchesCategory=category==="All"||resource.category===category;
  const haystack=`${resource.title} ${resource.description} ${resource.category} ${resource.type}`.toLowerCase();
  return matchesCategory&&haystack.includes(query.trim().toLowerCase());
 }),[category,query]);

 const selectedIndex=filtered.findIndex(resource=>resource.id===selectedId);
 const selected=selectedIndex>=0?filtered[selectedIndex]:null;
 const visibleThumbs=selected?nearbyIndexes(filtered.length,selectedIndex):[];

 useEffect(()=>{
  if(selectedId&&!filtered.some(resource=>resource.id===selectedId))setSelectedId(null);
 },[filtered,selectedId]);

 useEffect(()=>{
  const fan=fanRef.current;
  if(!fan||selected)return;
  let frame=0;
  const updateArc=()=>{
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    const bounds=fan.getBoundingClientRect();
    const center=bounds.left+bounds.width/2;
    fan.querySelectorAll<HTMLElement>(".resource-fan-card").forEach(card=>{
     const rect=card.getBoundingClientRect();
     const distance=Math.max(-1.45,Math.min(1.45,(rect.left+rect.width/2-center)/(bounds.width*.38)));
     card.style.setProperty("--fan-rotation",`${distance*8}deg`);
     card.style.setProperty("--fan-drop",`${Math.abs(distance)*52}px`);
     card.style.setProperty("--fan-scale",String(1-Math.abs(distance)*.055));
    });
   });
  };
  const wheel=(event:WheelEvent)=>{
   if(Math.abs(event.deltaY)<=Math.abs(event.deltaX))return;
   const max=fan.scrollWidth-fan.clientWidth;
   const next=fan.scrollLeft+event.deltaY;
   if((event.deltaY<0&&fan.scrollLeft>0)||(event.deltaY>0&&fan.scrollLeft<max)){
    event.preventDefault();
    fan.scrollTo({left:Math.max(0,Math.min(max,next)),behavior:"smooth"});
   }
  };
  fan.addEventListener("scroll",updateArc,{passive:true});
  fan.addEventListener("wheel",wheel,{passive:false});
  window.addEventListener("resize",updateArc);
  updateArc();
  return()=>{cancelAnimationFrame(frame);fan.removeEventListener("scroll",updateArc);fan.removeEventListener("wheel",wheel);window.removeEventListener("resize",updateArc)};
 },[filtered,selected]);

 useLayoutEffect(()=>{
  const detail=detailRef.current;
  const origin=pendingRect.current;
  if(!detail||!selected||!origin)return;
  pendingRect.current=null;
  const destination=detail.getBoundingClientRect();
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const context=gsap.context(()=>{
   gsap.fromTo(detail,{x:origin.left-destination.left,y:origin.top-destination.top,scaleX:origin.width/destination.width,scaleY:origin.height/destination.height,rotate:-3,borderRadius:30,transformOrigin:"top left"},{x:0,y:0,scaleX:1,scaleY:1,rotate:0,borderRadius:34,duration:.82,ease:"power4.inOut",clearProps:"transform,transformOrigin"});
   gsap.fromTo(detail.querySelectorAll("[data-resource-reveal]"),{opacity:0,y:22},{opacity:1,y:0,duration:.52,stagger:.055,delay:.38,ease:"power3.out"});
  },detail);
  return()=>context.revert();
 },[selectedId,selected]);

 const chooseCategory=(next:string)=>{
  setCategory(next);
  setSelectedId(null);
  window.history.replaceState(null,"",next==="All"?"/resources#library":`/resources?category=${encodeURIComponent(next)}#library`);
 };

 const openResource=(resource:ChapterResource,element:HTMLElement)=>{
  pendingRect.current=element.getBoundingClientRect();
  setSelectedId(resource.id);
 };

 const scrollFan=(direction:-1|1)=>fanRef.current?.scrollBy({left:direction*Math.min(430,fanRef.current.clientWidth*.72),behavior:"smooth"});

 return <section id="library" className="resources-library">
  <div className="resources-library-head">
   <div><p className="resources-kicker"><span>01</span> THE LIBRARY</p><h2>FIND IT<br/><em>FAST.</em></h2></div>
   <div className="resources-library-intro"><p>Choose a category or search by what you need. Current contest PDFs and the state-theme artwork open directly in a new tab.</p><div className="resources-search"><Search size={19}/><label className="sr-only" htmlFor="resource-search">Search resources</label><input id="resource-search" value={query} onChange={event=>{setQuery(event.target.value);setSelectedId(null)}} placeholder="Search forms, guides, or topics…"/>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="Clear search"><X size={18}/></button>}</div></div>
  </div>

  <div className="resources-category-bar" aria-label="Filter resources">
   {categories.map((item,index)=><button type="button" aria-pressed={category===item} key={item} onClick={()=>chooseCategory(item)}><span>{String(index+1).padStart(2,"0")}</span>{item}</button>)}
  </div>

  <div className="resources-status-line"><strong>{String(filtered.length).padStart(2,"0")}</strong><span>{filtered.length===1?"RESOURCE":"RESOURCES"} READY TO BROWSE</span><i/></div>

  {filtered.length>0&&!selected&&<div className="resource-fan-shell">
   <div className="resource-fan-guide"><span>SCROLL THE DECK</span><i/><span>SELECT TO OPEN</span></div>
   <div className="resource-fan" ref={fanRef} tabIndex={0} aria-label="Resource card carousel" onKeyDown={event=>{if(event.key==="ArrowLeft")scrollFan(-1);if(event.key==="ArrowRight")scrollFan(1)}}>
    {filtered.map((resource,index)=>{const icon=iconFor(resource);return <button className={`resource-fan-card resource-tone-${tones[index%tones.length]}`} type="button" key={resource.id} onClick={event=>openResource(resource,event.currentTarget)} aria-label={`Open details for ${resource.title}`}>
     <span className="resource-card-top"><b>{String(index+1).padStart(2,"0")}</b><small>{resource.type}</small></span>
     <span className="resource-card-mark" aria-hidden="true"><SiteIcon name={icon}/></span>
     <span className="resource-card-copy"><small>{resource.category}</small><strong>{resource.title}</strong><i>{resource.year}</i></span>
    </button>})}
   </div>
   <div className="resource-fan-controls" aria-label="Scroll resource cards"><button type="button" onClick={()=>scrollFan(-1)} aria-label="Previous resources"><ArrowLeft/></button><span>DRAG OR SCROLL</span><button type="button" onClick={()=>scrollFan(1)} aria-label="Next resources"><ArrowRight/></button></div>
  </div>}

  {selected&&<div className="resource-focus-stage">
   {(()=>{const selectedIcon=iconFor(selected);return <article ref={detailRef} className={`resource-focus-card resource-tone-${tones[selectedIndex%tones.length]}`}>
    <div className="resource-focus-number" data-resource-reveal><span>{String(selectedIndex+1).padStart(2,"0")}</span><small>OF {String(filtered.length).padStart(2,"0")}</small></div>
    <div className="resource-focus-main">
     <div className="resources-file-meta" data-resource-reveal><span>{selected.category}</span><span>{selected.type}</span><span>{selected.year}</span></div>
     <h3 data-resource-reveal>{selected.title}</h3>
     <p data-resource-reveal>{selected.description}</p>
    </div>
    <div className="resource-focus-actions" data-resource-reveal>
     <SiteIcon name={selectedIcon} aria-hidden="true"/>
     <div><small>SOURCE NOTE</small><p>{selected.source}</p></div>
     {selected.href?<a href={selected.href} target={selected.type==="PDF"||selected.type==="IMAGE"||selected.href.startsWith("https:")?"_blank":undefined} rel={selected.type==="PDF"||selected.type==="IMAGE"||selected.href.startsWith("https:")?"noopener noreferrer":undefined}>{actionLabel(selected.type)} <ArrowUpRight/></a>:<span className="resource-focus-status">{selected.status}</span>}
     {selected.download&&<a href={selected.download} download>Download <Download/></a>}
    </div>
   </article>})()}

   <div className="resource-thumbnail-row">
    <button className="resource-back-button" type="button" onClick={()=>setSelectedId(null)}><RotateCcw/> All resources</button>
    <div className="resource-thumbnail-viewport">
     <div className="resource-thumbnail-track">
      {visibleThumbs.map(index=>{
       const resource=filtered[index];
       const active=index===selectedIndex;
       const icon=iconFor(resource);
       return <button type="button" className={`resource-thumbnail resource-tone-${tones[index%tones.length]}`} aria-current={active?"true":undefined} aria-label={active?`${resource.title}, currently open`:`Open ${resource.title}`} key={resource.id} onClick={event=>!active&&openResource(resource,event.currentTarget)}><span>{String(index+1).padStart(2,"0")}</span><SiteIcon name={icon} aria-hidden="true"/><strong>{resource.title}</strong><small>{resource.type}</small></button>;
      })}
     </div>
    </div>
   </div>
  </div>}

  {filtered.length===0&&<div className="resources-empty"><span>0 RESULTS</span><h3>Nothing is hiding here.</h3><p>Try a different category or clear your search.</p><button type="button" onClick={()=>{setQuery("");chooseCategory("All")}}>Show every resource</button></div>}

  <aside className="resources-note"><b>GOOD TO KNOW</b><p>PDFs and artwork open directly in a new tab. A few remaining BAND-only files still require chapter membership; their cards take you to the relevant BAND folder.</p><span>DIRECT FILES + BAND</span></aside>
 </section>;
}
