"use client";

import Link from "next/link";
import ScrollExpand from "@/components/react-bits/ScrollExpand";
import TextLoop from "@/components/react-bits/TextLoop";
import {useMotionReady} from "./motion";
import {chapter} from "@/data/chapter";

export default function HomeHero(){
 const active=useMotionReady();
 return <>
  <section className="v2-hero" aria-labelledby="home-title">
   <div className="v2-hero-inner wrap">
    <div className="v2-hero-copy">
     <p className="v2-kicker">CAMPBELL HIGH SCHOOL <span>•</span> {chapter.yearLabel}</p>
     <h1 id="home-title">CAMPBELL<br/><span>FBLA</span></h1>
     <div className="v2-built-line"><strong>BUILT TO</strong><div className="v2-verb-stack"><b>COMPETE.</b><b>LEAD.</b><b>SERVE.</b><b>CREATE.</b></div></div>
     <div className="v2-loop" aria-hidden="true">{active?<TextLoop text="COMPETE • LEAD • SERVE • CREATE" shape="line" ribbon={false} color="#ffffff" fontSize={18} speed={18} separator="✦"/>:<span>COMPETE • LEAD • SERVE • CREATE</span>}</div>
     <p className="v2-hero-description">A student-led chapter where Campbell students compete, build career skills, lead real projects, serve their community, and create things that last.</p>
     <div className="v2-hero-actions"><Link className="v2-button v2-button-light" href="/get-involved">Get Involved <span>→</span></Link><Link className="v2-button v2-button-outline" href="/events">View Events <span>→</span></Link></div>
     <Link className="v2-tertiary" href="/points">Member Portal →</Link>
    </div>
    <div className="v2-hero-art" aria-label="Illustration of student leadership tools">
     <div className="v2-hero-art-frame"><ScrollExpand src="/campbell-hero-3d.png" alt="Three-dimensional collage of business leadership tools" startWidth={96} startHeight={96} startRadius={24} endRadius={24} mediaZoom={1.01} scrollDistance={0.12} holdDistance={0} useWindowScroll enabled={active} overlayScrim={0}/></div>
    </div>
   </div>
  </section>
  <section className="v2-info wrap" aria-label="Chapter information">
   <div><span className="v2-info-symbol">▣</span><p><b>MEETINGS</b>Wednesdays after school<strong>Starts at {chapter.meetingStart} · {chapter.room}</strong></p></div>
   <div><span className="v2-info-symbol">◉</span><p><b>MEMBERSHIP</b><strong>$35 FBLA</strong><strong>$45 FBLA + DECA</strong></p></div>
   <div><span className="v2-info-symbol">▥</span><p><b>{chapter.yearLabel}</b><strong>Year Three</strong>Student-led chapter</p></div>
   <div><span className="v2-info-symbol">•••</span><p><b>MEMBER UPDATES</b>Current members use<strong>BAND</strong></p></div>
  </section>
 </>;
}
