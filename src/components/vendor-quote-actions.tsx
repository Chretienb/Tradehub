"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { UserSession } from "@/lib/auth";
import { Send } from "lucide-react";

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

export function VendorQuoteActions({
  session,
  vendorId,
  vendorName,
  vendorPath,
}: {
  session: UserSession | null;
  vendorId: string;
  vendorName: string;
  vendorPath: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [sending, setSending] = useState(false);

  function requireCustomer(action: () => void) {
    if (!session) {
      router.push(`/login?from=${encodeURIComponent(vendorPath)}&role=customer`);
      return;
    }
    action();
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    requireCustomer(async () => {
      setSending(true);
      const res = await fetch(`/api/vendors/${vendorId}/messages`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ body: message.trim() }),
      });
      setSending(false);
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
        toast.error(error);
        return;
      }
      toast.success(`Message envoyé à ${vendorName}.`, {
        action: { label: "Voir", onClick: () => router.push("/account/messages") },
      });
      setMessage("");
    });
  }

  function handleRequestQuote() {
    requireCustomer(async () => {
      setRequesting(true);
      const res = await fetch(`/api/vendors/${vendorId}/quote-requests`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ message: `Demande de devis via la boutique de ${vendorName}.` }),
      });
      setRequesting(false);
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
        toast.error(error);
        return;
      }
      toast.success(`Votre demande a été envoyée à ${vendorName}.`);
    });
  }

  return (
    <>
      <Button className="w-full" disabled={requesting} onClick={handleRequestQuote}>
        Demander un devis
      </Button>

      <form onSubmit={handleSend} className="flex flex-col gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Écrire à ${vendorName}…`}
          rows={3}
          className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" variant="outline" className="w-full gap-2" disabled={!message.trim() || sending}>
          <Send className="size-4" /> Envoyer le message
        </Button>
      </form>

      {!session && (
        <p className="text-center text-xs text-muted-foreground">
          Un compte acheteur gratuit est nécessaire pour contacter un fournisseur.
        </p>
      )}
    </>
  );
}
