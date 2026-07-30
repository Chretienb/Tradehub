import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getConversationsForUser } from "@/lib/data/conversations";
import { getInitials, unwrapOne } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { MessagesPanel, type ConversationRow } from "./messages-panel";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rows = user ? await getConversationsForUser(supabase, user.id, "customer") : [];
  const conversations: ConversationRow[] = rows.map((c) => {
    const vendor = unwrapOne<{ id: string; name: string; verified: boolean; location: string }>(c.vendors);
    return {
      id: c.id,
      vendorId: vendor?.id ?? c.vendor_id,
      vendorName: vendor?.name ?? "Fournisseur",
      vendorVerified: vendor?.verified ?? false,
      vendorLocation: vendor?.location ?? "",
      vendorInitials: getInitials(vendor?.name ?? "?"),
      messages: [...c.messages]
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((m) => ({
          id: m.id,
          senderId: m.sender_id,
          body: m.body,
          kind: m.kind,
          paymentAmount: m.payment_amount,
          createdAt: m.created_at,
        })),
    };
  });

  return (
    <div className="flex h-screen flex-col bg-secondary/10 p-6 sm:p-8">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden">
        <div className="mb-6 flex-shrink-0">
          <Link
            href="/account"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Tableau de bord
          </Link>
          <p className="text-sm font-medium text-primary">Mon compte</p>
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          <p className="mt-1 text-muted-foreground">Échangez directement avec vos fournisseurs.</p>
        </div>

        {user && <MessagesPanel userId={user.id} initialConversations={conversations} />}
      </div>
    </div>
  );
}
