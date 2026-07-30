import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";

// Submit/resubmit KYB. verification_status is hardcoded to "pending" here
// regardless of what the client sends — RLS lets a vendor update their own
// profiles row, but can't distinguish "set to pending" from "set to
// verified" on the same column, so that distinction has to live here.
// Approval to verified/rejected stays a manual human-reviewer step.
export async function POST(request: Request) {
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "vendor") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { rccm, registeredAddress } = body ?? {};
  if (!rccm || !registeredAddress) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }

  // rccm is public (vendors table), registered_address/verification_status
  // are private (profiles table) — two writes, same request.
  const [vendorUpdate, profileUpdate] = await Promise.all([
    supabase
      .from("vendors")
      .update({ rccm, updated_at: new Date().toISOString() })
      .eq("id", user.id),
    supabase
      .from("profiles")
      .update({
        registered_address: registeredAddress,
        verification_status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id),
  ]);

  const error = vendorUpdate.error ?? profileUpdate.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
