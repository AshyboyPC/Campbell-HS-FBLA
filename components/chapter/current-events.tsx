"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {getNextEvents,chapterToday,formatDate} from "@/lib/event-dates";

export default function CurrentEvents(){
 const [today,setToday]=useState<string|null>(null);
 useEffect(()=>{const update=()=>setToday(chapterToday());update();const id=setInterval(update,60000);return()=>clearInterval(id)},[]);
 const all=today?getNextEvents(30,today):[];
 const firstMeeting=all.find(event=>event.category==='Chapter Meeting');
 const featured=all.filter(event=>['spirit-day','ice-cream','flc-registration'].includes(event.id));
 const items=[...(firstMeeting?[firstMeeting]:[]),...featured].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
 return <section className="v2-events" data-home-reveal><div className="wrap"><div className="v2-section-head v2-events-head"><div><span className="v2-tag">UPCOMING</span><h2>RIGHT NOW AT<br/>CAMPBELL FBLA</h2><p>The next things members need to know.</p></div><Link className="v2-button v2-button-blue" href="/events">View Full Calendar <span>→</span></Link></div><div className="v2-event-grid">{items.map(e=><Link className="v2-event-card" href={`/events#${e.id}`} key={e.id}><span className="v2-date"><small>{formatDate(e.date,{month:'short'}).toUpperCase()}</small><b>{formatDate(e.date,{day:'2-digit'})}</b></span><div><h3>{e.title}</h3><p>{e.id==='spirit-day'?'Wear FBLA blue and gold. Group picture at the Grand Staircase.':e.id==='ice-cream'?'3:30–4:30 PM · CHS Courtyard':e.id==='flc-registration'?'Fall Leadership Conference registration deadline.':<>3:45 PM<br/>Room 3104</>}</p></div><span className="v2-event-arrow">↗</span></Link>)}</div>{today&&items.length===0&&<p>New dates are being confirmed. Check back for the next chapter event.</p>}</div></section>;
}
