"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";

export function AdminUnlockForm({configured}:{configured:boolean}){
 const router=useRouter();const [state,setState]=useState("idle");
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setState("saving");const password=String(new FormData(event.currentTarget).get("password")||"");const response=await fetch("/api/points/admin/unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});const result=await response.json().catch(()=>({}));if(!response.ok){setState(result.error||"Unable to unlock.");return;}router.replace(result.redirect);router.refresh()}
 return <section className="portal-unlock-card"><LockKeyhole/><p className="portal-kicker">SECOND CHECK</p><h1>Unlock administration.</h1><p>Your Campbell Google account proves who you are. This separate password protects chapter-wide records and approval actions.</p>{configured?<form onSubmit={submit}><label>Administrator password<input name="password" type="password" autoComplete="current-password" required autoFocus/></label><button disabled={state==="saving"}>Unlock for 30 minutes <ArrowRight size={17}/></button>{!["idle","saving"].includes(state)&&<small role="alert">{state}</small>}</form>:<div className="portal-setup-note"><strong>Admin password is not configured</strong><span>Add PORTAL_ADMIN_PASSWORD and PORTAL_ADMIN_UNLOCK_SECRET to .env.local, then restart the server.</span></div>}</section>
}

