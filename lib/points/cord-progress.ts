type YearBalance = { academic_year_id: string; official_points: number | string };

export function pointBalances(rows: YearBalance[], currentYearId: string) {
  let current = 0;
  let cumulative = 0;
  for (const row of rows) {
    const points = Number(row.official_points);
    cumulative += points;
    if (row.academic_year_id === currentYearId) current += points;
  }
  return { current: Number(current.toFixed(2)), cumulative: Number(cumulative.toFixed(2)) };
}

export function cordProgress(points: number, target: number | null | undefined) {
  if (!target || target < 0) return null;
  return Math.min(100, Math.max(0, Math.floor(points / target * 100)));
}
