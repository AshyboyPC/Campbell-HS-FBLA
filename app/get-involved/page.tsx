import type {Metadata} from "next";
import GetInvolvedExperience from "@/components/chapter/get-involved-experience";
import "./get-involved.css";

export const metadata:Metadata={title:"Get Involved",description:"Join Campbell FBLA, choose a membership, connect in BAND, attend Wednesday meetings, and find your place in a chapter committee."};

export default function GetInvolved(){return <GetInvolvedExperience/>}
