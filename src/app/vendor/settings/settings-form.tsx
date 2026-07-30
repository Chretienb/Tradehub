"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserSession, VerificationStatus } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import {
  AlertTriangle,
  Bell,
  BellRing,
  Building2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

const notificationChannels = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: Phone },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

const statusMeta: Record<
  VerificationStatus,
  { label: string; icon: typeof ShieldCheck; className: string }
> = {
  unsubmitted: {
    label: "Non soumis",
    icon: AlertTriangle,
    className: "bg-secondary text-muted-foreground",
  },
  pending: {
    label: "En cours de vérification",
    icon: Clock,
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  verified: {
    label: "Entreprise vérifiée",
    icon: ShieldCheck,
    className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  rejected: {
    label: "Vérification refusée",
    icon: ShieldX,
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

export function SettingsForm({ session }: { session: UserSession | null }) {
  const [businessName, setBusinessName] = useState(session?.name ?? "");
  const [city, setCity] = useState(session?.location ?? "Kinshasa");
  const [phone, setPhone] = useState(session?.phone ?? "");
  const [channels, setChannels] = useState<string[]>(["email", "sms", "whatsapp"]);
  const [saving, setSaving] = useState(false);

  const [rccm, setRccm] = useState(session?.rccm ?? "");
  const [registeredAddress, setRegisteredAddress] = useState(session?.registeredAddress ?? "");
  const [certified, setCertified] = useState(false);
  const [status, setStatus] = useState<VerificationStatus>(session?.verificationStatus ?? "unsubmitted");
  const [submittingVerification, setSubmittingVerification] = useState(false);

  function toggleChannel(id: string) {
    setChannels((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const {
      data: { session: authSession },
    } = await supabase.auth.getSession();

    const res = await fetch("/api/vendor/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(authSession ? { Authorization: `Bearer ${authSession.access_token}` } : {}),
      },
      body: JSON.stringify({ businessName, city, phone, notificationChannels: channels }),
    });
    setSaving(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
      toast.error(error);
      return;
    }
    toast.success("Paramètres enregistrés.");
  }

  async function handleSubmitVerification(e: React.FormEvent) {
    e.preventDefault();
    if (!rccm.trim() || !registeredAddress.trim()) {
      toast.error("Le numéro RCCM et l'adresse enregistrée sont requis.");
      return;
    }
    if (!certified) {
      toast.error("Vous devez certifier l'exactitude de ces informations.");
      return;
    }
    setSubmittingVerification(true);
    const res = await fetch("/api/vendor/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rccm: rccm.trim(), registeredAddress: registeredAddress.trim() }),
    });
    setSubmittingVerification(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
      toast.error(error);
      return;
    }
    setStatus("pending");
    toast.success("Dossier envoyé pour vérification.");
  }

  const StatusIcon = statusMeta[status].icon;

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Votre entreprise</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="business-name">Nom de l&apos;entreprise</Label>
              <Input
                id="business-name"
                placeholder="Ex : Kin Grossiste SARL"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">Ville</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email de connexion</Label>
              <p className="rounded-lg border bg-secondary/40 px-3 py-2.5 text-sm">
                {session?.email || "Aucun email enregistré"}
              </p>
              <p className="text-xs text-muted-foreground">
                C&apos;est l&apos;email utilisé pour vous connecter à TEKA.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Téléphone de contact</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BellRing className="size-3.5 flex-shrink-0" />
                Utilisé pour vous alerter par SMS quand un acheteur vous écrit ou commande.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Recevez une alerte pour chaque nouvelle demande de devis et commande.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {notificationChannels.map((c) => {
                const Icon = c.icon;
                const active = channels.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleChannel(c.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4" />
              Vérification de l&apos;entreprise
            </CardTitle>
            <Badge className={statusMeta[status].className} variant="secondary">
              <StatusIcon className="size-3.5" />
              {statusMeta[status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Le badge « Vérifié » n&apos;apparaît sur votre boutique qu&apos;après contrôle de
            votre RCCM et de votre adresse par l&apos;équipe TEKA.
          </p>

          <form onSubmit={handleSubmitVerification} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rccm">
                Numéro RCCM <span className="text-muted-foreground">(Registre du Commerce et du Crédit Mobilier)</span>
              </Label>
              <Input
                id="rccm"
                placeholder="Ex : CD/KNG/RCCM/24-B-1234"
                value={rccm}
                onChange={(e) => setRccm(e.target.value)}
                disabled={status === "pending" || status === "verified"}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="registered-address">Adresse enregistrée</Label>
              <Input
                id="registered-address"
                placeholder="Ex : 12 Avenue du Commerce, Gombe, Kinshasa"
                value={registeredAddress}
                onChange={(e) => setRegisteredAddress(e.target.value)}
                disabled={status === "pending" || status === "verified"}
              />
            </div>

            {status === "unsubmitted" || status === "rejected" ? (
              <>
                <label className="flex items-start gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={certified}
                    onChange={(e) => setCertified(e.target.checked)}
                    className="mt-0.5 size-4 flex-shrink-0 accent-primary"
                  />
                  <span className="text-muted-foreground">
                    Je certifie que ces informations sont exactes et correspondent à une
                    entreprise réellement enregistrée en RDC.
                  </span>
                </label>

                <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
                  <AlertTriangle className="mt-0.5 size-3.5 flex-shrink-0" />
                  Toute fausse déclaration entraînera le blocage immédiat du compte et de la
                  personne responsable, avec signalement aux autorités compétentes.
                </p>

                <button
                  type="submit"
                  disabled={submittingVerification}
                  className="rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {submittingVerification ? "Envoi…" : "Soumettre pour vérification"}
                </button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                {status === "pending"
                  ? "Votre dossier est en cours d'examen — comptez 24 à 48h."
                  : "Votre entreprise est vérifiée."}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
