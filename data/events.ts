export type EventCategory = 'Chapter Meeting' | 'Social' | 'Service' | 'Conference' | 'Deadline' | 'Chapter Event' | 'National FBLA';

export type ChapterEvent = {
  id: string;
  title: string;
  shortTitle?: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  location?: string;
  category: EventCategory;
  description: string;
  secondaryDescription?: string;
  note?: string;
  featured?: boolean;
  featureStyle?: 'navy' | 'blue' | 'cream';
  abbreviation?: string;
  deadline?: string;
  status?: string;
  cost?: string;
  externalLink?: string;
  internalLink?: string;
  href?: string;
  membersOnlyDetails?: string;
  source?: string;
  homepage?: boolean;
};

const meetingDescription = 'Regular Campbell FBLA chapter meeting. Check BAND for the latest agenda and meeting-specific information.';
const meetingDates = [
  '2026-09-02','2026-09-09','2026-09-16','2026-09-30',
  '2026-10-07','2026-10-14','2026-10-21','2026-10-28',
  '2026-11-04','2026-11-11','2026-11-18',
  '2026-12-02','2026-12-09','2026-12-16',
  '2027-01-06','2027-01-13','2027-01-20','2027-01-27',
  '2027-02-03','2027-02-10','2027-02-24',
  '2027-03-03','2027-03-10','2027-03-17','2027-03-24','2027-03-31',
  '2027-04-14','2027-04-21','2027-04-28','2027-05-05','2027-05-12'
];

const meetings: ChapterEvent[] = meetingDates.map(date => ({
  id: `meeting-${date}`,
  title: 'FBLA Chapter Meeting',
  shortTitle: 'Chapter Meeting',
  date,
  startTime: '3:45 PM',
  time: '3:45 PM',
  location: 'Room 3104',
  category: 'Chapter Meeting',
  description: meetingDescription,
  membersOnlyDetails: 'Check BAND for the latest agenda and meeting-specific information.',
  source: 'Campbell FBLA 2026–27 BAND calendar',
  homepage: date === '2026-09-09'
}));

const specialEvents: ChapterEvent[] = [
  {id:'interest',title:'Interest Meeting',date:'2026-08-26',startTime:'3:45 PM',endTime:'5:00 PM',time:'3:45–5:00 PM',location:'Room 3104',category:'Chapter Meeting',description:'The chapter introduced the 2026–27 officer team, explained FBLA and current opportunities, reviewed chapter operations, and introduced the year ahead.',source:'Campbell FBLA 2026–27 chapter record',homepage:false},
  {id:'fall-rally-registration',title:'Fall Motivational Rally Registration',shortTitle:'Fall Rally Registration',date:'2026-09-08',category:'Deadline',description:"Registration and payment for Campbell's Fall Motivational Rally trip are due September 8.",note:'Event: October 5 • Six Flags Over Georgia',deadline:'2026-09-08',status:'DUE TODAY',internalLink:'/compete#rally',href:'/compete#rally',source:'Campbell FBLA September 2026 materials',homepage:false},
  {id:'spirit-day',title:'FBLA Spirit Day',date:'2026-09-15',time:'All Day',location:'Campbell High School',category:'Chapter Event',description:'Wear FBLA blue and gold. Members will meet between third and fourth block at the Grand Staircase for a chapter group picture.',source:'Campbell FBLA 2026–27 BAND calendar',homepage:true},
  {id:'ice-cream',title:'DECA × FBLA Ice Cream Social',shortTitle:'Ice Cream Social',date:'2026-09-17',startTime:'3:30 PM',endTime:'4:30 PM',time:'3:30–4:30 PM',location:'CHS Courtyard',category:'Social',description:'Our first social event of the year and our first joint social with DECA. Come for ice cream, activities, and a chance to meet members from both chapters.',featured:true,featureStyle:'cream',membersOnlyDetails:'Check BAND for current event instructions.',source:'Campbell FBLA 2026–27 BAND event',homepage:true},
  {id:'flc-registration',title:'Fall Leadership Conference Registration Deadline',shortTitle:'FLC Registration Deadline',date:'2026-09-29',location:'Athens, Georgia',category:'Deadline',description:"Members registering through Campbell must have dues fully paid, compete in an event, and participate in the Monopoly Tournament and/or Statesman Test.",deadline:'2026-09-29',internalLink:'/compete#conferences',href:'/compete#conferences',source:'Campbell FBLA 2026–27 BAND information',homepage:true},
  {id:'fall-rally',title:'Fall Motivational Rally',date:'2026-10-05',startTime:'9:30 AM',endTime:'5:00 PM',time:'9:30 AM–5:00 PM',location:'Six Flags Over Georgia',category:'Conference',description:'A day of FBLA activities, competitive-event practice, contests, networking with chapters from across Georgia, buffet lunch, and time in the park.',note:'Transportation is not provided.',featured:true,featureStyle:'navy',cost:'$85 through Campbell FBLA',internalLink:'/compete#rally',href:'/compete#rally',source:'Campbell FBLA September 2026 materials',homepage:false},
  {id:'trunk-treat',title:'CHS Trunk-or-Treat',date:'2026-10-29',startTime:'4:00 PM',endTime:'5:00 PM',time:'4:00–5:00 PM',location:'CHS PAC Parking Lot',category:'Service',description:'Help Campbell FBLA decorate and set up, run the activity for children, hand out prizes, and collect donations supporting chapter activities. Service hours are available.',featured:true,featureStyle:'blue',internalLink:'/get-involved#service',href:'/get-involved#service',source:'Campbell FBLA 2026–27 calendar and chapter materials',homepage:false},
  {id:'flc',title:'Fall Leadership Conference',date:'2026-11-16',location:'The Classic Center • Athens, Georgia',category:'Conference',description:"Campbell FBLA heads to Athens for Georgia FBLA's Fall Leadership Conference.",secondaryDescription:'Conference and competition-specific information belongs on the Compete page; members should check BAND for final Campbell logistics.',featured:true,featureStyle:'cream',abbreviation:'FLC',deadline:'2026-09-29',internalLink:'/compete#conferences',href:'/compete#conferences',membersOnlyDetails:'Check BAND for final Campbell logistics.',source:'Campbell FBLA 2026–27 BAND calendar',homepage:false},
  {id:'holiday-social',title:'Annual FBLA Holiday Social',date:'2026-12-11',startTime:'3:45 PM',endTime:'5:00 PM',time:'3:45–5:00 PM',category:'Social',description:'End the semester with Campbell FBLA at our annual holiday social. Additional activity and location details will be shared with members as the event approaches.',source:'Campbell FBLA 2026–27 calendar',homepage:false},
  {id:'shop-spartan',title:'Shop with a Spartan',date:'2026-12-12',startTime:'7:45 AM',endTime:'3:45 PM',time:'7:45 AM–3:45 PM',location:'Campbell High School + Walmart',category:'Service',description:'Campbell FBLA joins other Campbell student organizations to support 50 elementary students from local feeder schools.',secondaryDescription:"FBLA's chapter responsibility is preparing 50 family food and hygiene boxes for participating families.",note:'Participation requirements and member-specific instructions are shared through BAND.',featured:true,featureStyle:'navy',internalLink:'/get-involved#service',href:'/get-involved#service',membersOnlyDetails:'Participation requirements and member-specific instructions are shared through BAND.',source:'Campbell FBLA 2026–27 Shop with a Spartan materials',homepage:false},
  {id:'fbla-week',title:'FBLA Week 2027',date:'2027-02-07',endDate:'2027-02-13',category:'National FBLA',description:'A full week centered on FBLA, chapter participation, career and technical education, and member involvement. Campbell-specific activities will be added as they are confirmed.',note:'Celebrate. Lead. Achieve.',featured:true,featureStyle:'blue',source:'Campbell FBLA 2026–27 calendar',homepage:false},
  {id:'fall-in-love',title:'Fall in Love with FBLA',date:'2027-02-12',startTime:'3:30 PM',endTime:'5:00 PM',time:'3:30–5:00 PM',category:'Social',description:'A Campbell FBLA social during FBLA Week. Additional details will be posted as the event approaches.',source:'Campbell FBLA 2026–27 BAND calendar',homepage:false},
  {id:'slc',title:'State Leadership Conference',date:'2027-03-18',endDate:'2027-03-20',location:'Hyatt Regency Atlanta',category:'Conference',description:"Georgia FBLA's State Leadership Conference brings members together for competitive events, state officer elections, leadership workshops, recognition, and chapter experiences.",featured:true,featureStyle:'navy',abbreviation:'SLC',internalLink:'/compete#conferences',href:'/compete#conferences',source:'Campbell and Georgia FBLA 2026–27 calendars',homepage:false}
];

export const events: ChapterEvent[] = [...meetings, ...specialEvents].sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));

export function isPast(event: ChapterEvent, today: string) { return (event.endDate || event.date) < today; }
export function isToday(event: ChapterEvent, today: string) { return event.date <= today && (event.endDate || event.date) >= today; }
export function isUpcoming(event: ChapterEvent, today: string) { return event.date > today; }
export function isDeadlineSoon(event: ChapterEvent, today: string) {
  if (event.category !== 'Deadline' || isPast(event,today)) return false;
  const due = Date.parse(`${event.date}T12:00:00Z`), now = Date.parse(`${today}T12:00:00Z`);
  return due - now <= 72 * 60 * 60 * 1000;
}
export function getNextEvent(today: string) { return events.find(event => event.date > today); }
export function getUpcomingEvents(today: string) { return events.filter(event => !isPast(event,today)); }
export function getPastEvents(today: string) { return events.filter(event => isPast(event,today)).sort((a,b)=>b.date.localeCompare(a.date)); }
export function getEventsByMonth(month: string, source = events) { return source.filter(event => event.date.slice(0,7) === month); }
export function getEventsByCategory(category: EventCategory, source = events) { return source.filter(event => event.category === category); }

export const announcements = [
  {id:'officers',title:'Make your mark on Year Three.',description:'Officer and committee chair applications close September 9.',href:'/get-involved#leadership',startDisplay:'2026-08-26',endDisplay:'2026-09-09',priority:1},
  {id:'dues',title:'Membership is open.',description:'FBLA $35 · FBLA + DECA $45. Pay through MyPaymentsPlus.',href:'/get-involved#membership',startDisplay:'2026-08-03',endDisplay:'2026-10-01',priority:2},
  {id:'flc',title:'Heading to FLC?',description:'Register with an adviser by September 29.',href:'/compete#conferences',startDisplay:'2026-09-10',endDisplay:'2026-09-29',priority:1}
];
