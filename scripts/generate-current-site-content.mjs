import { writeFile } from "node:fs/promises";
import { competitionEvents } from "../data/competitive-events.ts";
import { events } from "../data/events.ts";
import { gallery } from "../data/gallery.ts";

const out = [];
const add = (value = "") => out.push(value);
const esc = (value) => String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", "<br>");

add(`# Campbell FBLA Website — Exact Current Content Inventory

Generated from the current implementation on September 10, 2026.

## Scope and reading notes

This document inventories the exact visitor-facing copy currently implemented for these public routes:

- \`/\` — Home
- \`/about\` — About
- \`/get-involved\` — Get Involved
- \`/events\` — Events
- \`/compete\` — Compete
- \`/gallery\` — Gallery
- \`/resources\` — Resources

Text is organized by page and section in display order. Dynamic labels, empty states, filters, buttons, links, drawer copy, and data-driven card content are included. Decorative SVG labels and meaningful image alternative text are included where they communicate content. Purely visual shapes, animation code, CSS, and screen-reader-only implementation details are not copied as page prose.

The Events page changes according to the current date. The Home “Right Now” area also selects upcoming records dynamically. This file documents the source copy and all records that can appear.

---

## Shared navigation

### Public navigation labels

- Home
- About
- Get Involved
- Events
- Compete
- Impact
- Resources
- Gallery
- Member Portal

### Additional navigation copy

- Explore Campbell
- Connect
- Contact us
- Get involved
- Menu
- Close
- Page-reading progress: \`0%\` through \`100%\`

---

# 1. Home — \`/\`

Metadata title inherits the site title. The page itself contains the following content.

## Hero

**Small label:** CAMPBELL HIGH SCHOOL · 2026—27

**Main heading:**

> Campbell FBLA.  
> Built to do more.

**Body:**

> A student-led chapter where Campbell students compete, build career skills, lead real projects, serve their community, and create things that last.

**Actions:**

- Get involved ↗
- View events →
- Member Portal →

**Official-lockup image alternative text:** Georgia FBLA, Campbell High School

## Hero scroll story

**Label:** WHAT WE DO ↓

### 01 / 03 — Compete.

> Build the skills to turn preparation into possibility.

### 02 / 03 — Lead. Create.

> Take ownership of real projects and build something the next team can continue.

### 03 / 03 — Serve.

> Connect with your community and make your contribution count.

## Fast chapter information strip

### MEETINGS

> Wednesdays after school  
> Starts at 3:45 PM · Room 3104

### MEMBERSHIP

> $35 FBLA  
> $45 FBLA + DECA

### 2026—27

> Year Three  
> Student-led chapter

### MEMBER UPDATES

> Current members use  
> BAND

## Get involved pathways

**Small label:** GET INVOLVED

**Heading:**

> THIS ISN’T JUST  
> ANOTHER CLUB.

**Intro:**

> Choose how you want to get involved. Compete, lead projects, serve your community, or build something new.

### COMPETE

> Test your skills through FBLA competitive events and prepare for conferences from regional through national levels.

Link: Explore Competition →

### LEAD

> Take ownership through officer roles, committees, chapter events, and projects that actually need student leadership.

Link: Meet Our Leadership →

### SERVE

> Work on meaningful service projects and community partnerships while creating measurable impact.

Link: See Our Impact →

### BUILD

> Use business, technology, design, and problem-solving skills to create tools and projects for the chapter and community.

Link: Explore Committees →

## Current events preview

**Small label:** UPCOMING

**Heading:**

> RIGHT NOW AT  
> CAMPBELL FBLA

**Supporting text:** The next things members need to know.

**Action:** View Full Calendar →

The component selects the next chapter meeting plus the records \`spirit-day\`, \`ice-cream\`, and \`flc-registration\`, sorts them by date, and displays up to four future records. Its specialized preview copy is:

- Chapter meeting: **3:45 PM / Room 3104**
- FBLA Spirit Day: **Wear FBLA blue and gold. Group picture at the Grand Staircase.**
- DECA × FBLA Ice Cream Social: **3:30–4:30 PM · CHS Courtyard**
- FLC Registration Deadline: **Fall Leadership Conference registration deadline.**

Empty state:

> New dates are being confirmed. Check back for the next chapter event.

## Year Three story

**Small label:** OUR NEXT CHAPTER

**Heading:**

> YEAR THREE.  
> FROM ADVISER-LED  
> TO STUDENT-LED.

**Body:**

> Campbell FBLA was rebuilt beginning in 2024–25. Now in our third year, we're building a chapter where students do more than attend meetings. Officers own real responsibilities, committees turn ideas into projects, members prepare year-round for competition, and the chapter documents what it creates so the next team can build on it.

**Action:** Learn About Campbell FBLA →

### 01 — OWN

> One person takes responsibility.

### 02 — SUPPORT

> A team helps make it happen.

### 03 — APPROVE

> Advisers guide school, safety, financial, and official requirements.

## Committees preview

**Small label:** COMMITTEES

**Heading:** FIND YOUR PLACE.

**Intro:** Four teams. Different ways to make the chapter better.

**Action:** Explore Committees →

### 01 — COMMUNITY SERVICE

> Turn local needs into meaningful projects.

### 02 — FUNDRAISING

> Plan campaigns that support chapter goals.

### 03 — SOCIAL EVENTS

> Create experiences that build chapter culture.

### 04 — CODING

> Build Campbell FBLA’s digital tools and technology projects.

## Historical impact

**Small label:** 2025–26 HIGHLIGHTS

**Heading:**

> WE’VE ALREADY  
> STARTED BUILDING.

**Body:**

> Last year's strongest projects showed what Campbell FBLA can do when an idea is carried through, measured, and shared. This year we're building systems that make that kind of work repeatable.

**Action:** Explore Our Impact →

**Proof points:**

- 432 — Items donated
- 72 — Families supported
- FLC · RLC · SLC — Competitive experience
- TOP 10 — SLC Management Information Systems

## Chapter Life archive teaser

**Small label:** CHAPTER LIFE

**Heading:** 2025–26 ARCHIVE

**Action:** Explore the Gallery →

**Artwork copy:**

- COMPETE — SHOW / WHAT / YOU KNOW.
- SERVE — MAKE IT / COUNT.
- BUILD — MAKE IT / USEFUL.

## Member Portal preview

**Small label:** COMING THIS YEAR

**Heading:**

> YOUR FBLA.  
> YOUR PROGRESS.

**Feature labels:**

- Verified Points
- Attendance History
- Cord Progress
- Leaderboard

**Body:**

> We're building a new Campbell FBLA member portal that will make it easier to see your participation and progress without manually tracking everything yourself.

**Action:** Member Portal / Coming Soon

**Image alternative text:** Three-dimensional symbols of progress and achievement

## Final Home call to action

**Small label:** CAMPBELL FBLA / 2026–27

**Heading:**

> READY TO DO MORE  
> THAN JOIN A CLUB?

**Body:**

> Compete. Build skills. Lead projects. Serve your community. Create something the next group of members can continue.

**Actions:**

- Get Involved →
- Contact Us →

**Image alternative text:** Trophy, megaphone, service heart, and coding laptop

---

# 2. About — \`/about\`

**Metadata title:** About Campbell FBLA

**Metadata description:** Learn how national FBLA, Georgia FBLA, and Campbell High School FBLA connect—and meet the chapter’s 2026–2027 leadership.

## Page hero

**Small label:** ABOUT CAMPBELL FBLA

**Main heading:** FROM NATIONAL FBLA TO CAMPBELL HIGH SCHOOL.

**Body:**

> FBLA is a national student organization focused on business, leadership, career preparation, competition, and community involvement. Campbell High School FBLA is our local chapter, giving Campbell students access to those opportunities throughout the school year.

**Jump links:**

- How FBLA Works ↓
- Our Chapter ↓
- Leadership ↓

**Hero artwork:**

- GEORGIA → CAMPBELL
- ONE ORGANIZATION. / OUR CHAPTER.
- Image alternative text: Georgia FBLA, Campbell High School

## What is FBLA?

**Small label:** START HERE

**Heading:** WHAT IS FBLA?

> FBLA stands for Future Business Leaders of America. It is a Career and Technical Student Organization, or CTSO, that helps students develop business and leadership skills through competitive events, conferences, career experiences, community involvement, recognition programs, and chapter leadership.

> Students can explore areas such as finance, marketing, entrepreneurship, management, technology, public speaking, design, coding, and many other business and career fields. FBLA also gives students opportunities to meet other members, business professionals, and chapters beyond their own school.

## One organization. Three levels.

**Small label:** HOW IT CONNECTS

**Heading:** ONE ORGANIZATION. THREE LEVELS.

### 01 — NATIONAL FBLA

> National FBLA provides the larger organization, national programs, competitive-event structure, recognition opportunities, and national conferences that chapters across the country participate in.

> National programs include opportunities such as Champion Chapter and the National Leadership Conference.

Link: Visit National FBLA ↗

### 02 — GEORGIA FBLA

> Georgia FBLA organizes the state-level opportunities Campbell members participate in, including rallies, leadership conferences, regional competition, state competition, testing, recognition, and statewide deadlines.

Conference line: Fall Rally → FLC → RLC → SLC

> Georgia FBLA connects local chapters across the state and provides the path members use to compete and advance toward higher levels of competition.

Link: Visit Georgia FBLA ↗

### 03 — CAMPBELL FBLA

> Campbell FBLA is where those opportunities become part of everyday student life. Our chapter organizes meetings, competition preparation, committees, service, fundraising, socials, career activities, and chapter projects for Campbell students.

> The chapter decides how to turn state and national opportunities into something members can actually participate in at Campbell.

Links: Explore Competition ↗ / View Events ↗

## Moving text divider

The About page places a full-width looping text divider between the three-level explanation and chapter-history sections. Its source component is \`ChapterTextRibbon\`.

## Chapter history

**Small label:** OUR CHAPTER

**Heading:** THREE YEARS IN.

### 2024–25 — REBUILDING THE CHAPTER

> Campbell FBLA was rebuilt during the 2024–25 school year, establishing the chapter again and beginning the current period of growth.

### 2025–26 — PROVING WHAT THE CHAPTER COULD DO

> The second year included regular chapter meetings, service, fundraising, competitive events, conferences, career-focused activities, Champion Chapter work, and officer succession.

> The year also produced measurable results in service and competition that the chapter can continue improving on.

### 2026–27 — YEAR THREE

> This year, Campbell FBLA is putting more structure behind the chapter. Officer responsibilities are clearer, four committees have defined purposes, competition preparation is being treated as a yearlong process, and activities are expected to have an owner, deadline, outcome, and record of what happened.

> The goal is simple: run the chapter more consistently and leave the next officer team with something organized to continue.

## The record so far

**Small label:** THE RECORD SO FAR

**Heading:** WHAT CAMPBELL FBLA HAS DONE.

**Intro:**

> The chapter is still young, but the last school year provides several clear examples of what Campbell members have already accomplished.

### COMMUNITY — 432 ITEMS. 72 FAMILIES.

> Campbell FBLA’s 2025–26 food drive collected 432 donated items and supported 72 families. It is the chapter’s clearest documented example of a project being announced, completed, measured, and reported back to members.

Link: See Service & Impact ↗

### COMPETITION — CAMPBELL MEMBERS HAVE COMPETED AT RLC AND SLC.

> Members represented Campbell in FBLA competition at the regional and state levels. The 2025–26 records include a Top 10 result in Management Information Systems at the State Leadership Conference.

Link: See How Competition Works ↗

### CAREER DEVELOPMENT — MEETINGS HAVE INCLUDED MORE THAN ANNOUNCEMENTS.

> Campbell members have taken part in networking, elevator-pitch practice, job-interview practice, parliamentary procedure, competition simulations, and other skill-focused activities. The chapter also hosted a networking program with guest speaker Isaac Acquah titled “Your Network Is Your Net Worth.”

Link: Explore Chapter Opportunities ↗

## Chapter leadership

**Small label:** 2026–27

**Heading:** CHAPTER LEADERSHIP.

**Intro:** Campbell FBLA is currently led by seven student officers working with three chapter advisers.

| No. | Officer | Role | Responsibility copy |
|---|---|---|---|
| 01 | XAVIER THOMAS | Co-President | Chapter direction, executive coordination, meetings, and overall chapter operations. |
| 02 | ASHWINDH RAMESH | Co-President | Chapter direction, executive coordination, projects, technology, and overall chapter operations. |
| 03 | HARSHAD PREMKUMAR | Executive Vice President | Internal operations, officer coordination, accountability, and special projects. |
| 04 | DEZZALYNNE HALLIDAY | VP of Competitions | Competitive-event preparation, conference participation, and competition planning. |
| 05 | MADDOX LEWIS | Activities Director | Member activities, recognition, BAA, and coordination of service and social programming. |
| 06 | VIVAAN BENDISHANKARA | Secretary | Minutes, attendance, correspondence, records, and meeting follow-up. |
| 07 | VIHAAN HARIHARAN | Treasurer | Budgeting, financial records, fundraising finances, and chapter financial planning. |

## Chapter advisers

**Heading:** CHAPTER ADVISERS.

**Names:** Mrs. Anthony / Mr. Gilliam / Ms. Flemming

> Our advisers provide school-level guidance, approvals, safety and financial oversight, registration support, and continuity while student officers manage the chapter’s day-to-day work.

Link: Contact Campbell FBLA ↗

## Chapter structure

**Small label:** CHAPTER STRUCTURE

**Heading:** FOUR COMMITTEES. DIFFERENT RESPONSIBILITIES.

### 01 — COMMUNITY SERVICE

> Plans service projects, volunteer opportunities, and community outreach.

### 02 — FUNDRAISING

> Plans fundraising activities that support chapter programs, conferences, and projects.

### 03 — SOCIAL EVENTS

> Plans member socials, celebrations, and chapter experiences.

### 04 — CODING

> Maintains Campbell FBLA’s digital tools, supports technology projects, and works on coding-related chapter initiatives.

Link: Explore Committees & Get Involved ↗

## What membership opens up

**Small label:** MEMBERSHIP

**Heading:** WHAT DOES MEMBERSHIP ACTUALLY OPEN UP?

### 01 — COMPETITIVE EVENTS

> Choose an FBLA event, prepare individually or with a team, and compete through Georgia FBLA conferences.

Link: Learn about competition ↗

### 02 — LEADERSHIP

> Apply for officer or committee leadership roles and take responsibility for chapter activities and projects.

Link: See how to get involved ↗

### 03 — SERVICE

> Participate in chapter service projects and community opportunities.

Link: See our impact ↗

### 04 — CAREER EXPERIENCE

> Practice business skills, hear from professionals, attend conferences, and take part in career-focused activities.

Link: Explore events ↗

### 05 — RECOGNITION

> Participate in FBLA programs such as BAA, competitive events, and chapter recognition opportunities.

Link: View resources ↗

## Keep going

**Small label:** KEEP GOING

**Heading:** WHAT ARE YOU LOOKING FOR?

| Choice | Supporting copy | Link |
|---|---|---|
| I WANT TO JOIN | Membership options, committees, and ways to get involved. | Get Involved ↗ |
| I WANT TO COMPETE | Learn how competitive events, conferences, and advancement work. | Compete ↗ |
| I NEED DATES | Chapter meetings, socials, conferences, service projects, and deadlines. | Events ↗ |
| I WANT TO SEE WHAT THE CHAPTER DOES | Service projects, chapter results, partnerships, and past highlights. | Impact ↗ |
| I NEED A FORM OR GUIDE | Competition documents, dress-code information, forms, and official links. | Resources ↗ |
| I WANT TO SEE PHOTOS | Browse Campbell FBLA’s chapter archive. | Gallery ↗ |

## Final About call to action

**Small label:** CAMPBELL HIGH SCHOOL FBLA

**Heading:** INTERESTED IN BEING PART OF IT?

> See current membership options, find a committee, or learn what is coming up this semester.

Links: Get Involved ↗ / View Events ↗

---

# 3. Get Involved — \`/get-involved\`

**Metadata title:** Get Involved

**Metadata description:** Join Campbell FBLA, choose a membership, connect in BAND, attend Wednesday meetings, and find your place in a chapter committee.

## Hero

**Small label:** GET INVOLVED / CAMPBELL FBLA 2026–27

**Heading:**

> SHOW UP.  
> PICK A LANE.  
> MAKE IT COUNT.

> Campbell FBLA works when students do more than put their name on a roster. Join the chapter, connect with members, choose where you want to contribute, and start building skills through real work.

Action: Start here ↗

**Hero route:** 01 Join / 02 Connect / 03 Show up / 04 Choose your lane

## Join in four moves

**Small label:** START HERE

**Heading:** JOIN IN FOUR MOVES.

> You do not need to understand every FBLA program before you begin. Follow the path in order and the chapter will help with the rest.

### 01 — Choose membership

> Pick FBLA Navy or the combined FBLA + DECA Gold option.

### 02 — Complete the form

> Share the student, family contact, shirt-size, and interest information the chapter needs.

### 03 — Connect in BAND

> Join the private member space for announcements, reminders, RSVPs, and committee updates.

### 04 — Come Wednesday

> Meet the chapter at 3:45 PM in Room 3104 and find the work that fits you.

## 2026–27 membership

**Small label:** 2026–27 MEMBERSHIP

**Heading:** TWO OPTIONS. ONE CHAPTER.

> Both membership options include competition eligibility and an FBLA T-shirt.

### FBLA NAVY — $35

**FBLA membership**

- Chapter membership
- Competition eligibility
- FBLA T-shirt

### FBLA GOLD — $45

**FBLA + DECA**

- Combined chapter membership
- Competition eligibility
- FBLA T-shirt

### Dues countdown

- EARN / 50 / POINTS
- DUES DEADLINE COUNTDOWN
- Completed-state label: THE DUES DEADLINE HAS ARRIVED
- SEP 28 / 11:59 PM
- DAYS / HOURS / MIN / SEC
- NOW

> Pay through MyPaymentsPlus by September 28, then complete the dues challenge check-in in BAND. The full challenge window closes October 1.

Action: Open membership form ↗

## BAND

**Small label:** YOUR MEMBER CHANNEL

**Heading:** THE WEBSITE GUIDES YOU. BAND KEEPS YOU CURRENT.

> Campbell FBLA’s BAND is a private, invite-only member space. Use it for chapter announcements, meeting reminders, event details, RSVP links, committee communication, and updates that may change after this page is published.

Action: Join Campbell FBLA on BAND ↗

Supporting label: Official chapter invite

**BAND card copy:**

- BAND ACCESS
- 2026—27
- SCAN TO JOIN
- Announcements / events / committees

**QR alternative text:** QR code for the official Campbell FBLA BAND invitation

## Meetings

**Decorative day label:** WED

**Small label:** YOUR WEEKLY STARTING POINT

**Heading:** 3:45 PM. ROOM 3104.

> General chapter meetings are held Wednesdays after school. Check BAND and the chapter calendar for confirmed dates and any schedule changes.

**Facts:** Starts at 3:45 PM / Campbell High School

### 1ST + 3RD WEDNESDAYS

> General meeting, then extended committee work. Room stays open until 5:15 PM.

### 2ND + 4TH WEDNESDAYS

> General meeting schedule. Room closes at 4:55 PM; use BAND for that day’s dismissal details.

## Committees

**Small label:** CHOOSE YOUR LANE

**Heading:** FOUR TEAMS. REAL RESPONSIBILITY.

> You do not join a committee just to receive another title. You join to help move one part of the chapter forward.

### 01 — Community Service

**Turn a need into action.**

> Plan service projects, volunteer opportunities, and outreach that gives back to Campbell and the local community.

> First move: shape one service idea into a project Campbell FBLA can actually complete.

### 02 — Fundraising

**Make the work possible.**

> Create and run fundraisers that support chapter activities, conferences, and community projects while practicing real business skills.

> First move: build a fundraiser idea with a goal, audience, plan, and measurable result.

### 03 — Social Events

**Build chapter culture.**

> Organize socials, celebrations, and member experiences that help people connect and want to return.

> This year: support experiences such as the Ice Cream Social, Holiday Social, and Fall in Love with FBLA.

### 04 — Coding

**Build something useful.**

> Maintain the website, support chapter technology, create an application for a local need, maintain the points tracker, and prepare for technology events.

> First move: identify a real Smyrna or community need that a useful digital project could address.

## Open leadership

**Small label:** OPEN LEADERSHIP / DEADLINE SEPTEMBER 9

**Heading:** DON’T WAIT TO LEAD.

> Leadership applications opened August 26. These roles give students a defined part of the chapter to own, organize, and improve.

> Ask for the current application instructions in BAND or speak with a chapter adviser or officer.

**Roles:**

1. Marketing & Communications Officer
2. Community Service Committee Chair
3. Social Events Committee Chair
4. Fundraising Committee Chair
5. Coding Committee Chair

## Points and cord targets

**Score artwork:** 250+ / CLASS-BASED CORD TARGETS

**Small label:** MAKE PARTICIPATION COUNT

**Heading:** SHOW UP. DO THE WORK. TRACK IT.

> Graduation-cord requirements are based on class year: 250 points for the Class of 2027, 375 for 2028, and 500 for the Class of 2029 and beyond. Members earn toward that total through dues, meetings, socials, workshops, service, competition preparation, conferences, and results.

**Examples:**

- 50 — Verified dues
- 5 — Chapter meeting
- 10 — FLC or SLC
- 15 — Compete at a conference

> The 2025–26 activity schedule was confirmed unchanged for 2026–27. Official records are verified through the Member Portal.

## Final Get Involved call to action

**Small label:** CHOOSE YOUR NEXT MOVE

**Heading:** WHAT DO YOU WANT TO DO FIRST?

- I’m ready to join ↗
- I need member updates ↗
- I want to compete ↗
- I have a question ↗

---

# 4. Events — \`/events\`

**Metadata title:** Events | 2026–2027

**Metadata description:** Campbell FBLA meetings, socials, service projects, conferences, competitions, and deadlines for the 2026–2027 school year.

## Hero

**Small label:** CAMPBELL HIGH SCHOOL FBLA • 2026–27

**Display title:** EVENTS

**Heading:** EVERY DATE THAT MATTERS.

> Chapter meetings, socials, service projects, conferences, competitions, and important deadlines — organized in one place.

Links: Jump to Upcoming ↓ / Competition Calendar →

### Dynamic “Next Up” ticket

- NEXT UP
- The next event’s month/day, short title or title, weekday, time, and location
- Our next regular chapter event. Check BAND before it begins for the latest agenda, forms, or event-specific updates.
- Tomorrow, or View in Calendar ↓

## Member notice

> **Current member?** BAND is still the place for last-minute changes, reminders, forms, and meeting-specific instructions.

> This page is the public 2026–27 calendar.

## Calendar controls

**Filters:** ALL / MEETINGS / SOCIAL / SERVICE / CONFERENCES / DEADLINES / PAST

**Search placeholder:** Search events

**Year rail:** 2026—27 / SCROLL OR SELECT

**Months and phrases:**

- 09 / SEPTEMBER — THE YEAR GETS MOVING.
- 10 / OCTOBER — COMPETE. SHOW UP. GET INVOLVED.
- 11 / NOVEMBER
- 12 / DECEMBER — CLOSE THE SEMESTER STRONG.
- 01 / JANUARY
- 02 / FEBRUARY
- 03 / MARCH — STATE SEASON.
- 04 / APRIL
- 05 / MAY — FINISH THE YEAR.

Empty month: **No matching events in this month.**

## Event detail drawer shared copy

- CLOSE ×
- DATE
- TIME
- LOCATION
- COST
- Check BAND ↗
- Competition Info →, when applicable
- Current members should check BAND for last-minute changes and member-specific instructions.

## Archive

**Label:** ARCHIVE

**Heading:** ALREADY HAPPENED

> Past 2026–27 events stay here so the chapter calendar remains a record of the year, not just a list of what's next.

Empty archive: **The school-year archive will grow as events happen.**

## Closing

**Small label:** MEMBER NOTE

**Heading:** NEED THE LATEST DETAILS?

> The website keeps the public calendar organized. Current members should still check BAND for last-minute changes, forms, transportation information, sign-ups, and event-specific instructions.

Links: Explore Competition → / Contact Campbell FBLA →

## Exact calendar records

The table below contains all records currently available to the Events page. Repeated chapter meetings intentionally share the same title, time, location, and description.
`);

add("| Date | End | Event | Category | Time | Location | Cost | Description | Secondary / note |");
add("|---|---|---|---|---|---|---|---|---|");
for (const event of events) {
  add(`| ${esc(event.date)} | ${esc(event.endDate || "—")} | ${esc(event.title)} | ${esc(event.category)} | ${esc(event.time || "—")} | ${esc(event.location || "—")} | ${esc(event.cost || "—")} | ${esc(event.description)} | ${esc([event.secondaryDescription, event.note].filter(Boolean).join(" ") || "—")} |`);
}

add(`
---

# 5. Compete — \`/compete\`

**Metadata title:** Competitive Events | Campbell FBLA

**Metadata description:** Find and compare current 2026–27 Georgia FBLA high-school competitive events and learn how Campbell prepares.

## Hero

**Small label:** CAMPBELL FBLA • COMPETITIVE EVENTS

**Main heading:**

> FIND THE EVENT  
> THAT FITS HOW  
> YOU THINK.

> FBLA competition is not one type of contest. Some events are objective tests. Others use presentations, case studies, projects, demonstrations, or teams. Start by finding the format and subject that match your strengths, then work backward from the official rules.

**Actions:** Browse Competitive Events ↓ / Competition Resources →

**Supporting line:** 2026–27 High School Competition

**Hero illustration alternative text:** A trophy standing on a three-level competition podium

## Choose a format

**Small label:** START WITH THE FORMAT

**Heading:** HOW DO YOU WANT TO COMPETE?

> You do not have to know your exact event yet. Start with the kind of work you would rather prepare for.

### 01 — OBJECTIVE TEST

> Study a defined subject area, then answer timed objective questions.

**BEST FIT:** You prefer independent preparation, concepts, calculations, or applying knowledge quickly.

Action: Show testing events ↓

### 02 — PRESENTATION

> Prepare an idea, solution, plan, or project and explain it clearly to judges.

**BEST FIT:** You like public speaking, visual communication, pitching ideas, or explaining your thinking.

Action: Show presentation events ↓

### 03 — CASE / ROLE-PLAY

> Receive a business situation, develop a response, and present your recommendation.

**BEST FIT:** You think well under pressure and prefer solving a problem over memorizing a large amount of material.

Action: Show case events ↓

### 04 — PROJECT / PREJUDGED

> Develop work before the conference and submit or present a finished project.

**BEST FIT:** You prefer building, writing, designing, researching, coding, or developing something over time.

Action: Show project events ↓

### 05 — TEAM EVENT

> Prepare and compete with teammates where the official event allows teams.

**BEST FIT:** You want to divide preparation, combine strengths, and present together.

Action: Show team events ↓

## Event directory

**Small label:** 2026–27 EVENT DIRECTORY

**Heading:** FIND YOUR EVENT.

> Search every current high-school competitive event in Georgia FBLA’s regional, fall-qualifying, and state competition system.

**Source status:** Official 2026–27 sources checked September 9, 2026

> **Two limits matter.** Team size comes from the national event guideline. The number of Campbell entries available depends on current Georgia registration rules, schedule conflicts, and the chapter plan. A national “state entry limit” is not a Campbell chapter limit.

**Search placeholder:** Search an event, subject, or skill...

**Pathway filters:** ALL EVENTS / RLC / SLC / RLC → SLC / FLC → SLC / SLC ONLY

**Format filters:** ALL EVENTS / TEST / PRESENTATION / CASE / ROLE-PLAY / PROJECT / TEAM

**Subject control:** SUBJECT AREA / ALL SUBJECTS

**Results labels and actions:**

- [number] events match
- 2026–27 topic
- Eligibility: [event eligibility]
- FORMAT / ENTRY / FIRST STAGE / CHAPTER SLOTS
- Confirm with Campbell
- Official guideline ↗
- Compare event
- Comparing
- Show more events [visible]/[total]

**No-results state:**

> No exact match.  
> Clear a filter or search a broader skill.

Action: Clear all filters

## Event comparison

**Small label:** SIDE BY SIDE

**Heading:** STUCK BETWEEN TWO EVENTS?

> Select up to three events and compare what preparation actually looks like before you commit.

Empty state: **01 / 02 / 03 — Add events from the directory above.**

Comparison fields: FORMAT / INDIVIDUAL / TEAM / COMPETITION LEVEL / TESTING / PREJUDGED WORK / LIVE PRESENTATION

Actions: Official guideline ↗ / Clear comparison

Floating comparison dock: **[number]/3 selected / Compare**

## How Campbell prepares

**Small label:** FROM INTEREST TO COMPETITION

**Heading:** HOW CAMPBELL PREPARES.

> Choosing an event is only the first step. Campbell’s competition system gives competitors time to understand the rules, prepare, practice, and improve before conference day.

### 01 — EXPLORE

> Look through the current directory and identify events that match your interests and strengths.

### 02 — SELECT

> Choose your event and confirm its eligibility, entry, and team requirements.

### 03 — READ THE RULES

> Read the complete official guidelines. Know what is tested, submitted, presented, prohibited, and scored.

### 04 — BUILD A PLAN

> Turn the event into preparation tasks: study sessions, project milestones, content development, and delivery practice.

### 05 — CHECKPOINT

> Complete progress reviews early enough to identify unfinished work and weak areas.

### 06 — PRACTICE

> Use mock tests, timed rehearsals, judge-style questions, or reviews that match the actual format.

### 07 — COMPETE

> Arrive knowing the rules, your material, your responsibilities, and what is being measured.

### 08 — REVIEW

> Record what worked, what did not, and what should change before the next level.

## RLC and SLC

**Small label:** THE COMPETITION PATH

**Heading:** RLC AND SLC DO DIFFERENT JOBS.

### RLC — REGION LEADERSHIP CONFERENCE

> For events that use regional qualification, RLC is the first live competitive stage. Competitors are evaluated within their Georgia FBLA region, and qualifying competitors can move forward to the State Leadership Conference.

> Not every event begins at RLC. Always check the event’s current pathway in the directory above.

Link: See RLC dates →

### SLC — STATE LEADERSHIP CONFERENCE

> SLC is Georgia FBLA’s statewide high-school competition and leadership conference. Some competitors arrive through regional or fall qualification, while other events begin through state-level testing, submissions, or performances.

> The official event guidelines determine how each event reaches SLC and what advancement is available afterward.

Link: See SLC dates →

## After state

**Small label:** AFTER STATE

**Heading:** WHAT COMES NEXT?

> For events that advance beyond the state level, qualifying competitors may move on to the National Leadership Conference. Advancement rules, placement requirements, team rules, and event availability can differ by event, so the current official guidelines are always the final source.

Action: National Competition Guidelines ↗

## Technology and coding

**Visual label:** TECH + CODING

**Small label:** CAMPBELL-SPECIFIC SUPPORT

**Heading:** INTERESTED IN A TECHNOLOGY EVENT?

> Campbell’s Coding Committee works on technology projects and supports coding and technology competition preparation. Under the current committee plan, Coding Committee members receive priority when signing up for coding- and technology-related competitive events.

Actions: Explore the Coding Committee → / Show Technology Events ↓

**Illustration alternative text:** A clean interface showing code, data, and web competition tools

## Before choosing

**Small label:** BEFORE YOU CHOOSE

**Heading:** BEFORE YOU COMMIT, CHECK FIVE THINGS.

### 01 — THE FORMAT

> Do you actually want to prepare for the way this event is judged?

### 02 — THE RULES

> Have you read the current official guideline from beginning to end?

### 03 — THE TIME

> Can you realistically prepare before Campbell’s internal and Georgia FBLA deadlines?

### 04 — THE TEAM

> If the event uses a team, are your teammates ready to contribute consistently?

### 05 — THE PATH

> Do you know whether the event starts with testing, RLC, FLC, prejudged work, SLC, or another stage?

**Bottom line:** Choose based on the work you want to do, not just the event title.

## Competition resources handoff

**Small label:** NEED THE RULES?

**Heading:** USE THE OFFICIAL DOCUMENTS.

> Event guidelines, current competition documents, dress and conduct information, and official FBLA links belong in Resources so there is one place to keep them current.

Actions: Competition Resources → / Dress & Conduct →

## Quick answers

**Small label:** QUICK ANSWERS

**Heading:** READ THIS BEFORE YOU ASK.

### 01 — DO ALL EVENTS START AT RLC?

> No. The competition path depends on the event. Use the pathway badge in the directory and confirm it in the official guidelines.

### 02 — ARE ALL EVENTS INDIVIDUAL?

> No. FBLA includes both individual and team events. The directory shows the permitted entry format for each event.

### 03 — DO ALL EVENTS USE A TEST?

> No. Events can use objective testing, presentations, role-play or case formats, prejudged work, projects, demonstrations, or combinations of these.

### 04 — CAN I PICK AN EVENT JUST FROM ITS NAME?

> Use the name to narrow your choices, but read the guideline before committing. Similar subjects can require completely different preparation.

### 05 — CAN I COMPETE IN MORE THAN ONE EVENT?

> That depends on current Georgia FBLA rules, event conflicts, eligibility, and Campbell’s registration plan. Confirm before registering.

### 06 — WHERE DO I FIND DEADLINES?

> Use the Events page for the public competition calendar and BAND for current member-specific reminders or changes.

## Final Compete call to action

**Small label:** READY TO CHOOSE?

**Heading:** FIND THE EVENT YOU WANT TO GET GOOD AT.

> Browse the directory, read the official rules, and choose an event you are willing to prepare for.

Actions: Browse All Events ↓ / Open Competition Resources →

> Need help choosing? Talk with the VP of Competitions or a chapter adviser.

## Exact 2026–27 competition event directory

The following 76 records are the exact records currently used by the directory. “Official guideline” preserves the individual event URL from the data file.
`);

for (const [index, event] of competitionEvents.entries()) {
  add(`### ${String(index + 1).padStart(2, "0")} — ${event.name}`);
  add("");
  add(`- **Pathway:** ${event.pathway}`);
  add(`- **Category:** ${event.category}`);
  add(`- **Subject:** ${event.subject}`);
  add(`- **Entry:** ${event.entry}`);
  add(`- **Format:** ${event.elements}`);
  add(`- **First stage:** ${event.firstStage}`);
  add(`- **Testing:** ${event.testing ? "Yes" : "No"}`);
  add(`- **Prejudged work:** ${event.prejudged ? "Yes" : "No"}`);
  add(`- **Live presentation/performance:** ${event.live ? "Yes" : "No"}`);
  add(`- **Annual topic:** ${event.annualTopic ? "Yes" : "No"}`);
  if (event.eligibility) add(`- **Eligibility:** ${event.eligibility}`);
  add(`- **Card description:** ${event.summary}`);
  add(`- **Official guideline:** ${event.guideline}`);
  add("");
}

add(`---

# 6. Gallery — \`/gallery\`

**Metadata title:** Gallery

**Metadata description:** Explore Campbell FBLA’s chapter photography, conferences, service, and socials, organized by school year.

## Page intro

**Small label:** THE CHAPTER, IN PICTURES

**Heading:** You had to be there.

> The stage, the service days, the people in between. Our chapter archive, one school year at a time.

## Gallery controls and states

**School years:** 2026–27 / 2025–26 / 2024–25

**Category control:** All, followed by categories available for the selected year.

**Live count:** [school year] / [number] PHOTOS

**Slider loading state:** Preparing the chapter gallery…

**Fallback carousel controls:** Previous photo / Next photo

**Caption format:** [image alternative text] / [school year] archive

**2024–25 archive note:**

> SLC 2025 is explicitly dated in the original collection and stays in the 2024–25 archive.

**2025–26 archive note:**

> Historical chapter photos from the existing public collection, organized into the 2025–26 archive. They are not presented as current-year photos.

### 2026–27 empty state

**Small label:** 2026–2027 / COMING SOON

**Heading:** A new year. A new story.

> Current-year chapter photos will appear here once their dates and public-use permissions are verified. Explore the archive in the meantime.

Action: Explore 2025–26 ↗

## Exact gallery records

| ID | School year | Category | Visible caption / image alternative text | Image source | Provenance |
|---|---|---|---|---|---|`);
for (const item of gallery) {
  add(`| ${esc(item.id)} | ${esc(item.schoolYear)} | ${esc(item.category)} | ${esc(item.alt)} | ${esc(item.src)} | ${esc(item.provenance)} |`);
}

add(`
---

# 7. Resources — \`/resources\`

**Metadata title:** Resources

**Metadata description:** Verified Campbell FBLA membership, competition, dress-code, and chapter resources.

## Page intro

**Small label:** THE CHAPTER TOOLKIT

**Heading:** What you need. In one place.

> Membership forms, competition guidance, and chapter resources—organized around what you’re here to do.

## Resource controls

**Filters:** All / Competition / Dress & Conduct / Membership / Chapter Resources / Official FBLA

**Library notice:**

> A curated library for members and families. Documents appear with an action only when their public link is verified. For day-to-day announcements, current members should check BAND.

## Resource cards

### Campbell FBLA Membership Form

- **Label:** Membership / FORM / 2026–27
- **Description:** For students joining or interested in joining the Campbell High School chapter. Opens the respondent form, not the editor or responses.
- **Action:** Open membership form ↗

### Membership options & meeting guide

- **Label:** Membership / GUIDE / 2026–27
- **Description:** Dues, MyPaymentsPlus instructions, Wednesday meetings, and the four chapter committees.
- **Action:** Open resource ↗

### Your competition pathway

- **Label:** Competition / GUIDE / 2026–27
- **Description:** Chapter conference plans and a practical sequence for preparing for a competitive event.
- **Action:** Open resource ↗

### FBLA Dress Code

- **Label:** Dress & Conduct / PDF / Year not confirmed
- **Description:** Conference attire reference. Confirm the applicable current-year requirements with an adviser.
- **Status:** Public link pending verification

### FLC Dress Code & Code of Conduct

- **Label:** Dress & Conduct / PDF / Year not confirmed
- **Description:** Dress and conduct reference for Fall Leadership Conference participants. Current-year applicability needs adviser confirmation.
- **Status:** Public link pending verification

### FBLA Interest Meeting

- **Label:** Chapter Resources / PDF / 2026–27
- **Description:** A chapter introduction for prospective members.
- **Status:** Verified public copy coming soon

### State Project AI Flyer Contest

- **Label:** Competition / PDF / Pending verification
- **Description:** Competition information will be linked after the current file and entry requirements are verified.
- **Status:** Verified public copy coming soon

### Open Testing Events

- **Label:** Competition / PDF / Pending verification
- **Description:** Event reference for competition planning. Ask the VP of Competitions about the current event list.
- **Status:** Verified public copy coming soon

### Chapter Spirit T-shirt

- **Label:** Chapter Resources / PDF / Pending verification
- **Description:** The current chapter shirt reference will be added after verification.
- **Status:** Verified public copy coming soon

## Empty filtered state

**Heading:** Links being verified.

> Official FBLA links will be added after verification. Your adviser can help with the current guidelines.

Action: Ask the chapter ↗

---

# Shared footer

The following footer appears across the public site.

## Feature panel

**Heading:** Make your next move matter.

> Compete. Lead. Serve. Create. There’s a place for you at Campbell FBLA.

Action: Get involved ↗

**Artwork copy:**

- CAMPBELL HIGH SCHOOL / 2026—27
- More than / a club.
- Student-led. Campbell proud.

## Footer base

**Heading:** Big ideas. Real impact. Our chapter.

### CONTACT

- fbla@campbellhigh.net
- Campbell High School
- 925 Powder Springs St, Smyrna, GA 30080

### NAVIGATION

- Home
- About
- Events
- Gallery

### YOUR CHAPTER

- Committees
- Competition
- Resources
- Our impact

### FOLLOW US

- Instagram
- TikTok

### Campbell FBLA.

### Stay in the loop.

> Current members use BAND for chapter announcements, meeting reminders, and updates.

Action: Connect with us ↗

**Legal line:** © 2026 CAMPBELL FBLA / FUTURE BUSINESS LEADERS OF AMERICA

---

# Source-of-truth files used for this inventory

- \`app/page.tsx\`
- \`app/about/page.tsx\`
- \`app/events/page.tsx\`
- \`app/get-involved/page.tsx\`
- \`app/compete/page.tsx\`
- \`app/gallery/page.tsx\`
- \`app/resources/page.tsx\`
- \`components/chapter/bio-hero.jsx\`
- \`components/chapter/opportunities.jsx\`
- \`components/chapter/current-events.tsx\`
- \`components/chapter/event-calendar.tsx\`
- \`components/chapter/get-involved-experience.tsx\`
- \`components/chapter/competition-experience.tsx\`
- \`components/chapter/gallery-experience.jsx\`
- \`components/chapter/resource-library.tsx\`
- \`components/chapter/navigation.jsx\`
- \`components/chapter/footer.tsx\`
- \`data/chapter.ts\`
- \`data/events.ts\`
- \`data/competitive-events.ts\`
- \`data/gallery.ts\`
- \`data/resources.ts\`
`);

await writeFile(new URL("../CAMPBELL_FBLA_EXACT_WEBSITE_CONTENT.md", import.meta.url), `${out.join("\n")}\n`, "utf8");
console.log(`Wrote CAMPBELL_FBLA_EXACT_WEBSITE_CONTENT.md (${out.length} blocks, ${competitionEvents.length} competition events, ${events.length} calendar records, ${gallery.length} gallery records).`);
