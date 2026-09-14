import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, CalendarCheck2, Medal, ShieldCheck } from "lucide-react";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Member Portal", description: "Private Campbell FBLA points, attendance, leaderboard, and graduation progress." };

export default async function PointsEntry() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  return <section className="points-entry portal-entry-page">
    <header className="portal-entry-nav">
      <Link className="portal-entry-brand" href="/points"><span>CF</span><b>Member Portal</b></Link>
      <Link className="portal-entry-back" href="/"><ArrowLeft size={16}/> Campbell FBLA</Link>
    </header>
    <div className="portal-entry-layout">
      <div className="points-entry-copy">
        <p className="portal-kicker">PRIVATE MEMBER SPACE · 2026—27</p>
        <h1>YOUR CHAPTER.<br/><em>YOUR RECORD.</em></h1>
        <p>Your official points, attendance, cord progress, and chapter participation—organized in one private, verified place.</p>
        <div className="points-entry-actions">
          <Link className="portal-primary" href={user ? "/points/onboarding" : "/points/login"}>{user ? "Open my portal" : "Continue to sign in"}<ArrowRight size={19}/></Link>
          <span>{hasSupabaseConfig ? "Uses your Campbell Google account" : "Portal connection pending"}</span>
        </div>
      </div>
      <div className="points-entry-board" aria-label="Member portal capabilities">
        <header><span>MEMBER RECORD</span><b>2026—27</b></header>
        <div className="entry-score">
          <div className="entry-score-heading">
            <span>HOW YOUR POINTS BECOME OFFICIAL</span>
            <b>PRIVATE · VERIFIED</b>
          </div>
          <div className="entry-score-path" role="list" aria-label="How member points become official">
            <svg viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 30 42 C 185 42, 172 112, 325 112 S 475 42, 610 42 S 760 112, 970 70" />
            </svg>
            <div className="entry-score-step" role="listitem"><i/><b>Participate</b></div>
            <div className="entry-score-step" role="listitem"><i/><b>Recorded</b></div>
            <div className="entry-score-step" role="listitem"><i/><b>Reviewed</b></div>
            <div className="entry-score-step" role="listitem"><i/><b>Official</b></div>
          </div>
          <p className="entry-score-note">Attendance is imported automatically. Other eligible activity is submitted, checked, and added only after approval.</p>
        </div>
        <div className="entry-capabilities">
          <div className="entry-capability"><ShieldCheck/><b>Verified points</b></div>
          <div className="entry-capability"><CalendarCheck2/><b>Attendance history</b></div>
          <div className="entry-capability"><BarChart3/><b>Member leaderboard</b></div>
          <div className="entry-capability"><Medal/><b>Cord progress</b></div>
        </div>
      </div>
    </div>
    <footer className="portal-entry-foot"><span>Campbell High School FBLA</span><span>Member data stays inside the private portal.</span></footer>
  </section>;
}
