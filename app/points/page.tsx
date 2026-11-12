import type { Metadata } from "next";
import { PortalEntry } from "@/components/points/portal-entry";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Member Portal", description: "Private Campbell FBLA points, attendance, and graduation cord progress." };

export default async function PointsEntry() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  return <PortalEntry signedIn={Boolean(user?.email_confirmed_at)} />;
}
