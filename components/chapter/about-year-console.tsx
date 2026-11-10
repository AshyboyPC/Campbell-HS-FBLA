"use client";

import {AnimatePresence,motion} from "framer-motion";
import {useState} from "react";
import {useMotionReady} from "@/components/chapter/motion";

const years=[
 {
  year:"2024–25",
  number:"01",
  label:"THE REBUILD",
  title:"REBUILDING THE CHAPTER",
  intro:"Campbell FBLA was rebuilt during the 2024–25 school year, establishing the chapter again and beginning the current period of growth.",
  highlights:["A chapter re-established","A new foundation","A community beginning again"],
  art:"rebuild",
  tone:"navy"
 },
 {
  year:"2025–26",
  number:"02",
  label:"THE PROOF",
  title:"PROVING WHAT THE CHAPTER COULD DO",
  intro:"The second year brought regular meetings, service, fundraising, competitive events, conferences, career activities, Champion Chapter work, and officer succession.",
  highlights:["432 food-drive items","72 families supported","RLC + SLC competition"],
  art:"proof",
  tone:"gold"
 },
 {
  year:"2026–27",
  number:"03",
  label:"THE SYSTEM",
  title:"BUILDING FOR WHAT COMES NEXT",
  intro:"Year three puts more structure behind the chapter: clearer officer responsibilities, four defined committees, yearlong competition preparation, and activities with an owner, deadline, outcome, and record.",
  highlights:["Clearer responsibilities","Four working committees","A repeatable preparation system"],
  art:"system",
  tone:"sky"
 }
] as const;

type YearArt=typeof years[number]["art"];

function YearArtwork({art,detail=false}:{art:YearArt;detail?:boolean}){
 if(art==="rebuild")return detail?<svg className="about-year-svg" viewBox="0 0 360 460" role="img" aria-label="A Campbell FBLA flag planted in a new foundation">
  <rect className="art-paper" x="22" y="22" width="316" height="416" rx="34"/>
  <g className="art-object"><path className="art-line" d="M92 356V98"/><path className="art-blue" d="M94 108h178l-34 55 34 55H94z"/><text className="art-flag-text" x="169" y="164">FBLA</text></g>
  <rect className="art-sky art-brick" x="63" y="340" width="234" height="52" rx="12"/>
  <rect className="art-gold art-brick" x="89" y="288" width="182" height="52" rx="12"/>
  <rect className="art-navy art-brick" x="117" y="236" width="126" height="52" rx="12"/>
  <path className="art-brick-line" d="M180 340v52M139 288v52M216 288v52M180 236v52"/>
 </svg>:<svg className="about-year-svg" viewBox="0 0 620 460" role="img" aria-label="A chapter blueprint, pencil, and building blocks showing the chapter being rebuilt">
  <rect className="art-paper" x="22" y="22" width="576" height="416" rx="34"/>
  <g className="art-object"><rect className="art-sky art-sheet" x="70" y="74" width="368" height="298" rx="22"/><path className="art-blueprint" d="M111 312V188l88-65 88 65v124h-62v-81h-53v81zM111 188h176M111 272h61M225 272h62"/><path className="art-blueprint art-dash" d="M95 101h318M95 345h318"/></g>
  <g className="art-object art-pencil"><path className="art-gold" d="M412 318l98-193 47 24-98 193-67 45z"/><path className="art-navy" d="M510 125l18-34 47 24-18 34zM392 387l20-69 47 24z"/></g>
  <rect className="art-navy" x="82" y="382" width="100" height="34" rx="9"/><rect className="art-blue" x="190" y="382" width="100" height="34" rx="9"/><rect className="art-gold" x="298" y="382" width="100" height="34" rx="9"/>
 </svg>;

 if(art==="proof")return detail?<svg className="about-year-svg" viewBox="0 0 360 460" role="img" aria-label="A donation box showing 432 collected items supporting 72 families">
  <rect className="art-paper" x="22" y="22" width="316" height="416" rx="34"/>
  <g className="art-object"><path className="art-gold art-box-flap" d="M61 174l119-54 119 54-119 55z"/><path className="art-blue" d="M61 174l119 55v148L61 319z"/><path className="art-navy" d="M299 174l-119 55v148l119-58z"/>
   <rect className="art-sky" x="91" y="66" width="54" height="102" rx="12"/><rect className="art-gold" x="157" y="48" width="54" height="122" rx="12"/><rect className="art-blue" x="223" y="78" width="50" height="96" rx="12"/>
   <path className="art-can-line" d="M101 90h34M101 143h34M167 72h34M167 145h34M233 100h30M233 149h30"/></g>
  <text className="art-box-number" x="125" y="284">432</text><text className="art-box-label" x="125" y="313">ITEMS</text>
  <text className="art-box-number" x="238" y="284">72</text><text className="art-box-label" x="238" y="313">FAMILIES</text>
 </svg>:<svg className="about-year-svg" viewBox="0 0 620 460" role="img" aria-label="A competition trophy, medal, and conference badges showing the chapter's results">
  <rect className="art-paper" x="22" y="22" width="576" height="416" rx="34"/>
  <g className="art-object art-trophy"><path className="art-gold" d="M225 76h170v94c0 69-37 112-85 112s-85-43-85-112z"/><path className="art-line" d="M225 104h-57v44c0 48 32 72 76 72M395 104h57v44c0 48-32 72-76 72"/><rect className="art-navy" x="282" y="275" width="56" height="67" rx="10"/><rect className="art-blue" x="233" y="333" width="154" height="51" rx="14"/><path className="art-star" d="M310 111l17 34 38 6-28 27 7 38-34-18-34 18 7-38-28-27 38-6z"/></g>
  <g className="art-badge"><rect className="art-sky" x="72" y="278" width="126" height="106" rx="20"/><text className="art-dark-text art-badge-title" x="135" y="321">RLC</text><path className="art-badge-line" d="M96 350h78"/></g>
  <g className="art-badge"><rect className="art-navy" x="422" y="278" width="126" height="106" rx="20"/><text className="art-badge-title" x="485" y="321">SLC</text><path className="art-badge-line art-badge-line-light" d="M446 350h78"/></g>
 </svg>;

 return detail?<svg className="about-year-svg" viewBox="0 0 360 460" role="img" aria-label="Four labeled folders representing Campbell FBLA's working committees">
  <rect className="art-paper" x="22" y="22" width="316" height="416" rx="34"/>
  <g className="art-folder-stack art-object"><path className="art-navy" d="M52 90h94l18 24h144v70H52z"/><text className="art-folder-text" x="180" y="150">SERVICE</text>
   <path className="art-blue" d="M52 166h94l18 24h144v70H52z"/><text className="art-folder-text" x="180" y="226">CODING</text>
   <path className="art-gold" d="M52 242h94l18 24h144v70H52z"/><text className="art-folder-text art-dark-text" x="180" y="302">FUNDRAISING</text>
   <path className="art-sky" d="M52 318h94l18 24h144v70H52z"/><text className="art-folder-text art-dark-text" x="180" y="378">SOCIAL</text></g>
 </svg>:<svg className="about-year-svg" viewBox="0 0 620 460" role="img" aria-label="An organized chapter planning board with owners, deadlines, and completed outcomes">
  <rect className="art-paper" x="22" y="22" width="576" height="416" rx="34"/>
  <g className="art-object"><rect className="art-navy" x="64" y="66" width="492" height="326" rx="27"/><rect className="art-sky" x="87" y="90" width="446" height="54" rx="14"/>
   <text className="art-board-title art-dark-text" x="310" y="119">CHAPTER PLAN</text>
   <path className="art-board-grid" d="M87 169h446M87 235h446M87 301h446M237 169v198M386 169v198"/>
   <text className="art-board-label" x="158" y="190">OWNER</text><text className="art-board-label" x="311" y="190">DEADLINE</text><text className="art-board-label" x="460" y="190">OUTCOME</text>
   <rect className="art-gold" x="105" y="207" width="111" height="38" rx="9"/><rect className="art-blue" x="254" y="207" width="111" height="38" rx="9"/><rect className="art-sky" x="403" y="207" width="111" height="38" rx="9"/>
   <rect className="art-blue" x="105" y="273" width="111" height="38" rx="9"/><rect className="art-sky" x="254" y="273" width="111" height="38" rx="9"/><rect className="art-gold" x="403" y="273" width="111" height="38" rx="9"/>
   <path className="art-checkmark" d="M127 225l10 10 21-24M425 291l10 10 21-24"/>
   <path className="art-board-rule" d="M105 341h177M302 341h212"/></g>
 </svg>;
}

export default function AboutYearConsole(){
 const [selected,setSelected]=useState(2);
 const motionReady=useMotionReady();
 const active=years[selected];
 const moveSelection=(direction:number)=>setSelected(current=>(current+direction+years.length)%years.length);

 return <div className="about-year-console" data-tone={active.tone}>
  <aside className="about-year-nav" aria-label="Choose a chapter year">
   <div className="about-year-nav-title"><strong>03</strong><span>CHAPTER<br/>YEARS</span></div>
   <div className="about-year-tabs" role="tablist" aria-orientation="vertical">
    {years.map((item,index)=><button type="button" role="tab" key={item.year} id={`year-tab-${index}`} aria-selected={selected===index} aria-controls="chapter-year-panel" tabIndex={selected===index?0:-1} onClick={()=>setSelected(index)} onKeyDown={event=>{if(event.key==="ArrowDown"||event.key==="ArrowRight"){event.preventDefault();moveSelection(1)}if(event.key==="ArrowUp"||event.key==="ArrowLeft"){event.preventDefault();moveSelection(-1)}}}><span>{item.number}</span><b>{item.year}</b><small>{item.label}</small><i aria-hidden="true">↗</i></button>)}
   </div>
   <p>SELECT A YEAR</p>
  </aside>

  <div className="about-year-stage">
   <AnimatePresence mode="wait" initial={false}>
    <motion.article id="chapter-year-panel" role="tabpanel" aria-labelledby={`year-tab-${selected}`} key={active.year} initial={motionReady?{opacity:0,y:14}:false} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.36,ease:[.22,1,.36,1]}}>
     <header className="about-year-banner"><span>{active.year} / {active.label}</span><h3>{active.title}</h3><b aria-hidden="true">↓↓</b></header>
     <div className="about-year-layout">
      <div className="about-year-copy">
       <span className="about-year-index">YEAR {active.number}</span>
       <h4>{active.year}</h4>
       <p>{active.intro}</p>
       <ul>{active.highlights.map(highlight=><li key={highlight}>{highlight}</li>)}</ul>
      </div>
      <figure className="about-year-photo about-year-photo-primary"><YearArtwork art={active.art}/></figure>
      <figure className="about-year-photo about-year-photo-secondary"><YearArtwork art={active.art} detail/></figure>
     </div>
    </motion.article>
   </AnimatePresence>
  </div>
 </div>;
}
