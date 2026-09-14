"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";

type Props = { email: string; defaults: { firstName?: string; lastName?: string; displayName?: string } };

export function PortalOnboarding({ email, defaults }: Props) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("saving"); setMessage("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/points/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setState("error"); setMessage(result.error || "Your profile could not be saved."); return; }
    router.replace(result.redirect || "/points/dashboard"); router.refresh();
  }

  return <section className="portal-onboarding-shell">
    <div className="portal-onboarding-copy"><span>FIRST-TIME SETUP</span><h1>Tell us who you are.</h1><p>This links your verified Campbell Google account to the private BAND roster. Known members continue immediately. A new or unclear match goes to the chapter review queue.</p><b>{email}</b></div>
    <form className="portal-onboarding-form" onSubmit={submit}>
      <div><label>First name<input name="firstName" required defaultValue={defaults.firstName}/></label><label>Last name<input name="lastName" required defaultValue={defaults.lastName}/></label></div>
      <label>Preferred name<input name="displayName" required defaultValue={defaults.displayName}/></label>
      <label>Name shown in BAND<input name="bandDisplayName" required placeholder="Exactly as it appears in BAND"/></label>
      <div><label>Grade<select name="gradeLevel" required defaultValue=""><option value="" disabled>Select</option>{["9","10","11","12"].map(v=><option key={v}>{v}</option>)}</select></label><label>Graduation year<input name="graduationYear" type="number" min="2026" max="2031" required/></label></div>
      <label>Primary committee<select name="primaryCommittee" defaultValue=""><option value="">Not selected</option><option>Community Service</option><option>Fundraising</option><option>Social Events</option><option>Coding</option></select></label>
      {state === "error" && <p className="portal-form-error" role="alert">{message}</p>}
      <button disabled={state === "saving"}>{state === "saving" ? <><LoaderCircle className="portal-spin"/> Saving…</> : <>Open my portal <ArrowRight size={18}/></>}</button>
      <small>Your points are never created by this form. Attendance imports, verified claims, dues, and approved adjustments feed the ledger separately.</small>
    </form>
  </section>;
}
