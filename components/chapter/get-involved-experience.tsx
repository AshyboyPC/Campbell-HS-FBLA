"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import gsap from "gsap";
import {useAfterPageMotion} from "@/components/chapter/use-after-page-motion";
import {CustomEase} from "gsap/CustomEase";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ArrowDown,ArrowUpRight,Check} from "@/components/icons";
import WordShutterReveal from "@/components/chapter/word-shutter-reveal";
import {SiteIcon,type SiteIconName} from "@/components/chapter/iconography";

gsap.registerPlugin(CustomEase,ScrollTrigger);

const membershipForm="https://docs.google.com/forms/d/e/1FAIpQLSdCSnrChNqB9gcWFnLNH8K9mFHUo1UCQx2imX0LDlXcv2PBuQ/viewform";
const bandInvite="https://band.us/n/ada8bajda70eP";

const committees=[
 {number:"01",name:"Community Service",verb:"Turn a need into action.",copy:"Plan service projects, volunteer opportunities, and outreach that gives back to Campbell and the local community.",task:"First move: shape one service idea into a project Campbell FBLA can actually complete.",icon:"heart"},
 {number:"02",name:"Fundraising",verb:"Make the work possible.",copy:"Create and run fundraisers that support chapter activities, conferences, and community projects while practicing real business skills.",task:"First move: build a fundraiser idea with a goal, audience, plan, and measurable result.",icon:"money"},
 {number:"03",name:"Social Events",verb:"Build chapter culture.",copy:"Organize socials, celebrations, and member experiences that help people connect and want to return.",task:"This year: support experiences such as the Ice Cream Social, Holiday Social, and Fall in Love with FBLA.",icon:"star"},
 {number:"04",name:"Coding",verb:"Build something useful.",copy:"Maintain the website, support chapter technology, create an application for a local need, maintain the points tracker, and prepare for technology events.",task:"First move: identify a real Smyrna or community need that a useful digital project could address.",icon:"laptop"},
] satisfies Array<{number:string;name:string;verb:string;copy:string;task:string;icon:SiteIconName}>;
const roles=["Marketing & Communications Officer","Community Service Committee Chair","Social Events Committee Chair","Fundraising Committee Chair","Coding Committee Chair"];

function ArrowLink({href,children,external=false,className=""}:{href:string;children:React.ReactNode;external?:boolean;className?:string}){return <Link className={`gi-button ${className}`} href={href} target={external?"_blank":undefined} rel={external?"noreferrer":undefined}>{children}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
function Label({children}:{children:React.ReactNode}){return <p className="gi-label">{children}</p>}

type CountdownState={days:string;hours:string;minutes:string;seconds:string;progress:number;complete:boolean};
function DeadlineCountdown(){
 const [countdown,setCountdown]=useState<CountdownState|null>(null);
 useEffect(()=>{
  const start=new Date("2026-08-03T00:00:00-04:00").getTime();
  const end=new Date("2026-09-28T23:59:59-04:00").getTime();
  const update=()=>{
   const now=Date.now(),remaining=Math.max(0,end-now);
   setCountdown({days:String(Math.floor(remaining/86400000)).padStart(2,"0"),hours:String(Math.floor((remaining%86400000)/3600000)).padStart(2,"0"),minutes:String(Math.floor((remaining%3600000)/60000)).padStart(2,"0"),seconds:String(Math.floor((remaining%60000)/1000)).padStart(2,"0"),progress:Math.min(100,Math.max(0,((now-start)/(end-start))*100)),complete:remaining===0});
  };
  update();
  const timer=window.setInterval(update,1000);
  return()=>window.clearInterval(timer);
 },[]);
 const units=[[countdown?.days??"--","DAYS"],[countdown?.hours??"--","HOURS"],[countdown?.minutes??"--","MIN"],[countdown?.seconds??"--","SEC"]];
 return <div id="dues-countdown" className="gi-deadline-instrument"><div className="gi-points-seal"><span>EARN</span><strong>50</strong><b>POINTS</b></div><div className="gi-countdown-body"><div className="gi-countdown-head"><p>{countdown?.complete?"THE DUES DEADLINE HAS ARRIVED":"DUES DEADLINE COUNTDOWN"}</p><time dateTime="2026-09-28T23:59:59-04:00">SEP 28 / 11:59 PM</time></div><div className="gi-countdown-grid" aria-label={countdown?`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, and ${countdown.seconds} seconds until the dues deadline`:"Loading dues deadline countdown"}>{units.map(([value,label])=><div key={label}><span className="gi-ticker-window"><b key={value}>{value}</b></span><small>{label}</small></div>)}</div><div className="gi-deadline-track" aria-hidden="true"><span style={{width:`${countdown?.progress??0}%`}}/><i style={{left:`${countdown?.progress??0}%`}}>NOW</i></div><div className="gi-countdown-foot"><p>Pay through MyPaymentsPlus by September 28, then complete the dues challenge check-in in BAND. The full challenge window closes October 1.</p><ArrowLink href={membershipForm} external className="gi-button-light">Open membership form</ArrowLink></div></div></div>
}

export default function GetInvolvedExperience(){
 const root=useRef<HTMLDivElement>(null);
 useAfterPageMotion(root,()=>{
  const motion=gsap.matchMedia(root.current);
  motion.add("(prefers-reduced-motion: no-preference)",()=>{
   const ease=CustomEase.create("join-editorial-ease","M0,0 C0.14,0.82 0.22,1 1,1");
   gsap.timeline({defaults:{ease}}).from(".gi-hero .gi-label",{y:18,autoAlpha:0,duration:.5}).from(".gi-hero h1 span",{yPercent:115,autoAlpha:0,duration:.85,stagger:.08},.08).from(".gi-hero-copy,.gi-hero-route",{y:26,autoAlpha:0,duration:.7,stagger:.1},.38);

   const groups=[
    {section:".gi-start",selector:".gi-heading",from:{x:-28,autoAlpha:0},stagger:0,duration:.65},
    {section:".gi-start",selector:".gi-join-path article",from:{y:34,rotation:(index:number)=>index%2?1.5:-1.5,autoAlpha:0},stagger:.11,duration:.68,ease:"back.out(1.3)"},
    {section:".gi-membership",selector:".gi-heading",from:{y:25,autoAlpha:0},stagger:0,duration:.62},
    {section:".gi-membership",selector:".gi-plan",from:{x:(index:number)=>index?30:-30,rotationY:(index:number)=>index?8:-8,autoAlpha:0},stagger:.14,duration:.78},
    {section:".gi-band",selector:".gi-band-copy",from:{x:-38,autoAlpha:0},stagger:0,duration:.72},
    {section:".gi-band",selector:".gi-band-pass",from:{x:26,rotationY:-12,scale:.95,autoAlpha:0},stagger:0,duration:.9,ease:"back.out(1.2)"},
    {section:".gi-meetings",selector:".gi-meeting-number",from:{scale:.72,rotation:-9,autoAlpha:0},stagger:0,duration:.72,ease:"back.out(1.6)"},
    {section:".gi-meetings",selector:".gi-meeting-main,.gi-week-pattern p",from:{x:24,autoAlpha:0},stagger:.1,duration:.66},
    {section:".gi-committees",selector:".gi-committee-list article",from:{clipPath:"inset(0 0 0 100%)",autoAlpha:0},stagger:.09,duration:.74},
    {section:".gi-leadership",selector:".gi-role-list li",from:{x:34,autoAlpha:0},stagger:{each:.08,from:"end" as const},duration:.58},
    {section:".gi-next",selector:".gi-next-links .gi-button",from:{y:17,scale:.92,autoAlpha:0},stagger:{each:.09,from:"center" as const},duration:.58,ease:"back.out(1.4)"},
   ];

   gsap.set(".gi-band",{perspective:1100});
   groups.forEach(({section,selector,from,stagger,duration,ease:itemEase})=>{
    const trigger=root.current?.querySelector(section);
    const targets=gsap.utils.toArray<HTMLElement>(selector,root.current);
    if(!trigger||!targets.length)return;
    gsap.fromTo(targets,from,{x:0,y:0,scale:1,rotation:0,rotationY:0,clipPath:"inset(0 0 0 0)",autoAlpha:1,duration,ease:itemEase||ease,stagger,scrollTrigger:{trigger,start:"top 83%",once:true}});
   });
  });
  return()=>motion.revert();
 });

 return <div className="get-involved-page" ref={root}>
  <header className="gi-hero"><div className="gi-hero-inner"><div className="gi-hero-main"><Label>GET INVOLVED / CAMPBELL FBLA 2026–27</Label><h1><span>SHOW UP.</span><span>PICK A <em>LANE.</em></span><span>MAKE IT COUNT.</span></h1></div><div className="gi-hero-copy"><p>Campbell FBLA works when students do more than put their name on a roster. Join the chapter, connect with members, choose where you want to contribute, and start building skills through real work.</p><ArrowLink href="#start">Start here</ArrowLink></div></div><nav className="gi-hero-route" aria-label="Get involved steps"><a href="#start"><b>01</b><span>Join</span></a><a href="#band"><b>02</b><span>Connect</span></a><a href="#meetings"><b>03</b><span>Show up</span></a><a href="#committees"><b>04</b><span>Choose your lane</span></a><ArrowDown aria-hidden="true"/></nav></header>

  <main>
   <section id="start" className="gi-section gi-start" data-join-reveal><div className="gi-heading" data-join-item><Label>START HERE</Label><h2>JOIN IN <em>FOUR MOVES.</em></h2><p>You do not need to understand every FBLA program before you begin. Follow the path in order and the chapter will help with the rest.</p></div><div className="gi-join-path"><div className="gi-route-line" aria-hidden="true"/><article data-join-item><span>01</span><div><SiteIcon name="badge"/><h3>Choose membership</h3><p>Pick FBLA Navy or the combined FBLA + DECA Gold option.</p></div></article><article data-join-item><span>02</span><div><SiteIcon name="clipboard"/><h3>Complete the form</h3><p>Share the student, family contact, shirt-size, and interest information the chapter needs.</p></div></article><article data-join-item><span>03</span><div><SiteIcon name="comments"/><h3>Connect in BAND</h3><p>Join the private member space for announcements, reminders, RSVPs, and committee updates.</p></div></article><article data-join-item><span>04</span><div><SiteIcon name="calendar-alt"/><h3>Come Wednesday</h3><p>Meet the chapter at 3:45 PM in Room 3104 and find the work that fits you.</p></div></article></div></section>

   <section className="gi-section gi-membership" data-join-reveal><div className="gi-heading gi-heading-light" data-join-item><Label>2026–27 MEMBERSHIP</Label><h2>TWO OPTIONS.<br/><em>ONE CHAPTER.</em></h2><p>Both membership options include competition eligibility and an FBLA T-shirt.</p></div><div className="gi-plan-stack"><article className="gi-plan gi-plan-navy" data-join-item><div><span>FBLA NAVY</span><strong><small>$</small>35</strong></div><div><h3>FBLA membership</h3><ul><li><Check/>Chapter membership</li><li><Check/>Competition eligibility</li><li><Check/>FBLA T-shirt</li></ul></div></article><article className="gi-plan gi-plan-gold" data-join-item><div><span>FBLA GOLD</span><strong><small>$</small>45</strong></div><div><h3>FBLA + DECA</h3><ul><li><Check/>Combined chapter membership</li><li><Check/>Competition eligibility</li><li><Check/>FBLA T-shirt</li></ul></div></article></div><DeadlineCountdown/></section>

   <section id="band" className="gi-section gi-band" data-join-reveal><div className="gi-band-copy" data-join-item><Label>YOUR MEMBER CHANNEL</Label><h2>THE WEBSITE GUIDES YOU.<br/><em>BAND KEEPS YOU CURRENT.</em></h2><WordShutterReveal cover="navy" text="Campbell FBLA’s BAND is a private, invite-only member space. Use it for chapter announcements, meeting reminders, event details, RSVP links, committee communication, and updates that may change after this page is published."/><div className="gi-band-actions"><ArrowLink href={bandInvite} external>Join Campbell FBLA on BAND</ArrowLink><span>Official chapter invite</span></div></div><div className="gi-band-pass" data-join-item><div className="gi-band-card-inner"><div className="gi-band-pass-top"><span>BAND ACCESS</span><b>2026—27</b></div><div className="gi-qr"><Image src="/campbell-fbla-band-qr.png" alt="QR code for the official Campbell FBLA BAND invitation" width={640} height={640}/></div><div className="gi-band-pass-bottom"><b>SCAN TO JOIN</b><span>Announcements / events / committees</span></div></div></div></section>

   <section id="meetings" className="gi-section gi-meetings" data-join-reveal><div className="gi-meeting-number" aria-hidden="true" data-join-item>WED</div><div className="gi-meeting-main" data-join-item><Label>YOUR WEEKLY STARTING POINT</Label><h2>3:45 PM.<br/>ROOM 3104.</h2><p>General chapter meetings are held Wednesdays after school. Check BAND and the chapter calendar for confirmed dates and any schedule changes.</p><div className="gi-meeting-facts"><span><SiteIcon name="clock"/>Starts at 3:45 PM</span><span><SiteIcon name="location"/>Campbell High School</span></div></div><div className="gi-week-pattern" data-join-item><p><b>1ST + 3RD WEDNESDAYS</b><span>General meeting, then extended committee work. Room stays open until 5:15 PM.</span></p><p><b>2ND + 4TH WEDNESDAYS</b><span>General meeting schedule. Room closes at 4:55 PM; use BAND for that day’s dismissal details.</span></p></div></section>

   <section id="committees" className="gi-section gi-committees" data-join-reveal><div className="gi-heading" data-join-item><Label>CHOOSE YOUR LANE</Label><h2>FOUR TEAMS.<br/><em>REAL RESPONSIBILITY.</em></h2><p>You do not join a committee just to receive another title. You join to help move one part of the chapter forward.</p></div><div className="gi-committee-list">{committees.map(({number,name,verb,copy,task,icon})=><article id={name==="Coding"?"coding":undefined} key={name} data-join-item><span className="gi-committee-number">{number}</span><SiteIcon name={icon} className="gi-committee-icon" aria-hidden="true"/><div className="gi-committee-title"><p>{name}</p><h3>{verb}</h3></div><p className="gi-committee-copy">{copy}</p><p className="gi-committee-task">{task}</p><ArrowUpRight aria-hidden="true"/></article>)}</div></section>

   <section id="leadership" className="gi-section gi-leadership" data-join-reveal><div className="gi-leadership-intro" data-join-item><Label>OPEN LEADERSHIP / DEADLINE SEPTEMBER 9</Label><h2>DON’T WAIT<br/>TO <em>LEAD.</em></h2><p>Leadership applications opened August 26. These roles give students a defined part of the chapter to own, organize, and improve.</p><p className="gi-leadership-note">Ask for the current application instructions in BAND or speak with a chapter adviser or officer.</p></div><ol className="gi-role-list">{roles.map((role,index)=><li key={role} data-join-item><span>0{index+1}</span><b>{role}</b></li>)}</ol></section>

   <section className="gi-section gi-points"><div className="gi-points-score" data-join-item><SiteIcon name="trophy" aria-hidden="true"/><strong>250+</strong><span>CLASS-BASED CORD TARGETS</span></div><div className="gi-points-copy" data-join-item><Label>MAKE PARTICIPATION COUNT</Label><h2>SHOW UP.<br/>DO THE WORK.<br/><em>TRACK IT.</em></h2><WordShutterReveal cover="blue" text="Graduation-cord requirements are based on class year: 250 points for the Class of 2027, 375 for 2028, and 500 for the Class of 2029 and beyond. Members earn toward that total through dues, meetings, socials, workshops, service, competition preparation, conferences, and results."/><div className="gi-point-examples"><span><b>50</b>Verified dues</span><span><b>5</b>Chapter meeting</span><span><b>10</b>FLC or SLC</span><span><b>15</b>Compete at a conference</span></div><small>The 2025–26 activity schedule was confirmed unchanged for 2026–27. Official records are verified through the Member Portal.</small></div></section>

   <section className="gi-section gi-next" data-join-reveal><Label>CHOOSE YOUR NEXT MOVE</Label><h2 data-join-item>WHAT DO YOU<br/>WANT TO DO <em>FIRST?</em></h2><div className="gi-next-links"><ArrowLink href={membershipForm} external className="gi-next-primary">I’m ready to join</ArrowLink><ArrowLink href={bandInvite} external>I need member updates</ArrowLink><ArrowLink href="/compete">I want to compete</ArrowLink><ArrowLink href="/contact">I have a question</ArrowLink></div></section>
  </main>
 </div>
}
