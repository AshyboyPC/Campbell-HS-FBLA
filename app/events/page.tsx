import type {Metadata} from "next";
import EventCalendar from "@/components/chapter/event-calendar";
import "./events.css";

export const metadata:Metadata={title:"Events | 2026–2027",description:"Campbell FBLA meetings, socials, service projects, conferences, competitions, and deadlines for the 2026–2027 school year."};
export default function Events(){return <EventCalendar/>}
