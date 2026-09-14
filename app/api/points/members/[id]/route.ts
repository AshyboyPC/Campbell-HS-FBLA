import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";

const ADMIN_ROLES = ["admin", "adviser"];
const MEMBERSHIP_STATUSES = ["pending", "active", "inactive", "graduated"];
const DUES_STATUSES = ["not_paid", "pending", "paid", "waived"];
const ACCOUNT_ROLES = ["member", "officer"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePortalRole(ADMIN_ROLES);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Missing member update." }, { status: 400 });

  const { data: before } = await auth.admin.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!before) return NextResponse.json({ error: "Member was not found." }, { status: 404 });
  if (auth.profile.account_role !== "adviser" && ["admin", "adviser"].includes(before.account_role)) {
    return NextResponse.json({ error: "Only the adviser account can change administrator access." }, { status: 403 });
  }

  const update: Record<string, unknown> = {};
  if (typeof body.approved === "boolean") update.approved = body.approved;
  if (typeof body.active === "boolean") update.active = body.active;
  if (body.membershipStatus && MEMBERSHIP_STATUSES.includes(body.membershipStatus)) update.membership_status = body.membershipStatus;
  if (body.duesStatus && DUES_STATUSES.includes(body.duesStatus)) {
    update.dues_status = body.duesStatus;
    update.dues_paid_at = body.duesStatus === "paid" ? (body.duesPaidAt || new Date().toISOString()) : null;
  }
  if (typeof body.approvedAuthEmail === "string") update.approved_auth_email = body.approvedAuthEmail.trim().toLowerCase() || null;
  if (body.accountRole && ACCOUNT_ROLES.includes(body.accountRole)) update.account_role = body.accountRole;
  if (typeof body.officerPosition === "string") update.officer_position = body.officerPosition.trim() || null;
  if (typeof body.membershipTier === "string") update.membership_tier = body.membershipTier.trim() || null;
  if (!Object.keys(update).length) return NextResponse.json({ error: "No supported fields were supplied." }, { status: 400 });

  const { data: after, error } = await auth.admin.from("profiles").update(update).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: "The member update could not be saved." }, { status: 409 });

  if (update.dues_status) {
    const { data: category } = await auth.admin.from("point_categories").select("id,default_points").eq("academic_year_id", auth.year.id).eq("code", "DUES").eq("active", true).maybeSingle();
    if (category?.default_points != null) {
      const { data: existing } = await auth.admin.from("point_transactions").select("points").eq("member_id", id).eq("academic_year_id", auth.year.id).eq("point_category_id", category.id).eq("status", "approved");
      const previousTotal = (existing ?? []).reduce((sum, row) => sum + Number(row.points), 0);
      const desiredTotal = update.dues_status === "paid" ? Number(category.default_points) : 0;
      const delta = desiredTotal - previousTotal;
      if (delta !== 0) await auth.admin.from("point_transactions").insert({
        member_id: id,
        academic_year_id: auth.year.id,
        point_category_id: category.id,
        transaction_type: existing?.length ? (delta < 0 ? "reversal" : "adjustment") : "earned",
        points: delta,
        status: "approved",
        source_type: "dues_verification",
        source_reference: existing?.length ? `dues-adjustment:${auth.year.id}:${id}:${randomUUID()}` : `dues:${auth.year.id}:${id}`,
        description: `${auth.year.label} membership dues ledger recalculation`,
        notes: `Required total ${desiredTotal}; previous active total ${previousTotal}`,
        created_by: auth.profile.id,
        approved_by: auth.profile.id,
        approved_at: new Date().toISOString(),
      });
    }
  }

  await auth.admin.from("audit_log").insert({ actor_profile_id: auth.profile.id, action: "member_record_updated", entity_type: "profile", entity_id: id, academic_year_id: auth.year.id, before_data: before, after_data: after });
  return NextResponse.json({ ok: true, member: after });
}
