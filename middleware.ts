import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/points/dashboard", request.url), 308);
  }

  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && publishableKey);
  if (!configured) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    publishableKey!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (items) => {
          items.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  const publicPortalRoute = pathname === "/points" || pathname === "/points/login" || pathname.startsWith("/points/auth/");
  if (!user && !publicPortalRoute) {
    const login = new URL("/points/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  if (user && pathname === "/points/login") return NextResponse.redirect(new URL("/points/onboarding", request.url));
  return response;
}

export const config = { matcher: ["/points/:path*", "/dashboard/:path*", "/admin/dashboard/:path*"] };
