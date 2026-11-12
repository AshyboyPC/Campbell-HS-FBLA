import type { Metadata } from "next";
import { PortalLogin } from "@/components/points/portal-login";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Member Sign In", robots: { index: false } };

export default async function PointsLoginPage({ searchParams }: {
  searchParams: Promise<{ authError?: string; mode?: string; useSavedEmail?: string }>;
}) {
  const { authError, mode, useSavedEmail } = await searchParams;
  return <PortalLogin key={mode ?? "signin"} configured={hasSupabaseConfig} failedSignIn={authError === "1"}
    signUp={mode === "signup"} useSavedEmail={useSavedEmail === "1"} />;
}
