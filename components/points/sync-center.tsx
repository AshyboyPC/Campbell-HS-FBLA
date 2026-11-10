"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, CircleAlert, RefreshCw, Sheet, Workflow } from "@/components/icons";

type Connection={id:string;purpose:string;provider:string;display_name:string;status:string;external_resource_id?:string|null;worksheet_name?:string|null;last_synced_at?:string|null;last_error?:string|null;active:boolean};

export function SyncCenter({connections,credentialsConfigured,recentRuns}:{connections:Connection[];credentialsConfigured:boolean;recentRuns:Array<Record<string,unknown>>}){
 const [message,setMessage]=useState("");const [saving,setSaving]=useState<string|null>(null);
 const byPurpose=(purpose:string)=>connections.find(item=>item.purpose===purpose);
 async function save(event:FormEvent<HTMLFormElement>,purpose:"attendance_source"|"adviser_ledger"){
  event.preventDefault();setSaving(purpose);setMessage("");const form=new FormData(event.currentTarget);
  const response=await fetch("/api/points/sync/connections",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({purpose,resource:form.get("resource"),worksheetName:form.get("worksheetName")})});
  const body=await response.json().catch(()=>({}));setSaving(null);setMessage(response.ok?"Connection saved. Refresh to see its live status.":body.error||"Connection could not be saved.");if(response.ok)location.reload();
 }
 return <div className="sync-center">
  <div className="sync-security-note"><Workflow/><div><b>Automatic, replay-safe sync</b><p>Every inbound event is signed, timestamp-checked, deduplicated, and journaled before it can affect a record. The portal remains the source of truth; spreadsheet edits enter a validated adviser-action lane.</p></div></div>
  {!credentialsConfigured&&<div className="sync-config-warning"><CircleAlert/><span><b>Server credentials still needed</b><small>You can save the Form and Sheet links now. Sync activates only after the service-account and webhook secrets are added to the server.</small></span></div>}
  <div className="sync-connection-grid">
   <SyncCard icon={<Workflow/>} title="All-activity sign-in" copy="One Google Form can cover chapter, committee, officer, event, and service attendance." connection={byPurpose("attendance_source")} saving={saving==="attendance_source"} onSubmit={event=>save(event,"attendance_source")} placeholder="Paste the Google Form URL or form ID"/>
   <SyncCard icon={<Sheet/>} title="Adviser ledger" copy="Members, approved points, and attendance publish to a readable Sheet. Adviser actions flow back through validation and audit." connection={byPurpose("adviser_ledger")} saving={saving==="adviser_ledger"} onSubmit={event=>save(event,"adviser_ledger")} placeholder="Paste the Google Sheet URL or spreadsheet ID" sheet/>
  </div>
  {message&&<p className="portal-form-success">{message}</p>}
  <section className="sync-run-strip"><span><RefreshCw size={16}/> RECENT SYNC HEALTH</span><strong>{recentRuns.length?`${recentRuns.length} recent run${recentRuns.length===1?"":"s"}`:"No runs yet"}</strong><small>Historical attendance will be staged separately when the previous-year file is provided; no points are invented in advance.</small></section>
 </div>
}

function SyncCard({icon,title,copy,connection,saving,onSubmit,placeholder,sheet=false}:{icon:React.ReactNode;title:string;copy:string;connection?:Connection;saving:boolean;onSubmit:(event:FormEvent<HTMLFormElement>)=>void;placeholder:string;sheet?:boolean}){
 const ready=connection?.status==="ready";
 return <article className={`sync-card ${ready?"is-ready":""}`}><header><span>{icon}</span><i>{ready?<><CheckCircle2 size={14}/> READY</>:"AWAITING SETUP"}</i></header><h2>{title}</h2><p>{copy}</p><form onSubmit={onSubmit}><label><span>{sheet?"Sheet":"Form"} link</span><input name="resource" defaultValue={connection?.external_resource_id||""} placeholder={placeholder} required/></label>{sheet&&<label><span>Primary tab</span><input name="worksheetName" defaultValue={connection?.worksheet_name||"Members"}/></label>}<button disabled={saving}>{saving?"Saving…":"Save connection"}<ArrowRight size={16}/></button></form>{connection?.last_synced_at&&<small>Last synced {new Date(connection.last_synced_at).toLocaleString()}</small>}{connection?.last_error&&<small className="sync-error">{connection.last_error}</small>}</article>
}
