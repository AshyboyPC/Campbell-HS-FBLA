import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Member Portal is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Sign in with the Google account used for FBLA Connect." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const quantity = Number(body?.quantity ?? 1);
  if (!body?.pointCategoryId || !body?.activityDate || typeof body.description !== "string" || body.description.trim().length < 10 || !Number.isFinite(quantity) || quantity <= 0) return NextResponse.json({ error: "Choose an activity, date, and include at least ten characters of detail." }, { status: 400 });
  if (body.evidenceUrl) {
    try { const url = new URL(body.evidenceUrl); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); }
    catch { return NextResponse.json({ error: "Evidence must be a valid http(s) link." }, { status: 400 }); }
  }
  const [{ data: profile }, { data: year }, { data: category }] = await Promise.all([
    supabase.from("profiles").select("id,membership_status,account_role").eq("auth_user_id", user.id).eq("approved", true).eq("active", true).maybeSingle(),
    supabase.from("academic_years").select("id,start_date,end_date").eq("is_active", true).maybeSingle(),
    supabase.from("point_categories").select("id,academic_year_id,self_reportable").eq("id", body.pointCategoryId).eq("active", true).eq("published", true).maybeSingle(),
  ]);
  if (!profile || profile.account_role==="adviser" || profile.membership_status!=="active" || !year || !category?.self_reportable || category.academic_year_id !== year.id) return NextResponse.json({ error: "This activity is not eligible for member self-reporting." }, { status: 403 });
  if (body.activityDate < year.start_date || body.activityDate > year.end_date) return NextResponse.json({ error: "The activity date must fall inside the active school year." }, { status: 400 });
  if (body.eventId) {
    const { data: event } = await supabase.from("events").select("id,academic_year_id").eq("id", body.eventId).maybeSingle();
    if (!event || event.academic_year_id !== year.id) return NextResponse.json({ error: "The selected event is not part of the active school year." }, { status: 400 });
  }
  let duplicate = supabase.from("point_claims").select("id").eq("member_id", profile.id).eq("academic_year_id", year.id).eq("point_category_id", category.id).eq("activity_date", body.activityDate).in("status", ["submitted", "under_review", "approved"]);
  duplicate = body.eventId ? duplicate.eq("event_id", body.eventId) : duplicate.is("event_id", null);
  const { data: existing } = await duplicate.limit(1).maybeSingle();
  if (existing) return NextResponse.json({ error: "A claim for this activity and date is already pending or approved." }, { status: 409 });
  const { data, error } = await supabase.from("point_claims").insert({ member_id: profile.id, academic_year_id: year.id, point_category_id: category.id, event_id: body.eventId || null, activity_date: body.activityDate, quantity, member_description: body.description.trim(), evidence_url: body.evidenceUrl?.trim() || null, status: "submitted" }).select("id,status").single();
  if (error) return NextResponse.json({ error: "The point claim could not be submitted." }, { status: 409 });
  return NextResponse.json({ ok: true, claim: data }, { status: 201 });
}
