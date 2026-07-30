import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Shared between GET /api/orders and the account/orders Server Component.
export async function getCustomerOrders(supabase: SupabaseClient, customerId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(name, image_url, unit), vendors(name)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCustomerOrders", error);
    return [];
  }
  return data;
}
