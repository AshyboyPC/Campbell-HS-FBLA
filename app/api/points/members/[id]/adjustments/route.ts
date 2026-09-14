import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";

const REVIEWERS = ["secretary", "executive_leadership", "adviser", "admin"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePortalRole(REVIEWERS); if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params; const body = await request.json().catch(() => null); const points = Number(body?.points);
  if (!body?.pointCategoryId || !Number.isFinite(points) || points === 0 || typeof body.description !== "string" || body.description.trim().length < 5) return NextResponse.json({ error: "Choose a category, enter a non-zero adjustment, and explain why." }, { status: 400 });
  const [{ data: member }, { data: category }] = await Promise.all([
    auth.admin.from("profiles").select("id").eq("id",id).eq("approved",true).neq("account_role","adviser").maybeSingle(),
    auth.admin.from("point_categories").select("id").eq("id",body.pointCategoryId).eq("academic_year_id",auth.year.id).eq("active",true).maybeSingle(),
  ]);
  if (!member || !category) return NextResponse.json({ error: "Member or point category was not found." }, { status: 404 });
  const { data, error } = await auth.admin.from("point_transactions").insert({ member_id:id,academic_year_id:auth.year.id,point_category_id:category.id,event_id:body.eventId||null,transaction_type:points<0?"reversal":"adjustment",points,status:"approved",source_type:"leadership_adjustment",source_reference:`adjustment:${id}:${randomUUID()}`,description:body.description.trim(),notes:body.notes?.trim()||null,created_by:auth.profile.id,approved_by:auth.profile.id,approved_at:new Date().toISOString(),reversal_of:body.originalTransactionId||null }).select("*").single();
  if (error) return NextResponse.json({ error: "The ledger adjustment could not be saved." }, { status: 409 });
  await auth.admin.from("audit_log").insert({actor_profile_id:auth.profile.id,action:"point_adjustment_created",entity_type:"point_transaction",entity_id:data.id,academic_year_id:auth.year.id,after_data:data});
  return NextResponse.json({ok:true,transaction:data},{status:201});
}
