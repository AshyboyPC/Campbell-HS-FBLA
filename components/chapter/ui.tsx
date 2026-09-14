import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { chapter } from "@/data/chapter";
export function Action({href,children,secondary=false}:{href:string;children:React.ReactNode;secondary?:boolean}){return <Link className={`action ${secondary?'action-outline':''}`} href={href}>{children}<ArrowUpRight size={18} aria-hidden="true"/></Link>}
export function PageIntro({eyebrow,title,description,children}:{eyebrow:string;title:string;description:string;children?:React.ReactNode}){return <header className="page-intro wrap"><p className="eyebrow">{eyebrow} <span>/ {chapter.yearLabel}</span></p><h1>{title}</h1><div className="intro-bottom"><p className="lead">{description}</p>{children}</div></header>}
export function SectionLabel({number,children}:{number:string;children:React.ReactNode}){return <p className="eyebrow section-label"><span>{number}</span>{children}</p>}
export function JoinCTA(){return <section className="join-cta"><div className="wrap split"><div><p className="eyebrow">There’s a place for your kind of ambition.</p><h2>Ready to do more<br/>than join a club?</h2></div><div className="cta-side"><p>Start with a Wednesday meeting.<br/>{chapter.meetingStart} · {chapter.room}</p><Action href="/get-involved">Get involved</Action><Link className="text-link" href="/contact">Have a question? Talk to us ↗</Link></div></div></section>}

