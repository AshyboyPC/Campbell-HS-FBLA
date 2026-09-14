import { events, announcements, type ChapterEvent } from '@/data/events';
// Calendar-day comparison in the chapter timezone. Unknown end times stay unknown.
export function chapterToday(now = new Date()) { return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(now); }
export function isUpcomingEvent(event: ChapterEvent, today = chapterToday()) { return (event.endDate || event.date) >= today; }
export function isPastEvent(event: ChapterEvent, today = chapterToday()) { return !isUpcomingEvent(event,today); }
export function getNextEvents(count = 4, today = chapterToday()) { return events.filter(e=>isUpcomingEvent(e,today)&&e.homepage!==false).slice(0,count); }
export function getCurrentAnnouncements(today = chapterToday()) { return announcements.filter(a=>a.startDisplay<=today&&a.endDisplay>=today).sort((a,b)=>a.priority-b.priority); }
export function formatDate(date: string, options: Intl.DateTimeFormatOptions = {month:'short',day:'numeric'}) { return new Intl.DateTimeFormat('en-US',{...options,timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`)); }
