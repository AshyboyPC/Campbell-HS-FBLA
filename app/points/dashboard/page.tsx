import type { Metadata } from "next";
import { PortalShell } from "@/components/points/portal-shell";
import { loadPortalContext } from "@/lib/points/portal-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Member Dashboard" };
export default async function PointsDashboard() {
  return <PortalShell context={await loadPortalContext("dashboard")}/>;
}
