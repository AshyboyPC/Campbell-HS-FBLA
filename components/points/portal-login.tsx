"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Mail, ShieldCheck } from "@/components/icons";
import { gsap } from "gsap";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PortalLogin({ configured, failedSignIn }: { configured: boolean; failedSignIn: boolean }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">(failedSignIn ? "error" : "idle");
  const [message, setMessage] = useState(failedSignIn ? "That sign-in link could not be verified. Request a new link and open it in this browser." : "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const method = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value");
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setState("error");
      setMessage("Enter the personal email you used for FBLA Connect.");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setState("loading");
    setMessage("");
    const redirectTo = `${window.location.origin}/points/auth/callback`;
    try {
      if (method === "email") {
        const { error } = await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: { emailRedirectTo: redirectTo },
        });
        if (error) throw error;
        setState("sent");
        setMessage("Check your inbox for the sign-in link. Open it in this browser to continue.");
        return;
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, queryParams: { login_hint: normalizedEmail, prompt: "select_account" } },
      });
      if (error) throw error;
    } catch {
      setState("error");
      setMessage(method === "email" ? "We couldn’t send a sign-in link. Please try again." : "We couldn’t open Google sign-in. Please try again.");
    }
  }

  useEffect(() => {
    if (!shellRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-auth-reveal]", { y: 22, opacity: 0, duration: .72, stagger: .07, ease: "power3.out" });
      gsap.fromTo(".portal-auth-route", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.65, ease: "power2.inOut" });
      gsap.to(".portal-auth-star", { rotate: 360, transformOrigin: "50% 50%", duration: 18, repeat: -1, ease: "none" });
      gsap.to(".portal-auth-orbit-dot", { y: -7, duration: 1.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, shellRef);
    return () => context.revert();
  }, []);

  return <div className="portal-auth-shell" ref={shellRef}>
    <div className="portal-auth-card">
      <div className="portal-auth-mark" data-auth-reveal><span>CF</span><b>MEMBER PORTAL · 2026—27</b></div>
      <p className="portal-kicker" data-auth-reveal>YOUR FBLA RECORD</p>
      <h1 data-auth-reveal>Welcome back.<br/><em>Pick up your progress.</em></h1>
      <p data-auth-reveal>Use the personal email you registered with in FBLA Connect. Sign in with Google or get a link by email.</p>
      {!configured ? <div className="portal-setup-note"><strong>Portal connection required</strong><span>Add the Supabase environment variables, apply the migrations, and restart the site.</span></div> : <form onSubmit={submit}>
        <label htmlFor="portal-email">Personal email used for FBLA Connect</label>
        <div className="portal-email-field"><Mail size={19}/><input id="portal-email" type="email" autoComplete="email" required value={email} onChange={(e)=>{setEmail(e.target.value); if (state !== "loading") setState("idle");}} placeholder="your.personal@email.com"/></div>
        {state === "sent" && <p role="status">{message}</p>}
        {state === "error" && <p className="portal-form-error" role="alert">{message}</p>}
        <button type="submit" value="google" disabled={state === "loading"}>{state === "loading" ? <LoaderCircle className="portal-spin"/> : <>Continue with Google <ArrowRight size={18}/></>}</button>
        <button type="submit" value="email" disabled={state === "loading" || state === "sent"}>Email me a sign-in link <Mail size={18}/></button>
      </form>}
      <Link className="portal-auth-back" href="/points"><ArrowLeft size={15}/> Back to portal overview</Link>
    </div>
    <aside className="portal-auth-guide">
      <svg className="portal-auth-orbit" viewBox="0 0 620 430" aria-hidden="true">
        <path className="portal-auth-route portal-auth-route-back" pathLength="1" d="M38 296C116 58 303 31 442 93C574 151 559 329 406 353C269 375 192 267 267 191C332 126 431 171 416 248"/>
        <path className="portal-auth-route" pathLength="1" d="M38 296C116 58 303 31 442 93C574 151 559 329 406 353C269 375 192 267 267 191C332 126 431 171 416 248"/>
        <circle className="portal-auth-orbit-dot" cx="38" cy="296" r="17"/>
        <path className="portal-auth-star" d="M416 218C421 237 427 243 446 248C427 253 421 259 416 278C411 259 405 253 386 248C405 243 411 237 416 218Z"/>
      </svg>
      <div className="portal-auth-guide-copy">
        <ShieldCheck size={28}/>
        <p className="portal-kicker">PRIVATE BY DESIGN</p>
        <h2>Your personal email.<br/>Your chapter record.</h2>
        <div>
          <p><i>01</i><span><b>Use your real login</b>Enter the personal email you used for FBLA Connect.</span><Check size={16}/></p>
          <p><i>02</i><span><b>Exact email match</b>Use Google or an email link to verify your address.</span><Check size={16}/></p>
          <p><i>03</i><span><b>Adviser-approved access</b>Confirm the name on a possible match and an adviser can link your email.</span><Check size={16}/></p>
        </div>
        <small>Officers review submitted claims. Advisers manage rules, balances, deductions, and access.</small>
      </div>
    </aside>
  </div>;
}
