import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";
import { extractGoogleResourceId, googleSyncConfigured } from "@/lib/points/google-workspace";

export async function GET() {
  const access = await requirePortalRole(["adviser"]);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  const { data, error } = await access.admin.from("sync_connections").select("id,purpose,provider,display_name,status,external_resource_id,worksheet_name,field_mapping,last_synced_at,last_error,active").order("purpose");
  if (error) return NextResponse.json({ error: "Sync storage has not been migrated yet." }, { status: 503 });
  return NextResponse.json({ connections: data ?? [], credentialsConfigured: googleSyncConfigured() });
}

export async function PATCH(request: Request) {
  const access = await requirePortalRole(["adviser"]);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  const body = await request.json().catch(() => null) as null | { purpose?: string; resource?: string; worksheetName?: string; fieldMapping?: Record<string, string>; active?: boolean };
  if (!body || !["attendance_source", "adviser_ledger"].includes(body.purpose ?? "") || typeof body.resource !== "string") return NextResponse.json({ error: "A valid sync purpose and Google resource are required." }, { status: 400 });
  const kind = body.purpose === "attendance_source" ? "form" : "sheet";
  const resourceId = extractGoogleResourceId(body.resource, kind);
  if (!resourceId) return NextResponse.json({ error: `Enter a valid Google ${kind === "form" ? "Form" : "Sheet"} URL or ID.` }, { status: 400 });
  const status = googleSyncConfigured() ? "ready" : "needs_configuration";
  const { data, error } = await access.admin.from("sync_connections").update({
    external_resource_id: resourceId,
    worksheet_name: kind === "sheet" ? body.worksheetName?.trim() || "Members" : null,
    field_mapping: body.fieldMapping ?? (kind === "form" ? { eventCode:"Event code", studentEmail:"Email Address", memberId:"FBLA member ID", studentName:"Name", serviceHours:"Service hours" } : {}),
    active: body.active ?? true,
    status,
    updated_by: access.profile.id,
    updated_at: new Date().toISOString(),
    last_error: status === "ready" ? null : "Server Google credentials still need to be configured.",
  }).eq("purpose", body.purpose).select("id,purpose,provider,display_name,status,worksheet_name,last_synced_at,last_error,active").single();
  if (error) return NextResponse.json({ error: "The sync connection could not be saved." }, { status: 500 });
  await access.admin.from("audit_log").insert({ action: "sync_connection_updated", entity_type: "sync_connection", entity_id: data.id, academic_year_id: access.year.id, actor_profile_id: access.profile.id, after_data: { purpose: body.purpose, status, resourceConfigured: true } });
  return NextResponse.json({ connection: data });
}
