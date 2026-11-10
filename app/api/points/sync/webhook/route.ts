import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sha256, verifySyncSignature } from "@/lib/points/sync-auth";
import { ingestAttendance } from "@/lib/points/attendance-ingestion";

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifySyncSignature(rawBody, request.headers.get("x-sync-timestamp"), request.headers.get("x-sync-signature"))) return NextResponse.json({ error: "Invalid or expired signature." }, { status: 401 });
  let body:{ purpose?: string; eventId?: string; eventType?: string; payload?: Record<string, unknown> };
  try{body=JSON.parse(rawBody)}catch{return NextResponse.json({error:"Invalid JSON."},{status:400})}
  if (!["attendance_source", "adviser_ledger"].includes(body.purpose ?? "") || !body.eventId || !body.eventType || body.payload == null) return NextResponse.json({ error: "Invalid sync event." }, { status: 400 });
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Sync is not configured." }, { status: 503 });
  const { data: connection } = await admin.from("sync_connections").select("id,status,field_mapping").eq("purpose", body.purpose).eq("active", true).maybeSingle();
  if (!connection) return NextResponse.json({ error: "Sync connection is not active." }, { status: 409 });
  const status = body.purpose === "attendance_source" && !Object.keys(connection.field_mapping ?? {}).length ? "needs_mapping" : "received";
  const { data, error } = await admin.from("sync_inbox_events").insert({ connection_id: connection.id, source_event_id: body.eventId, event_type: body.eventType, payload: body.payload, payload_hash: sha256(JSON.stringify(body.payload)), status }).select("id,status").single();
  if (error?.code === "23505") return NextResponse.json({ ok: true, status: "duplicate" });
  if (error) return NextResponse.json({ error: "The event could not be journaled safely." }, { status: 500 });
  if(body.purpose==="attendance_source"&&status==="received"){
    try{
      const mapping=connection.field_mapping as Record<string,string>;const payload=body.payload;const answers=(payload.answers??{}) as Record<string,unknown>;const answer=(field:string)=>mapping[field]?answers[mapping[field]]:undefined;
      const normalized={source:"google_form" as const,submissionId:body.eventId,eventCode:String(answer("eventCode")??""),submittedAt:String(payload.submittedAt??""),studentEmail:String(answer("studentEmail")??payload.respondentEmail??"")||null,memberId:String(answer("memberId")??"")||null,studentName:String(answer("studentName")??"")||null,serviceHours:answer("serviceHours")==null?null:Number(answer("serviceHours"))};
      if(!normalized.eventCode||!normalized.submittedAt){await admin.from("sync_inbox_events").update({status:"needs_mapping",error_message:"Event code or submission timestamp could not be mapped."}).eq("id",data.id);return NextResponse.json({ok:true,inboxId:data.id,status:"needs_mapping"},{status:202})}
      const result=await ingestAttendance(admin,normalized);await admin.from("sync_inbox_events").update({status:"processed",result,processed_at:new Date().toISOString()}).eq("id",data.id);await admin.from("sync_connections").update({last_synced_at:new Date().toISOString(),last_success_at:new Date().toISOString(),last_error:null,status:"ready"}).eq("id",connection.id);return NextResponse.json({ok:true,inboxId:data.id,status:result.status},{status:result.httpStatus});
    }catch(error){const message=error instanceof Error?error.message:"Attendance processing failed.";await admin.from("sync_inbox_events").update({status:"failed",error_message:message,processed_at:new Date().toISOString()}).eq("id",data.id);await admin.from("sync_connections").update({status:"error",last_error:message,last_error_at:new Date().toISOString()}).eq("id",connection.id);return NextResponse.json({error:"The signed event was saved but needs adviser review.",inboxId:data.id},{status:202})}
  }
  return NextResponse.json({ ok: true, inboxId: data.id, status: data.status }, { status:202 });
}
