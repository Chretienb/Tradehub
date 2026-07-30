import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";
import { getCustomerOrders } from "@/lib/data/orders";

// Current customer's order history, properly scoped — replaces the mock's
// getOrdersForCustomer(), which returned every order regardless of who
// was logged in.
export async function GET(request: Request) {
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const orders = await getCustomerOrders(supabase, user.id);
  return NextResponse.json({ orders });
}
