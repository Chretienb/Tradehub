import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";

// Accept/decline — RLS lets the owning vendor UPDATE the row at all, but
// can't express "only from status=new" as a row-ownership check, so that
// transition rule lives here.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const { status } = body ?? {};
  if (status !== "accepted" && status !== "declined") {
    return NextResponse.json({ error: "status must be accepted or declined" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("quote_requests")
    .select("status")
    .eq("id", id)
    .eq("vendor_id", user.id)
    .single();
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (existing.status !== "new") {
    return NextResponse.json({ error: "request is no longer pending" }, { status: 409 });
  }

  const { data: request_, error } = await supabase
    .from("quote_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("vendor_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ request: request_ });
}
