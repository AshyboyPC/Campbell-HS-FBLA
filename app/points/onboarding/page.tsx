import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PortalOnboarding } from "@/components/points/portal-onboarding";

export const dynamic = "force-dynamic";
export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user?.email || !user.email_confirmed_at) redirect("/points/login");
  const { data: profile } = await supabase!.from("profiles").select("onboarding_completed,approved,active,account_role").eq("auth_user_id", user.id).maybeSingle();
  if (profile?.onboarding_completed) redirect(profile.account_role === "adviser" ? "/points/admin/dashboard" : "/points/dashboard");
  const meta = user.user_metadata || {}; const emailName = user.email.split("@")[0].split(".");
  return <PortalOnboarding email={user.email} defaults={{ firstName: meta.given_name || emailName[0] || "", lastName: meta.family_name || emailName.slice(1).join(" "), displayName: meta.full_name || "" }}/>
}
