/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Send } from "@/components/icons";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PortalSignOut() {
  const router = useRouter();
  return <button className="portal-signout" onClick={async()=>{const client=createSupabaseBrowserClient();await client?.auth.signOut();router.push("/points");router.refresh()}}><LogOut size={16}/> Sign out</button>;
}

async function submitJson(url:string,body:Record<string,unknown>){
  const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(payload.error||"We couldn’t save this request.");
}

export function CorrectionForm({events}:{events:any[]}){
 const [state,setState]=useState("idle");const router=useRouter();
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setState("saving");const form=new FormData(event.currentTarget);try{await submitJson("/api/points/corrections",Object.fromEntries(form));setState("saved");event.currentTarget.reset();router.refresh()}catch(error){setState(error instanceof Error?error.message:"error")}}
 return <form className="portal-request-form" onSubmit={submit}><div><label>Issue type<select name="issueType" required defaultValue=""><option value="" disabled>Select an issue</option>{["Incorrect Attendance","Missing Points","Incorrect Points","Incorrect Service Hours","Dues Issue","Other"].map(x=><option key={x}>{x}</option>)}</select></label><label>Related event<select name="eventId" defaultValue=""><option value="">No specific event</option>{events.map(e=><option value={e.id} key={e.id}>{e.title}</option>)}</select></label></div><label>Activity date<input name="activityDate" type="date"/></label><label>What needs to be corrected?<textarea name="description" required minLength={10} rows={5} placeholder="Include enough detail for the Secretary to verify the record."/></label><label>Evidence link (optional)<input name="evidenceUrl" type="url" placeholder="https://…"/></label><button disabled={state==="saving"}><Send size={17}/>{state==="saving"?"Submitting…":"Submit for review"}</button>{state==="saved"&&<p className="portal-form-success">Submitted. Your official record has not changed yet.</p>}{!['idle','saving','saved'].includes(state)&&<p className="portal-form-error">{state}</p>}</form>
}

export function MissedAttendanceForm({events}:{events:any[]}){
 const [state,setState]=useState("idle");const router=useRouter();
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setState("saving");const form=new FormData(event.currentTarget);try{await submitJson("/api/points/corrections",{...Object.fromEntries(form),issueType:"Missing Attendance"});setState("saved");event.currentTarget.reset();router.refresh()}catch(error){setState(error instanceof Error?error.message:"error")}}
 return <form className="portal-request-form portal-missed-form" onSubmit={submit}><label>Meeting or event you attended<select name="eventId" required defaultValue=""><option value="" disabled>Choose the missed check-in</option>{events.map(e=><option value={e.id} key={e.id}>{e.title} · {new Date(e.start_datetime).toLocaleDateString()}</option>)}</select></label><label>What can the reviewer verify?<textarea name="description" required minLength={10} rows={4} placeholder="For example: I attended the full September 9 chapter meeting but forgot to submit the attendance form."/></label><label>Evidence link (optional)<input name="evidenceUrl" type="url" placeholder="A photo, document, or other link if available"/></label><button disabled={state==="saving"}><Send size={17}/>{state==="saving"?"Sending for verification…":"Request attendance verification"}</button><p className="portal-form-caption">This does not add attendance or points by itself. A Secretary, executive officer, or adviser must verify that you attended. Once verified, the event’s configured point rule is applied automatically.</p>{state==="saved"&&<p className="portal-form-success">Request submitted once. It is now waiting for attendance verification.</p>}{!['idle','saving','saved'].includes(state)&&<p className="portal-form-error">{state}</p>}</form>
}

export function AbsenceRequestForm({events}:{events:any[]}){
 const [state,setState]=useState("idle");const router=useRouter();
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setState("saving");const form=new FormData(event.currentTarget);const body:Record<string,unknown>={...Object.fromEntries(form),handoffRequired:form.get("handoffRequired")==="on"};try{await submitJson("/api/points/officer/absence-requests",body);setState("saved");event.currentTarget.reset();router.refresh()}catch(error){setState(error instanceof Error?error.message:"error")}}
 return <form className="portal-request-form" onSubmit={submit}><label>Officer meeting<select name="eventId" required defaultValue=""><option value="" disabled>Select a meeting</option>{events.map(e=><option value={e.id} key={e.id}>{e.title} · {new Date(e.start_datetime).toLocaleDateString()}</option>)}</select></label><label>Brief reason<textarea name="reason" required minLength={5} rows={4}/></label><label className="portal-checkbox"><input type="checkbox" name="handoffRequired"/> I have time-sensitive work that needs a handoff.</label><label>Handoff plan<textarea name="handoffPlan" rows={3} placeholder="Responsibility, person supporting it, and next step."/></label><label>Additional notes<textarea name="additionalNotes" rows={3}/></label><button disabled={state==="saving"}><Send size={17}/>{state==="saving"?"Submitting…":"Submit for review"}</button><p className="portal-form-caption">Submitting does not mark the absence excused. Leadership or an adviser must review it.</p>{state==="saved"&&<p className="portal-form-success">Request submitted as pending review.</p>}{!['idle','saving','saved'].includes(state)&&<p className="portal-form-error">{state}</p>}</form>
}
