import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const clean = (value: unknown) => String(value ?? "").trim().replace(/\s+/g, " ");
const normalized = (value: string) => clean(value).toLowerCase().replace(/[^a-z0-9 ]/g, "");

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient(); const admin = createSupabaseAdminClient();
  if (!supabase || !admin) return NextResponse.json({ error: "Member Portal is not configured." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser(); const email = user?.email?.toLowerCase();
  if (!user || !email || !/^(?:[a-z0-9]+\.[a-z0-9]+|fbla)@campbellhigh\.net$/.test(email)) return NextResponse.json({ error: "Use first.last@campbellhigh.net or the official adviser account." }, { status: 403 });
  const body = await request.json().catch(() => null); if (!body) return NextResponse.json({ error: "Missing onboarding information." }, { status: 400 });
  const firstName=clean(body.firstName),lastName=clean(body.lastName),displayName=clean(body.displayName),bandDisplayName=clean(body.bandDisplayName),gradeLevel=clean(body.gradeLevel),primaryCommittee=clean(body.primaryCommittee)||null;
  const graduationYear=Number(body.graduationYear);
  if(!firstName||!lastName||!displayName||!bandDisplayName||!["9","10","11","12"].includes(gradeLevel)||!Number.isInteger(graduationYear)) return NextResponse.json({error:"Complete every required field."},{status:400});

  const [{ data: allow }, { data: roster }] = await Promise.all([
    admin.from("portal_access_allowlist").select("account_role,officer_position,display_name").eq("email",email).eq("active",true).maybeSingle(),
    admin.from("band_roster_members").select("id,canonical_name,aliases,roster_kind,officer_position,grade_level").eq("active",true),
  ]);
  // Automatic approval uses only the identity proven by the school email—not a name typed into this form.
  const candidates = new Set([normalized(email.split("@")[0].replaceAll("."," "))]);
  const matches=(roster??[]).filter(row=>(row.aliases??[]).some((alias:string)=>candidates.has(normalized(alias)))||candidates.has(normalized(row.canonical_name)));
  const match=matches.length===1?matches[0]:null;
  const role=allow?.account_role || (match?.roster_kind==="officer"?"officer":"member");
  const approved=Boolean(allow||match); const adviser=role==="adviser";
  const record={auth_user_id:user.id,first_name:firstName,last_name:lastName,display_name:adviser?(allow?.display_name||displayName):displayName,school_email:email,approved_auth_email:email,graduation_year:adviser?null:graduationYear,grade_level:adviser?null:gradeLevel,membership_status:approved?"active":"pending",account_role:role,officer_position:allow?.officer_position||match?.officer_position||null,active:true,approved,band_display_name:bandDisplayName,primary_committee:primaryCommittee,onboarding_completed:true,roster_match_status:allow?(adviser?"adviser":"administrator"):(match?"known_member":"pending_review"),join_date:new Date().toISOString().slice(0,10)};
  const { data: existing }=await admin.from("profiles").select("id,member_id").or(`auth_user_id.eq.${user.id},approved_auth_email.eq.${email},school_email.eq.${email}`).maybeSingle();
  const operation=existing?admin.from("profiles").update(record).eq("id",existing.id):admin.from("profiles").insert({...record,member_id:""});
  const { error }=await operation; if(error) return NextResponse.json({error:"Your profile could not be linked. Ask an adviser to check for a duplicate roster record."},{status:409});
  return NextResponse.json({approved,redirect:adviser?"/points/admin/dashboard":"/points/dashboard"});
}
