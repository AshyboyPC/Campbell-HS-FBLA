"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthFrame } from "./auth-frame";
import { PortalStage } from "./portal-motion";
import styles from "./auth.module.css";

type Props = { email: string; defaults: { firstName?: string; lastName?: string; displayName?: string } };
type Match = { name: string; requestId: string; maskedEmail: string | null; hasSavedEmail: boolean };
type Details = { firstName: string; lastName: string; email: string };

export function PortalOnboarding({ email, defaults }: Props) {
  const router = useRouter();
  const [details, setDetails] = useState<Details>({ firstName: defaults.firstName ?? "", lastName: defaults.lastName ?? "", email });
  const [step, setStep] = useState<"lookup" | "match" | "email" | "details" | "requested">("lookup");
  const [match, setMatch] = useState<Match | null>(null);
  const [emailChoice, setEmailChoice] = useState<"saved" | "current" | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current !== step) heading.current?.focus();
    previousStep.current = step;
  }, [step]);

  async function save(body: Record<string, FormDataEntryValue>) {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/points/onboarding", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your record couldn’t be saved.");
      if (result.redirect) {
        router.replace(result.redirect);
        router.refresh();
        return;
      }
      if (result.matchRequested) setStep("requested");
      else if (result.match) {
        setMatch(result.match);
        setEmailChoice(null);
        setStep("match");
      } else if (result.needsDetails) setStep("details");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Your record couldn’t be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function switchEmail(keepSaved: boolean) {
    setBusy(true);
    setMessage("");
    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) throw new Error("Sign-in is temporarily unavailable.");
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      window.location.assign(keepSaved ? "/points/login?mode=signup&useSavedEmail=1" : "/points/login?mode=signup");
    } catch {
      setMessage("We couldn’t switch accounts. Please try again.");
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>, complete: boolean) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    void save({ ...details, ...fields, stage: complete ? "complete" : "lookup" });
  }

  function back() {
    setMessage("");
    setStep("lookup");
  }

  const button = `${styles.button} ${styles.primary}`;

  const title = {
    lookup: "Find your chapter record",
    match: "Is this you?",
    email: "Which email should we use?",
    details: "Finish your profile",
    requested: "Request sent",
  }[step];

  return <AuthFrame><PortalStage stage={step}>
    <h1 ref={heading} tabIndex={-1}>{title}</h1>
    {step === "lookup" && <>
      <p>Enter your name as it appears in FBLA Connect. We’ll use your verified personal email to connect you to the points you’ve already earned.</p>
      <form className={styles.form} onSubmit={event => submit(event, false)}>
        <div className={styles.fields}>
          <label className={styles.field}>First name<input name="firstName" autoComplete="given-name" value={details.firstName} maxLength={100}
            onChange={event => setDetails({ ...details, firstName: event.target.value })} required /></label>
          <label className={styles.field}>Last name<input name="lastName" autoComplete="family-name" value={details.lastName} maxLength={100}
            onChange={event => setDetails({ ...details, lastName: event.target.value })} required /></label>
        </div>
        <label className={styles.field}>Verified personal email<input name="email" type="email" value={email} readOnly /></label>
        <button type="button" className={styles.textButton} disabled={busy} onClick={() => switchEmail(false)}>Use another email</button>
        <button className={button} disabled={busy}>{busy ? "Checking…" : "Find my record"}</button>
      </form>
    </>}
    {step === "match" && match && <>
      <p>We found a chapter record for <strong>{match.name}</strong>. Connect to this record to keep your points and activity history together.</p>
      <button type="button" className={button} disabled={busy} onClick={() => {
        if (match.hasSavedEmail) setStep("email");
        else void save({ ...details, confirmMatch: match.requestId });
      }}>{busy ? "Sending…" : "Yes, that’s me"}</button>
      <button type="button" className={styles.textButton} disabled={busy} onClick={back}>Go back and edit my name</button>
    </>}
    {step === "email" && match && <>
      <p>Your chapter record has a different email. Choose the one you want to use for the portal.</p>
      <form className={styles.form} aria-label="Choose your personal email" onSubmit={event => {
        event.preventDefault();
        if (emailChoice === "saved") void switchEmail(true);
        if (emailChoice === "current") void save({ ...details, confirmMatch: match.requestId });
      }}>
        <label className={styles.choice}><input type="radio" name="emailChoice" checked={emailChoice === "saved"} onChange={() => setEmailChoice("saved")} required />
          <span>Keep the saved email {match.maskedEmail && <>({match.maskedEmail})</>}</span></label>
        <label className={styles.choice}><input type="radio" name="emailChoice" checked={emailChoice === "current"} onChange={() => setEmailChoice("current")} required />
          <span>Use {email}</span></label>
        {emailChoice === "saved" && <p>Verify the saved email to open your existing record.</p>}
        {emailChoice === "current" && <p>An adviser will verify the match before replacing the saved email.</p>}
        <button className={button} disabled={busy || !emailChoice}>{busy ? "Continuing…" : emailChoice === "current" ? "Request email update" : "Continue"}</button>
      </form>
      <button type="button" className={styles.textButton} disabled={busy} onClick={() => { setMessage(""); setStep("match"); }}>Back</button>
    </>}
    {step === "requested" && <>
      <p>An adviser will verify your identity and connect <strong>{email}</strong> to your chapter record. Sign in with that email after they confirm.</p>
    </>}
    {step === "details" && <>
      <p>We couldn’t find a chapter record for <strong>{details.firstName} {details.lastName}</strong>. Add your member details to set up a new profile.</p>
      <form className={styles.form} onSubmit={event => submit(event, true)}>
        <label className={styles.field}>Preferred name<input name="displayName" defaultValue={defaults.displayName || `${details.firstName} ${details.lastName}`} maxLength={200} /></label>
        <label className={styles.field}>Name in BAND <small>Optional</small><input name="bandDisplayName" maxLength={200} /></label>
        <div className={styles.fields}>
          <label className={styles.field}>Grade<select name="gradeLevel" required defaultValue=""><option value="" disabled>Select</option>{["9","10","11","12"].map(grade => <option key={grade}>{grade}</option>)}</select></label>
          <label className={styles.field}>Graduation year<input name="graduationYear" type="number" min={2026} max={2100} required /></label>
        </div>
        <label className={styles.field}>Primary committee<select name="primaryCommittee" defaultValue=""><option value="">Not selected</option><option>Community Service</option><option>Fundraising</option><option>Social Events</option><option>Coding</option></select></label>
        <button className={button} disabled={busy}>{busy ? "Saving…" : "Create my profile"}</button>
      </form>
      <button type="button" className={styles.textButton} disabled={busy} onClick={back}>Go back and edit my name</button>
    </>}
    {message && <p className={styles.error} role="alert">{message}</p>}
  </PortalStage></AuthFrame>;
}
