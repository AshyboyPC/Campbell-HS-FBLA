import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/points/onboarding";
  const supabase = await createSupabaseServerClient();
  if (code && supabase) {
    await supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email && !/^(?:[a-z0-9]+\.[a-z0-9]+|fbla)@campbellhigh\.net$/i.test(user.email)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/points/login?error=school-email-required", url.origin));
    }
  }
  return NextResponse.redirect(new URL(next.startsWith("/points") ? next : "/points/dashboard", url.origin));
}
