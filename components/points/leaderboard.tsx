import Link from "next/link";
import type { LeaderboardData } from "@/lib/points/leaderboard";
import styles from "./leaderboard.module.css";

const gradeLabels = { 9: "9th grade", 10: "10th grade", 11: "11th grade", 12: "12th grade" };

export function Leaderboard({ data, year, adviser }: { data: LeaderboardData; year: string; adviser: boolean }) {
  const { grade, period, visibleGrades, rows } = data;
  const yearLabel = year.replace(/^(\d{4})-\d{2}(\d{2})$/, "$1–$2");
  const scope = grade ? gradeLabels[grade] : "Chapter";
  const ownRow = rows?.find(row => row.isViewer);

  function href(nextPeriod: LeaderboardData["period"], nextGrade: LeaderboardData["grade"]) {
    const query = new URLSearchParams();
    if (nextPeriod === "all-time") query.set("period", nextPeriod);
    if (nextGrade) query.set("grade", String(nextGrade));
    const search = query.toString();
    return search ? `/points/leaderboard?${search}` : "/points/leaderboard";
  }

  return (
    <section className={styles.board} aria-labelledby="standings-title">
      <div className={styles.filters}>
        <nav aria-label="Ranking period">
          <Link href={href("year", grade)} aria-current={period === "year" ? "page" : undefined}>{yearLabel}</Link>
          <Link href={href("all-time", grade)} aria-current={period === "all-time" ? "page" : undefined}>All time</Link>
        </nav>
        {visibleGrades.length > 0 && (
          <nav aria-label="Ranking group">
            <Link href={href(period, undefined)} aria-current={grade === undefined ? "page" : undefined}>Chapter</Link>
            {visibleGrades.map(value => (
              <Link key={value} href={href(period, value)} aria-current={grade === value ? "page" : undefined}>
                {adviser ? gradeLabels[value] : "My grade"}
              </Link>
            ))}
          </nav>
        )}
      </div>
      <header className={styles.summary}>
        <div>
          <h2 id="standings-title">{scope} standings</h2>
          <p>{period === "year"
            ? `Current members ranked by approved points earned in ${yearLabel}.`
            : "Current members ranked by approved points across all school years."}
            {period === "all-time" && grade ? " Groups use each member’s current grade." : ""}
          </p>
        </div>
        {ownRow && <div className={styles.position}><span>Your rank</span><strong>#{ownRow.rank}</strong><span>of {rows?.length}</span></div>}
      </header>
      {rows?.length ? (
        <table className={styles.standings} aria-labelledby="standings-title">
          <thead><tr><th scope="col">Rank</th><th scope="col">Member</th><th scope="col">{period === "year" ? "Year points" : "All-time points"}</th></tr></thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className={row.isViewer ? styles.ownRow : undefined}>
                <td><span className={styles.rank}>#{row.rank}</span></td>
                <th scope="row">{row.name}{row.isViewer && <span className={styles.you}>You</span>}</th>
                <td>{row.points.toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className={styles.empty}>{rows === null ? "Rankings are temporarily unavailable." : "No eligible members in this group yet."}</p>}
    </section>
  );
}
