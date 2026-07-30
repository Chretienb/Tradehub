import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { UserSession } from "@/lib/auth";

// Server-side session reader. Layouts/pages use this instead of reading
// Supabase directly so the mapping onto UserSession lives in one place —
// consumers (site-header.tsx, vendor-nav.tsx, etc.) never changed when this
// swapped from a mock cookie read to a real Supabase Auth + profiles lookup.
//
// rccm/location live on vendors (public business info, not private — see
// the vendors public storefront read), so vendor sessions need a second
// lookup there; customer sessions never have a vendors row at all.
export async function readSessionServer(): Promise<UserSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, phone, email, registered_address, verification_status")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  let rccm: string | undefined;
  let location: string | undefined;
  if (profile.role === "vendor") {
    const { data: vendor } = await supabase
      .from("vendors")
      .select("rccm, location")
      .eq("id", user.id)
      .single();
    rccm = vendor?.rccm ?? undefined;
    location = vendor?.location ?? undefined;
  }

  return {
    role: profile.role,
    name: profile.name,
    phone: profile.phone ?? undefined,
    email: profile.email ?? undefined,
    rccm,
    location,
    registeredAddress: profile.registered_address ?? undefined,
    verificationStatus: profile.verification_status,
  };
}
