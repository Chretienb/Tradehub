import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";

// Escrow payment agreed on in chat. Wraps the create_escrow_payment RPC
// (order + payment message, one transaction) — not a real Mobile
// Money/card integration, matching the original mock's own scope.
export async function POST(request: Request, { params }: { params: Promise<{ vendorId: string }> }) {
  const { vendorId } = await params;
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const amount = Number(body?.amount);
  if (!(amount > 0)) return NextResponse.json({ error: "amount must be positive" }, { status: 400 });

  const { data: order, error } = await supabase
    .rpc("create_escrow_payment", { p_vendor_id: vendorId, p_amount: amount })
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ order }, { status: 201 });
}
