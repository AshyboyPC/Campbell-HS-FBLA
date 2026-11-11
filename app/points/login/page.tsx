import type { Metadata } from "next";
import { PortalLogin } from "@/components/points/portal-login";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Member Sign In" };
export default async function PointsLoginPage({ searchParams }: { searchParams: Promise<{ authError?: string }> }) {
  const { authError } = await searchParams;
  return <section className="points-entry points-login"><PortalLogin configured={hasSupabaseConfig} failedSignIn={authError === "1"}/></section>;
}

