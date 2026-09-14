"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";

async function send(url: string, method: "POST" | "PATCH", body: Record<string, unknown>) {
  const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "The update could not be saved.");
}

export function MemberApprovalActions({ id, approved, duesStatus, accountRole }: { id: string; approved: boolean; duesStatus: string; accountRole: string }) {
  const router = useRouter(); const [state, setState] = useState("idle"); const [role,setRole]=useState(accountRole);
  const securedRole = ["secretary", "executive_leadership", "adviser", "admin"].includes(accountRole);
  async function update(body: Record<string, unknown>) { setState("saving"); try { await send(`/api/points/members/${id}`, "PATCH", body); setState("saved"); router.refresh(); } catch (error) { setState(error instanceof Error ? error.message : "error"); } }
  return <div className="portal-inline-actions"><button disabled={state === "saving" || approved} onClick={() => update({ approved: true, membershipStatus: "active" })}>{approved ? "Approved" : "Approve"}</button><button disabled={state === "saving" || duesStatus === "paid"} onClick={() => update({ duesStatus: "paid" })}>{duesStatus === "paid" ? "Dues verified" : "Verify dues"}</button>{securedRole?<small>Secured reviewer: {accountRole.replaceAll("_"," ")}</small>:<><select value={role} onChange={event=>setRole(event.target.value)}><option value="member">Member</option><option value="officer">Officer</option></select><button disabled={state==="saving"||role===accountRole} onClick={()=>update({accountRole:role})}>Save access</button></>}{!["idle", "saving", "saved"].includes(state) && <small>{state}</small>}</div>;
}

export function OfficerAttendanceClassifier({ id, current }: { id: string; current: string }) {
  const router = useRouter(); const [status, setStatus] = useState(current === "pending_review" ? "present" : current); const [state, setState] = useState("idle");
  async function save() { setState("saving"); try { await send(`/api/points/officer/attendance/${id}`, "PATCH", { status }); setState("saved"); router.refresh(); } catch (error) { setState(error instanceof Error ? error.message : "error"); } }
  return <div className="portal-inline-actions"><select value={status} onChange={event => setStatus(event.target.value)}><option value="present">Present</option><option value="late">Late</option><option value="excused_absence">Excused</option><option value="unexcused_absence">Unexcused</option><option value="not_required">Not required</option></select><button onClick={save} disabled={state === "saving"}><Check size={13}/>{state === "saving" ? "Saving" : "Confirm"}</button>{!["idle", "saving", "saved"].includes(state) && <small>{state}</small>}</div>;
}

export function AbsenceDecision({ id }: { id: string }) {
  const router = useRouter(); const [state, setState] = useState("idle");
  async function decide(status: "excused" | "unexcused") { setState("saving"); try { await send(`/api/points/officer/absence-requests/${id}`, "PATCH", { status }); setState("saved"); router.refresh(); } catch (error) { setState(error instanceof Error ? error.message : "error"); } }
  return <div className="portal-inline-actions"><button disabled={state === "saving"} onClick={() => decide("excused")}>Excuse</button><button disabled={state === "saving"} onClick={() => decide("unexcused")}>Unexcused</button>{!["idle", "saving", "saved"].includes(state) && <small>{state}</small>}</div>;
}

export function CorrectionReviewActions({ id, status, issueType }: { id: string; status: string; issueType: string }) {
  const router = useRouter(); const [state, setState] = useState("idle");
  async function update(next: "under_review" | "rejected" | "resolved") { setState("saving"); const body:Record<string,unknown>={status:next};if(next==="resolved"){body.resolutionType="attendance";body.attendanceStatus="present";body.verified=true;body.notes="Attendance verified after member correction request."}try { await send(`/api/points/corrections/${id}`, "PATCH", body); setState("saved"); router.refresh(); } catch (error) { setState(error instanceof Error ? error.message : "error"); } }
  return <div className="portal-inline-actions"><button disabled={state === "saving" || status === "under_review"} onClick={() => update("under_review")}>Review</button>{issueType==="Missing Attendance"&&<button disabled={state === "saving"} onClick={() => update("resolved")}>Verify attended</button>}<button disabled={state === "saving"} onClick={() => update("rejected")}>Reject</button>{!["idle", "saving", "saved"].includes(state) && <small>{state}</small>}</div>;
}

export function EventCreateForm({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter(); const [open, setOpen] = useState(false); const [state, setState] = useState("idle");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setState("saving"); const form = new FormData(event.currentTarget); const raw = Object.fromEntries(form); const body = { ...raw, requiredForMembers: form.get("requiredForMembers") === "on", requiredForOfficers: form.get("requiredForOfficers") === "on" }; try { await send("/api/points/events", "POST", body); setState("saved"); setOpen(false); event.currentTarget.reset(); router.refresh(); } catch (error) { setState(error instanceof Error ? error.message : "error"); } }
  if (!open) return <button className="portal-create-button" onClick={() => setOpen(true)}><Plus size={16}/>Create event</button>;
  return <form className="portal-request-form portal-event-form" onSubmit={submit}><div><label>Event code<input name="eventCode" required placeholder="CHAPTER-2026-09-09"/></label><label>Title<input name="title" required/></label></div><div><label>Type<select name="eventType" defaultValue="chapter_meeting">{["chapter_meeting","officer_team_meeting","social","service","fundraiser","workshop","competition_study","rally","conference","competition","BAA","leadership","other"].map(value => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select></label><label>Attendance source<select name="attendanceSource" defaultValue="google_form"><option value="google_form">Google Form</option><option value="microsoft_form">Microsoft Form</option><option value="csv">CSV</option><option value="manual">Manual</option><option value="qr">QR</option></select></label></div><div><label>Starts<input name="startDatetime" type="datetime-local" required/></label><label>Ends<input name="endDatetime" type="datetime-local" required/></label></div><div><label>Location<input name="location"/></label><label>Point rule<select name="pointCategoryId" defaultValue=""><option value="">No automatic points</option>{categories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label></div><div className="portal-form-checks"><label className="portal-checkbox"><input type="checkbox" name="requiredForMembers"/>Required for members</label><label className="portal-checkbox"><input type="checkbox" name="requiredForOfficers"/>Required for officers</label></div><label>Description<textarea name="description" rows={3}/></label><div className="portal-form-buttons"><button disabled={state === "saving"}>{state === "saving" ? "Creating…" : "Create event"}</button><button type="button" onClick={() => setOpen(false)}>Cancel</button></div>{!["idle", "saving", "saved"].includes(state) && <p className="portal-form-error">{state}</p>}</form>;
}
