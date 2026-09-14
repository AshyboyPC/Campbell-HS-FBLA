"use client";

import Link from "next/link";
import {useLayoutEffect,useMemo,useRef,useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ArrowDown,ArrowRight,Check,ChevronDown,ExternalLink,Search,X} from "lucide-react";
import FoldText from "@/components/react-bits/FoldText";
import WordShutterReveal from "@/components/chapter/word-shutter-reveal";
import {SiteIcon} from "@/components/chapter/iconography";
import {competitionEvents,competitionSubjects,type CompetitionEvent} from "@/data/competitive-events";

const formatChoices=[
 {key:"TEST",number:"01",title:"OBJECTIVE TEST",copy:"Study a defined subject area, then answer timed objective questions.",fit:"You prefer independent preparation, concepts, calculations, or applying knowledge quickly.",action:"Show testing events"},
 {key:"PRESENTATION",number:"02",title:"PRESENTATION",copy:"Prepare an idea, solution, plan, or project and explain it clearly to judges.",fit:"You like public speaking, visual communication, pitching ideas, or explaining your thinking.",action:"Show presentation events"},
 {key:"CASE / ROLE-PLAY",number:"03",title:"CASE / ROLE-PLAY",copy:"Receive a business situation, develop a response, and present your recommendation.",fit:"You think well under pressure and prefer solving a problem over memorizing a large amount of material.",action:"Show case events"},
 {key:"PROJECT",number:"04",title:"PROJECT / PREJUDGED",copy:"Develop work before the conference and submit or present a finished project.",fit:"You prefer building, writing, designing, researching, coding, or developing something over time.",action:"Show project events"},
 {key:"TEAM",number:"05",title:"TEAM EVENT",copy:"Prepare and compete with teammates where the official event allows teams.",fit:"You want to divide preparation, combine strengths, and present together.",action:"Show team events"}
] as const;

const process=[
 ["EXPLORE","Look through the current directory and identify events that match your interests and strengths."],
 ["SELECT","Choose your event and confirm its eligibility, entry, and team requirements."],
 ["READ THE RULES","Read the complete official guidelines. Know what is tested, submitted, presented, prohibited, and scored."],
 ["BUILD A PLAN","Turn the event into preparation tasks: study sessions, project milestones, content development, and delivery practice."],
 ["CHECKPOINT","Complete progress reviews early enough to identify unfinished work and weak areas."],
 ["PRACTICE","Use mock tests, timed rehearsals, judge-style questions, or reviews that match the actual format."],
 ["COMPETE","Arrive knowing the rules, your material, your responsibilities, and what is being measured."],
 ["REVIEW","Record what worked, what did not, and what should change before the next level."]
];

const checks=[
 ["THE FORMAT","Do you actually want to prepare for the way this event is judged?"],
 ["THE RULES","Have you read the current official guideline from beginning to end?"],
 ["THE TIME","Can you realistically prepare before Campbell’s internal and Georgia FBLA deadlines?"],
 ["THE TEAM","If the event uses a team, are your teammates ready to contribute consistently?"],
 ["THE PATH","Do you know whether the event starts with testing, RLC, FLC, prejudged work, SLC, or another stage?"]
];

const faqs=[
 ["DO ALL EVENTS START AT RLC?","No. The competition path depends on the event. Use the pathway badge in the directory and confirm it in the official guidelines."],
 ["ARE ALL EVENTS INDIVIDUAL?","No. FBLA includes both individual and team events. The directory shows the permitted entry format for each event."],
 ["DO ALL EVENTS USE A TEST?","No. Events can use objective testing, presentations, role-play or case formats, prejudged work, projects, demonstrations, or combinations of these."],
 ["CAN I PICK AN EVENT JUST FROM ITS NAME?","Use the name to narrow your choices, but read the guideline before committing. Similar subjects can require completely different preparation."],
 ["CAN I COMPETE IN MORE THAN ONE EVENT?","That depends on current Georgia FBLA rules, event conflicts, eligibility, and Campbell’s registration plan. Confirm before registering."],
 ["WHERE DO I FIND DEADLINES?","Use the Events page for the public competition calendar and BAND for current member-specific reminders or changes."]
];

function matchesFormat(event:CompetitionEvent,filter:string){
 if(filter==="ALL EVENTS")return true;
 if(filter==="TEST")return event.category==="Objective Test"||event.category==="Production";
 if(filter==="PRESENTATION")return event.category==="Presentation";
 if(filter==="CASE / ROLE-PLAY")return event.category==="Role Play";
 if(filter==="PROJECT")return event.prejudged||event.category==="Chapter";
 if(filter==="TEAM")return event.entry.startsWith("Team");
 return true;
}

function EventCard({event,selected,onCompare}:{event:CompetitionEvent;selected:boolean;onCompare:()=>void}){
 const routeClass=event.pathway.startsWith("RLC")?"rlc":event.pathway.startsWith("FLC")?"flc":"slc";
 return <article className={`comp-event-card comp-event-card-${routeClass}`}>
  <div className="comp-event-top"><span className={`comp-path comp-path-${event.pathway.startsWith("RLC")?"rlc":event.pathway.startsWith("FLC")?"flc":"slc"}`}>{event.pathway}</span>{event.annualTopic&&<span className="comp-topic"><SiteIcon name="star" size={13}/> 2026–27 topic</span>}</div>
  <h3>{event.name}</h3>
  {event.eligibility&&<p className="comp-eligibility">Eligibility: {event.eligibility}</p>}
  <p className="comp-event-summary">{event.summary}</p>
  <dl>
   <div><dt>FORMAT</dt><dd>{event.elements}</dd></div>
   <div><dt>ENTRY</dt><dd>{event.entry}</dd></div>
   <div><dt>FIRST STAGE</dt><dd>{event.firstStage}</dd></div>
   <div><dt>CHAPTER SLOTS</dt><dd>Confirm with Campbell</dd></div>
  </dl>
  <div className="comp-event-actions"><a href={event.guideline} target="_blank" rel="noreferrer">Official guideline <ExternalLink size={14}/></a><button type="button" className={selected?"is-selected":""} onClick={onCompare}>{selected?<><Check size={14}/> Comparing</>:"Compare event"}</button></div>
 </article>
}

export default function CompetitionExperience(){
 const root=useRef<HTMLElement>(null);
 const [query,setQuery]=useState("");
 const [pathway,setPathway]=useState("ALL EVENTS");
 const [format,setFormat]=useState("ALL EVENTS");
 const [subject,setSubject]=useState("ALL SUBJECTS");
 const [selected,setSelected]=useState<string[]>([]);
 const [visible,setVisible]=useState(12);

 useLayoutEffect(()=>{
  if(!root.current)return;
  gsap.registerPlugin(ScrollTrigger);
  const ctx=gsap.context(()=>{
   gsap.utils.toArray<HTMLElement>("[data-comp-reveal]").forEach(el=>gsap.fromTo(el,{y:28,opacity:0},{y:0,opacity:1,duration:.72,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 86%",once:true}}));
   gsap.utils.toArray<HTMLElement>("[data-comp-line]").forEach(el=>gsap.fromTo(el,{scaleX:0},{scaleX:1,duration:1.05,ease:"power3.inOut",transformOrigin:"left",scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
   gsap.from(".comp-award-card",{y:36,opacity:0,duration:.7,ease:"power3.out"});
   gsap.from(".comp-trophy",{y:24,opacity:0,duration:.7,delay:.18,ease:"back.out(1.35)"});
   gsap.from(".comp-podium path",{scaleY:0,duration:.58,delay:.26,stagger:.08,ease:"power3.out",transformOrigin:"bottom"});
   gsap.from(".comp-award-spark",{scale:0,rotate:-45,duration:.48,delay:.55,ease:"back.out(1.8)",transformOrigin:"center"});
  },root);
  return()=>ctx.revert();
 },[]);

 const filtered=useMemo(()=>competitionEvents.filter(event=>{
  const haystack=`${event.name} ${event.subject} ${event.summary} ${event.elements}`.toLowerCase();
  const searchOk=!query||haystack.includes(query.toLowerCase());
  const pathOk=pathway==="ALL EVENTS"||(pathway==="RLC"&&event.pathway==="RLC → SLC")||(pathway==="SLC"&&event.pathway.includes("SLC"))||event.pathway===pathway;
  return searchOk&&pathOk&&matchesFormat(event,format)&&(subject==="ALL SUBJECTS"||event.subject===subject);
 }),[query,pathway,format,subject]);

 const compared=selected.map(name=>competitionEvents.find(event=>event.name===name)).filter(Boolean) as CompetitionEvent[];
 const chooseFormat=(next:string)=>{setFormat(next);setVisible(12);requestAnimationFrame(()=>document.querySelector("#event-directory")?.scrollIntoView({behavior:"smooth",block:"start"}));};
 const toggleCompare=(name:string)=>setSelected(current=>current.includes(name)?current.filter(item=>item!==name):current.length<3?[...current,name]:current);

 return <main ref={root} className="compete-page">
  <section className="comp-hero">
   <div className="comp-hero-copy">
    <p className="comp-label">CAMPBELL FBLA • COMPETITIVE EVENTS</p>
    <h1><FoldText text={"FIND THE EVENT\nTHAT FITS HOW\nYOU THINK."} splitBy="line" hinge="top" trigger="mount" duration={.58} stagger={.11} perspective={820} creaseShading={.28} fontSize={140} fontWeight={500} color="#ffffff"/></h1>
    <p className="comp-hero-body">FBLA competition is not one type of contest. Some events are objective tests. Others use presentations, case studies, projects, demonstrations, or teams. Start by finding the format and subject that match your strengths, then work backward from the official rules.</p>
    <div className="comp-actions"><a className="comp-button comp-button-gold" href="#event-directory">Browse Competitive Events <ArrowDown size={17}/></a><Link className="comp-button" href="/resources?category=Competition">Competition Resources <ArrowRight size={17}/></Link></div>
    <small>2026–27 High School Competition</small>
   </div>
   <aside className="comp-hero-index" aria-label="Competition trophy illustration">
    <div className="comp-hero-visual">
     <svg viewBox="0 0 620 540" role="img" aria-label="A trophy standing on a three-level competition podium">
      <rect className="comp-award-card" x="34" y="34" width="552" height="472" rx="92"/>
      <path className="comp-award-corner" d="M34 165V126c0-51 41-92 92-92h122c-47 36-84 79-111 131z"/>
      <circle className="comp-award-disc" cx="310" cy="253" r="157"/>
      <path className="comp-award-spark" d="M498 112v50M473 137h50"/>
      <g className="comp-trophy">
       <path d="M238 130h144v91c0 64-32 109-72 109s-72-45-72-109z"/>
       <path d="M238 157h-46v38c0 53 29 81 69 81M382 157h46v38c0 53-29 81-69 81"/>
       <path d="M310 330v48M265 378h90"/>
      </g>
      <g className="comp-podium">
       <path d="M142 416h132v56H142zM274 390h72v82h-72zM346 431h132v41H346z"/>
       <path d="M119 472h382"/>
      </g>
     </svg>
    </div>
   </aside>
  </section>

  <section className="comp-format comp-section" id="formats">
   <header className="comp-split-head" data-comp-reveal><div><p className="comp-label">START WITH THE FORMAT</p><h2>HOW DO YOU WANT<br/>TO <em>COMPETE?</em></h2></div><p>You do not have to know your exact event yet. Start with the kind of work you would rather prepare for.</p></header>
   <div className="comp-format-list">
    {formatChoices.map((item,index)=><article key={item.key} data-comp-reveal><div className="comp-format-number">{item.number}</div><div><h3>{item.title}</h3><p>{item.copy}</p></div><div><span>BEST FIT</span><p>{item.fit}</p></div><button onClick={()=>chooseFormat(item.key)}>{item.action} <ArrowDown size={15}/></button><i>{["A","B","C","D","E"][index]}</i></article>)}
   </div>
  </section>

  <section id="event-directory" className="comp-directory comp-section">
   <header className="comp-directory-head" data-comp-reveal><div><p className="comp-label">2026–27 EVENT DIRECTORY</p><h2>FIND YOUR <em>EVENT.</em></h2></div><div><p>Search every current high-school competitive event in Georgia FBLA’s regional, fall-qualifying, and state competition system.</p><span className="comp-source-status"><Check size={15}/> Official 2026–27 sources checked September 9, 2026</span></div></header>
   <div className="comp-rules-note" data-comp-reveal><SiteIcon name="file-check"/><p><strong>Two limits matter.</strong> Team size comes from the national event guideline. The number of Campbell entries available depends on current Georgia registration rules, schedule conflicts, and the chapter plan. A national “state entry limit” is not a Campbell chapter limit.</p></div>
   <div className="comp-filter-console" data-comp-reveal>
    <label className="comp-search"><Search size={19}/><input value={query} onChange={e=>{setQuery(e.target.value);setVisible(12)}} placeholder="Search an event, subject, or skill..." aria-label="Search competitive events"/>{query&&<button onClick={()=>setQuery("")} aria-label="Clear search"><X size={16}/></button>}</label>
    <div className="comp-filter-group"><span>PATHWAY</span><div className="comp-filter-row" aria-label="Competition pathway filters">{["ALL EVENTS","RLC","SLC","RLC → SLC","FLC → SLC","SLC ONLY"].map(item=><button className={pathway===item?"is-active":""} key={item} onClick={()=>{setPathway(item);setVisible(12)}}>{item}</button>)}</div></div>
    <div className="comp-filter-group"><span>FORMAT</span><div className="comp-filter-row" aria-label="Event format filters">{["ALL EVENTS","TEST","PRESENTATION","CASE / ROLE-PLAY","PROJECT","TEAM"].map(item=><button className={format===item?"is-active":""} key={item} onClick={()=>{setFormat(item);setVisible(12)}}>{item}</button>)}</div></div>
    <label className="comp-select">SUBJECT AREA<select value={subject} onChange={e=>{setSubject(e.target.value);setVisible(12)}}><option>ALL SUBJECTS</option>{competitionSubjects.map(item=><option key={item}>{item}</option>)}</select><ChevronDown size={17}/></label>
   </div>
   <div className="comp-results-line"><p><strong>{filtered.length}</strong> events match</p><span data-comp-line/></div>
   <div className="comp-event-grid">{filtered.slice(0,visible).map(event=><EventCard key={event.name} event={event} selected={selected.includes(event.name)} onCompare={()=>toggleCompare(event.name)}/>)}</div>
   {!filtered.length&&<div className="comp-empty"><h3>No exact match.</h3><p>Clear a filter or search a broader skill.</p><button onClick={()=>{setQuery("");setPathway("ALL EVENTS");setFormat("ALL EVENTS");setSubject("ALL SUBJECTS")}}>Clear all filters</button></div>}
   {visible<filtered.length&&<button className="comp-load" onClick={()=>setVisible(count=>count+12)}>Show more events <span>{visible}/{filtered.length}</span></button>}
  </section>

  <section className="comp-compare comp-section" id="compare">
   <header data-comp-reveal><p className="comp-label">SIDE BY SIDE</p><h2>STUCK BETWEEN<br/>TWO EVENTS?</h2><p>Select up to three events and compare what preparation actually looks like before you commit.</p></header>
   {compared.length?<div className="comp-compare-board">{compared.map(event=><article key={event.name}><button aria-label={`Remove ${event.name}`} onClick={()=>toggleCompare(event.name)}><X size={16}/></button><span>{event.pathway}</span><h3>{event.name}</h3><dl><div><dt>FORMAT</dt><dd>{event.category}</dd></div><div><dt>INDIVIDUAL / TEAM</dt><dd>{event.entry}</dd></div><div><dt>COMPETITION LEVEL</dt><dd>{event.pathway}</dd></div><div><dt>TESTING</dt><dd>{event.testing?"Yes":"No"}</dd></div><div><dt>PREJUDGED WORK</dt><dd>{event.prejudged?"Yes":"No"}</dd></div><div><dt>LIVE PRESENTATION</dt><dd>{event.live?"Yes":"No"}</dd></div></dl><a href={event.guideline} target="_blank" rel="noreferrer">Official guideline <ExternalLink size={14}/></a></article>)}</div>:<div className="comp-compare-empty"><span>01</span><span>02</span><span>03</span><p>Add events from the directory above.</p></div>}
   {!!compared.length&&<button className="comp-clear" onClick={()=>setSelected([])}>Clear comparison</button>}
  </section>

  <section className="comp-process comp-section">
   <div className="comp-process-intro"><p className="comp-label">FROM INTEREST TO COMPETITION</p><h2>HOW CAMPBELL<br/><em>PREPARES.</em></h2><WordShutterReveal cover="blue" text="Choosing an event is only the first step. Campbell’s competition system gives competitors time to understand the rules, prepare, practice, and improve before conference day."/></div>
   <div className="comp-process-track">{process.map(([title,copy],index)=><article key={title} data-comp-reveal><span>{String(index+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
  </section>

  <section className="comp-pathway comp-section">
   <header data-comp-reveal><p className="comp-label">THE COMPETITION PATH</p><h2>RLC AND SLC DO<br/><em>DIFFERENT JOBS.</em></h2></header>
   <div className="comp-pathway-grid">
    <article className="comp-rlc" data-comp-reveal><strong>RLC</strong><div><p className="comp-label">REGION LEADERSHIP CONFERENCE</p><p>For events that use regional qualification, RLC is the first live competitive stage. Competitors are evaluated within their Georgia FBLA region, and qualifying competitors can move forward to the State Leadership Conference.</p><small>Not every event begins at RLC. Always check the event’s current pathway in the directory above.</small><Link href="/events">See RLC dates <ArrowRight size={16}/></Link></div></article>
    <article className="comp-slc" data-comp-reveal><strong>SLC</strong><div><p className="comp-label">STATE LEADERSHIP CONFERENCE</p><p>SLC is Georgia FBLA’s statewide high-school competition and leadership conference. Some competitors arrive through regional or fall qualification, while other events begin through state-level testing, submissions, or performances.</p><small>The official event guidelines determine how each event reaches SLC and what advancement is available afterward.</small><Link href="/events">See SLC dates <ArrowRight size={16}/></Link></div></article>
   </div>
  </section>

  <section className="comp-next comp-section"><div data-comp-reveal><p className="comp-label">AFTER STATE</p><h2>WHAT COMES <em>NEXT?</em></h2></div><div><WordShutterReveal cover="gold" text="For events that advance beyond the state level, qualifying competitors may move on to the National Leadership Conference. Advancement rules, placement requirements, team rules, and event availability can differ by event, so the current official guidelines are always the final source."/><a className="comp-button" href="https://www.fbla.org/high-school/competitive-events/" target="_blank" rel="noreferrer">National Competition Guidelines <ExternalLink size={16}/></a></div></section>

  <section className="comp-tech comp-section"><div className="comp-tech-visual"><svg viewBox="0 0 620 500" role="img" aria-label="A clean interface showing code, data, and web competition tools"><rect className="comp-tech-window" x="35" y="30" width="550" height="390" rx="38"/><circle cx="83" cy="74" r="8"/><circle cx="111" cy="74" r="8"/><circle cx="139" cy="74" r="8"/><path className="comp-tech-rule" d="M35 108h550"/><rect className="comp-tech-sidebar" x="73" y="146" width="132" height="230" rx="22"/><rect className="comp-tech-line gold" x="103" y="181" width="73" height="16" rx="8"/><rect className="comp-tech-line" x="103" y="219" width="53" height="10" rx="5"/><rect className="comp-tech-line" x="103" y="248" width="72" height="10" rx="5"/><rect className="comp-tech-line" x="103" y="277" width="44" height="10" rx="5"/><path className="comp-code-stroke" d="m289 187-49 43 49 43M426 187l49 43-49 43M382 154l-52 150"/><rect className="comp-tech-chip" x="239" y="328" width="92" height="34" rx="17"/><rect className="comp-tech-chip sky" x="342" y="328" width="92" height="34" rx="17"/><text x="285" y="350" textAnchor="middle">WEB</text><text x="388" y="350" textAnchor="middle">DATA</text><path className="comp-tech-cursor" d="m449 284 62 44-31 7-16 29z"/></svg><span>TECH + CODING</span></div><div><p className="comp-label">CAMPBELL-SPECIFIC SUPPORT</p><h2>INTERESTED IN A<br/>TECHNOLOGY EVENT?</h2><p>Campbell’s Coding Committee works on technology projects and supports coding and technology competition preparation. Under the current committee plan, Coding Committee members receive priority when signing up for coding- and technology-related competitive events.</p><div className="comp-actions"><Link className="comp-button comp-button-gold" href="/get-involved#coding">Explore the Coding Committee <ArrowRight size={16}/></Link><button className="comp-button" onClick={()=>{setSubject("Technology");setFormat("ALL EVENTS");requestAnimationFrame(()=>document.querySelector("#event-directory")?.scrollIntoView({behavior:"smooth"}))}}>Show Technology Events <ArrowDown size={16}/></button></div></div></section>

  <section className="comp-checks comp-section"><header data-comp-reveal><p className="comp-label">BEFORE YOU CHOOSE</p><h2>BEFORE YOU COMMIT,<br/>CHECK <em>FIVE THINGS.</em></h2></header><div className="comp-check-list">{checks.map(([title,copy],index)=><article key={title} data-comp-reveal><span>{String(index+1).padStart(2,"0")}</span><Check/><h3>{title}</h3><p>{copy}</p></article>)}</div><p className="comp-bottom-line">Choose based on the work you want to do, not just the event title.</p></section>

  <section className="comp-resources comp-section"><div><p className="comp-label">NEED THE RULES?</p><h2>USE THE OFFICIAL<br/>DOCUMENTS.</h2></div><div><p>Event guidelines, current competition documents, dress and conduct information, and official FBLA links belong in Resources so there is one place to keep them current.</p><div className="comp-actions"><Link className="comp-button" href="/resources?category=Competition">Competition Resources <ArrowRight size={16}/></Link><Link className="comp-button" href="/resources?category=Dress%20%26%20Conduct">Dress & Conduct <ArrowRight size={16}/></Link></div></div></section>

  <section className="comp-faq comp-section"><header><p className="comp-label">QUICK ANSWERS</p><h2>READ THIS<br/>BEFORE YOU ASK.</h2></header><div>{faqs.map(([question,answer],index)=><details key={question}><summary><span>{String(index+1).padStart(2,"0")}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></section>

  <section className="comp-final comp-section"><p className="comp-label">READY TO CHOOSE?</p><h2>FIND THE EVENT YOU<br/>WANT TO GET <em>GOOD AT.</em></h2><p>Browse the directory, read the official rules, and choose an event you are willing to prepare for.</p><div className="comp-actions"><a className="comp-button comp-button-gold" href="#event-directory">Browse All Events <ArrowDown size={16}/></a><Link className="comp-button" href="/resources?category=Competition">Open Competition Resources <ArrowRight size={16}/></Link></div><small>Need help choosing? Talk with the VP of Competitions or a chapter adviser.</small></section>
  {selected.length>0&&<a href="#compare" className="comp-dock"><SiteIcon name="compare" size={17}/><span>{selected.length}/3 selected</span><b>Compare</b></a>}
 </main>;
}
