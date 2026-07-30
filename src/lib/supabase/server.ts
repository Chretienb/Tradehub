import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client for Server Components and Route Handlers.
// Server Components can't write cookies (only read them), so the setAll
// call is wrapped in a try/catch — it's a no-op there, and relies on
// src/lib/supabase/middleware.ts's updateSession() to actually refresh the
// session cookie on every request via proxy.ts.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — proxy.ts refreshes the
            // session cookie instead.
          }
        },
      },
    }
  );
}

// generateStaticParams runs at build time with no HTTP request, so
// next/headers' cookies() throws there — this is for build-time-only,
// unauthenticated public reads (e.g. vendors/[id]'s generateStaticParams),
// never for anything that needs a user session.
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Shared Route Handler auth pattern: the web app authenticates via cookies
// (handled above), but a future mobile client won't have those — it'll
// send `Authorization: Bearer <token>` instead. getUser() accepts an
// explicit JWT for exactly this case, so every /api/** handler resolves
// the caller through this one helper instead of assuming cookies.
export async function getRequestUser(request: Request, supabase: SupabaseClient) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const { data, error } = await supabase.auth.getUser(authHeader.slice(7));
    return error ? null : data.user;
  }
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}
