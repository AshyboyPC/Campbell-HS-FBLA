import type { Metadata } from "next";
import { PortalShell } from "@/components/points/portal-shell";
import { loadPortalContext } from "@/lib/points/portal-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Member Portal" };
export default async function PortalRoute({ params }:{ params:Promise<{slug:string[]}> }) {
  const { slug } = await params;
  const route = slug.join("/");
  return <PortalShell context={await loadPortalContext(route)}/>;
}

