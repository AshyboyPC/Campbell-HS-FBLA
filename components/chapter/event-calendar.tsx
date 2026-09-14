"use client";

import {useEffect,useLayoutEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import OptionWheel from "@/components/react-bits/OptionWheel";
import {
  events,
  getEventsByMonth,
  getNextEvent,
  getPastEvents,
  isDeadlineSoon,
  isPast,
  isToday,
  type ChapterEvent
} from "@/data/events";
import {chapterToday,formatDate} from "@/lib/event-dates";

const bandInvite="https://band.us/n/ada8bajda70eP";
const months=[
  {key:"2026-09",abbr:"SEP",number:"09",name:"SEPTEMBER",phrase:"THE YEAR GETS MOVING."},
  {key:"2026-10",abbr:"OCT",number:"10",name:"OCTOBER",phrase:"COMPETE. SHOW UP. GET INVOLVED."},
  {key:"2026-11",abbr:"NOV",number:"11",name:"NOVEMBER",phrase:""},
  {key:"2026-12",abbr:"DEC",number:"12",name:"DECEMBER",phrase:"CLOSE THE SEMESTER STRONG."},
  {key:"2027-01",abbr:"JAN",number:"01",name:"JANUARY",phrase:""},
  {key:"2027-02",abbr:"FEB",number:"02",name:"FEBRUARY",phrase:""},
  {key:"2027-03",abbr:"MAR",number:"03",name:"MARCH",phrase:"STATE SEASON."},
  {key:"2027-04",abbr:"APR",number:"04",name:"APRIL",phrase:""},
  {key:"2027-05",abbr:"MAY",number:"05",name:"MAY",phrase:"FINISH THE YEAR."}
];
const filters=["ALL","MEETINGS","SOCIAL","SERVICE","CONFERENCES","DEADLINES","PAST"] as const;
type Filter=typeof filters[number];

function matchesFilter(event:ChapterEvent,filter:Filter){
  if(filter==="ALL")return true;
  if(filter==="MEETINGS")return event.category==="Chapter Meeting";
  if(filter==="CONFERENCES")return event.category==="Conference"||event.category==="National FBLA";
  if(filter==="DEADLINES")return event.category==="Deadline";
  return event.category.toUpperCase()===filter;
}
function matchesSearch(event:ChapterEvent,query:string){return `${event.title} ${event.shortTitle||""} ${event.category} ${event.description} ${event.location||""}`.toLowerCase().includes(query.trim().toLowerCase())}
function dateParts(event:ChapterEvent){return {month:formatDate(event.date,{month:"short"}).toUpperCase(),day:formatDate(event.date,{day:"2-digit"})}}
function dateRange(event:ChapterEvent){
  if(!event.endDate)return formatDate(event.date,{month:"short",day:"numeric",year:"numeric"});
  return `${formatDate(event.date,{month:"short",day:"numeric"})}—${formatDate(event.endDate,{day:"numeric"})}, ${formatDate(event.endDate,{year:"numeric"})}`;
}
function statusFor(event:ChapterEvent,today:string){
  if(isToday(event,today))return event.category==="Deadline"?"DUE TODAY":"TODAY";
  if(isDeadlineSoon(event,today))return "DUE SOON";
  return event.status;
}
function buttonLabel(event:ChapterEvent){
  if(event.id==="fall-rally")return "Explore Rally Details";
  if(event.id==="flc")return "Explore FLC";
  if(event.id==="slc")return "Explore SLC";
  if(event.id==="shop-spartan")return "Community Service";
  if(event.id==="flc-registration")return "Learn About FLC";
  return "Event Details";
}

function EventRow({event,today,onOpen}:{event:ChapterEvent;today:string;onOpen:(event:ChapterEvent)=>void}){
  const {month,day}=dateParts(event);
  return <article className="ev-row" id={event.id}>
    <button type="button" onClick={()=>onOpen(event)} aria-label={`View details for ${event.title}`}>
      <time dateTime={event.date}><small>{month}</small><strong>{day}</strong></time>
      <span className="ev-row-title"><small>{event.category}</small><b>{event.title}</b></span>
      <span className="ev-row-meta"><b>{event.time||formatDate(event.date,{weekday:"long"})}</b><small>{event.location||"Details in event"}</small></span>
      {statusFor(event,today)&&<span className="ev-status">{statusFor(event,today)}</span>}
      <span className="ev-row-arrow" aria-hidden="true">→</span>
    </button>
  </article>
}

function DeadlineRow({event,today,onOpen}:{event:ChapterEvent;today:string;onOpen:(event:ChapterEvent)=>void}){
  const {month,day}=dateParts(event);
  return <article className="ev-deadline" id={event.id}>
    <button type="button" onClick={()=>onOpen(event)}>
      <span>DEADLINE</span><time dateTime={event.date}>{month} {day}</time><i aria-hidden="true"/>
      <b>{event.shortTitle||event.title}</b>{statusFor(event,today)&&<em>{statusFor(event,today)}</em>}<span aria-hidden="true">→</span>
    </button>
  </article>
}

function FeatureEvent({event,onOpen}:{event:ChapterEvent;onOpen:(event:ChapterEvent)=>void}){
  const {month,day}=dateParts(event);
  return <article className={`ev-feature ev-feature-${event.featureStyle||"navy"}`} id={event.id} data-event-feature>
    {event.abbreviation&&<span className="ev-feature-ghost" aria-hidden="true">{event.abbreviation}</span>}
    <button type="button" onClick={()=>onOpen(event)} aria-label={`View details for ${event.title}`}>
      <span className="ev-feature-date">{month} {day}{event.endDate?`—${formatDate(event.endDate,{day:"numeric"})}`:""}</span>
      <span className="ev-feature-category">{event.category}</span>
      <strong>{event.title}</strong>
      {event.note&&<em>{event.note}</em>}
      <span className="ev-feature-bottom"><span>{event.time||dateRange(event)}</span><span>{event.cost||event.location||"Campbell FBLA"}</span><b>{buttonLabel(event)} →</b></span>
    </button>
  </article>
}

function DetailDrawer({event,today,onClose}:{event:ChapterEvent;today:string;onClose:()=>void}){
  useEffect(()=>{
    const close=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose()};
    document.addEventListener("keydown",close);document.body.style.overflow="hidden";
    return()=>{document.removeEventListener("keydown",close);document.body.style.overflow=""};
  },[onClose]);
  const {month,day}=dateParts(event);
  return <div className="ev-drawer-shell" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <aside className="ev-drawer" role="dialog" aria-modal="true" aria-labelledby="event-drawer-title">
      <button className="ev-drawer-close" type="button" onClick={onClose} aria-label="Close event details">CLOSE ×</button>
      <div className="ev-drawer-date"><span>{month}</span><strong>{day}</strong>{event.endDate&&<small>— {formatDate(event.endDate,{month:"short",day:"numeric"}).toUpperCase()}</small>}</div>
      <p className="ev-drawer-category">{event.category}{statusFor(event,today)?` / ${statusFor(event,today)}`:""}</p>
      <h2 id="event-drawer-title">{event.title}</h2>
      <dl><div><dt>DATE</dt><dd>{dateRange(event)}</dd></div>{event.time&&<div><dt>TIME</dt><dd>{event.time}</dd></div>}{event.location&&<div><dt>LOCATION</dt><dd>{event.location}</dd></div>}{event.cost&&<div><dt>COST</dt><dd>{event.cost}</dd></div>}</dl>
      <div className="ev-drawer-copy"><p>{event.description}</p>{event.secondaryDescription&&<p>{event.secondaryDescription}</p>}{event.note&&<p className="ev-drawer-note">{event.note}</p>}</div>
      <div className="ev-drawer-actions">{event.internalLink&&<Link href={event.internalLink}>{buttonLabel(event)} <span>↗</span></Link>}{(event.id==="flc"||event.id==="slc")&&<Link href="/compete">Competition Info <span>→</span></Link>}<a href={bandInvite} target="_blank" rel="noreferrer">Check BAND <span>↗</span></a></div>
      <p className="ev-drawer-member">Current members should check BAND for last-minute changes and member-specific instructions.</p>
    </aside>
  </div>
}

export default function EventCalendar(){
  const root=useRef<HTMLDivElement>(null);
  const [filter,setFilter]=useState<Filter>("ALL");
  const [search,setSearch]=useState("");
  const [today,setToday]=useState<string>("2026-09-08");
  const [selected,setSelected]=useState<ChapterEvent|null>(null);
  const [activeMonth,setActiveMonth]=useState(0);
  useEffect(()=>{const update=()=>setToday(chapterToday());update();const timer=window.setInterval(update,60000);return()=>window.clearInterval(timer)},[]);
  useEffect(()=>{
    let frame=0;
    const syncMonth=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        // The global navigation and sticky filter reserve the top of the
        // viewport, so a month becomes active as its section enters the clear
        // reading area below both controls.
        const readingLine=window.innerWidth<=760?285:360;
        let current=0;
        for(let index=0;index<months.length;index+=1){
          const section=document.getElementById(`month-${months[index].key}`);
          if(section&&section.getBoundingClientRect().top<=readingLine)current=index;
          else break;
        }
        setActiveMonth(current);
      });
    };
    syncMonth();
    window.addEventListener("scroll",syncMonth,{passive:true});
    window.addEventListener("resize",syncMonth);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",syncMonth);window.removeEventListener("resize",syncMonth)};
  },[]);
  useEffect(()=>{const id=window.location.hash.slice(1);const event=events.find(item=>item.id===id);if(event){setSelected(event);requestAnimationFrame(()=>document.getElementById(event.id)?.scrollIntoView({block:"center"}))}},[]);
  useLayoutEffect(()=>{
    if(!root.current||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx=gsap.context(()=>{
      gsap.timeline({defaults:{ease:"power3.out"}}).from(".ev-hero-eyebrow",{y:18,opacity:0,duration:.45}).from(".ev-title-main",{yPercent:110,duration:.8},.05).from(".ev-title-ghost,.ev-hero-copy,.ev-next-ticket",{y:34,opacity:0,duration:.65,stagger:.08},.28);
      gsap.utils.toArray<HTMLElement>("[data-event-feature]").forEach(card=>gsap.from(card,{y:40,opacity:0,duration:.7,ease:"power3.out",scrollTrigger:{trigger:card,start:"top 84%",once:true}}));
    },root);return()=>ctx.revert();
  },[]);
  const next=getNextEvent(today);
  const upcoming=useMemo(()=>events.filter(event=>!isPast(event,today)&&matchesFilter(event,filter)&&matchesSearch(event,search)),[today,filter,search]);
  const past=useMemo(()=>getPastEvents(today).filter(event=>matchesFilter(event,filter==="PAST"?"ALL":filter)&&matchesSearch(event,search)),[today,filter,search]);
  const jumpTo=(index:number)=>document.getElementById(`month-${months[index].key}`)?.scrollIntoView({behavior:"smooth",block:"start"});
  const tomorrow=next&&Math.round((Date.parse(`${next.date}T12:00:00Z`)-Date.parse(`${today}T12:00:00Z`))/86400000)===1;
  return <div className="events-page" ref={root}>
    <header className="ev-hero">
      <p className="ev-hero-eyebrow">CAMPBELL HIGH SCHOOL FBLA • 2026–27</p>
      <div className="ev-title-stack" aria-label="Events"><span className="ev-title-ghost" aria-hidden="true">EVENTS</span><span className="ev-title-ghost" aria-hidden="true">EVENTS</span><h1 className="ev-title-main">EVENTS</h1></div>
      <div className="ev-hero-copy"><h2>EVERY DATE THAT MATTERS.</h2><p>Chapter meetings, socials, service projects, conferences, competitions, and important deadlines — organized in one place.</p><nav><a href="#calendar">Jump to Upcoming ↓</a><Link href="/compete">Competition Calendar →</Link></nav></div>
      {next&&<button className="ev-next-ticket" type="button" onClick={()=>{setSelected(next);document.getElementById(next.id)?.scrollIntoView({behavior:"smooth",block:"center"})}}><span>NEXT UP</span><time dateTime={next.date}>{dateParts(next).month} {dateParts(next).day}</time><strong>{next.shortTitle||next.title}</strong><small>{formatDate(next.date,{weekday:"long"})} • {next.time||"Details in calendar"}</small>{next.location&&<small>{next.location}</small>}<p>Our next regular chapter event. Check BAND before it begins for the latest agenda, forms, or event-specific updates.</p><b>{tomorrow?"Tomorrow":"View in Calendar ↓"}</b></button>}
    </header>
    <div className="ev-member-line"><p><strong>Current member?</strong> BAND is still the place for last-minute changes, reminders, forms, and meeting-specific instructions.</p><span>This page is the public 2026–27 calendar.</span></div>
    <section className="ev-calendar" id="calendar">
      <div className="ev-utility"><div role="group" aria-label="Filter events">{filters.map(item=><button key={item} type="button" aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}</button>)}</div><label><span className="sr-only">Search events</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events"/><b aria-hidden="true">⌕</b></label></div>
      <div className="ev-calendar-layout">
        <aside className="ev-year-rail"><div className="ev-rail-sticky"><p>2026—27</p><small>SCROLL OR SELECT</small><div className="ev-month-wheel"><OptionWheel items={months.map(m=>m.abbr)} defaultSelected={0} selectedIndex={activeMonth} onChange={(index:number)=>jumpTo(index)} textColor="#7890b5" activeColor="#00205b" fontSize={1.35} spacing={1.7} inset={88} curve={.42} tilt={6} blur={0} fade={.2} minOpacity={.34} smoothing={220} loop={false}/></div></div><div className="ev-mobile-months">{months.map((month,index)=><button type="button" key={month.key} aria-current={activeMonth===index?"true":undefined} onClick={()=>jumpTo(index)}>{month.abbr}</button>)}</div></aside>
        <div className="ev-months">
          {filter!=="PAST"&&months.map(month=>{const monthEvents=getEventsByMonth(month.key,upcoming);return <section className="ev-month" id={`month-${month.key}`} key={month.key}><header><h2><span>{month.number}</span> / {month.name}</h2>{month.phrase&&<p>{month.phrase}</p>}</header>{monthEvents.length?monthEvents.map(event=>event.category==="Deadline"?<DeadlineRow key={event.id} event={event} today={today} onOpen={setSelected}/>:event.featured?<FeatureEvent key={event.id} event={event} onOpen={setSelected}/>:<EventRow key={event.id} event={event} today={today} onOpen={setSelected}/>):<p className="ev-no-events">No matching events in this month.</p>}</section>})}
          {(filter==="ALL"||filter==="PAST")&&<section className="ev-archive" id="past"><p>ARCHIVE</p><h2>ALREADY HAPPENED</h2><div className="ev-archive-intro">Past 2026–27 events stay here so the chapter calendar remains a record of the year, not just a list of what&apos;s next.</div>{past.length?<div className="ev-archive-list">{past.map(event=><EventRow key={event.id} event={event} today={today} onOpen={setSelected}/>)}</div>:<p className="ev-no-events">The school-year archive will grow as events happen.</p>}</section>}
        </div>
      </div>
    </section>
    <section className="ev-closing"><div><p>MEMBER NOTE</p><h2>NEED THE LATEST DETAILS?</h2></div><div><p>The website keeps the public calendar organized. Current members should still check BAND for last-minute changes, forms, transportation information, sign-ups, and event-specific instructions.</p><nav><Link href="/compete">Explore Competition →</Link><Link href="/contact">Contact Campbell FBLA →</Link></nav></div></section>
    {selected&&<DetailDrawer event={selected} today={today} onClose={()=>setSelected(null)}/>} 
  </div>
}
