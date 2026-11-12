import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const clean = (value: unknown) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
const literal = (value: string) => value.replace(/[\\%_]/g, "\\$&");
const profileFields = "id,auth_user_id,account_role,display_name,approved,active,membership_status";

function matchRequestId(userId: string, profileId: string, email: string, savedEmail: string | null, linkedUser: string | null) {
  const hash = createHash("sha256").update(JSON.stringify([userId, profileId, email, savedEmail, linkedUser])).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-8${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function unavailable() {
  return NextResponse.json({ error: "The portal couldn’t check your record. Please try again." }, { status: 503 });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  if (!supabase || !admin) return unavailable();

  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();
  if (!user || !email || !user.email_confirmed_at) {
    return NextResponse.json({ error: "Sign in and verify your personal email first." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const firstName = clean(body?.firstName);
  const lastName = clean(body?.lastName);
  if ([firstName, lastName].some(value => !value || value.length > 100)) {
    return NextResponse.json({ error: "Enter your first and last name." }, { status: 400 });
  }
  if (clean(body.email).toLowerCase() !== email) {
    return NextResponse.json({ error: "Use the verified email shown here, or sign in with a different address." }, { status: 400 });
  }

  const [allow, identity, linked, exact] = await Promise.all([
    admin.from("portal_access_allowlist").select("account_role,officer_position,display_name").eq("email", email).eq("active", true).maybeSingle(),
    admin.from("external_identity_mappings").select("profile_id").eq("provider", "personal_google").eq("external_identifier", email).maybeSingle(),
    admin.from("profiles").select(profileFields).eq("auth_user_id", user.id).maybeSingle(),
    admin.from("profiles").select(profileFields).eq("approved_auth_email", email).maybeSingle(),
  ]);
  if (allow.error || identity.error || linked.error || exact.error) return unavailable();

  const existingIds = new Set([linked.data?.id, exact.data?.id, identity.data?.profile_id].filter(Boolean));
  if (existingIds.size > 1) {
    return NextResponse.json({ error: "Ask an adviser to resolve the records associated with this email." }, { status: 409 });
  }

  let existing = linked.data ?? exact.data;
  if (!existing && identity.data) {
    const mapped = await admin.from("profiles").select(profileFields).eq("id", identity.data.profile_id).maybeSingle();
    if (mapped.error) return unavailable();
    existing = mapped.data;
  }
  if (existing?.auth_user_id && existing.auth_user_id !== user.id) {
    return NextResponse.json({ error: "Ask an adviser to review your sign-in details." }, { status: 409 });
  }

  if (!existing && !allow.data) {
    const candidates = await admin.from("profiles").select("id,display_name,approved_auth_email,auth_user_id,account_role,active,membership_status")
      .ilike("first_name", literal(firstName)).ilike("last_name", literal(lastName)).limit(2);
    if (candidates.error) return unavailable();

    const candidate = candidates.data?.length === 1 ? candidates.data[0] : null;
    if (candidate?.active && candidate.auth_user_id && candidate.account_role !== "member") {
      return NextResponse.json({
        error: "We found a chapter record for that name. It already has a sign-in email. Use the email on file, or ask an adviser to verify a change.",
      }, { status: 409 });
    }
    if (candidate?.active && candidate.account_role === "member"
        && ["active", "pending"].includes(candidate.membership_status)) {
      const savedEmail = candidate.approved_auth_email;
      const requestId = matchRequestId(user.id, candidate.id, email, savedEmail, candidate.auth_user_id);
      if (!body.confirmMatch) {
        const [local, domain] = savedEmail?.split("@") ?? [];
        const maskedEmail = local && domain ? `${local[0]}•••@${domain[0]}•••` : null;
        return NextResponse.json({ match: {
          name: candidate.display_name,
          requestId,
          maskedEmail,
          hasSavedEmail: Boolean(savedEmail),
        } });
      }
      if (body.confirmMatch === requestId) {
        const saved = await admin.from("audit_log").upsert({
          id: requestId,
          action: "account_match_requested",
          entity_type: "profile",
          entity_id: candidate.id,
          metadata: {
            auth_user_id: user.id,
            email,
            expected_auth_user_id: candidate.auth_user_id,
            expected_email: savedEmail,
          },
        }, { onConflict: "id", ignoreDuplicates: true });
        if (saved.error) return unavailable();
        return NextResponse.json({ matchRequested: true });
      }
    }
    if (body.confirmMatch || candidates.data?.length) {
      return NextResponse.json({ error: "An adviser needs to help find the right chapter record. Contact fbla@campbellhigh.net." }, { status: 409 });
    }
  }

  if (existing) {
    const saved = await admin.from("profiles")
      .update({ auth_user_id: user.id, onboarding_completed: true })
      .eq("id", existing.id).or(`auth_user_id.is.null,auth_user_id.eq.${user.id}`)
      .select("id").maybeSingle();
    if (saved.error || !saved.data) return NextResponse.json({ error: "Your record couldn’t be linked. Ask an adviser for help." }, { status: 409 });
    return NextResponse.json({ redirect: existing.account_role === "adviser" ? "/points/admin/dashboard" : "/points/dashboard" });
  }

  if (body.stage !== "complete") return NextResponse.json({ needsDetails: true });
  const displayName = clean(body.displayName) || `${firstName} ${lastName}`;
  const bandDisplayName = clean(body.bandDisplayName) || displayName;
  const gradeLevel = clean(body.gradeLevel);
  const graduationYear = Number(body.graduationYear);
  const primaryCommittee = clean(body.primaryCommittee) || null;
  if (displayName.length > 200 || bandDisplayName.length > 200 || (primaryCommittee && primaryCommittee.length > 100)
      || !["9", "10", "11", "12"].includes(gradeLevel)
      || !Number.isInteger(graduationYear) || graduationYear < 2026 || graduationYear > 2100) {
    return NextResponse.json({ error: "Enter your grade and graduation year." }, { status: 400 });
  }

  const accountRole = allow.data?.account_role ?? "member";
  const approved = Boolean(allow.data);
  const details = {
    auth_user_id: user.id,
    band_display_name: bandDisplayName,
    primary_committee: primaryCommittee,
    onboarding_completed: true,
  };
  const newProfile = {
    ...details,
    member_id: "",
    first_name: firstName,
    last_name: lastName,
    display_name: allow.data?.display_name ?? displayName,
    approved_auth_email: email,
    graduation_year: accountRole === "adviser" ? null : graduationYear,
    grade_level: accountRole === "adviser" ? null : gradeLevel,
    membership_status: approved ? "active" : "pending",
    account_role: accountRole,
    officer_position: allow.data?.officer_position ?? null,
    active: true,
    approved,
    roster_match_status: accountRole === "adviser" ? "adviser" : allow.data ? "known_member" : "pending_review",
    join_date: new Date().toISOString().slice(0, 10),
  };
  const saved = await admin.from("profiles").insert(newProfile).select("id").single();
  if (saved.error) return NextResponse.json({ error: "Your profile couldn’t be saved. Please try again." }, { status: 409 });

  return NextResponse.json({ approved, redirect: accountRole === "adviser" ? "/points/admin/dashboard" : "/points/dashboard" });
}
