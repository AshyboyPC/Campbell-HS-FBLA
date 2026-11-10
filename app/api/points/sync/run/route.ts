/* eslint-disable @typescript-eslint/no-explicit-any */
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { clearSheetValues, writeSheetValues } from "@/lib/points/google-workspace";

function secretMatches(received:string|null, expected:string|undefined){if(!received||!expected)return false;const a=Buffer.from(received);const b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)}

export async function POST(request:Request){
 const bearer=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"")||null;
 const cron=secretMatches(bearer,process.env.POINTS_SYNC_CRON_SECRET);
 let actorId:string|null=null;let admin=createSupabaseAdminClient();
 if(!cron){const access=await requirePortalRole(["adviser"]);if("error" in access)return NextResponse.json({error:access.error},{status:access.status});admin=access.admin;actorId=access.profile.id}
 if(!admin)return NextResponse.json({error:"Sync is not configured."},{status:503});
 const {data:connection}=await admin.from("sync_connections").select("id,external_resource_id,status,active").eq("purpose","adviser_ledger").maybeSingle();
 if(!connection?.active||!connection.external_resource_id||connection.status==="needs_configuration")return NextResponse.json({error:"The adviser Sheet connection is not ready."},{status:409});
 const key=`sheet-snapshot:${new Date().toISOString().slice(0,16)}`;
 const {data:run,error:runError}=await admin.from("sync_runs").insert({connection_id:connection.id,direction:"outbound",idempotency_key:key,status:"running"}).select("id").single();
 if(runError?.code==="23505")return NextResponse.json({ok:true,status:"already_running"});
 if(runError)return NextResponse.json({error:"A sync run could not be started."},{status:500});
 try{
  const {data:year}=await admin.from("academic_years").select("id,label").eq("is_active",true).single();
  if(!year)throw new Error("Active academic year is not configured.");
  const [{data:members},{data:totals},{data:ledger},{data:attendance}]=await Promise.all([
   admin.from("profiles").select("id,member_id,display_name,graduation_year,membership_status,membership_tier,dues_status,account_role,officer_position,active,approved").neq("account_role","adviser").order("display_name"),
   admin.from("member_point_totals").select("member_id,official_points,points_earned,adjustments").eq("academic_year_id",year.id),
   admin.from("point_transactions").select("id,member_id,points,status,source_type,description,created_at,point_categories(name),events(title)").eq("academic_year_id",year.id).order("created_at",{ascending:false}),
   admin.from("member_attendance").select("id,member_id,status,verified,service_hours,source_type,check_in_timestamp,events(title,start_datetime,event_type)").order("check_in_timestamp",{ascending:false}),
  ]);
  const totalMap=new Map((totals??[]).map((row:any)=>[row.member_id,row]));const nameMap=new Map((members??[]).map((row:any)=>[row.id,row.display_name]));
  const memberRows=[["MEMBER_ID","NAME","CLASS","MEMBERSHIP","TIER","DUES","ROLE","OFFICIAL_POINTS","EARNED","ADJUSTMENTS","ACTIVE","APPROVED","SCHEMA_VERSION"],...(members??[]).map((row:any)=>{const total:any=totalMap.get(row.id)||{};return [row.member_id,row.display_name,row.graduation_year,row.membership_status,row.membership_tier,row.dues_status,row.officer_position||row.account_role,total.official_points??0,total.points_earned??0,total.adjustments??0,row.active,row.approved,"1"]})];
  const ledgerRows=[["TRANSACTION_ID","MEMBER","DATE","ACTIVITY","CATEGORY","SOURCE","POINTS","STATUS"],...(ledger??[]).map((row:any)=>[row.id,nameMap.get(row.member_id)||row.member_id,row.created_at,row.events?.title||row.description,row.point_categories?.name||"Adjustment",row.source_type,row.points,row.status])];
  const attendanceRows=[["ATTENDANCE_ID","MEMBER","DATE","EVENT","TYPE","STATUS","VERIFIED","SERVICE_HOURS","SOURCE"],...(attendance??[]).map((row:any)=>[row.id,nameMap.get(row.member_id)||row.member_id,row.events?.start_datetime||row.check_in_timestamp,row.events?.title||"Event",row.events?.event_type||"",row.status,row.verified,row.service_hours??"",row.source_type])];
  for(const [range,values] of [["Members!A:Z",memberRows],["Point Ledger!A:Z",ledgerRows],["Attendance!A:Z",attendanceRows]] as const){await clearSheetValues(connection.external_resource_id,range);await writeSheetValues(connection.external_resource_id,range,values)}
  await admin.from("sync_outbox").update({status:"completed",processed_at:new Date().toISOString()}).in("status",["pending","processing"]);
  await admin.from("sync_runs").update({status:"completed",processed_count:memberRows.length+ledgerRows.length+attendanceRows.length-3,finished_at:new Date().toISOString()}).eq("id",run.id);
  await admin.from("sync_connections").update({status:"ready",last_synced_at:new Date().toISOString(),last_success_at:new Date().toISOString(),last_error:null}).eq("id",connection.id);
  await admin.from("audit_log").insert({action:"adviser_sheet_synced",entity_type:"sync_connection",entity_id:connection.id,academic_year_id:year.id,actor_profile_id:actorId,after_data:{memberRows:memberRows.length-1,ledgerRows:ledgerRows.length-1,attendanceRows:attendanceRows.length-1}});
  return NextResponse.json({ok:true,members:memberRows.length-1,transactions:ledgerRows.length-1,attendance:attendanceRows.length-1});
 }catch(error){const message=error instanceof Error?error.message:"Unknown sync error";await admin.from("sync_runs").update({status:"failed",error_count:1,error_summary:message,finished_at:new Date().toISOString()}).eq("id",run.id);await admin.from("sync_connections").update({status:"error",last_error:message,last_error_at:new Date().toISOString()}).eq("id",connection.id);return NextResponse.json({error:"The adviser Sheet sync failed safely. No portal records were changed."},{status:502})}
}
