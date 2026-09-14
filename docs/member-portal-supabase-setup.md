# Supabase setup

## 1. Create the project and environment variables

Create a Supabase project, then copy `.env.example` to `.env.local` and set:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_SECRET_KEY
ATTENDANCE_WEBHOOK_SECRET=A_LONG_RANDOM_SECRET
```

The service-role key and webhook secret are server-only. Never prefix them with `NEXT_PUBLIC_`, commit them, paste them into client code, or show them in the admin interface.

## 2. Run the migrations

Run these in order using the Supabase SQL Editor or your normal migration workflow:

1. `supabase/migrations/202609090001_member_portal_foundation.sql`
2. `supabase/migrations/202609090002_member_portal_rules_rls.sql`
3. `supabase/migrations/202609090003_member_claims_and_school_email.sql`
4. `supabase/migrations/202609090004_attendance_claim_hardening.sql`
5. `supabase/migrations/202609090005_approver_access_roster.sql`

The migrations create the active 2026–27 year, carry forward the chapter-confirmed point schedule, create RLS policies, add the officer-policy and attendance-ledger functions, require approved `@campbellhigh.net` identities, and add the reviewed member-claim workflow. The fourth migration makes missed-sign-in resolution transactional and adds database-level validation for claims and corrections. The fifth migration locks full administrator access to the approved 2026–27 roster and creates the shared chapter adviser profile. They do not seed member attendance or point totals.

## 3. Configure Auth

In Supabase Auth URL Configuration, add the deployed site URL and this redirect path:

```text
https://YOUR_SITE/points/auth/callback
```

For local development, add:

```text
http://localhost:3000/points/auth/callback
```

Email accounts do not become members automatically. A verified account is linked only when an approved profile has the same normalized `approved_auth_email`.

## 4. Sign in with the chapter adviser account

1. Migration 5 creates the approved adviser profile for `fbla@campbellhigh.net`.
2. Use `/points/login` with that email.
3. Confirm `auth_user_id` was linked to the adviser profile.

Do not create a separate shared technical-admin password. Student reviewers use their own approved `first.last@campbellhigh.net` accounts.

## 5. Confirm the 2026–27 administrator roster

Migration 5 grants full points-system administrator access only to:

- `ashwindh.ramesh@campbellhigh.net` — Ashwindh Ramesh
- `xavier.thomas@campbellhigh.net` — Xavier Thomas
- `harshad.premkumar@campbellhigh.net` — Harshad Premkumar
- `vivaan.bendishankara@campbellhigh.net` — Vivaan Bendishankara, Secretary
- `fbla@campbellhigh.net` — shared adviser account

These five accounts can review and approve claims, inspect every member record, manage attendance and events, export reports, manage the roster, and access policy/configuration screens. All other officers remain ordinary officer accounts. Administrator access cannot be assigned through the portal UI; the protected database allowlist is authoritative.

## 6. Import chapter data

Use `/points/manage/imports` in this order:

1. Membership roster
2. Events
3. Historical general attendance
4. Teams officer-attendance evidence
5. Historical point ledger, administrators only

Every import has a preview and explicit confirmation. Unmatched, duplicate, and conflicting rows remain in review.

## 7. Production checks

- Confirm a member can read only their own detailed data.
- Confirm the leaderboard excludes emails and officer-accountability details.
- Confirm one verified attendance row creates only one effective point award.
- Change verified service hours and confirm a compensating ledger transaction appears.
- Confirm 1, 3, 5, and 7 unexcused absences result in −5, −10, −15, and −20 cumulative totals.
- Correct 3 unexcused absences to 2 and confirm the ledger adds +5.
- Confirm the seven-absence threshold flags review but does not change the officer’s role.
