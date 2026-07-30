import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Shared between GET /api/conversations and Server Components (account
// page's unread badge, account/messages) that need the same scoped query
// in-process.
export async function getConversationsForUser(supabase: SupabaseClient, userId: string, role: string) {
  const column = role === "vendor" ? "vendor_id" : "customer_id";

  const { data, error } = await supabase
    .from("conversations")
    .select(
      "id, customer_id, vendor_id, last_message_at, vendors(id, name, verified, location), messages(id, sender_id, body, kind, payment_amount, read_at, created_at)"
    )
    .eq(column, userId)
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error("getConversationsForUser", error);
    return [];
  }
  return data;
}

// A conversation is "unread" (from userId's perspective) when its latest
// message wasn't sent by them and hasn't been read yet — there's no
// per-conversation unread flag, this is derived from the messages embed.
export function isConversationUnread(
  messages: { sender_id: string; read_at: string | null; created_at: string }[],
  userId: string
) {
  if (messages.length === 0) return false;
  const last = [...messages].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  return last.sender_id !== userId && !last.read_at;
}
