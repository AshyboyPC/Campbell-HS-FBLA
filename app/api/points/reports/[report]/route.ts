/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { readChapterBalances } from "@/lib/points/chapter-balances";
import { requirePortalRole } from "@/lib/points/api-auth";

const STAFF = ["adviser"];
const EXEC = ["adviser"];

const csvCell = (value: unknown) => {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const csv = (headers: string[], rows: unknown[][]) => [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
const download = (name: string, headers: string[], rows: unknown[][]) => new NextResponse(csv(headers, rows), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}.csv"`, "Cache-Control": "private, no-store" } });

export async function GET(_: Request, { params }: { params: Promise<{ report: string }> }) {
  const { report } = await params;
  const auth = await requirePortalRole(["officer-attendance", "point-claims"].includes(report) ? EXEC : STAFF);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  if (report === "member-totals") {
    const [{ data: totals }, { data: profiles }] = await Promise.all([
      auth.admin.from("member_point_totals").select("member_id,official_points,points_earned,adjustments").eq("academic_year_id", auth.year.id).order("official_points", { ascending: false }),
      auth.admin.from("profiles").select("id,member_id,display_name,graduation_year,account_role").neq("account_role","adviser"),
    ]);
    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const rows = (totals ?? []).map((r: any) => { const p: any = profileMap.get(r.member_id); return [p?.member_id, p?.display_name, p?.graduation_year, r.official_points, r.points_earned, r.adjustments]; });
    return download("campbell-fbla-member-point-totals", ["Member ID", "Member", "Graduation Year", "Official Points", "Points Earned", "Adjustments"], rows);
  }
  if (report === "point-ledger") {
    const { data } = await auth.admin.from("point_transactions").select("created_at,points,transaction_type,status,source_type,description,profiles!point_transactions_member_id_fkey(member_id,display_name),point_categories(name),events(title)").eq("academic_year_id", auth.year.id).order("created_at", { ascending: false });
    return download("campbell-fbla-point-ledger", ["Created", "Member ID", "Member", "Activity", "Category", "Type", "Points", "Status", "Source"], (data ?? []).map((r: any) => [r.created_at, r.profiles?.member_id, r.profiles?.display_name, r.events?.title || r.description, r.point_categories?.name, r.transaction_type, r.points, r.status, r.source_type]));
  }
  if (["chapter-attendance", "event-attendance", "service-hours"].includes(report)) {
    const query = auth.admin.from("member_attendance").select("status,check_in_timestamp,verified,service_hours,source_type,profiles!member_attendance_member_id_fkey(member_id,display_name),events!inner(title,event_type,start_datetime,academic_year_id)").eq("events.academic_year_id", auth.year.id).order("check_in_timestamp", { ascending: false });
    const { data } = await query;
    const filtered = (data ?? []).filter((r: any) => report === "chapter-attendance" ? r.events?.event_type === "chapter_meeting" : report === "service-hours" ? Number(r.service_hours) > 0 : true);
    return download(`campbell-fbla-${report}`, ["Event Date", "Event", "Member ID", "Member", "Status", "Verified", "Service Hours", "Source"], filtered.map((r: any) => [r.events?.start_datetime, r.events?.title, r.profiles?.member_id, r.profiles?.display_name, r.status, r.verified, r.service_hours, r.source_type]));
  }
  if (["leaderboard", "cord-progress"].includes(report)) {
    const balances = await readChapterBalances(auth.admin, auth.year.id);
    if (!balances) return NextResponse.json({ error: "Point balances are temporarily unavailable." }, { status: 503 });
    const rows = balances.map(row => [row.rank, row.display_name, row.graduation_year, row.official_points,
      row.cord_points, row.required_points, row.cord_progress]);
    return download(`campbell-fbla-${report}`, ["Rank", "Member", "Graduation Year", `${auth.year.label} Points`,
      "Points Toward Cord (All Years)", "Required Points", "Cord Progress Percent"], rows);
  }
  if (report === "officer-attendance") {
    const { data } = await auth.admin.from("officer_attendance").select("status,attendance_evidence_status,late_minutes,early_departure_minutes,classified_at,profiles!officer_attendance_officer_id_fkey(member_id,display_name,officer_position),events(title,start_datetime)").eq("academic_year_id", auth.year.id).order("created_at", { ascending: false });
    return download("campbell-fbla-officer-attendance", ["Meeting Date", "Meeting", "Member ID", "Officer", "Position", "Classification", "Evidence", "Late Minutes", "Early Departure Minutes", "Classified At"], (data ?? []).map((r: any) => [r.events?.start_datetime, r.events?.title, r.profiles?.member_id, r.profiles?.display_name, r.profiles?.officer_position, r.status, r.attendance_evidence_status, r.late_minutes, r.early_departure_minutes, r.classified_at]));
  }
  if (report === "point-claims") {
    const { data } = await auth.admin.from("point_claims").select("activity_date,quantity,member_description,evidence_url,status,calculated_points,reviewer_notes,created_at,reviewed_at,profiles!point_claims_member_id_fkey(member_id,display_name),point_categories(name),events(title)").eq("academic_year_id",auth.year.id).order("created_at",{ascending:false});
    return download("campbell-fbla-member-point-claims",["Submitted","Activity Date","Member ID","Member","Category","Event","Description","Claimed Amount","Status","Approved Points","Reviewed At","Reviewer Notes","Evidence"],(data??[]).map((r:any)=>[r.created_at,r.activity_date,r.profiles?.member_id,r.profiles?.display_name,r.point_categories?.name,r.events?.title,r.member_description,r.quantity,r.status,r.calculated_points,r.reviewed_at,r.reviewer_notes,r.evidence_url]));
  }
  return NextResponse.json({ error: "Unknown report." }, { status: 404 });
}
