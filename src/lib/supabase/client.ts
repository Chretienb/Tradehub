import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Used for auth calls that must run on the
// client (signInWithOtp/verifyOtp, signUp/signInWithPassword, signOut) so
// @supabase/ssr can set the real signed/httpOnly session cookies itself.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
