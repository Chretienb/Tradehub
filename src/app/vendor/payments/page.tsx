"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CreditCard, ShieldCheck, Phone } from "lucide-react";

const providers = [
  { id: "airtel", label: "Airtel Money", icon: Phone },
  { id: "orange", label: "Orange Money", icon: Phone },
  { id: "mpesa", label: "M-Pesa", icon: Phone },
  { id: "card", label: "Compte bancaire", icon: CreditCard },
];

export default function VendorPaymentsPage() {
  const [provider, setProvider] = useState("airtel");
  const [number, setNumber] = useState("");
  const [connected, setConnected] = useState<{ provider: string; number: string } | null>(null);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!number.trim()) {
      toast.error("Entrez un numéro ou identifiant de compte.");
      return;
    }
    setConnected({ provider, number: number.trim() });
    toast.success("Moyen de paiement enregistré.");
  }

  const connectedLabel = providers.find((p) => p.id === connected?.provider)?.label;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Espace fournisseur</p>
        <h1 className="text-2xl font-semibold tracking-tight">Paiements</h1>
        <p className="mt-1 text-muted-foreground">
          Choisissez comment vous recevez vos paiements une fois le séquestre libéré.
        </p>
      </div>

      {connected && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border bg-background p-4">
          <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="size-5 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Connecté : {connectedLabel}</p>
            <p className="truncate text-xs text-muted-foreground">{connected.number}</p>
          </div>
        </div>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <Label>Moyen de réception</Label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {providers.map((p) => {
                  const Icon = p.icon;
                  const active = provider === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProvider(p.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="payout-number">
                {provider === "card" ? "Numéro de compte" : "Numéro de téléphone"}
              </Label>
              <Input
                id="payout-number"
                placeholder={provider === "card" ? "Ex : 000123456789" : "+1 234 567 8900"}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Enregistrer
            </button>

            <p className="text-xs text-muted-foreground">
              Ce moyen de paiement sera visible par les acheteurs une fois un montant convenu
              dans la messagerie — le paiement reste séquestré par TEKA jusqu&apos;à confirmation
              de réception.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
