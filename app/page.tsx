import Link from "next/link";
import Image from "next/image";
import HomeHero from "@/components/chapter/bio-hero";
import Opportunities from "@/components/chapter/opportunities";
import CurrentEvents from "@/components/chapter/current-events";
import HomeMotion from "@/components/chapter/home-motion";
import {Burst,Scribble,Spark} from "@/components/chapter/home-graphics";
import WordShutterReveal from "@/components/chapter/word-shutter-reveal";
import {SiteIcon} from "@/components/chapter/iconography";
import {committees} from "@/data/chapter";

const ownership=[['01','OWN','One person takes responsibility.'],['02','SUPPORT','A team helps make it happen.'],['03','APPROVE','Advisers guide school, safety, financial, and official requirements.']];
const committeeCopy=['Turn local needs into meaningful projects.','Plan campaigns that support chapter goals.','Create experiences that build chapter culture.','Build Campbell FBLA’s digital tools and technology projects.'];

export default function Home(){return <HomeMotion>
 <HomeHero/>
 <Opportunities/>
 <CurrentEvents/>

 <section className="v2-story" data-home-reveal><div className="wrap v2-story-grid"><div className="v2-story-copy"><span className="v2-tag">OUR NEXT CHAPTER</span><h2>YEAR THREE.<br/>FROM ADVISER-LED<br/>TO <em>STUDENT-LED.</em></h2><WordShutterReveal cover="sky" text="Campbell FBLA was rebuilt beginning in 2024–25. Now in our third year, we're building a chapter where students do more than attend meetings. Officers own real responsibilities, committees turn ideas into projects, members prepare year-round for competition, and the chapter documents what it creates so the next team can build on it."/><Link className="v2-button v2-button-blue" href="/about">Learn About Campbell FBLA <span>→</span></Link></div><div className="v2-ownership">{ownership.map(([number,title,copy])=><div key={title}><span>{number}</span><b>{title}</b><p>{copy}</p></div>)}</div></div></section>

 <section className="v2-committees" data-home-reveal><div className="wrap"><div className="v2-section-head"><div><span className="v2-tag">COMMITTEES</span><h2>FIND YOUR <em>PLACE.</em></h2><p>Four teams. Different ways to make the chapter better.</p></div><Link className="v2-text-link" href="/get-involved#committees">Explore Committees →</Link></div><div className="v2-committee-grid">{committees.map((committee,index)=><Link key={committee.id} className={`v2-committee-card v2-committee-card-${index}`} href={`/get-involved#${committee.id}`}><span className="v2-committee-num">0{index+1}</span><b>{committee.name.toUpperCase()}</b><p>{committeeCopy[index]}</p><span className="committee-arrow" aria-hidden="true">↗</span></Link>)}</div></div></section>

 <section className="v2-feature-pair wrap" data-home-reveal><div className="v2-gallery-card"><div className="v2-card-heading"><div><span className="v2-tag">CHAPTER LIFE</span><h2>2025–26 <em>ARCHIVE</em></h2></div><Link className="v2-text-link" href="/gallery">Explore the Gallery →</Link></div><div className="v2-archive-art"><div className="v2-archive-large"><span>COMPETE</span><b>SHOW<br/>WHAT<br/>YOU KNOW.</b><Burst/></div><div className="v2-archive-small v2-archive-service"><span>SERVE</span><b>MAKE IT<br/>COUNT.</b><Spark/></div><div className="v2-archive-small v2-archive-build"><span>BUILD</span><b>MAKE IT<br/>USEFUL.</b><Scribble/></div></div></div><div className="v2-portal-card"><span className="v2-tag">COMING THIS YEAR</span><h2>YOUR FBLA.<br/><em>YOUR PROGRESS.</em></h2><div className="v2-portal-features"><span><SiteIcon name="verified" size={18} aria-hidden="true"/><b>Verified Points</b></span><span><SiteIcon name="calendar-alt" size={18} aria-hidden="true"/><b>Attendance History</b></span><span><SiteIcon name="target" size={18} aria-hidden="true"/><b>Cord Progress</b></span><span><SiteIcon name="award" size={18} aria-hidden="true"/><b>Leaderboard</b></span></div><p>We&apos;re building a new Campbell FBLA member portal that will make it easier to see your participation and progress without manually tracking everything yourself.</p><Link className="v2-portal-button" href="/points"><span>Member Portal</span><small>Coming Soon</small></Link><Image className="v2-momentum-art" data-home-float src="/campbell-momentum-3d.png" alt="Three-dimensional symbols of progress and achievement" width={720} height={480}/></div></section>

 <section className="v2-final" data-home-reveal><div className="wrap"><div className="v2-final-art"><Image src="/campbell-pathways-3d.png" alt="Trophy, megaphone, service heart, and coding laptop" width={680} height={226}/></div><div className="v2-final-copy"><span className="v2-tag">CAMPBELL FBLA / 2026–27</span><h2>READY TO DO MORE<br/>THAN JOIN A <em>CLUB?</em></h2><p>Compete. Build skills. Lead projects. Serve your community. Create something the next group of members can continue.</p></div><div className="v2-final-actions"><Link className="v2-button v2-button-blue" href="/get-involved">Get Involved <span>→</span></Link><Link className="v2-button v2-button-outline-dark" href="/contact">Contact Us <span>→</span></Link></div></div></section>
</HomeMotion>}
