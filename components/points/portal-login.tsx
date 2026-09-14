"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PortalLogin({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^(?:[a-z0-9]+\.[a-z0-9]+|fbla)@campbellhigh\.net$/.test(normalizedEmail)) {
      setState("error");
      setMessage("Use first.last@campbellhigh.net (or the official adviser account). ");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setState("loading");
    const redirectTo = `${window.location.origin}/points/auth/callback?next=/points/onboarding`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { hd: "campbellhigh.net", login_hint: normalizedEmail, prompt: "select_account" },
      },
    });
    if (error) {
      setState("error");
      setMessage("We couldn’t open Campbell Google sign-in. Please try again.");
      return;
    }
  }

  return <div className="portal-auth-shell">
    <div className="portal-auth-card">
      <div className="portal-auth-mark"><span>CF</span><b>MEMBER PORTAL · 2026—27</b></div>
      <p className="portal-kicker">CAMPBELL ACCOUNT ACCESS</p>
      <h1>Welcome.<br/><em>Let&apos;s find your record.</em></h1>
      <p>Enter your Campbell email, then continue through Google. There is no separate portal password or email confirmation link.</p>
      {!configured ? <div className="portal-setup-note"><strong>Portal connection required</strong><span>Add the Supabase environment variables, apply the migrations, and restart the site.</span></div> : <form onSubmit={submit}>
        <label htmlFor="portal-email">Your Campbell email</label>
        <div className="portal-email-field"><Mail size={19}/><input id="portal-email" type="email" autoComplete="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="first.last@campbellhigh.net"/></div>
        {state === "error" && <p className="portal-form-error" role="alert">{message}</p>}
        <button disabled={state === "loading"}>{state === "loading" ? <LoaderCircle className="portal-spin"/> : <>Continue with Campbell Google <ArrowRight size={18}/></>}</button>
      </form>}
      <Link className="portal-auth-back" href="/points"><ArrowLeft size={15}/> Back to portal overview</Link>
    </div>
    <aside className="portal-auth-guide">
      <ShieldCheck size={28}/>
      <p className="portal-kicker">PRIVATE BY DESIGN</p>
      <h2>One school account.<br/>The right access.</h2>
      <div>
        <p><i>01</i><span><b>School identity</b>Use your first.last@campbellhigh.net account.</span><Check size={16}/></p>
        <p><i>02</i><span><b>Roster match</b>Known members connect to their existing chapter record.</span><Check size={16}/></p>
        <p><i>03</i><span><b>Role-aware portal</b>Members, officers, administrators, and advisers see the correct tools.</span><Check size={16}/></p>
      </div>
      <small>New or unmatched accounts wait for chapter approval. Adviser accounts are oversight-only.</small>
    </aside>
  </div>;
}
