import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";

// Status transitions: vendor moves sequestre -> expediee, customer moves
// expediee -> livree. Two different actors, two different allowed
// transitions on the same column — RLS can't express "only these parties,
// only these from-states," so both checks live here.
//
// deliveryPhotoUrl is accepted but Storage upload isn't wired up yet — the
// account/orders/page.tsx photo picker is still a local-only preview, same
// as the mock it replaced. Flagged as a follow-up, not silently dropped.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const { status, deliveryPhotoUrl } = body ?? {};

  const { data: order } = await supabase
    .from("orders")
    .select("customer_id, vendor_id, status")
    .eq("id", id)
    .single();
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });

  const isVendor = order.vendor_id === user.id;
  const isCustomer = order.customer_id === user.id;
  if (!isVendor && !isCustomer) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const validTransition =
    (isVendor && order.status === "sequestre" && status === "expediee") ||
    (isCustomer && order.status === "expediee" && status === "livree");
  if (!validTransition) {
    return NextResponse.json({ error: "invalid status transition" }, { status: 409 });
  }

  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (status === "livree" && deliveryPhotoUrl) updates.delivery_photo_url = deliveryPhotoUrl;

  const { data: updated, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ order: updated });
}
