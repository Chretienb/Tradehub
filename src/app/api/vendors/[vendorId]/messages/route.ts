import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";

// Send a message to a vendor — reused by both the storefront "contact
// vendor" widget and the customer inbox reply box. Gets-or-creates the
// conversation (unique(customer_id, vendor_id) makes this race-safe via
// upsert with ignoreDuplicates + a follow-up select).
export async function POST(request: Request, { params }: { params: Promise<{ vendorId: string }> }) {
  const { vendorId } = await params;
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const { body: text } = body ?? {};
  if (!text?.trim()) return NextResponse.json({ error: "body is required" }, { status: 400 });

  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .upsert(
      { customer_id: user.id, vendor_id: vendorId },
      { onConflict: "customer_id,vendor_id", ignoreDuplicates: true }
    )
    .select("id")
    .single();

  // ignoreDuplicates makes upsert return nothing on a pre-existing row —
  // fetch it explicitly in that case.
  let conversationId = conversation?.id;
  if (!conversationId) {
    const { data: existing, error: fetchError } = await supabase
      .from("conversations")
      .select("id")
      .eq("customer_id", user.id)
      .eq("vendor_id", vendorId)
      .single();
    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 });
    conversationId = existing.id;
  } else if (convError) {
    return NextResponse.json({ error: convError.message }, { status: 400 });
  }

  const { data: message, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: user.id, body: text.trim() })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return NextResponse.json({ message }, { status: 201 });
}
