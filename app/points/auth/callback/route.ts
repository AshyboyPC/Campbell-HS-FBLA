import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const signUp = url.searchParams.get("intent") === "signup";
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const supabase = await createSupabaseServerClient();
  if (supabase && (code || tokenHash)) {
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: "email" });
    if (!error) return NextResponse.redirect(new URL("/points/onboarding", url.origin));
  }
  return NextResponse.redirect(new URL(signUp ? "/points/login?mode=signup&authError=1" : "/points/login?authError=1", url.origin));
}
