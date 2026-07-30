import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Route protection for the vendor dashboard and customer account area.
// Next.js 16 renamed `middleware.ts` to `proxy.ts` (and `middleware()` to
// `proxy()`) — see node_modules/next/dist/docs .../upgrading/version-16.md.
//
// updateSession() refreshes the Supabase session cookie on every request
// (the standard @supabase/ssr Next.js pattern) and hands back a client
// bound to that same request/response pair, which we then use to verify
// the caller and look up their role.
export async function proxy(request: NextRequest) {
  const { supabase, response } = updateSession(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requiredRole = request.nextUrl.pathname.startsWith("/vendor") ? "vendor" : "customer";

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  if (!user || role !== requiredRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    loginUrl.searchParams.set("role", requiredRole);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/vendor/:path*", "/account/:path*"],
};
