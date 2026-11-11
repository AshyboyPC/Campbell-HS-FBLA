import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/points/api-auth";

function conflict(error: string) {
  return NextResponse.json({ error }, { status: 409 });
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePortalRole(["adviser"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const request = await auth.admin.from("audit_log").select("entity_id,metadata")
    .eq("id", id).eq("action", "account_match_requested").eq("entity_type", "profile").maybeSingle();
  const memberId = request.data?.entity_id;
  const userId = request.data?.metadata?.auth_user_id;
  const email = request.data?.metadata?.email;
  if (!memberId || typeof userId !== "string" || typeof email !== "string") {
    return conflict("This account request is no longer available.");
  }

  const [account, allowlist, mapping] = await Promise.all([
    auth.admin.auth.admin.getUserById(userId),
    auth.admin.from("portal_access_allowlist").select("email").eq("email", email).eq("active", true).maybeSingle(),
    auth.admin.from("external_identity_mappings").select("profile_id").eq("provider", "personal_google").eq("external_identifier", email).maybeSingle(),
  ]);
  const user = account.data.user;
  if (account.error || allowlist.error || mapping.error || !user?.email_confirmed_at || user.email?.toLowerCase() !== email) {
    return conflict("The requested email could not be verified. Ask the member to sign in again.");
  }
  if (allowlist.data || (mapping.data && mapping.data.profile_id !== memberId)) {
    return conflict("This email is already assigned. Review the existing account before linking it.");
  }

  // A match cannot take over an existing login or change the member's role or approval.
  const linked = await auth.admin.from("profiles")
    .update({ auth_user_id: userId, approved_auth_email: email, roster_match_status: "known_member" })
    .eq("id", memberId).eq("active", true).eq("account_role", "member")
    .in("membership_status", ["active", "pending"]).is("auth_user_id", null)
    .select("id").maybeSingle();
  if (linked.error || !linked.data) return conflict("This record could not be linked. Check whether either account is already in use.");

  const audit = await auth.admin.from("audit_log").insert({
    actor_profile_id: auth.profile.id,
    academic_year_id: auth.year.id,
    action: "account_match_linked",
    entity_type: "profile",
    entity_id: memberId,
    metadata: { request_id: id },
  });
  if (audit.error) console.error("Could not record account match review", audit.error.code);
  return NextResponse.json({ ok: true });
}
