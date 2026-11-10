import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";

const STAFF = ["adviser"];
const STATUSES = ["present", "late", "excused_absence", "unexcused_absence", "not_required"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePortalRole(STAFF); if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params; const body = await request.json().catch(() => null);
  if (!body || !STATUSES.includes(body.status)) return NextResponse.json({ error: "Choose a valid final classification." }, { status: 400 });
  const { data: before } = await auth.admin.from("officer_attendance").select("*").eq("id", id).eq("academic_year_id", auth.year.id).maybeSingle();
  if (!before) return NextResponse.json({ error: "Officer attendance record was not found." }, { status: 404 });
  const update = { status: body.status, notes: body.notes?.trim() || before.notes || null, classified_by: auth.profile.id, classified_at: new Date().toISOString() };
  const { data: after, error } = await auth.admin.from("officer_attendance").update(update).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: "The classification could not be saved." }, { status: 409 });
  await auth.admin.from("audit_log").insert({ actor_profile_id: auth.profile.id, action: "officer_attendance_classified", entity_type: "officer_attendance", entity_id: id, academic_year_id: auth.year.id, before_data: before, after_data: after });
  return NextResponse.json({ ok: true, attendance: after });
}
