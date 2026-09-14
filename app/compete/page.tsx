import type {Metadata} from "next";
import CompetitionExperience from "@/components/chapter/competition-experience";
import "./compete.css";

export const metadata:Metadata={title:"Competitive Events | Campbell FBLA",description:"Find and compare current 2026–27 Georgia FBLA high-school competitive events and learn how Campbell prepares."};
export default function Compete(){return <CompetitionExperience/>}
