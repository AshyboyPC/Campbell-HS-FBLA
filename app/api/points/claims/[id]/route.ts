import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";

const REVIEWERS = ["secretary", "executive_leadership", "adviser", "admin"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePortalRole(REVIEWERS); if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params; const body = await request.json().catch(() => null);
  if (!body || !["under_review", "approved", "rejected"].includes(body.decision)) return NextResponse.json({ error: "Choose review, approve, or reject." }, { status: 400 });
  const verifiedQuantity = body.verifiedQuantity === "" || body.verifiedQuantity == null ? null : Number(body.verifiedQuantity);
  if (verifiedQuantity !== null && (!Number.isFinite(verifiedQuantity) || verifiedQuantity <= 0)) return NextResponse.json({ error: "Verified quantity must be positive." }, { status: 400 });
  const { data, error } = await auth.admin.rpc("review_point_claim", { p_claim_id: id, p_actor_id: auth.profile.id, p_decision: body.decision, p_verified_quantity: verifiedQuantity, p_reviewer_notes: body.notes?.trim() || null });
  if (error) return NextResponse.json({ error: error.message || "The claim decision could not be saved." }, { status: 409 });
  return NextResponse.json({ ok: true, result: data });
}
