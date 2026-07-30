import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";
import { getVendorQuoteRequests } from "@/lib/data/quote-requests";

// The current vendor's quote-request inbox — vendor/requests/page.tsx and
// the dashboard's "new" count both use this (or the shared query function
// directly, when called from a Server Component in-process).
export async function GET(request: Request) {
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const requests = await getVendorQuoteRequests(supabase, user.id);
  return NextResponse.json({ requests });
}
