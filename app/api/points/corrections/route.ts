import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ISSUE_TYPES = ["Missing Attendance","Incorrect Attendance","Missing Points","Incorrect Points","Incorrect Service Hours","Dues Issue","Other"];

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Member Portal is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!/^[^@\s]+@campbellhigh\.net$/i.test(user.email)) return NextResponse.json({ error: "A Campbell High School email is required." }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || !ISSUE_TYPES.includes(body.issueType) || typeof body.description !== "string" || body.description.trim().length < 10) {
    return NextResponse.json({ error: "Choose an issue and include at least ten characters of detail." }, { status: 400 });
  }
  if (body.evidenceUrl) {
    try { const url = new URL(body.evidenceUrl); if (!['http:','https:'].includes(url.protocol)) throw new Error(); }
    catch { return NextResponse.json({ error: "Evidence must be a valid http(s) link." }, { status: 400 }); }
  }
  const [{ data: profile }, { data: year }] = await Promise.all([
    supabase.from("profiles").select("id,membership_status,account_role").eq("auth_user_id",user.id).eq("approved",true).eq("active",true).maybeSingle(),
    supabase.from("academic_years").select("id,start_date,end_date").eq("is_active",true).maybeSingle(),
  ]);
  if (!profile || profile.account_role === "adviser" || profile.membership_status !== "active" || !year) return NextResponse.json({ error: "Your approved member profile is not active." }, { status: 403 });
  if (["Missing Attendance", "Incorrect Attendance"].includes(body.issueType) && !body.eventId) return NextResponse.json({ error: "Choose the event whose attendance needs to be corrected." }, { status: 400 });
  if (body.activityDate && (body.activityDate < year.start_date || body.activityDate > year.end_date)) return NextResponse.json({ error: "The activity date must fall inside the active school year." }, { status: 400 });
  if (body.eventId) {
    const { data: event } = await supabase.from("events").select("id,academic_year_id").eq("id", body.eventId).eq("active", true).maybeSingle();
    if (!event || event.academic_year_id !== year.id) return NextResponse.json({ error: "The selected event is not part of the active school year." }, { status: 400 });
  }
  if (body.issueType === "Missing Attendance") {
    const { data: existing } = await supabase.from("correction_requests").select("id").eq("member_id", profile.id).eq("academic_year_id", year.id).eq("event_id", body.eventId).eq("issue_type", "Missing Attendance").in("status", ["submitted", "under_review"]).limit(1).maybeSingle();
    if (existing) return NextResponse.json({ error: "A missed-attendance request for this event is already being reviewed." }, { status: 409 });
  }
  const { error } = await supabase.from("correction_requests").insert({ member_id:profile.id,academic_year_id:year.id,issue_type:body.issueType,event_id:body.eventId||null,activity_date:body.activityDate||null,description:body.description.trim(),evidence_url:body.evidenceUrl||null,status:"submitted" });
  if (error) return NextResponse.json({ error: "We couldn’t save this request. It has not changed your official record." }, { status: 500 });
  return NextResponse.json({ ok:true }, { status:201 });
}
