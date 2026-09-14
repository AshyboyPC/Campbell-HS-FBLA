import type {Metadata} from "next";
import Link from "next/link";
import {ArrowDown, ArrowUpRight} from "lucide-react";
import {SiteIcon} from "@/components/chapter/iconography";
import ResourceLibrary from "@/components/chapter/resource-library";
import "./resources.css";

export const metadata:Metadata={
 title:"Resources",
 description:"Verified Campbell FBLA membership, competition, dress-code, and chapter resources."
};

const quickPaths=[
 {number:"01",label:"JOIN",title:"Membership",copy:"Forms, dues, and chapter basics.",href:"/resources?category=Membership#library",tone:"gold"},
 {number:"02",label:"PREP",title:"Competition",copy:"Pathways, events, and preparation.",href:"/resources?category=Competition#library",tone:"blue"},
 {number:"03",label:"SHOW UP",title:"Dress + conduct",copy:"Conference expectations in one place.",href:"/resources?category=Dress%20%26%20Conduct#library",tone:"sky"},
];

export default function Resources(){return <div className="resources-page">
 <header className="resources-hero">
  <div className="resources-hero-copy">
   <p className="resources-kicker"><span>2026–27</span> CAMPBELL FBLA TOOLKIT</p>
   <h1>THE RIGHT<br/><em>RESOURCE.</em><br/>RIGHT NOW.</h1>
   <div className="resources-hero-bottom"><p>Membership forms, competition guidance, dress and conduct information, and official links—sorted around what you need to do next.</p><a href="#library">Open the library <ArrowDown size={18}/></a></div>
  </div>
  <div className="resources-desk" aria-label="Three ways into the resource library">
   <div className="resources-desk-label"><SiteIcon name="folder" size={20}/><span>START WITH YOUR TASK</span></div>
   <div className="resources-folder-stack">
    {quickPaths.map((path,index)=><Link className={`resources-folder resources-folder-${path.tone}`} href={path.href} key={path.title} style={{"--folder-index":index} as React.CSSProperties}>
     <span className="resources-folder-tab">{path.number} / {path.label}</span>
     <span className="resources-folder-icon">{index===0?<SiteIcon name="verified"/>:index===1?<SiteIcon name="file-search"/>:<SiteIcon name="dress"/>}</span>
     <strong>{path.title}</strong><small>{path.copy}</small><i><ArrowUpRight/></i>
    </Link>)}
   </div>
  </div>
 </header>

 <section className="resources-route-strip" aria-label="Resource guidance">
  <span>FIND</span><i>→</i><span>CHECK THE YEAR</span><i>→</i><span>OPEN</span><i>→</i><span>CONFIRM WITH BAND</span>
 </section>

 <ResourceLibrary/>

 <section className="resources-help">
  <div><p>STILL LOOKING?</p><h2>ASK A PERSON.<br/><em>NOT ANOTHER TAB.</em></h2></div>
  <div><p>If a document is missing, pending verification, or unclear, contact the chapter before relying on an older copy.</p><Link href="/contact">Contact Campbell FBLA <ArrowUpRight size={19}/></Link></div>
 </section>
 </div>}
