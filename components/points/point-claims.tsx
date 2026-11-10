/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock3, Send, X } from "@/components/icons";

async function send(url: string, method: "POST" | "PATCH", body: Record<string, unknown>) {
  const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "The request could not be saved.");
  return result;
}

export function PointClaimForm({ categories, events }: { categories: any[]; events: any[] }) {
  const router = useRouter(); const [state, setState] = useState("idle");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setState("saving"); const form = new FormData(event.currentTarget); try { await send("/api/points/claims", "POST", Object.fromEntries(form)); setState("saved"); event.currentTarget.reset(); router.refresh(); } catch (error) { setState(error instanceof Error ? error.message : "error"); } }
  return <form className="portal-request-form" onSubmit={submit}><div><label>Point activity<select name="pointCategoryId" required defaultValue=""><option value="" disabled>Choose an eligible activity</option>{categories.map(category => <option value={category.id} key={category.id}>{category.name} · {category.calculation_type === "per_hour" ? `${category.points_per_unit}/hour` : `${category.default_points} points`}</option>)}</select></label><label>Activity date<input name="activityDate" type="date" required/></label></div><div><label>Quantity or verified hours<input name="quantity" type="number" min="0.25" step="0.25" defaultValue="1" required/></label><label>Related event<select name="eventId" defaultValue=""><option value="">No specific event</option>{events.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label></div><label>What did you complete?<textarea name="description" required minLength={10} rows={5} placeholder="Give reviewers enough information to verify the activity. No reflection is required."/></label><label>Evidence link (optional)<input name="evidenceUrl" type="url" placeholder="Link to a certificate, result, document, or other evidence"/></label><button disabled={state === "saving"}><Send size={16}/>{state === "saving" ? "Submitting…" : "Submit for verification"}</button>{state === "saved" && <p className="portal-form-success">Submitted. These points are not official until a reviewer approves them.</p>}{!["idle", "saving", "saved"].includes(state) && <p className="portal-form-error">{state}</p>}</form>;
}

export function ClaimReviewActions({ id, quantity, canEditQuantity }: { id: string; quantity: number; canEditQuantity: boolean }) {
  const router = useRouter(); const [verifiedQuantity, setVerifiedQuantity] = useState(String(quantity)); const [state, setState] = useState("idle");
  async function decide(decision: "under_review" | "approved" | "rejected") { setState("saving"); try { await send(`/api/points/claims/${id}`, "PATCH", { decision, ...(canEditQuantity ? { verifiedQuantity } : {}), notes: decision === "approved" ? "Verified by chapter reviewer." : undefined }); setState("saved"); router.refresh(); } catch (error) { setState(error instanceof Error ? error.message : "error"); } }
  return <div className="claim-review-actions">{canEditQuantity?<label>Verified amount<input value={verifiedQuantity} onChange={event => setVerifiedQuantity(event.target.value)} type="number" min="0.25" step="0.25"/></label>:<p className="claim-fixed-amount"><span>Submitted amount</span><strong>{quantity}</strong><small>Officer approvals cannot change this value.</small></p>}<div><button onClick={() => decide("under_review")} disabled={state === "saving"}><Clock3 size={13}/>Reviewing</button><button onClick={() => decide("approved")} disabled={state === "saving"}><Check size={13}/>Approve</button><button onClick={() => decide("rejected")} disabled={state === "saving"}><X size={13}/>Reject</button></div>{!["idle", "saving", "saved"].includes(state) && <small>{state}</small>}</div>;
}

export function StaffPointAdjustmentForm({ memberId, categories }: { memberId: string; categories: any[] }) {
  const router = useRouter(); const [state,setState]=useState("idle");
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setState("saving");const form=new FormData(event.currentTarget);try{await send(`/api/points/members/${memberId}/adjustments`,"POST",Object.fromEntries(form));setState("saved");event.currentTarget.reset();router.refresh()}catch(error){setState(error instanceof Error?error.message:"error")}}
  return <form className="portal-request-form compact-adjustment" onSubmit={submit}><div><label>Point category<select name="pointCategoryId" required defaultValue=""><option value="" disabled>Choose category</option>{categories.map(category=><option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label>Point change<input name="points" type="number" step="0.25" required placeholder="Use a negative number to correct downward"/></label></div><label>Reason<input name="description" required minLength={5} placeholder="Why this adjustment is necessary"/></label><button disabled={state==="saving"}><Check size={15}/>{state==="saving"?"Saving…":"Add ledger adjustment"}</button>{state==="saved"&&<p className="portal-form-success">Adjustment recorded without deleting earlier history.</p>}{!["idle","saving","saved"].includes(state)&&<p className="portal-form-error">{state}</p>}</form>
}
