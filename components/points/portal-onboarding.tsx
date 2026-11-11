"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "@/components/icons";

type Props = { email: string; defaults: { firstName?: string; lastName?: string; displayName?: string } };

export function PortalOnboarding({ email, defaults }: Props) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  const [match, setMatch] = useState<{ name: string; requestId: string } | null>(null);
  const [details, setDetails] = useState<Record<string, FormDataEntryValue> | null>(null);
  const [requested, setRequested] = useState(false);

  async function save(body: Record<string, FormDataEntryValue>) {
    setState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/points/onboarding", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your profile could not be saved.");
      if (result.matchRequested) setRequested(true);
      else if (result.match) setMatch(result.match);
      else {
        router.replace(result.redirect || "/points/dashboard");
        router.refresh();
      }
      setState("idle");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Your profile could not be saved.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget));
    setDetails(body);
    await save(body);
  }

  return <section className="portal-onboarding-shell">
    <div className="portal-onboarding-copy"><span>FIRST-TIME SETUP</span><h1>Connect your record.</h1><p>Use the personal email you registered with in FBLA Connect. If we find a possible match, you can confirm the name on the chapter record.</p><b>{email}</b></div>
    {requested ? <div className="portal-onboarding-form">
      <h2>Request sent</h2>
      <p>An adviser will verify the match and link your personal email to your existing record. Sign in again after your adviser confirms it.</p>
    </div> : match ? <div className="portal-onboarding-form">
      <h2>Is this your chapter record?</h2>
      <p>We found a record for <strong>{match.name}</strong> with a matching or similar email address.</p>
      {message && <p role="alert" className="portal-form-error">{message}</p>}
      <button type="button" disabled={state === "saving"} onClick={() => details && save({ ...details, confirmMatch: match.requestId })}>
        {state === "saving" ? "Sending…" : "Yes, request a match"}
      </button>
      <button type="button" disabled={state === "saving"} onClick={() => { setMatch(null); setMessage(""); }}>
        Go back and edit my details
      </button>
    </div> : <form className="portal-onboarding-form" onSubmit={submit}>
      <div><label>First name<input name="firstName" required defaultValue={String(details?.firstName ?? defaults.firstName ?? "")}/></label><label>Last name<input name="lastName" required defaultValue={String(details?.lastName ?? defaults.lastName ?? "")}/></label></div>
      <label>Preferred name<input name="displayName" required defaultValue={String(details?.displayName ?? defaults.displayName ?? "")}/></label>
      <label>Name shown in BAND<input name="bandDisplayName" required defaultValue={String(details?.bandDisplayName ?? "")} placeholder="Exactly as it appears in BAND"/></label>
      <div><label>Grade<select name="gradeLevel" required defaultValue={String(details?.gradeLevel ?? "")}><option value="" disabled>Select</option>{["9","10","11","12"].map(v=><option key={v}>{v}</option>)}</select></label><label>Graduation year<input name="graduationYear" defaultValue={String(details?.graduationYear ?? "")} type="number" min="2026" max="2031" required/></label></div>
      <label>Primary committee<select name="primaryCommittee" defaultValue={String(details?.primaryCommittee ?? "")}><option value="">Not selected</option><option>Community Service</option><option>Fundraising</option><option>Social Events</option><option>Coding</option></select></label>
      {state === "error" && <p className="portal-form-error" role="alert">{message}</p>}
      <button disabled={state === "saving"}>{state === "saving" ? <><LoaderCircle className="portal-spin"/> Saving…</> : <>Open my portal <ArrowRight size={18}/></>}</button>
      <small>Your points are never created by this form. Attendance imports, verified claims, dues, and approved adjustments feed the ledger separately.</small>
    </form>}
  </section>;
}
