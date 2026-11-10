/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";

const STAFF = ["adviser"];
const EVENT_TYPES = ["chapter_meeting", "officer_team_meeting", "social", "service", "fundraiser", "workshop", "competition_study", "rally", "conference", "competition", "BAA", "leadership", "other"];
const SOURCES = ["google_form", "microsoft_form", "csv", "manual", "qr", "admin", "other"];

function eventPayload(body: any, academicYearId: string, actorId: string) {
  const start = new Date(body.startDatetime);
  const end = new Date(body.endDatetime);
  const open = body.attendanceOpenDatetime ? new Date(body.attendanceOpenDatetime) : null;
  const close = body.attendanceCloseDatetime ? new Date(body.attendanceCloseDatetime) : null;
  const override = body.pointOverride === "" || body.pointOverride == null ? null : Number(body.pointOverride);
  if (!body.eventCode || !/^[A-Za-z0-9_-]{2,80}$/.test(body.eventCode) || !body.title || !EVENT_TYPES.includes(body.eventType) || Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || end < start || (open && Number.isNaN(open.valueOf())) || (close && Number.isNaN(close.valueOf())) || (override !== null && !Number.isFinite(override))) return null;
  return {
    academic_year_id: academicYearId,
    event_code: body.eventCode.trim().toUpperCase(), title: body.title.trim(), event_type: body.eventType,
    description: body.description?.trim() || null, start_datetime: start.toISOString(), end_datetime: end.toISOString(), location: body.location?.trim() || null,
    attendance_open_datetime: open?.toISOString() || null,
    attendance_close_datetime: close?.toISOString() || null,
    point_category_id: body.pointCategoryId || null, point_override: override,
    required_for_members: Boolean(body.requiredForMembers), required_for_officers: Boolean(body.requiredForOfficers),
    attendance_source: SOURCES.includes(body.attendanceSource) ? body.attendanceSource : "manual", active: body.active !== false, created_by: actorId,
  };
}

export async function POST(request: Request) {
  const auth = await requirePortalRole(STAFF); if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = await request.json().catch(() => null); const payload = body && eventPayload(body, auth.year.id, auth.profile.id);
  if (!payload) return NextResponse.json({ error: "Provide a valid event code, title, type, start, and end time." }, { status: 400 });
  const { data, error } = await auth.admin.from("events").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: "The event could not be created. Check the event code and point rule." }, { status: 409 });
  await auth.admin.from("audit_log").insert({ actor_profile_id: auth.profile.id, action: "event_created", entity_type: "event", entity_id: data.id, academic_year_id: auth.year.id, after_data: data });
  return NextResponse.json({ ok: true, event: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requirePortalRole(STAFF); if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = await request.json().catch(() => null); if (!body?.id) return NextResponse.json({ error: "Missing event id." }, { status: 400 });
  const { data: before } = await auth.admin.from("events").select("*").eq("id", body.id).eq("academic_year_id", auth.year.id).maybeSingle();
  if (!before) return NextResponse.json({ error: "Event was not found." }, { status: 404 });
  const payload = eventPayload({ ...before, ...body, startDatetime: body.startDatetime ?? before.start_datetime, endDatetime: body.endDatetime ?? before.end_datetime, eventCode: body.eventCode ?? before.event_code, eventType: body.eventType ?? before.event_type, attendanceSource: body.attendanceSource ?? before.attendance_source, attendanceOpenDatetime: body.attendanceOpenDatetime ?? before.attendance_open_datetime, attendanceCloseDatetime: body.attendanceCloseDatetime ?? before.attendance_close_datetime, pointCategoryId: body.pointCategoryId ?? before.point_category_id, pointOverride: body.pointOverride ?? before.point_override, requiredForMembers: body.requiredForMembers ?? before.required_for_members, requiredForOfficers: body.requiredForOfficers ?? before.required_for_officers, active: body.active ?? before.active }, auth.year.id, before.created_by || auth.profile.id);
  if (!payload) return NextResponse.json({ error: "The event update is invalid." }, { status: 400 });
  const { data: after, error } = await auth.admin.from("events").update(payload).eq("id", body.id).select("*").single();
  if (error) return NextResponse.json({ error: "The event update could not be saved." }, { status: 409 });
  await auth.admin.from("audit_log").insert({ actor_profile_id: auth.profile.id, action: "event_updated", entity_type: "event", entity_id: body.id, academic_year_id: auth.year.id, before_data: before, after_data: after });
  return NextResponse.json({ ok: true, event: after });
}
