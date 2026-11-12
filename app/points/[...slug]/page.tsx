import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/points/portal-shell";
import { loadPortalContext } from "@/lib/points/portal-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Member Portal" };
export default async function PortalRoute({ params, searchParams }: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ period?: string | string[]; grade?: string | string[] }>;
}) {
  const { slug } = await params;
  const route = slug.join("/");
  const consolidatedRoutes: Record<string, string> = {
    attendance: "/points/activity",
    history: "/points/activity",
    rules: "/points/activity",
    claims: "/points/requests",
    corrections: "/points/requests",
    "officer/status": "/points/officer",
    "officer/absence-request": "/points/officer",
    "manage/point-review": "/points/manage/review",
    "manage/attendance-review": "/points/manage/review",
    "manage/officer-team": "/points/manage/review",
    "manage/officer-attendance": "/points/manage/review",
    "manage/imports": "/points/manage/events",
    "admin/integrations": "/points/manage/events",
    "admin/point-rules": "/points/admin/settings",
    "admin/cord-rules": "/points/admin/settings",
    "admin/officer-policy": "/points/admin/settings",
    "admin/audit": "/points/admin/settings",
    "manage/reports": "/points/admin/settings",
  };
  if (consolidatedRoutes[route]) redirect(consolidatedRoutes[route]);
  return <PortalShell context={await loadPortalContext(route, route === "leaderboard" ? await searchParams : undefined)}/>;
}
