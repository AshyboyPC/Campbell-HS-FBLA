import type { SupabaseClient } from "@supabase/supabase-js";
import { readChapterPointBalances } from "./chapter-balances";

const grades = [9, 10, 11, 12] as const;
type Grade = typeof grades[number];
type Period = "year" | "all-time";

type MemberGrade = { graduation_year: number | null; grade_level: string | null };

function currentGrade(member: MemberGrade, schoolYearEnd: number) {
  const grade = member.graduation_year === null
    ? Number(member.grade_level)
    : 12 + schoolYearEnd - member.graduation_year;
  return grades.find(value => value === grade);
}

export async function loadLeaderboard(
  admin: SupabaseClient | null,
  year: { id: string; end_date: string },
  viewer: MemberGrade & { id: string },
  adviser: boolean,
  query: { period?: string | string[]; grade?: string | string[] },
) {
  const period: Period = query.period === "all-time" ? "all-time" : "year";
  const schoolYearEnd = Number(year.end_date.slice(0, 4));
  const ownGrade = currentGrade(viewer, schoolYearEnd);
  const visibleGrades = adviser ? grades : ownGrade ? [ownGrade] : [];
  const grade = visibleGrades.find(value => String(value) === query.grade);
  const members = admin ? await readChapterPointBalances(admin, year.id) : null;
  const sorted = members
    ?.filter(member => member.graduation_year === null || member.graduation_year >= schoolYearEnd)
    .map(member => ({
      name: member.display_name,
      grade: currentGrade(member, schoolYearEnd),
      points: period === "year" ? member.current : member.cumulative,
      isViewer: member.id === viewer.id,
    }))
    .filter(member => grade === undefined || member.grade === grade)
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  let rank = 0;
  const rows = sorted?.map((row, index) => {
    if (index === 0 || sorted[index - 1].points !== row.points) rank = index + 1;
    return { ...row, rank };
  }) ?? null;
  return { period, grade, visibleGrades, rows };
}

export type LeaderboardData = Awaited<ReturnType<typeof loadLeaderboard>>;
