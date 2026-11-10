/* eslint-disable @typescript-eslint/no-explicit-any */
export type AttendancePayload={source:"google_form"|"microsoft_form";submissionId:string;eventCode:string;submittedAt:string;studentEmail?:string|null;memberId?:string|null;studentName?:string|null;serviceHours?:number|null};

export async function ingestAttendance(admin:any,body:AttendancePayload){
 const submittedAt=new Date(body.submittedAt);if(Number.isNaN(submittedAt.valueOf()))throw new Error("Invalid submittedAt value.");
 const {data:existing}=await admin.from("attendance_imports").select("id,status").eq("source_type",body.source).eq("source_submission_id",body.submissionId).maybeSingle();
 if(existing)return {ok:true,status:"duplicate",importId:existing.id,httpStatus:200};
 const [{data:year},{data:event}]=await Promise.all([
  admin.from("academic_years").select("id").eq("is_active",true).single(),
  admin.from("events").select("id,academic_year_id,attendance_open_datetime,attendance_close_datetime").eq("event_code",body.eventCode).eq("active",true).maybeSingle(),
 ]);
 if(!year)throw new Error("Active academic year is not configured.");
 let member:any=null;
 if(body.studentEmail){const {data}=await admin.from("profiles").select("id").eq("approved",true).eq("active",true).eq("membership_status","active").neq("account_role","adviser").eq("approved_auth_email",String(body.studentEmail).trim().toLowerCase()).maybeSingle();member=data}
 if(!member&&body.memberId){const {data}=await admin.from("profiles").select("id").eq("member_id",String(body.memberId).trim()).eq("approved",true).eq("active",true).eq("membership_status","active").neq("account_role","adviser").maybeSingle();member=data}
 if(!member&&body.studentEmail){const {data:mapping}=await admin.from("external_identity_mappings").select("profile_id").eq("provider",body.source).eq("external_identifier",String(body.studentEmail).trim().toLowerCase()).maybeSingle();if(mapping)member={id:mapping.profile_id}}
 let status=!member?"unmatched_member":!event||event.academic_year_id!==year.id?"unmatched_event":"matched";
 if(event&&(event.attendance_open_datetime&&submittedAt<new Date(event.attendance_open_datetime)||event.attendance_close_datetime&&submittedAt>new Date(event.attendance_close_datetime)))status="outside_window";
 const {data:staged,error:stageError}=await admin.from("attendance_imports").insert({academic_year_id:year.id,source_type:body.source,source_submission_id:body.submissionId,submitted_at:submittedAt.toISOString(),event_code:body.eventCode,submitted_email:body.studentEmail?String(body.studentEmail).trim().toLowerCase():null,submitted_member_id:body.memberId||null,submitted_name:body.studentName||null,matched_member_id:member?.id||null,matched_event_id:event?.id||null,status,review_reason:status==="outside_window"?"Submission received outside the configured attendance window.":null,raw_metadata:{serviceHours:body.serviceHours??null}}).select("id").single();
 if(stageError)throw stageError;
 if(status!=="matched")return {ok:true,status,importId:staged.id,httpStatus:202};
 const {data:attendance,error:attendanceError}=await admin.from("member_attendance").insert({event_id:event.id,member_id:member.id,status:"present",check_in_timestamp:submittedAt.toISOString(),source_type:body.source,source_submission_id:body.submissionId,verified:true,verified_at:new Date().toISOString(),service_hours:body.serviceHours??null}).select("id").single();
 if(attendanceError?.code==="23505"){await admin.from("attendance_imports").update({status:"duplicate",review_reason:"A canonical attendance record already exists for this member and event.",processed_at:new Date().toISOString()}).eq("id",staged.id);return {ok:true,status:"duplicate",importId:staged.id,httpStatus:202}}
 if(attendanceError)throw attendanceError;
 await admin.from("attendance_imports").update({status:"processed",processed_at:new Date().toISOString()}).eq("id",staged.id);
 await admin.from("audit_log").insert({action:"attendance_webhook_processed",entity_type:"member_attendance",entity_id:attendance.id,academic_year_id:year.id,after_data:{source:body.source,eventCode:body.eventCode,submissionId:body.submissionId}});
 return {ok:true,status:"processed",importId:staged.id,attendanceId:attendance.id,httpStatus:201};
}
