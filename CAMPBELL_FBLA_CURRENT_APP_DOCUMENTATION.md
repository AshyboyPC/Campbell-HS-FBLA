# Campbell FBLA public website — current implementation

Last updated: September 7, 2026

## Product direction

The public site is a curated 2026–2027 chapter website, not a BAND mirror and not the future member tracker. It uses Campbell navy #00205B, FBLA blue #003DA5, gold #FFC72C, ivory, local display fonts, real chapter archive photography, editorial grids, thin rules, and purposeful motion. Reduced-motion users receive static fallbacks.

## Public route map

- / — Home: Year Three, meeting strip, pathways, current events, historical proof, member-portal preview.
- /about — FBLA overview, Campbell story, current seven-officer team, three advisers, and Own → Support → Approve leadership model.
- /get-involved — membership, $35 FBLA / $45 FBLA + DECA, MyPaymentsPlus, meeting rhythm, four committees, coding feature, date-aware leadership opportunities.
- /events — searchable, filterable, date-aware 2026–2027 chapter calendar.
- /compete — Explore → Choose → Prepare → Practice → Compete → Advance and conference pathway.
- /impact — planned service, archive results, and partner invitation.
- /resources — allowlisted public-safe resource library; verified membership form link; unavailable Drive files remain structured entries with no broken actions.
- /gallery — year-first archive with explicit 2024–25, 2025–26, and current-year Coming Soon state.
- /contact — audience-specific contact paths and chapter form.
- /points — Coming Soon member-portal preview only; no authentication, tracker, attendance, or leaderboard data.

Legacy redirects preserve /membership, /community, /news, /sponsors, /login, /admin/dashboard, and /points/dashboard without restoring retired systems.

## Shared data and UI

- data/chapter.ts — public chapter facts, membership plans, officers, advisers, committees, archive proof, navigation.
- data/events.ts — confirmed public event dataset and announcements.
- data/gallery.ts — the existing public image collection with school-year/category/provenance labels.
- data/resources.ts — explicit public-safe resource allowlist.
- lib/event-dates.ts — current-day, upcoming/past, next-event, announcement, and display-date helpers.
- components/chapter/ — shared navigation, footer, motion wrappers, event calendar, resource library, gallery experience, forms, and editorial sections.

Official React Bits registry components installed and used where they add a real interaction: PillNav (primary navigation), CardNav (interior section navigation), ScrollExpand, TextLoop, SplitText, BlurText, TextType, Shuffle, GradientText, ScrollFloat, ScrollReveal, ScrambledText, FoldText, CardSwap, BorderGlow, GradualBlur, MorphSlider, and OptionWheel. React Bits source was adapted for Next.js routing and keyboard/reduced-motion behavior.

## Google Drive review

The authorized Chrome account was used to inspect CHS FBLA Repository, including Branding, Notices / Documents, and Conference Info. The official Campbell brand guide, Campbell/Georgia FBLA logo assets, membership form, and Dress-Code_FINAL.pdf were verified. The membership respondent link is published. The dress-code file is public on the web but remains a verified-link-pending resource until a stable website-safe copy/link is selected.

Intentionally not published: response sheets, member/contact information, officer attendance policy, points-system PDF, private meeting files, private officer materials, financial records, internal Chapter of the Year files, private Program of Work, and internal chats. Drive downloads were blocked by Chrome’s own download protection; no permission bypass was attempted.

## Verification

- npm run lint — passes with no ESLint warnings or errors; includes TypeScript no-emit check.
- npm run build — passes; 24 routes generated successfully.
- Build skips validation/linting internally because the existing next.config.ts keeps those production flags disabled, so lint was run separately.
- Live visual browser QA was attempted but unavailable after the environment usage limit blocked localhost browser access. The local server was already present during implementation and the production build is clean.

## Remaining manual confirmation

RLC Region 7 exact date/location, NLC dates, current-year conference resources, selected committee chairs, current-year gallery photos, and any stable local copies of Drive PDFs still need chapter-side confirmation before being labeled final/current.

