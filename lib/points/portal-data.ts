/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { adminUnlockConfigured, isAdminUnlocked } from "@/lib/points/admin-unlock";

const STAFF = ["adviser", "admin"];
const EXEC = ["adviser", "admin"];
const ADMIN = ["admin", "adviser"];

const participatingLeaderboard = (rows: any[] | null | undefined) => {
  const participants = (rows ?? []).filter(row => row.graduation_year != null);
  let priorPoints: number | null = null;
  let priorRank = 0;
  return participants.map((row, index) => {
    const points = Number(row.official_points ?? 0);
    const rank = priorPoints === points ? priorRank : index + 1;
    priorPoints = points;
    priorRank = rank;
    return { ...row, rank };
  });
};

export type PortalContext = {
  configured: boolean;
  authenticated: boolean;
  profile: any | null;
  year: any | null;
  slug: string;
  authorized: boolean;
  data: Record<string, any>;
  requiresAdminUnlock: boolean;
  adminUnlockConfigured: boolean;
};

export async function loadPortalContext(slug: string): Promise<PortalContext> {
  const empty: PortalContext = { configured: hasSupabaseConfig, authenticated: false, profile: null, year: null, slug, authorized: false, data: {}, requiresAdminUnlock:false, adminUnlockConfigured:adminUnlockConfigured() };
  if (!hasSupabaseConfig) return empty;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return empty;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return empty;
  empty.authenticated = true;
  const [{ data: profile }, { data: year }] = await Promise.all([
    supabase.from("profiles").select("id,member_id,first_name,last_name,display_name,graduation_year,grade_level,membership_status,membership_tier,dues_status,account_role,officer_position,active,approved,join_date,onboarding_completed,band_display_name,primary_committee,roster_match_status").eq("auth_user_id", user.id).maybeSingle(),
    supabase.from("academic_years").select("id,label,start_date,end_date,points_deadline,yearly_goal").eq("is_active", true).maybeSingle(),
  ]);
  empty.profile = profile;
  empty.year = year;
  if (!profile?.approved || !profile?.active || !year || (profile.membership_status !== "active" && !["admin","adviser"].includes(profile.account_role))) return empty;

  const isStaff = STAFF.includes(profile.account_role);
  const isExec = EXEC.includes(profile.account_role);
  const isAdmin = ADMIN.includes(profile.account_role);
  const managementRoute = slug.startsWith("manage/");
  const claimReviewRoute = slug === "manage/point-review";
  const adminRoute = slug.startsWith("admin/") || slug === "admin";
  const officerRoute = slug.startsWith("officer/");
  empty.authorized = adminRoute ? isAdmin : claimReviewRoute ? isExec : managementRoute ? isStaff : officerRoute ? Boolean(profile.officer_position || isStaff) : profile.account_role !== "adviser";
  if (!empty.authorized) return empty;
  if ((managementRoute || adminRoute) && ["admin","adviser"].includes(profile.account_role)) {
    empty.requiresAdminUnlock = !(await isAdminUnlocked(user.id));
    if (empty.requiresAdminUnlock) return empty;
  }

  const data: Record<string, any> = {};
  if (slug === "dashboard") {
    const [{ data: totals }, { data: recent }, { data: attendance }, { data: leaderboard }, { data: requirement }, { data: corrections }, { data: nextEvent }] = await Promise.all([
      supabase.from("member_point_totals").select("official_points,points_earned,adjustments").eq("member_id", profile.id).eq("academic_year_id", year.id).maybeSingle(),
      supabase.from("point_transactions").select("id,points,transaction_type,status,description,created_at,point_categories(name,group_name),events(title)").eq("member_id", profile.id).eq("academic_year_id", year.id).order("created_at", { ascending: false }).limit(6),
      supabase.from("member_attendance").select("id,status,verified,service_hours,created_at,events(title,start_datetime,event_type)").eq("member_id", profile.id).order("created_at", { ascending: false }).limit(5),
      supabase.rpc("get_safe_leaderboard", { p_academic_year_id: year.id }),
      supabase.from("graduation_requirements").select("required_points").eq("academic_year_id", year.id).eq("graduation_year", profile.graduation_year).eq("published", true).maybeSingle(),
      supabase.from("correction_requests").select("id,status,issue_type,created_at").eq("member_id", profile.id).not("status", "in", "(resolved,rejected)").order("created_at", { ascending: false }).limit(3),
      supabase.from("events").select("id,title,start_datetime,event_type,location,point_categories(name,default_points,points_per_unit,max_points)").eq("academic_year_id", year.id).eq("active", true).gte("start_datetime", new Date().toISOString()).order("start_datetime").limit(1).maybeSingle(),
    ]);
    data.totals = totals ?? { official_points: 0, points_earned: 0, adjustments: 0 };
    data.recent = recent ?? [];
    data.attendance = attendance ?? [];
    data.leaderboard = participatingLeaderboard(leaderboard);
    data.rank = data.leaderboard.find((row: any) => row.is_current_member)?.rank ?? null;
    data.requirement = requirement;
    data.corrections = corrections ?? [];
    data.nextEvent = nextEvent;
  } else if (slug === "leaderboard") {
    const { data: rows } = await supabase.rpc("get_safe_leaderboard", { p_academic_year_id: year.id }); data.rows = participatingLeaderboard(rows);
  } else if (slug === "attendance") {
    const { data: rows } = await supabase.from("member_attendance").select("id,status,verified,service_hours,source_type,check_in_timestamp,events(title,start_datetime,event_type,required_for_members)").eq("member_id", profile.id).order("check_in_timestamp", { ascending: false }); data.rows = rows ?? [];
  } else if (slug === "history") {
    const { data: rows } = await supabase.from("point_transactions").select("id,points,transaction_type,status,source_type,description,created_at,point_categories(name,group_name),events(title)").eq("member_id", profile.id).eq("academic_year_id", year.id).order("created_at", { ascending: false }); data.rows = rows ?? [];
  } else if (slug === "claims") {
    const [{ data: rows }, { data: categories }, { data: events }] = await Promise.all([
      supabase.from("point_claims").select("id,activity_date,quantity,member_description,evidence_url,status,calculated_points,reviewer_notes,created_at,point_categories(name,calculation_type,default_points,points_per_unit,max_points),events(title)").eq("member_id",profile.id).eq("academic_year_id",year.id).order("created_at",{ascending:false}),
      supabase.from("point_categories").select("id,name,calculation_type,default_points,points_per_unit,max_points").eq("academic_year_id",year.id).eq("self_reportable",true).eq("active",true).eq("published",true).order("sort_order"),
      supabase.from("events").select("id,title,start_datetime").eq("academic_year_id",year.id).eq("active",true).order("start_datetime",{ascending:false}).limit(100),
    ]);data.rows=rows??[];data.categories=categories??[];data.events=events??[];
  } else if (slug === "rules") {
    const [{ data: rules }, { data: requirement }] = await Promise.all([
      supabase.from("point_categories").select("id,code,name,description,group_name,calculation_type,default_points,points_per_unit,max_points,max_occurrences,repeatable,approval_required,source_document,source_version").eq("academic_year_id", year.id).eq("published", true).eq("active", true).order("sort_order"),
      supabase.from("graduation_requirements").select("required_points,notes").eq("academic_year_id", year.id).eq("graduation_year", profile.graduation_year).eq("published", true).maybeSingle(),
    ]); data.rules = rules ?? []; data.requirement = requirement;
  } else if (slug === "corrections") {
    const [{ data: rows }, { data: events }] = await Promise.all([
      supabase.from("correction_requests").select("id,issue_type,description,status,activity_date,created_at,resolved_at,events(title)").eq("member_id", profile.id).order("created_at", { ascending: false }),
      supabase.from("events").select("id,title,start_datetime").eq("academic_year_id", year.id).order("start_datetime", { ascending: false }).limit(50),
    ]); data.rows = rows ?? []; data.events = events ?? [];
  } else if (slug === "officer/status") {
    const [{ data: attendance }, { data: actions }, { data: requests }, { data: policyTx }] = await Promise.all([
      supabase.from("officer_attendance").select("id,status,late_minutes,early_departure_minutes,attendance_evidence_status,first_join_at,last_leave_at,events(title,start_datetime)").eq("officer_id", profile.id).eq("academic_year_id", year.id).order("created_at", { ascending: false }),
      supabase.from("officer_accountability_actions").select("id,threshold,action_type,action_label,status,issued_at,review_date").eq("officer_id", profile.id).eq("academic_year_id", year.id).order("threshold", { ascending: false }),
      supabase.from("officer_absence_requests").select("id,status,notice_given_at,handoff_required,events(title,start_datetime)").eq("officer_id", profile.id).order("created_at", { ascending: false }),
      supabase.from("point_transactions").select("points,created_at,point_categories!inner(code)").eq("member_id", profile.id).eq("academic_year_id", year.id).eq("point_categories.code", "OFFICER_ATTENDANCE_POLICY").eq("status", "approved"),
    ]); data.attendance=attendance??[];data.actions=actions??[];data.requests=requests??[];data.policyTotal=(policyTx??[]).reduce((sum:number,row:any)=>sum+Number(row.points),0);
  } else if (slug === "officer/absence-request") {
    const { data: events } = await supabase.from("events").select("id,title,start_datetime").eq("academic_year_id",year.id).eq("required_for_officers",true).gte("start_datetime",new Date().toISOString()).order("start_datetime").limit(30); data.events=events??[];
  } else if (slug.startsWith("manage/members/")) {
    const memberId=slug.split("/")[2];
    const [{data:member},{data:totals},{data:attendance},{data:transactions},{data:claims},{data:categories}]=await Promise.all([
      supabase.from("profiles").select("id,member_id,display_name,graduation_year,membership_status,membership_tier,dues_status,account_role,officer_position,approved,active,join_date").eq("id",memberId).maybeSingle(),
      supabase.from("member_point_totals").select("official_points,points_earned,adjustments").eq("member_id",memberId).eq("academic_year_id",year.id).maybeSingle(),
      supabase.from("member_attendance").select("id,status,verified,service_hours,source_type,check_in_timestamp,events(title,start_datetime,event_type)").eq("member_id",memberId).order("check_in_timestamp",{ascending:false}),
      supabase.from("point_transactions").select("id,points,status,source_type,description,created_at,point_categories(name),events(title)").eq("member_id",memberId).eq("academic_year_id",year.id).order("created_at",{ascending:false}),
      supabase.from("point_claims").select("id,status,activity_date,quantity,calculated_points,member_description,point_categories(name)").eq("member_id",memberId).eq("academic_year_id",year.id).order("created_at",{ascending:false}),
      supabase.from("point_categories").select("id,name").eq("academic_year_id",year.id).eq("active",true).order("sort_order"),
    ]);data.member=member;data.totals=totals;data.attendance=attendance??[];data.transactions=transactions??[];data.claims=claims??[];data.categories=categories??[];
  } else if (slug === "manage/members") {
    const { data: rows } = await supabase.from("profiles").select("id,member_id,display_name,graduation_year,membership_status,membership_tier,dues_status,account_role,officer_position,approved,active").neq("account_role","adviser").order("display_name"); data.rows=rows??[];
  } else if (slug === "manage/events" || slug.startsWith("manage/events/")) {
    const [{ data: rows }, { data: categories }] = await Promise.all([
      supabase.from("events").select("id,event_code,title,event_type,start_datetime,end_datetime,location,required_for_members,required_for_officers,attendance_source,active").eq("academic_year_id",year.id).order("start_datetime",{ascending:false}),
      supabase.from("point_categories").select("id,name").eq("academic_year_id",year.id).eq("active",true).order("sort_order"),
    ]);data.rows=rows??[];data.categories=categories??[];
  } else if (slug === "manage/attendance-review") {
    const [{ data: rows }, { data: corrections }] = await Promise.all([
      supabase.from("attendance_imports").select("id,source_type,submitted_at,submitted_name,submitted_email,event_code,status,review_reason,created_at").eq("academic_year_id",year.id).in("status",["unmatched_member","unmatched_event","duplicate","outside_window","pending_review"]).order("created_at",{ascending:false}),
      supabase.from("correction_requests").select("id,issue_type,description,status,created_at,profiles!correction_requests_member_id_fkey(display_name),events(title)").eq("academic_year_id",year.id).in("status",["submitted","under_review"]).order("created_at"),
    ]);data.rows=rows??[];data.corrections=corrections??[];
  } else if (slug === "manage/point-review") {
    const { data: rows } = await supabase.from("point_claims").select("id,activity_date,quantity,member_description,evidence_url,status,created_at,profiles!point_claims_member_id_fkey(member_id,display_name),point_categories(name,calculation_type,default_points,points_per_unit,max_points),events(title)").eq("academic_year_id",year.id).in("status",["submitted","under_review"]).order("created_at");data.rows=rows??[];
  } else if (slug === "manage/officer-team") {
    const { data: rows } = await supabase.from("profiles").select("id,member_id,display_name,officer_position,account_role,active").not("officer_position","is",null).order("display_name");data.rows=rows??[];
  } else if (slug === "manage/officer-attendance") {
    const [{ data: rows }, { data: requests }] = await Promise.all([
      supabase.from("officer_attendance").select("id,status,attendance_evidence_status,first_join_at,last_leave_at,late_minutes,early_departure_minutes,profiles!officer_attendance_officer_id_fkey(display_name),events(title,start_datetime)").eq("academic_year_id",year.id).order("created_at",{ascending:false}),
      isExec ? supabase.from("officer_absence_requests").select("id,reason,notice_given_at,handoff_required,handoff_plan,status,profiles!officer_absence_requests_officer_id_fkey(display_name),events(title,start_datetime)").eq("status","pending").order("created_at") : Promise.resolve({data:[]}),
    ]);data.rows=rows??[];data.requests=requests??[];
  } else if (slug === "manage/imports") {
    const { data: rows } = await supabase.from("import_batches").select("id,import_type,source_type,filename,status,row_count,ready_count,duplicate_count,unmatched_count,conflict_count,created_at").eq("academic_year_id",year.id).order("created_at",{ascending:false});data.rows=rows??[];
  } else if (slug === "admin/dashboard" || slug === "admin") {
    const [{count:members},{count:pendingMembers},{count:pendingClaims},{count:pendingCorrections},{data:reviewers}]=await Promise.all([
      supabase.from("profiles").select("id",{count:"exact",head:true}).eq("approved",true).eq("active",true).eq("membership_status","active").neq("account_role","adviser"),
      supabase.from("profiles").select("id",{count:"exact",head:true}).eq("approved",false),
      supabase.from("point_claims").select("id",{count:"exact",head:true}).in("status",["submitted","under_review"]),
      supabase.from("correction_requests").select("id",{count:"exact",head:true}).in("status",["submitted","under_review"]),
      supabase.from("profiles").select("id,member_id,display_name,account_role,officer_position,active").in("account_role",["admin","adviser"]).order("account_role"),
    ]);data.members=members??0;data.pendingMembers=pendingMembers??0;data.pendingClaims=pendingClaims??0;data.pendingCorrections=pendingCorrections??0;data.reviewers=reviewers??[];
  } else if (slug === "admin/point-rules") {
    const { data: rows } = await supabase.from("point_categories").select("*").eq("academic_year_id",year.id).order("sort_order");data.rows=rows??[];
  } else if (slug === "admin/cord-rules") {
    const { data: rows } = await supabase.from("graduation_requirements").select("*").eq("academic_year_id",year.id).order("graduation_year");data.rows=rows??[];
  } else if (slug === "admin/officer-policy") {
    const { data: rows } = await supabase.from("officer_policy_thresholds").select("*").eq("academic_year_id",year.id).order("threshold");data.rows=rows??[];
  } else if (slug === "admin/audit") {
    const { data: rows } = await supabase.from("audit_log").select("id,action,entity_type,entity_id,metadata,created_at,profiles(display_name)").order("created_at",{ascending:false}).limit(200);data.rows=rows??[];
  }
  empty.data = data;
  return empty;
}
