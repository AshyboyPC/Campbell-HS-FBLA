import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";

const LEADERSHIP = ["secretary", "executive_leadership", "adviser", "admin"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePortalRole(LEADERSHIP); if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params; const body = await request.json().catch(() => null);
  if (!body || !["excused", "unexcused"].includes(body.status)) return NextResponse.json({ error: "Choose excused or unexcused." }, { status: 400 });
  const { data: before } = await auth.admin.from("officer_absence_requests").select("*,events(start_datetime)").eq("id", id).maybeSingle();
  if (!before) return NextResponse.json({ error: "Absence request was not found." }, { status: 404 });
  const { data: after, error } = await auth.admin.from("officer_absence_requests").update({ status: body.status, reviewed_by: auth.profile.id, reviewed_at: new Date().toISOString(), decision_notes: body.notes?.trim() || null }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: "The absence decision could not be saved." }, { status: 409 });
  await auth.admin.from("officer_attendance").upsert({ academic_year_id: auth.year.id, officer_id: before.officer_id, event_id: before.event_id, status: body.status === "excused" ? "excused_absence" : "unexcused_absence", source_type: "admin", attendance_evidence_status: "confirmed", absence_request_id: id, classified_by: auth.profile.id, classified_at: new Date().toISOString(), notes: body.notes?.trim() || null }, { onConflict: "officer_id,event_id" });
  await auth.admin.from("audit_log").insert({ actor_profile_id: auth.profile.id, action: "absence_request_decided", entity_type: "officer_absence_request", entity_id: id, academic_year_id: auth.year.id, before_data: before, after_data: after });
  return NextResponse.json({ ok: true, request: after });
}
