import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const clean = (value: unknown) => String(value ?? "").trim().replace(/\s+/g, " ");

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient(); const admin = createSupabaseAdminClient();
  if (!supabase || !admin) return NextResponse.json({ error: "Member Portal is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser(); const email = user?.email?.toLowerCase();
  if (!user || !email) return NextResponse.json({ error: "Sign in with the personal Google account used for FBLA Connect." }, { status: 403 });
  const body = await request.json().catch(() => null); if (!body) return NextResponse.json({ error: "Missing onboarding information." }, { status: 400 });
  const firstName=clean(body.firstName),lastName=clean(body.lastName),displayName=clean(body.displayName),bandDisplayName=clean(body.bandDisplayName),gradeLevel=clean(body.gradeLevel),primaryCommittee=clean(body.primaryCommittee)||null;
  const graduationYear=Number(body.graduationYear);
  if(!firstName||!lastName||!displayName||!bandDisplayName||!["9","10","11","12"].includes(gradeLevel)||!Number.isInteger(graduationYear)) return NextResponse.json({error:"Complete every required field."},{status:400});

  const [{ data: allow }, { data: identity }] = await Promise.all([
    admin.from("portal_access_allowlist").select("account_role,officer_position,display_name").eq("email",email).eq("active",true).maybeSingle(),
    admin.from("external_identity_mappings").select("profile_id").eq("provider","personal_google").eq("external_identifier",email).maybeSingle(),
  ]);
  const {data:existing}=await admin.from("profiles").select("id,member_id,account_role,officer_position,display_name,approved,active,membership_status,approved_auth_email").or(`auth_user_id.eq.${user.id},approved_auth_email.eq.${email}${identity?.profile_id?`,id.eq.${identity.profile_id}`:""}`).maybeSingle();
  // Personal-email access is approved only by an exact pre-existing FBLA Connect
  // email match or an adviser-maintained allowlist entry. Typed names never grant access.
  const role=allow?.account_role || existing?.account_role || "member";
  const approved=Boolean(allow||(existing?.approved&&existing?.active)); const adviser=role==="adviser";
  const record={auth_user_id:user.id,first_name:firstName,last_name:lastName,display_name:adviser?(allow?.display_name||existing?.display_name||displayName):displayName,school_email:null,approved_auth_email:existing?.approved_auth_email||null,graduation_year:adviser?null:graduationYear,grade_level:adviser?null:gradeLevel,membership_status:approved?(existing?.membership_status||"active"):"pending",account_role:role,officer_position:allow?.officer_position||existing?.officer_position||null,active:true,approved,band_display_name:bandDisplayName,primary_committee:primaryCommittee,onboarding_completed:true,roster_match_status:allow?(adviser?"adviser":"administrator"):(existing?"known_member":"pending_review"),join_date:new Date().toISOString().slice(0,10)};
  const operation=existing?admin.from("profiles").update(record).eq("id",existing.id):admin.from("profiles").insert({...record,member_id:""});
  const { data:linked,error }=await operation.select("id").single(); if(error) return NextResponse.json({error:"Your profile could not be linked. Ask an adviser to check for a duplicate roster record."},{status:409});
  await admin.from("external_identity_mappings").upsert({profile_id:linked.id,provider:"personal_google",external_identifier:email},{onConflict:"provider,external_identifier"});
  return NextResponse.json({approved,redirect:adviser?"/points/admin/dashboard":"/points/dashboard"});
}
