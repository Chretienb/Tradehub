import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";
import { getConversationsForUser } from "@/lib/data/conversations";

// Current user's conversation list — works for both roles: a customer sees
// their vendor threads, a vendor sees their customer threads.
export async function GET(request: Request) {
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const conversations = await getConversationsForUser(supabase, user.id, profile?.role ?? "customer");
  return NextResponse.json({ conversations });
}
