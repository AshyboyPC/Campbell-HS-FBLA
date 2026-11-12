"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Mail } from "@/components/icons";
import { PortalStage } from "./portal-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthFrame } from "./auth-frame";
import styles from "./auth.module.css";

function GoogleMark() {
  return <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.1v5h6.7c3.9-3.6 6-8.8 6-14.8Z" />
    <path fill="#34A853" d="M24 44c5.5 0 10.2-1.8 13.6-4.9l-6.7-5a12.3 12.3 0 0 1-18.2-6.5H5.8v5.2A20 20 0 0 0 24 44Z" />
    <path fill="#FBBC05" d="M12.7 27.6a12 12 0 0 1 0-7.2v-5.2H5.8a20 20 0 0 0 0 17.6l6.9-5.2Z" />
    <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3l5.8-5.8A19.2 19.2 0 0 0 24 4 20 20 0 0 0 5.8 15.2l6.9 5.2A12 12 0 0 1 24 12Z" />
  </svg>;
}

export function PortalLogin({ configured, failedSignIn, signUp, useSavedEmail }: {
  configured: boolean;
  failedSignIn: boolean;
  signUp: boolean;
  useSavedEmail: boolean;
}) {
  const [busy, setBusy] = useState<"email" | "google" | null>(null);
  const [sentTo, setSentTo] = useState("");
  const [showEmail, setShowEmail] = useState(useSavedEmail);
  const firstField = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const emailMethod = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (sentTo) heading.current?.focus();
    else if (showEmail) firstField.current?.focus();
  }, [showEmail, sentTo]);
  const [message, setMessage] = useState(failedSignIn ? "That sign-in link expired or couldn’t be verified. Try signing in again." : "");

  async function authenticate(method: "email" | "google", details?: FormData) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase || busy) return;
    setBusy(method);
    setMessage("");
    const redirectTo = new URL("/points/auth/callback", window.location.origin);
    if (signUp) redirectTo.searchParams.set("intent", "signup");
    try {
      if (method === "google") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: redirectTo.href, queryParams: { prompt: "select_account" } },
        });
        if (error) throw error;
        return;
      }
      const email = String(details?.get("email") ?? "").trim().toLowerCase();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo.href,
          shouldCreateUser: signUp,
          data: signUp ? {
            given_name: String(details?.get("firstName") ?? "").trim(),
            family_name: String(details?.get("lastName") ?? "").trim(),
          } : undefined,
        },
      });
      if (error) throw error;
      setSentTo(email);
    } catch {
      setMessage(method === "google" ? "Google sign-in couldn’t start. Please try again."
        : signUp ? "We couldn’t send a link. Check your email and try again."
          : "We couldn’t send a sign-in link. Check your email or use Sign up if this is your first time.");
    } finally {
      setBusy(null);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void authenticate("email", new FormData(event.currentTarget));
  }

  return <AuthFrame mode={signUp ? "signup" : "signin"}>
    <PortalStage stage={sentTo ? "inbox" : showEmail ? "email" : "methods"}>
      <h1 ref={heading} tabIndex={-1}>{sentTo ? "Check your inbox" : signUp ? <>Find your<br />FBLA record</> : "Welcome back"}</h1>
      <p>{sentTo ? <>We sent a link to <strong>{sentTo}</strong>. Open it in this browser to continue.</>
        : useSavedEmail ? "Verify the personal email already on your chapter record."
        : signUp ? "Use the personal email from FBLA Connect to find your points and finish setting up your account."
        : "Sign in with the personal email you used for FBLA Connect."}</p>
      {!configured ? <p className={styles.notice} role="status">Member sign-in is temporarily unavailable. Please try again later.</p>
        : sentTo ? <button type="button" className={styles.textButton} onClick={() => setSentTo("")}>Use a different email</button>
        : showEmail ? <form className={styles.form} onSubmit={submit}>
          {signUp && <div className={styles.fields}>
            <label className={styles.field}>First name<input ref={firstField} name="firstName" autoComplete="given-name" maxLength={100} required /></label>
            <label className={styles.field}>Last name<input name="lastName" autoComplete="family-name" maxLength={100} required /></label>
          </div>}
          <label className={styles.field}>Personal email<input ref={!signUp ? firstField : undefined} name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <button className={`${styles.button} ${styles.primary}`} disabled={Boolean(busy)}>
            {busy === "email" ? "Sending…" : "Email me a link"} <ArrowRight size={17} />
          </button>
          <button type="button" className={styles.textButton} disabled={Boolean(busy)} onClick={() => { setShowEmail(false); setMessage(""); requestAnimationFrame(() => emailMethod.current?.focus()); }}>
            Back to account options
          </button>
        </form> : <div className={styles.methods}>
          <button type="button" className={styles.button} disabled={Boolean(busy)} onClick={() => authenticate("google")}>
            <GoogleMark /> <span>{busy === "google" ? "Opening Google…" : "Continue with Google"}</span><ArrowRight size={17} />
          </button>
          <button ref={emailMethod} type="button" className={styles.button} disabled={Boolean(busy)} onClick={() => { setShowEmail(true); setMessage(""); }}>
            <Mail size={18} /><span>Continue with email</span><ArrowRight size={17} />
          </button>
        </div>}
      {message && <p className={styles.error} role="alert">{message}</p>}
    </PortalStage>
  </AuthFrame>;
}
