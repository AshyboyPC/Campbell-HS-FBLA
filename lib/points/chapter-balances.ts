import type { SupabaseClient } from "@supabase/supabase-js";
import { cordProgress, pointBalances } from "./cord-progress";

// Call only after the portal has verified membership or adviser access. This
// projection exposes the same member identities as the existing safe leaderboard.
export async function readChapterBalances(admin: SupabaseClient, yearId: string) {
  const [requirements, profiles] = await Promise.all([
    admin.from("graduation_requirements").select("graduation_year,required_points")
      .eq("academic_year_id", yearId).eq("published", true),
    readProfiles(admin),
  ]);
  if (requirements.error || !profiles) return null;
  const targets = new Map((requirements.data ?? []).map(row => [row.graduation_year, row.required_points]));
  const rows = [];

  // Batch IDs to keep query URLs short. Page balances in case the chapter has
  // enough historical years to exceed the API's result limit.
  for (let start = 0; start < profiles.length; start += 75) {
    const members = profiles.slice(start, start + 75);
    const byMember = new Map<string, { academic_year_id: string; official_points: number }[]>();
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await admin.from("member_point_totals")
        .select("member_id,academic_year_id,official_points")
        .in("member_id", members.map(member => member.id))
        .order("member_id").order("academic_year_id").range(offset, offset + 499);
      if (error) return null;
      for (const row of data ?? []) {
        const balances = byMember.get(row.member_id) ?? [];
        balances.push(row);
        byMember.set(row.member_id, balances);
      }
      if (!data || data.length < 500) break;
    }

    for (const member of members) {
      const { current, cumulative } = pointBalances(byMember.get(member.id) ?? [], yearId);
      const target = targets.get(member.graduation_year) ?? null;
      rows.push({
        display_name: member.display_name,
        graduation_year: member.graduation_year,
        official_points: current,
        cord_points: cumulative,
        required_points: target,
        cord_progress: cordProgress(cumulative, target),
      });
    }
  }

  rows.sort((a, b) => b.official_points - a.official_points || a.display_name.localeCompare(b.display_name));
  let rank = 0;
  return rows.map((row, index) => {
    if (index === 0 || rows[index - 1].official_points !== row.official_points) rank = index + 1;
    return { ...row, rank };
  });
}

async function readProfiles(admin: SupabaseClient) {
  const profiles: { id: string; display_name: string; graduation_year: number }[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await admin.from("profiles").select("id,display_name,graduation_year")
      .eq("active", true).eq("approved", true).eq("membership_status", "active")
      .neq("account_role", "adviser").not("graduation_year", "is", null)
      .order("id").range(offset, offset + 499);
    if (error) return null;
    profiles.push(...(data ?? []));
    if (!data || data.length < 500) return profiles;
  }
}
