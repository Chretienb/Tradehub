import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";

// settings-form.tsx "Enregistrer" — business name/city/phone/notification
// prefs. Name/city are public (vendors table), phone/notification prefs
// are private (profiles table) — same split reasoning as verification/route.ts.
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "vendor") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { businessName, city, phone, notificationChannels } = body ?? {};

  const vendorUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (businessName !== undefined) vendorUpdates.name = businessName;
  if (city !== undefined) vendorUpdates.location = city;

  const profileUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (phone !== undefined) profileUpdates.phone = phone;
  if (notificationChannels !== undefined) profileUpdates.notification_channels = notificationChannels;

  const [vendorUpdate, profileUpdate] = await Promise.all([
    supabase.from("vendors").update(vendorUpdates).eq("id", user.id),
    supabase.from("profiles").update(profileUpdates).eq("id", user.id),
  ]);

  const error = vendorUpdate.error ?? profileUpdate.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
