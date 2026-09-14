// Public chapter facts supplied in the September 2026 content brief.
// Never place member records, responses, contacts, or attendance in this module.
export const chapter = {
  year: '2026–2027', yearLabel: '2026—27', phase: 'Year Three',
  meetingDay: 'Wednesdays', meetingStart: '3:45 PM', room: 'Room 3104',
  email: 'fbla@campbellhigh.net', address: '925 Powder Springs St, Smyrna, GA 30080',
  school: 'Campbell High School',
  socials: [{ label: 'Instagram', handle: '@campbell_fbla', href: 'https://www.instagram.com/campbell_fbla/' }, { label: 'TikTok', handle: '@chs.fbla', href: 'https://www.tiktok.com/@chs.fbla' }],
};
export const membership = {
  payment: 'MyPaymentsPlus', applicationDeadline: '2026-09-09', earlyActionDeadline: '2026-09-28',
  challengeStart: '2026-08-03', challengeEnd: '2026-10-01', formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdCSnrChNqB9gcWFnLNH8K9mFHUo1UCQx2imX0LDlXcv2PBuQ/viewform' as string | null,
  plans: [{ name: 'FBLA Blue', price: 35, label: 'FBLA membership', includes: ['FBLA membership', 'Competition eligibility', 'FBLA T-shirt'] }, { name: 'FBLA Gold', price: 45, label: 'FBLA + DECA', includes: ['Combined chapter membership', 'Competition eligibility', 'FBLA T-shirt'] }],
};
export const officers = [
  { name: 'Xavier Thomas', role: 'Co-President', focus: 'Chapter direction, student leadership, and chapter-wide execution.' },
  { name: 'Ashwindh Ramesh', role: 'Co-President', focus: 'Chapter direction, student leadership, and chapter-wide execution.' },
  { name: 'Harshad Premkumar', role: 'Executive Vice President', focus: 'Operations, the Program of Work, and coordination across committees.' },
  { name: 'Dezzalynne Halliday', role: 'VP of Competitions', focus: 'Event selection, competition preparation, and conference readiness.' },
  { name: 'Maddox Lewis', role: 'Activities Director', focus: 'Member experiences, service projects, and chapter activities.' },
  { name: 'Vivaan Bendishankara', role: 'Secretary', focus: 'Chapter records, correspondence, and follow-through.' },
  { name: 'Vihaan Hariharan', role: 'Treasurer', focus: 'Chapter finances and fundraising with adviser oversight.' },
];
export const advisers = ['Mrs. Anthony', 'Mr. Gilliam', 'Ms. Flemming'];
export const committees = [
  { id: 'service', name: 'Community Service', verb: 'Show up.', description: 'Plan service projects, volunteer opportunities, and outreach that respond to real community needs.' },
  { id: 'fundraising', name: 'Fundraising', verb: 'Make it possible.', description: 'Build and run projects that support conferences, chapter activities, and community work while practicing business skills.' },
  { id: 'social', name: 'Social Events', verb: 'Bring people together.', description: 'Plan socials, celebrations, and experiences that make a chapter feel like a community.' },
  { id: 'coding', name: 'Coding', verb: 'Build something useful.', description: 'Maintain our website, support chapter technology, build a useful local or community application, and prepare for coding competitions.' },
];
export const openRoles = ['Marketing & Communications Officer', ...committees.map(c => `${c.name} Committee Chair`)];
export const navItems = [ ['Home', '/'], ['About', '/about'], ['Get Involved', '/get-involved'], ['Events', '/events'], ['Compete', '/compete'], ['Resources', '/resources'], ['Gallery', '/gallery'] ].map(([label, href]) => ({label, href}));
