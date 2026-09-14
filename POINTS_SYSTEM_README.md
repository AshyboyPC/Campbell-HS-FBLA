# Campbell FBLA Member Portal

The Member Portal is a private, Supabase-backed attendance and points system for Campbell FBLA. Members can read their own approved records, published rules, corrections, and the privacy-safe leaderboard. Members cannot award, edit, or delete official points.

## 2026–27 policy source

The 2026–27 database seed uses the Campbell point schedule from 2025–26 **unchanged**, as explicitly confirmed by the chapter on September 9, 2026. Every seeded rule is year-scoped and carries this source version in the database:

`2025-2026 schedule confirmed unchanged for 2026-2027 on 2026-09-09`

The officer attendance policy is separately versioned as effective August 28, 2026. Its deductions are cumulative totals, not stacked penalties:

- 0 unexcused: 0
- 1–2 unexcused: −5 total
- 3–4 unexcused: −10 total
- 5–6 unexcused: −15 total
- 7 or more: −20 total and a human removal review flag

If a classification is corrected, the immutable ledger receives only the difference. The software never automatically removes or demotes an officer.

## Architecture

- Supabase Auth with verified email magic links
- PostgreSQL tables, triggers, immutable point ledger, and audit log
- Row Level Security for member, officer, and secured administrator roles
- Google Forms and Microsoft Forms normalized attendance webhook
- CSV preview/confirm imports for membership, general attendance, Teams evidence, and historical points
- Provider-neutral event records and configurable point categories
- Authorized CSV reports

## Routes

- `/points` — public portal introduction
- `/points/login` — verified email sign-in
- `/points/dashboard` — private member dashboard
- `/points/leaderboard`, `/attendance`, `/history`, `/rules`, `/corrections`
- `/points/claims` — member submission for eligible non-attendance activities
- `/points/officer/status`, `/points/officer/absence-request`
- `/points/manage/*` — role-controlled chapter operations
- `/points/admin/*` — secured administrator policy and audit screens

## Setup

Follow [docs/member-portal-supabase-setup.md](docs/member-portal-supabase-setup.md). The migrations do not seed member names, private emails, attendance, or point totals.

Integration guides:

- [Google Forms attendance](docs/google-forms-attendance.md)
- [Microsoft Forms attendance](docs/microsoft-forms-attendance.md)
- [Microsoft Teams attendance](docs/microsoft-teams-attendance.md)

## Safety rules

- Exact member ID or approved email matching only; no fuzzy name matching
- Duplicate source submissions are staged for review
- Only active, approved members can receive imported attendance or submit requests
- Teams attendance is evidence only until a human classifies the record
- Normal attendance comes automatically from Google/Microsoft Forms; members never self-enter it
- A forgotten form submission becomes one pending missed-attendance correction; authorized staff verifies it and the event rule awards points from canonical attendance
- Member activity claims remain non-official until a secured administrator approves them
- Review access is allowlisted to `ashwindh.ramesh@campbellhigh.net`, `xavier.thomas@campbellhigh.net`, `harshad.premkumar@campbellhigh.net`, `vivaan.bendishankara@campbellhigh.net`, and `fbla@campbellhigh.net`
- The five allowlisted accounts receive full points-system administrator access; other executive officers retain ordinary officer/member access unless the secured roster is deliberately changed in a later migration
- A tardy suggestion begins at 10 minutes, but never creates discipline automatically
- Attendance and service-hour edits create compensating ledger entries; history is not deleted
- Dues awards are unique per member and academic year
- Secrets are server-only and never displayed in the portal

## Verification

Run:

```bash
npm test
npx tsc --noEmit
npm run build
```
