import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request:Request){
 const supabase=await createSupabaseServerClient();if(!supabase)return NextResponse.json({error:"Member Portal is not configured."},{status:503});
 const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Sign in required."},{status:401});
 const body=await request.json().catch(()=>null);if(!body?.eventId||typeof body.reason!=="string"||body.reason.trim().length<5)return NextResponse.json({error:"Choose a meeting and provide a brief reason."},{status:400});
 const [{data:profile},{data:event}]=await Promise.all([
  supabase.from("profiles").select("id,officer_position").eq("auth_user_id",user.id).eq("approved",true).eq("active",true).maybeSingle(),
  supabase.from("events").select("id,required_for_officers").eq("id",body.eventId).maybeSingle(),
 ]);
 if(!profile?.officer_position||!event?.required_for_officers)return NextResponse.json({error:"This request is limited to required officer meetings."},{status:403});
 const {error}=await supabase.from("officer_absence_requests").insert({officer_id:profile.id,event_id:event.id,reason:body.reason.trim(),notice_given_at:new Date().toISOString(),handoff_required:Boolean(body.handoffRequired),handoff_plan:body.handoffPlan?.trim()||null,additional_notes:body.additionalNotes?.trim()||null,status:"pending"});
 if(error?.code==="23505")return NextResponse.json({error:"You already submitted a request for this meeting."},{status:409});
 if(error)return NextResponse.json({error:"We couldn’t save this absence request."},{status:500});
 return NextResponse.json({ok:true},{status:201});
}

