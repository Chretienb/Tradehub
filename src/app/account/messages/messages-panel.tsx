"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ArrowLeft, BadgeCheck, ShieldCheck, Send, Wallet } from "lucide-react";

export type MessageRow = {
  id: string;
  senderId: string;
  body: string;
  kind: "text" | "payment";
  paymentAmount: number | null;
  createdAt: string;
};

export type ConversationRow = {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorVerified: boolean;
  vendorLocation: string;
  vendorInitials: string;
  messages: MessageRow[];
};

async function authHeaders() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };
}

export function MessagesPanel({
  userId,
  initialConversations,
}: {
  userId: string;
  initialConversations: ConversationRow[];
}) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  function isUnread(conv: ConversationRow) {
    const last = conv.messages[conv.messages.length - 1];
    return !!last && last.senderId !== userId;
  }

  async function selectConversation(id: string) {
    setSelectedId(id);
    setPayOpen(false);
    // Marks the other party's messages read as a side effect; response is
    // the authoritative message list for this thread.
    const res = await fetch(`/api/conversations/${id}/messages`, { headers: await authHeaders() });
    if (!res.ok) return;
    const { messages } = await res.json();
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              messages: messages.map((m: { id: string; sender_id: string; body: string; kind: "text" | "payment"; payment_amount: number | null; created_at: string }) => ({
                id: m.id,
                senderId: m.sender_id,
                body: m.body,
                kind: m.kind,
                paymentAmount: m.payment_amount,
                createdAt: m.created_at,
              })),
            }
          : c
      )
    );
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !selected) return;
    setSending(true);
    const res = await fetch(`/api/vendors/${selected.vendorId}/messages`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ body: draft.trim() }),
    });
    setSending(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
      toast.error(error);
      return;
    }
    const { message } = await res.json();
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: message.id,
                  senderId: message.sender_id,
                  body: message.body,
                  kind: message.kind,
                  paymentAmount: message.payment_amount,
                  createdAt: message.created_at,
                },
              ],
            }
          : c
      )
    );
    setDraft("");
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(payAmount);
    if (!selected || !amount || amount <= 0) return;

    setPaying(true);
    const res = await fetch(`/api/vendors/${selected.vendorId}/payments`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ amount }),
    });
    setPaying(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
      toast.error(error);
      return;
    }

    setPayAmount("");
    setPayOpen(false);
    toast.success(`Paiement de ${amount.toLocaleString("fr-FR")} $ envoyé — en séquestre.`);
    // Payment creates a message + order server-side; reload this thread.
    selectConversation(selected.id);
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border bg-background">
      {/* Conversation list */}
      <div
        className={cn(
          "w-full flex-shrink-0 overflow-y-auto border-r sm:block sm:w-72",
          selected ? "hidden" : "block"
        )}
      >
        {conversations.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">Aucune conversation pour le moment.</p>
        )}
        {conversations.map((conv) => {
          const lastMessage = conv.messages[conv.messages.length - 1];
          const active = conv.id === selectedId;

          return (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={cn(
                "flex w-full items-start gap-3 border-b p-4 text-left transition-colors hover:bg-secondary/60",
                active && "bg-secondary/60"
              )}
            >
              <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                {conv.vendorInitials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium">{conv.vendorName}</p>
                  {conv.vendorVerified && <BadgeCheck className="size-3.5 flex-shrink-0 text-primary" />}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {lastMessage?.kind === "payment" ? `💳 ${lastMessage.body}` : lastMessage?.body}
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                <span className="text-[11px] text-muted-foreground">
                  {lastMessage ? formatRelativeTime(lastMessage.createdAt) : ""}
                </span>
                {isUnread(conv) && <span className="size-2 rounded-full bg-primary" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Thread */}
      <div className={cn("flex min-w-0 flex-1 flex-col", !selected && "hidden sm:flex")}>
        {selected ? (
          <>
            <div className="flex flex-shrink-0 items-center gap-3 border-b p-4">
              <button
                onClick={() => setSelectedId(null)}
                className="flex size-8 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary sm:hidden"
                aria-label="Retour"
              >
                <ArrowLeft className="size-4" />
              </button>
              <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                {selected.vendorInitials}
              </span>
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => router.push(`/vendors/${selected.vendorId}`)}
                  className="flex items-center gap-1.5 truncate text-sm font-medium hover:underline"
                >
                  {selected.vendorName}
                  {selected.vendorVerified && <BadgeCheck className="size-3.5 flex-shrink-0 text-primary" />}
                </button>
                <p className="truncate text-xs text-muted-foreground">{selected.vendorLocation}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {selected.messages.map((msg) =>
                msg.kind === "payment" ? (
                  <div key={msg.id} className="flex flex-col items-end">
                    <div className="flex max-w-[75%] items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-3.5 py-2 text-sm text-primary">
                      <ShieldCheck className="size-4 flex-shrink-0" />
                      {msg.body}
                    </div>
                    <span className="mt-1 px-1 text-[11px] text-muted-foreground">
                      {formatRelativeTime(msg.createdAt)}
                    </span>
                  </div>
                ) : (
                  <div
                    key={msg.id}
                    className={cn("flex flex-col", msg.senderId === userId ? "items-end" : "items-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                        msg.senderId === userId
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : "rounded-bl-sm bg-secondary text-foreground"
                      )}
                    >
                      {msg.body}
                    </div>
                    <span className="mt-1 px-1 text-[11px] text-muted-foreground">
                      {formatRelativeTime(msg.createdAt)}
                    </span>
                  </div>
                )
              )}
            </div>

            <form onSubmit={sendMessage} className="flex flex-shrink-0 gap-2 border-t p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Écrire un message…"
                className="h-10 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                aria-label="Envoyer"
                className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                disabled={!draft.trim() || sending}
              >
                <Send className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setPayOpen((v) => !v)}
                aria-label="Payer"
                className={cn(
                  "flex size-10 flex-shrink-0 items-center justify-center rounded-full transition-colors",
                  payOpen
                    ? "bg-[#c89b2d] text-white"
                    : "border text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Wallet className="size-4" />
              </button>
            </form>

            {payOpen && (
              <form
                onSubmit={handlePay}
                className="flex flex-shrink-0 flex-col gap-3 border-t bg-secondary/30 p-4"
              >
                <p className="text-xs text-muted-foreground">
                  Une fois le prix convenu ci-dessus, réglez directement ici. Le
                  paiement reste séquestré par TEKA jusqu&apos;à confirmation de
                  réception.
                </p>
                <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm">
                  <ShieldCheck className="size-4 flex-shrink-0 text-primary" />
                  Paiement sécurisé — retenu par TEKA jusqu&apos;à livraison confirmée.
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder="Montant convenu"
                      className="h-10 w-full rounded-full border bg-background pl-7 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!payAmount || Number(payAmount) <= 0 || paying}
                    className="flex-shrink-0 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-40"
                  >
                    Payer
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  );
}
