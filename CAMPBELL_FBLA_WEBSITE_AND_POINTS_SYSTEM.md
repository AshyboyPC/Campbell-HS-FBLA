# Campbell FBLA Website and Points System — Detailed Reader's Guide

**Prepared:** September 25, 2026

**Coverage:** Original website at the project's first commit, current 2026–27 redesign in the working tree, public pages and content, member portal, points rules, attendance and review workflows, and the way records are protected and kept current.

## What this guide is for

This is a patient explanation of the website and points experience as a student, family member, adviser, or other reader would encounter it. It explains what the website communicates, how its sections fit together, how the old site differed from the remodeled one, what members do to earn points, and what happens before a point appears as official. Technical terms are defined only when they help explain that experience.

This is a description of the project and its behavior, not a plan or recipe for recreating the points system. It aims to answer “what does this website/system do, and how should I understand it?” rather than “how do I build it?”

For a literal, page-by-page inventory of the current public-facing wording, see [`CAMPBELL_FBLA_EXACT_WEBSITE_CONTENT.md`](CAMPBELL_FBLA_EXACT_WEBSITE_CONTENT.md). That companion records headings, copy, links, card text, dynamic event records, and image descriptions. This guide explains what those pages mean together and gives the fuller, plain-language explanation of the point schedule and how members experience it.

The project contains working-tree changes that have not yet been committed. “Current” below means the code present in the project workspace on the prepared date, not a claim that every feature is deployed or connected to a live database. Database-backed pages need the relevant Supabase configuration and migrations; Google synchronization also needs its credentials and setup.

---

# 1. Project history: the original site and the whole-site remodel

## 1.1 The first complete website

The initial project commit, `571593a` (“Initial commit of Campbell HS FBLA website”), is the source record for the original website. The early implementation was a conventional chapter-club site built around a homepage hero, a top navigation bar, a small set of information pages, and an integrated, self-service points tracker.

The initial home page used a `Hero`, a slideshow, a “Who We Are” introduction, and three interactive gradient cards: **Compete**, **Lead**, and **Serve**. The cards used animated gradient artwork and click ripples. The design emphasized polished visual effects, standard cards, broad chapter messaging, and quick entry points into membership and the member tracker.

The original public route set included:

- `/` — hero, chapter introduction, slideshow, Compete/Lead/Serve cards.
- `/about` — chapter information.
- `/community` — community stories and involvement.
- `/events` — event information and deadlines.
- `/gallery` — photo gallery.
- `/membership` — membership information.
- `/news` — news.
- `/resources` — chapter resources.
- `/sponsors` — sponsor information.
- `/contact` — contact page and form.
- `/login` — sign-in and account creation.
- `/points` and `/points/dashboard` — public points overview and member tracker.
- `/admin/dashboard` — administration dashboard.

The original project also contained a `Navbar`, `AnnouncementBar`, `Countdown`, `Footer`, `Hero`, `Slideshow`, `PointsSection`, `PointsDashboard`, `AdminDashboard`, `AuthContext`, `PageTransition`, and shared animated UI components. Authentication and points were described in the old README as Cosmic Authentication and Cosmic Database features.

## 1.2 The scale of the remodel

The change is a site-wide remodel of the site's identity, content, page structure, and member service. “Information architecture” means the way information is grouped and the paths people follow to find it. In the earlier site, a visitor largely encountered a homepage, a collection of broad topic pages, and a tracker. The remodel gives each major visitor question a more direct destination: What is FBLA? How do I join? What is happening? How do I compete? What has the chapter done? Where are the official materials? How do I check my own record?

The earlier site was primarily a set of general chapter pages plus a self-service points feature. The remodeled site is organized around the Year Three chapter story and clearer visitor/member paths: understand the chapter, join, see dates, choose competition events, explore impact, find resources, and access a private member portal. Formerly broad or overlapping topics now have distinct roles. Competition preparation is explained on Compete; dates and event history belong on Events; community results belong on Impact; photos belong in a year-labeled Gallery; membership steps and committees belong on Get Involved; private personal progress belongs in the Member Portal.

The visual change supports a different editorial approach too. The old homepage used a hero, slideshow, and three animated gradient cards to introduce Compete, Lead, and Serve. The redesigned homepage tells a sequenced chapter story: a strong Year Three identity, short practical facts, specific ways to participate, the next dates, how the chapter is growing, committee opportunities, past results, and a direct portal path. Across the rest of the site, chapter evidence and archive context are made visible instead of relying only on general promotional statements. The remodel also changes the private points experience; that distinction is explained separately below.

## 1.3 Original tracker policy versus the remodeled system

The first `POINTS_SYSTEM_README.md` describes an early tracker in which members could add their own point entries and delete their own entries. The original plan gave administrators a password-protected dashboard with broad point editing/deletion. It used Cosmic services and included a 125-point annual goal, a Class of 2026 target of 125, and earlier class-year targets. Its policy also included service at 2 points per hour with a 10-point maximum, a dues deadline, and a school-year cutoff.

The current portal is a substantial policy and data-integrity redesign. A member can see their own approved record and submit eligible claims or corrections, but cannot make a submission official by themselves. Verified attendance is generated through approved sources; non-attendance activity claims need human approval. Official adjustments are journaled instead of deleting the historic record. The current 2026–27 target schedule carries forward the 2025–26 activity schedule unchanged (confirmed September 9, 2026), while the current cord targets are Class of 2027: 250, Class of 2028: 375, and Class of 2029 onward: 500. The older Class of 2026 and 125-point annual-goal wording is historical and should not be treated as current policy.

## 1.4 What the remodeled site is trying to help people understand

The current public site presents Campbell FBLA as a student-led chapter that competes, develops career skills, leads real projects, serves the community, and builds repeatable work that the next officer team can continue. Its editorial structure centers on:

- The chapter's third year after rebuilding began in 2024–25.
- The progression from national FBLA to Georgia FBLA to the Campbell chapter.
- Concrete ways to participate: compete, lead, serve, build.
- Defined committee responsibilities and student ownership, with advisers providing approval and oversight.
- Chapter results with context, including the 2025–26 food-drive report of 432 donated items supporting 72 families and the SLC Top 10 in Management Information Systems.
- Clear paths to current dates, membership steps, competition rules, resources, and the private portal.

The chapter story is deliberately practical: students can take part at different levels, and participation can lead to real skills and visible work. “Student-led” here is expressed as ownership: officers and committees plan and carry work forward, while advisers support and approve matters that require adult, school, financial, or safety oversight. The site presents that relationship as **Own → Support → Approve** so leadership is neither an empty title nor a claim that students act without adviser guidance.

---

# 2. Current website structure

## 2.1 Shared design and implementation vocabulary

- **Next.js App Router:** the framework's directory-based routing system. A page file under `app/` maps to a website route; route handlers under `app/api/` provide server-side endpoints.
- **React component:** a reusable piece of the interface, such as the navigation, calendar, card, gallery, or portal shell.
- **Server component:** a component rendered on the server. It can securely read session-bound data before returning page output.
- **Client component:** a component rendered in the browser when it needs interaction, animation, browser events, or live state.
- **CSS module / stylesheet:** the rules controlling layout, typography, color, responsive behavior, and animation.
- **Design system:** the shared visual choices and reusable patterns. This site uses Campbell navy (`#00205B`), FBLA blue (`#003DA5`), gold (`#FFC72C`), ivory, local display fonts, editorial grids, fine rules, and chapter photography.
- **Reduced motion:** a setting that asks the interface to minimize animation. Motion-aware components provide reduced-motion behavior or static fallbacks.
- **Metadata:** page title and description that help browsers, search engines, and link previews identify a page.
- **Redirect:** an instruction that sends a request for an older route to its replacement route.

Shared navigation labels are Home, About, Get Involved, Events, Compete, Impact, Resources, Gallery, and Member Portal. Shared UI includes navigation, section navigation, footer, page transitions and motion, event calendar, resource library, gallery, contact forms, and accessible interaction patterns. Data is separated into files such as `data/chapter.ts`, `data/events.ts`, `data/gallery.ts`, and `data/resources.ts` so page content and page layout are easier to maintain independently.

## 2.2 Current public routes and their purpose

| Route | Purpose and main content |
|---|---|
| `/` | The Year Three story, meeting and membership facts, participation paths, upcoming events, committee preview, historical proof, and member-portal entry. |
| `/about` | What FBLA is, national/state/local structure, chapter history, impact evidence, current officers/advisers, committees, and what membership provides. |
| `/get-involved` | Membership options and steps, BAND, meetings, open roles, committees, and the points/cord explanation. |
| `/events` | Searchable, filterable, date-aware 2026–27 calendar. The page can distinguish upcoming and past items; it is a calendar and record, not a static list. |
| `/compete` | Competition pathway: Explore → Choose → Prepare → Practice → Compete → Advance, current event directory, formats, and conference sequence. |
| `/impact` | Chapter service, results, projects, and partner invitation. |
| `/resources` | Allowlisted, public-safe resources, including the verified membership form and official competition information where available. Unverified or private files do not get a misleading working download action. |
| `/gallery` | Year-first archive, with 2024–25 and 2025–26 material separated from the 2026–27 “Coming Soon” state. |
| `/contact` | Audience-specific contact paths and chapter contact form. |
| `/points` | Private Member Portal introduction, sign-in path, and explanation of verified points, attendance, leaderboard, and cord progress. |

The exact page wording, card inventory, event records, competition directory, resource details, image descriptions, and dynamic text are in [`CAMPBELL_FBLA_EXACT_WEBSITE_CONTENT.md`](CAMPBELL_FBLA_EXACT_WEBSITE_CONTENT.md).

### How a visitor is meant to move through the site

Someone who has never heard of the chapter can begin at **Home**, learn what FBLA and the Campbell chapter do on **About**, then use **Get Involved** for dues, meeting, BAND, committee, and membership steps. Someone already interested in a particular opportunity can skip directly to **Events** for dates or **Compete** for event formats and preparation. **Impact** shows what the chapter has done and why the work matters; **Gallery** gives past photos their correct school-year context; **Resources** points to useful public documents and forms; **Contact** offers a direct route for questions. Returning members can go to **Member Portal** for private personal records.

This makes the site both an introduction and a practical guide. It gives newcomers enough context to choose a next step, while giving members a place to find dates, official resources, and their own progress. The site itself says BAND is the place for changing member-only logistics: the website provides the stable public explanation; BAND carries timely reminders, RSVP details, and changes.

### What changes from page to page

- **Home** sets the chapter's identity and gives short routes onward. It introduces the weekly meeting rhythm, membership prices, participation paths, committees, next events, past results, and the portal. It is a map, not the only place that explains everything.
- **About** provides context before asking someone to join. It explains the national/state/local structure of FBLA, the rebuild starting in 2024–25, the current Year Three direction, named leadership responsibilities, advisers, and documented examples of competition and service.
- **Get Involved** turns interest into action. It explains two membership options, the form/payment steps, BAND, Wednesday meetings, four committees, open leadership roles, and the points/cord idea. It emphasizes doing chapter work rather than merely collecting a membership title.
- **Events** behaves as a calendar and historical record. Search and filters help a visitor find relevant events; date-aware states separate what is upcoming from what has passed. Since schedules change, details may point members to BAND for final logistics.
- **Compete** explains that FBLA contests have different formats—tests, presentations, projects, case studies, demonstrations, or team events. Its pathway helps a student go from interest to event choice, rule reading, preparation, practice, competition, and possible advancement. It distinguishes official statewide/national entry rules from Campbell's own registration capacity.
- **Impact** connects projects to outcomes, such as what was collected or who was helped, and invites community partnership. It makes results legible instead of treating service as an unmeasured list of activities.
- **Resources** is a curated public library. “Allowlisted” means only specifically reviewed resources are made available through the public interface. A file known to exist but lacking a stable approved link can be described without presenting a broken or unsafe download.
- **Gallery** groups photographs by school year and category. This prevents an older conference photo from looking like a current-year event and makes the archive a record of chapter life, not a live events feed.
- **Contact** gives audiences a direct path to ask a question, with a chapter contact form and contact information.
- **Member Portal** is the transition from public chapter information to private personal records. It is not a public roster and does not expose a visitor to another student's attendance or individual points.

## 2.3 Member Portal routes

Portal pages live under `/points`. The implemented route dispatcher consolidates older deep links into a smaller set of current screens. Depending on role and enabled data, the experience includes:

- `/points/login` — verified-email sign-in.
- `/points/onboarding` — first-time profile/roster setup flow.
- `/points/dashboard` — official points total, points earned and adjustments, recent transactions, attendance, rank, cord requirement/progress, unresolved corrections, and next event.
- `/points/activity` — points/attendance history, published rules, cord requirement, and leaderboard context.
- `/points/requests` — eligible self-reportable claims and correction requests with status.
- `/points/officer` — officer attendance, accountability actions, policy deduction total, absence requests, and required upcoming officer events.
- `/points/manage/*` — role-limited chapter operations such as reviewing claims, members, events, attendance, and sync state.
- `/points/admin/*` — adviser administrator settings, rules, cord thresholds, officer policy, and audit view.

Legacy paths such as `/points/leaderboard`, `/points/attendance`, `/points/history`, `/points/rules`, `/points/claims`, `/points/corrections`, and officer/admin subpaths redirect to the consolidated portal screens. The public `/login`, `/membership`, `/community`, `/news`, `/sponsors`, `/admin/dashboard`, and `/points/dashboard` legacy routes are preserved by redirects or portal routing so old links can find a current destination.

## 2.4 Current public chapter facts in the implementation

- School year: 2026–27; current phase: Year Three.
- Regular meeting: Wednesdays, 3:45 PM, Room 3104.
- Email: `fbla@campbellhigh.net`.
- Address: 925 Powder Springs St, Smyrna, GA 30080.
- Membership plans: FBLA Blue, $35; FBLA Gold (FBLA + DECA), $45.
- Payment processor/instructions: MyPaymentsPlus.
- Member announcements and updates: private, invite-only BAND space.
- Chapter has seven student officers and three advisers in the public chapter profile.

Public event dates, announcements, event display rules, gallery labels, and resources are data-driven. Dates can age, so check the current site/BAND for the latest operational details. Historical records are intentionally labeled as history.

---

# 3. The points system: policy schedule

## 3.1 How to read the rule terms

- **Points / point value:** the credit value attached to a qualifying activity.
- **Fixed award:** one set number of points for a qualifying event or action.
- **Repeatable:** the activity can receive credit more than once, subject to its rule and evidence.
- **Maximum points:** a ceiling on the award for a single claim/event. For service, it prevents excess hours on one activity from exceeding the permitted cap.
- **Maximum occurrences:** a one-time or limited number of awards of that kind in the year.
- **Per-hour calculation:** verified hours multiplied by the category's points-per-hour value, capped by the maximum.
- **Attendance-generated:** points are attached by the system after attendance is verified for an event configured with that rule.
- **Approval required:** an authorized reviewer must approve the item before it becomes official.
- **Self-reportable:** a member may submit a claim for review. Submission is a request, not an award.
- **Academic year:** the school-year record to which a point transaction or policy applies. Current seed: `2026-2027`, August 1, 2026 through July 31, 2027; points deadline is May 1, 2027.
- **Source version:** the source policy and date/version that explain where a seeded rule came from.

The rule schedule below is the 2026–27 database seed. It identifies the configured award and calculation for each category. Some award rules have variable event eligibility or approval requirements; the event and its current configuration determine how a particular activity is recorded.

Think of the schedule as the chapter's credit menu. Points recognize several kinds of participation: belonging to the chapter, showing up, building skills, serving, taking on leadership, attending conferences, and earning competition results. Points are not money, grades, FBLA competitive-event scores, or a measure of a student's worth. They are chapter-record credit toward the chapter's cord threshold.

The examples shown publicly—50 for verified dues, 5 for a chapter meeting, 10 for FLC or SLC attendance, and 15 for competing at a conference—are examples, not the entire schedule. The complete seeded schedule follows.

## 3.2 Every seeded point category

| Category | Points / calculation | Repeat or limit | How it is earned and recorded |
|---|---:|---|---|
| Membership dues (`DUES`) | 50 fixed points | One time per academic year | Annual FBLA dues must be verified by an adviser. Unique-award protection prevents duplicate dues credit for the same member and year. |
| Chapter meeting (`CHAPTER_MEETING`) | 5 | Repeatable | Awarded from verified attendance at a Campbell FBLA chapter meeting. |
| Social event (`SOCIAL`) | 3 | Repeatable | Awarded from verified attendance at an FBLA social. |
| Workshop (`WORKSHOP`) | 3 | Repeatable | Awarded from verified workshop attendance. |
| Competition study session (`COMP_STUDY`) | 3 | Repeatable | Awarded from verified attendance at a competitive-event study session. |
| BAA Contributor Level (`BAA_CONTRIBUTOR`) | 5 | One time | Achievement credit for completing the Business Achievement Awards Contributor level. |
| BAA Leader Level (`BAA_LEADER`) | 8 | One time | Achievement credit for completing the BAA Leader level. |
| BAA Advocate Level (`BAA_ADVOCATE`) | 10 | One time | Achievement credit for completing the BAA Advocate level. |
| BAA Capstone Level (`BAA_CAPSTONE`) | 15 | One time | Achievement credit for completing the BAA Capstone level. |
| Callis Foundation activity (`CALLIS`) | 10 | Repeatable | Credit for a Callis Foundation workshop or service event; the seeded rule requires approval. |
| Service/fundraiser hours (`SERVICE_HOURS`) | 2 per verified hour | Maximum 10 points per activity | Eligible school/community service or fundraiser work; hours must be verified. Formula: `min(hours × 2, 10)`. |
| Rally, RLC, or SLOTS attendance (`RALLY_RLC_SLOTS`) | 10 | Repeatable | Verified attendance at Motivational Rally, Region Leadership Conference, or SLOTS. |
| FLC or SLC attendance (`FLC_SLC_ATTEND`) | 10 | Repeatable | Verified attendance at Fall Leadership Conference or State Leadership Conference. |
| Competitive-event participation (`COMPETE`) | 15 | Repeatable by eligible competition | Achievement credit for competing at FLC, RLC, SLC, or NLC; must be supported/approved as configured. |
| RLC Top 10 (`RLC_TOP_10`) | 3 | Repeatable | Placement achievement for Top 10 at RLC. |
| Advance to SLC (`ADVANCE_SLC`) | 5 | Repeatable | Achievement for advancing from regional competition to SLC. |
| SLC Top 10 (`SLC_TOP_10`) | 8 | Repeatable | Placement achievement for Top 10 at SLC. |
| Advance to NLC (`ADVANCE_NLC`) | 10 | Repeatable | Achievement for advancing from state competition to NLC. |
| NLC Top 10 (`NLC_TOP_10`) | 15 | Repeatable | Placement achievement for Top 10 at NLC. |
| NLC attendance (`NLC_ATTEND`) | 20 | Repeatable | Verified National Leadership Conference attendance. |
| Recruitment referral (`RECRUITMENT`) | 3 | Repeatable | Approved member recruitment referral. |
| Officer application (`OFFICER_APPLICATION`) | 2 | One time | Credit for submitting an officer application. |
| Adviser-approved duty (`ADVISER_APPROVED`) | 3 | Repeatable | Other chapter duty approved by an adviser. |
| Officer attendance policy (`OFFICER_ATTENDANCE_POLICY`) | Negative cumulative adjustment | Policy applies to officers; not published as a member earning rule | Cumulative attendance deductions/corrections. Human review is required for accountability action; the system does not demote or remove an officer automatically. |

### What the categories mean in everyday terms

**Joining and showing up.** Verified dues carry 50 points and are the largest single ordinary participation award. A chapter meeting is 5 points; a social, workshop, or competition study session is 3 points each. The same member may earn the recurring participation credit again by attending another eligible event. The system needs a verified attendance record each time, so being on the general membership list by itself does not create meeting points.

**Completing a structured achievement.** The four BAA awards are 5, 8, 10, and 15 points as a member completes Contributor, Leader, Advocate, and Capstone levels. They recognize completion of each named level; they are not automatic for attending a meeting. The seeded rules treat each level as a one-time achievement for the year.

**Service and approved community activity.** A qualifying Callis Foundation activity is 10 points. For approved service or fundraiser work, points are tied to verified hours: two points per hour, with a maximum of ten points for that activity. So two hours produce four points; five hours or more reach the ten-point cap for that activity. This cap applies per activity entry as configured, not as a blanket lifetime cap. The hours still need to be verified and attached to the appropriate activity.

**Attending conferences.** Motivational Rally, RLC, and SLOTS attendance each use a 10-point award. FLC or SLC attendance is also 10 points. NLC attendance is 20 points. These are awards for attending the conference; they are conceptually separate from points for competing or placing there.

**Competing and achieving results.** Competing at an eligible FLC, RLC, SLC, or NLC event is 15 points. A student may also earn achievement points for results or advancement: RLC Top 10 earns 3; advancing from region to SLC earns 5; SLC Top 10 earns 8; advancing from state to NLC earns 10; NLC Top 10 earns 15. Conference attendance, competition participation, advancement, and placement are separate milestones, and the system may record more than one if each was actually earned and verified. These chapter point awards are separate from official FBLA event rankings and do not affect the competition judge's score.

**Leadership and contribution.** An approved recruitment referral is 3 points, submitting an officer application is 2 points, and another adviser-approved chapter duty is 3 points. A referral or duty must be approved; the award is not granted simply because someone says it happened. Officer application credit recognizes submission, not winning an election.

**Officer attendance adjustment.** The final category is different from the earning categories: it can reduce an officer's net official points under the separate officer attendance policy. It is an accountability record, not a way for members to earn points. The policy section below explains the bands and human review.

### Understanding the different rule labels

The database gives each category a calculation style. A fixed award means the qualifying activity has one stated value. An attendance award means attendance must be verified first. An achievement award recognizes a completed milestone such as a BAA level or competition result. A per-hour award multiplies confirmed hours by two and respects the ten-point cap. A manual category needs an authorized person to confirm the record. From a member's perspective the important questions are: did I complete the activity, is there evidence, and has the record been confirmed?

“Repeatable” means the award can recur for separate qualifying occasions where the rule permits it. It does not mean the same activity can be submitted repeatedly for extra credit. “One time” means the annual schedule is designed to prevent a second award for the same member and category during that school year. Event setup and review still matter for repeatable categories so duplicate form submissions do not accidentally create duplicate awards.

**Schedule source:** `Campbell FBLA Points System`; the migration records: “2025-2026 schedule confirmed unchanged for 2026-2027 on 2026-09-09.” Rule records are associated with the 2026–27 academic year. Adviser controls can later change the live database policy; the seeded values describe the baseline shipped by the migration.

## 3.3 Graduation cord requirements

Current seeded class-year requirements:

| Graduation class | Required official points |
|---|---:|
| Class of 2027 | 250 |
| Class of 2028 | 375 |
| Class of 2029 and later | 500 |

The dashboard uses the member's graduation year to find the applicable published requirement. Progress is based on official points and is capped visually at 100%. A negative policy adjustment affects official net points and therefore progress. The targets are graduation-cord thresholds, not a promise that hitting a number alone satisfies any separate school or FBLA eligibility requirement.

Historical reference only: the original tracker README listed Class of 2026 at 125, Class of 2027 at 250, Class of 2028 at 375, Class of 2029+ at 500, plus a 125-point annual goal. The current seeded schedule no longer includes the Class of 2026 target or the 125-point annual goal.

In plain terms, a senior in the Class of 2027 compares their official point total with 250; a Class of 2028 member compares it with 375; a student in the Class of 2029 or later compares it with 500. The progress display is a guide to that target. It is based on what is official in the portal, so a pending claim may not move the bar yet. The member can still see the request's status and follow up if it needs attention.

The Get Involved page also has a public dues challenge/countdown message. That message is a joining incentive and schedule reminder: it describes the dues payment and the associated BAND check-in window. The private portal's points rule separately says dues credit is 50 points after adviser verification. Paying by a displayed deadline, completing a challenge check-in, and seeing an official 50-point transaction are related steps, but they should not be conflated: the portal's official member record is the source for whether points have actually been verified and posted.

## 3.4 Officer attendance policy

The officer attendance policy is separately versioned, with a source effective date of August 28, 2026. Deductions are cumulative totals by unexcused-absence band, not penalties stacked on top of one another:

| Unexcused absences | Cumulative deduction | Recorded action / response |
|---:|---:|---|
| 0 | 0 | No deduction. |
| 1–2 | −5 total | Written warning. |
| 3–4 | −10 total | President/VP check-in and probation. |
| 5–6 | −15 total | Adviser involvement and performance review. |
| 7 or more | −20 total | Removal threshold reached; adviser/executive review required. |

If an absence classification is corrected, the ledger gets only the difference between the previous cumulative deduction and the corrected one. For example, moving from a −10 band to a −5 band adds back +5; it does not erase the history. A threshold is a review/action trigger, not automatic officer removal. Policy notes in the source README also say a tardy suggestion begins at 10 minutes but never creates discipline automatically.

This policy applies to officer responsibilities and should not be read as a general attendance penalty for every member. Officers have a separate view of their required attendance, absence requests, evidence state, late/early departure information, cumulative point adjustment, and any accountability action. An officer can request an absence and provide notice/handoff information. A request is reviewed; submitting it does not automatically classify an absence as excused. Human judgment remains central to classification and any action.

---

# 4. How a member experiences the points system

## 4.1 From doing an activity to seeing credit

1. **The member participates.** Examples include paying annual dues, attending a meeting or conference, completing BAA work, serving, competing, placing, or taking on a chapter responsibility.
2. **The system gets a record of it.** Attendance normally comes from a chapter attendance form or a configured attendance source. For eligible work that is not ordinary attendance, the member may submit a claim. A claim tells the reviewer what happened, when, which activity it belongs to, the quantity/hours if needed, and where to see evidence if there is a link.
3. **The record is matched to the right person and activity.** The system needs to know which member, school year, event, and point category are involved. It uses exact member ID or approved email matching. If it cannot confidently identify the person or event, it holds the row for human review instead of guessing.
4. **The rule is applied.** A five-point meeting award is different from a two-points-per-hour service award. The event configuration and category decide the amount. Duplicate submissions, occurrence limits, missing evidence, and dates are checked as relevant.
5. **Some records wait for a person to decide.** A submitted claim, unmatched row, possible duplicate, missed-attendance correction, or unclear evidence is pending. The member can see status, but pending points are not yet official.
6. **Approval makes the award official.** An authorized person verifies the entry where required. The approved transaction records what was awarded and its source. That is why portal copy describes the process as **Participate → Recorded → Reviewed → Official**.
7. **The dashboard summarizes the record.** The member sees official points, positive points earned, adjustments, recent activity, attendance history, cord progress, and privacy-safe leaderboard information. These are different views of the same reviewed record, not separate point balances members maintain themselves.

### What the member can and cannot do

Members can review their own record, published point rules, attendance history, request eligible non-attendance credit, and report a missing or inaccurate record. They can follow whether a request is submitted, under review, approved, or rejected. Members cannot turn their own claim into official credit, change the award amount, edit the central ledger, edit someone else's record, or erase official history. That separation gives members visibility and a way to flag issues while keeping official credit reviewable.

## 4.2 Attendance imports and normal attendance

- General attendance is imported through configured Google Forms or Microsoft Forms routes. A provider-neutral event record connects an attendance source to a chapter event and point category.
- Matching is exact member ID or approved email only. Fuzzy name matching is intentionally avoided because it could award points to the wrong student.
- Duplicate source submissions are staged for review instead of silently double-counted.
- Only active, approved members can receive imported attendance or submit point requests.
- Teams attendance is evidence only until a human classifies it; a Teams roster alone does not silently become a final attendance award.
- If a student forgot to submit the attendance form, they can make one missed-attendance correction request. Authorized staff verifies it; the canonical event rule then awards attendance points. Members do not self-enter normal meeting attendance.
- Attendance-generated points are created by a database trigger after the attendance record reaches its verified qualifying state. A configured event override can supersede the category's default award; service uses verified hours × points per unit, capped by the rule maximum.

## 4.3 Claims and corrections

A **claim** says, “I did an eligible activity that is not already captured by ordinary attendance; please review it for credit.” It includes an activity/category, date, quantity where relevant, description, and optional evidence link. It starts pending and is approved or rejected by an authorized reviewer. If approved, the configured category rule determines the credit; it is not the member's free choice of point value.

A **correction request** says, “Something in a record that should already exist is missing or wrong; please check it.” For example, a member may have attended a meeting but forgotten the attendance form, or may see a mismatched status. A correction request is not itself a point award. The reviewer verifies evidence and uses the correct event/category. If a correction changes points, the history keeps enough information to explain both the original record and the correction.

## 4.4 Ledger and audit concepts

- **Point ledger / transaction:** an individual official earning, deduction, or correction entry. Totals are calculated from entries rather than being trusted as a user-editable number.
- **Immutable history:** official entries are not casually overwritten or deleted. A correction is represented by a new compensating entry (the difference needed to correct the total), preserving the audit trail.
- **Audit log:** a record of sensitive administrative actions such as policy changes, approvals, and review decisions, including actor and relevant before/after context.
- **Pending vs. approved:** pending items are visible as workflow status but do not count as official points until approval/verification.
- **Official points:** approved positive awards plus approved negative adjustments for the academic year.
- **Points earned:** the approved positive awards total, kept distinct from adjustments.

### What the dashboard numbers are meant to tell a member

- **Official points** are the net sum of approved awards and approved deductions for the selected academic year. This is the total used for the cord progress comparison.
- **Points earned** show positive approved awards before deductions. This answers “how much credit have I earned?” without hiding a separate adjustment.
- **Adjustments** collect the approved positive or negative correction entries. A correction can be negative when credit was posted incorrectly or positive when missing credit is restored.
- **Recent activity/history** explains which activities created the total, when they were recorded, their status, and which point category they came from. It lets the member understand how the number was formed.
- **Attendance history** is the event-by-event attendance record. It is related to points but is not identical to the points ledger: an attendance record may exist before verification or may correspond to an event that awards no points.
- **Leaderboard/rank** compares official totals among participating current members for the active academic year. The database excludes adviser accounts; the safe leaderboard returns display names and graduation years rather than private contact details. Tied totals receive tied ranks.
- **Cord progress** compares official points with the requirement for the member's graduation class. It is shown as progress toward a target, not as proof of any other graduation or school requirement.
- **Next event / unresolved corrections** provide practical reminders: what is coming up and whether a record question is still awaiting resolution.

---

# 5. Roles, privacy, and access

## 5.1 Member access

Members must sign in through Supabase Auth using verified email/magic-link flow and complete onboarding/profile matching as required. The member portal only loads an approved, active member record for the active academic year. The member can view their own points, attendance, published rules, claims, corrections, and privacy-safe leaderboard. They cannot award themselves official points, edit the official ledger, change another member's data, or delete official history.

## 5.2 Officer and adviser access

Roles are kept distinct:

- **Member:** own private record and own requests.
- **Officer:** officer-specific status and (where authorized) point-claim review. Ordinary officer status does not automatically grant full system administration.
- **Adviser/staff:** operational management routes, based on server-side role checks.
- **Administrator:** sensitive settings, all-member operations, synchronization inbox, and audit functions, protected by server-side authorization and an additional adviser unlock where configured.

The source policy README records a restricted five-account review/admin allowlist: `ashwindh.ramesh@campbellhigh.net`, `xavier.thomas@campbellhigh.net`, `harshad.premkumar@campbellhigh.net`, `vivaan.bendishankara@campbellhigh.net`, and `fbla@campbellhigh.net`. It says other executive officers retain ordinary officer/member access unless a later secured roster migration deliberately changes access. Actual access depends on the applied migrations and current database role assignments; this list is not a substitute for verifying the live configuration.

## 5.3 Database protections

- **Supabase:** hosted authentication and PostgreSQL database platform.
- **PostgreSQL:** relational database storing profiles, academic years, rules, events, attendance, transactions, claims, corrections, sync records, and audit records.
- **Row Level Security (RLS):** database policies that restrict which rows a signed-in user can read or change, even if they try to call the database directly outside the normal page UI.
- **Server-only secret/service key:** privileged credential used only on the server. It must never be sent to browser code or displayed.
- **RPC/database function:** a named operation executed inside the database for sensitive, validated steps such as approving a claim or publishing an authorized result.
- **Foreign key:** a database relationship requiring a record to refer to a valid member, event, year, or category.

The migrations establish database tables, constraints, triggers, RLS, year-scoped rules, attendance award logic, claim approval logic, and privacy-safe ranking queries. Member names/contact details and attendance are not seeded into migrations. Adviser-only data should not be published on the public website.

---

# 6. Chapter records and synchronization

## 6.1 Imports and reports

The current system includes CSV preview/confirm workflows for membership, general attendance, Teams evidence, and historical points. A **preview/confirm import** parses the proposed file, identifies rows that are ready, duplicated, unmatched, conflicting, or otherwise need review, and only writes accepted rows after a human confirms. This lets a chapter catch mapping mistakes before committing an import.

Authorized reports are generated through protected routes. Report access is not public website access; member and sensitive data remain behind portal authorization.

## 6.2 How the Google connection fits into the experience

The Google Workspace integration is server-mediated; credentials are not put in browser code. The repository includes:

- Google service-account-based server access to a shared adviser spreadsheet and (when enabled) Form reconciliation.
- Configured sync connections, sync runs, webhook inbox/outbox foundations, and an Apps Script bridge in `integrations/google-apps-script/Code.gs`.
- An adviser-ledger action flow where proposed external changes are validated and reviewed rather than trusted as arbitrary cell edits.
- Read-only spreadsheet snapshot tabs named `Members`, `Point Ledger`, and `Attendance`; advisers should not edit totals in those snapshots. Proposed changes belong in `Adviser Actions`.
- Google Form submission webhook support and optional scheduled reconciliation for missed webhooks.

In everyday terms, Google is one way the chapter can move attendance and adviser ledger information into the member portal. The spreadsheet's read-only snapshot tabs are for viewing the current system record, not for typing over an official total. A proposed change goes through the adviser action/review path. That distinction means the spreadsheet is a convenient window into the record, while the portal/database remains the place that validates and records official changes. If a webhook is delayed or missed, reconciliation can compare source records later. The integration is an operational aid; the published point rules and review requirements still govern what counts.

The bridge requires adviser-side access and credentials before it can operate. The repository includes a separate technical setup guide for the person responsible for configuring it; those setup steps are intentionally outside this reader's guide.

---

# 7. What sits behind the experience

There are two visible layers. The public website explains Campbell FBLA and guides visitors to participate. The private portal is the member's personal window into reviewed records. Behind those screens, a database keeps the current member profile, academic year, rules, events, attendance, point transactions, claims, corrections, and review history connected. The site reads from that record; it does not treat a displayed number as a free-standing value a student can edit.

“Supabase” is the hosted sign-in and database service used by the current portal. “Next.js” and “React” are the web tools used to present pages and interactive screens. These names explain the project context, but a reader does not need to understand or operate them to follow the chapter website or the points workflow. A “migration” is a dated database change that sets or updates those rules and records. The project contains migrations and integration notes as evidence of how the current version is represented; this document does not attempt to reproduce their setup instructions.

---

# 8. Accuracy notes and boundaries

1. **The initial commit is the historical baseline.** It shows the first committed website, not every intermediate prototype or uncommitted change ever made.
2. **Current files include uncommitted work.** The project may contain edits not yet represented in the latest commit. This guide reflects the checked-out workspace state.
3. **A source rule is not proof of live deployment.** A migration describes what the database will be seeded/configured to do when applied; it does not prove that a hosted database has that migration or current values.
4. **A route is not proof of successful production configuration.** The portal requires Supabase and eligible member records. Google synchronization requires separate credentials, access grants, and setup.
5. **Public historical content and current operational content differ.** Archives retain their school-year context; BAND and the current site provide changing event logistics.
6. **Private records are not part of the public content inventory.** Member identities, roster responses, contacts, attendance, point totals, internal officer materials, and financial records are private portal/operations data, not website copy.
7. **The existing exact-content companion is the copy source.** It captures the current public site prose in much greater detail than this architectural/policy guide; it is not an additional claim that every possible combination of dynamic content is visible at once.

---

# 9. Project documents to consult

- [`CAMPBELL_FBLA_EXACT_WEBSITE_CONTENT.md`](CAMPBELL_FBLA_EXACT_WEBSITE_CONTENT.md) — exact current public-facing page content and dynamic page records.
- [`QUICK_START.md`](QUICK_START.md) — project setup entry point, for people maintaining the code.
- [`docs/member-portal-supabase-setup.md`](docs/member-portal-supabase-setup.md) — Supabase setup instructions.
- [`integrations/google-apps-script/README.md`](integrations/google-apps-script/README.md) — Google sync bridge setup and operating model.
- `supabase/migrations/202609090002_member_portal_rules_rls.sql` — authoritative seeded 2026–27 point categories, cord requirements, officer thresholds, ledger logic, and leaderboard calculations.
- `supabase/migrations/202609090001_member_portal_foundation.sql` — foundational database tables and constraints.
- `POINTS_SYSTEM_README.md` at the initial commit — historical description of the earlier self-service points tracker and its older rules.
