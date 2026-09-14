import type { Metadata } from "next";
import { PortalLogin } from "@/components/points/portal-login";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Member Sign In" };
export default function PointsLoginPage() {
  return <section className="points-entry points-login"><PortalLogin configured={hasSupabaseConfig}/></section>;
}

