import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ingestAttendance, type AttendancePayload } from "@/lib/points/attendance-ingestion";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function secretMatches(received:string|null,expected:string|undefined){if(!received||!expected)return false;const a=Buffer.from(received);const b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)}
export async function POST(request:Request){
 const supplied=request.headers.get("x-attendance-webhook-secret")||request.headers.get("authorization")?.replace(/^Bearer\s+/i,"")||null;
 if(!secretMatches(supplied,process.env.ATTENDANCE_WEBHOOK_SECRET))return NextResponse.json({error:"Unauthorized."},{status:401});
 const admin=createSupabaseAdminClient();if(!admin)return NextResponse.json({error:"Attendance integration is not configured."},{status:503});
 const incoming=await request.json().catch(()=>null);const body=incoming?{...incoming,source:incoming.source??incoming.sourceType,submissionId:incoming.submissionId??incoming.sourceSubmissionId} as AttendancePayload:null;
 if(!body||!["google_form","microsoft_form"].includes(body.source)||typeof body.submissionId!=="string"||typeof body.eventCode!=="string"||typeof body.submittedAt!=="string")return NextResponse.json({error:"Invalid normalized attendance payload."},{status:400});
 try{const result=await ingestAttendance(admin,body);return NextResponse.json(result,{status:result.httpStatus})}catch(error){console.error("attendance_ingestion_failed",error);return NextResponse.json({error:"We couldn’t process this attendance record. It has been sent for review."},{status:500})}
}
