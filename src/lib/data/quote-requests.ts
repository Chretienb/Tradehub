import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Shared between GET /api/vendor/quote-requests and Server Components
// (vendor/dashboard, vendor/requests) that need the same scoped query
// in-process — avoids a Server Component HTTP-round-tripping to its own
// server for data it could just query directly.
export async function getVendorQuoteRequests(supabase: SupabaseClient, vendorId: string) {
  const { data, error } = await supabase
    .from("quote_requests")
    .select(
      "id, customer_id, product_id, message, location, status, source, created_at, profiles(name), products(name)"
    )
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getVendorQuoteRequests", error);
    return [];
  }
  return data;
}
