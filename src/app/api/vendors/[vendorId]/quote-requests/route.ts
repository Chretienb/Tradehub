import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";

// Customer's "Demander un devis" button on a vendor's storefront.
export async function POST(request: Request, { params }: { params: Promise<{ vendorId: string }> }) {
  const { vendorId } = await params;
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const { message, location, productId } = body ?? {};
  if (!message?.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const { data: quoteRequest, error } = await supabase
    .from("quote_requests")
    .insert({
      customer_id: user.id,
      vendor_id: vendorId,
      product_id: productId ?? null,
      message: message.trim(),
      location: location ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ quoteRequest }, { status: 201 });
}
