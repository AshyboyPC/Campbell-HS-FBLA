import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";

const STAFF = ["adviser"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePortalRole(STAFF); if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params; const body = await request.json().catch(() => null);
  if (!body || !["under_review", "rejected", "resolved"].includes(body.status)) return NextResponse.json({ error: "Choose a supported review status." }, { status: 400 });
  const { data: before } = await auth.admin.from("correction_requests").select("*").eq("id", id).eq("academic_year_id", auth.year.id).maybeSingle();
  if (!before) return NextResponse.json({ error: "Correction request was not found." }, { status: 404 });
  if (["resolved", "rejected"].includes(before.status)) return NextResponse.json({ error: "This correction request has already been finalized." }, { status: 409 });

  if (body.status === "resolved") {
    if (body.resolutionType === "attendance") {
      if (!["present", "absent", "late", "excused", "not_required", "pending_review"].includes(body.attendanceStatus)) return NextResponse.json({ error: "A valid attendance status is required." }, { status: 400 });
      const serviceHours = body.serviceHours === "" || body.serviceHours == null ? null : Number(body.serviceHours);
      if (serviceHours !== null && (!Number.isFinite(serviceHours) || serviceHours < 0)) return NextResponse.json({ error: "Service hours cannot be negative." }, { status: 400 });
      const { data, error } = await auth.admin.rpc("resolve_attendance_correction", {
        p_correction_id: id,
        p_actor_id: auth.profile.id,
        p_attendance_status: body.attendanceStatus,
        p_service_hours: serviceHours,
        p_notes: body.notes?.trim() || null,
      });
      if (error) return NextResponse.json({ error: error.message || "The attendance correction could not be applied." }, { status: 409 });
      return NextResponse.json({ ok: true, result: data });
    } else if (body.resolutionType === "point_adjustment") {
      if (auth.profile.account_role !== "adviser") return NextResponse.json({ error: "Point adjustments require an adviser." }, { status: 403 });
      const points = Number(body.points); if (!Number.isFinite(points) || points === 0 || !body.pointCategoryId) return NextResponse.json({ error: "A non-zero point adjustment and category are required." }, { status: 400 });
      const { error } = await auth.admin.from("point_transactions").insert({ member_id: before.member_id, academic_year_id: auth.year.id, point_category_id: body.pointCategoryId, event_id: before.event_id, transaction_type: "adjustment", points, status: "approved", source_type: "correction_request", source_reference: `correction:${id}:${randomUUID()}`, description: body.description?.trim() || `Correction request ${id}`, notes: body.notes?.trim() || null, created_by: auth.profile.id, approved_by: auth.profile.id, approved_at: new Date().toISOString() });
      if (error) return NextResponse.json({ error: "The point adjustment could not be applied." }, { status: 409 });
    } else return NextResponse.json({ error: "Resolved requests require an attendance correction or point adjustment." }, { status: 400 });
  }

  const resolved = body.status === "resolved" || body.status === "rejected";
  const { data: after, error } = await auth.admin.from("correction_requests").update({ status: body.status, reviewed_by: auth.profile.id, review_notes: body.notes?.trim() || null, resolved_at: resolved ? new Date().toISOString() : null }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: "The correction review could not be saved." }, { status: 409 });
  await auth.admin.from("audit_log").insert({ actor_profile_id: auth.profile.id, action: resolved ? "correction_resolved" : "correction_review_started", entity_type: "correction_request", entity_id: id, academic_year_id: auth.year.id, before_data: before, after_data: after });
  return NextResponse.json({ ok: true, correction: after });
}
