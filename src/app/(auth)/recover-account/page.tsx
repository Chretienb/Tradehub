"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

type Role = "customer" | "vendor";

export default function RecoverAccountPage() {
  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !newEmail.trim()) {
      toast.error("Indiquez votre nom et un email où vous joindre.");
      return;
    }
    setSubmitting(true);
    // No self-service reset here on purpose — losing the only auth factor
    // means there's nothing left to verify an OTP against, so a human on the
    // support team has to confirm identity before any account is unlocked.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-7 text-primary" />
        </span>
        <div className="max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Demande envoyée</h1>
          <p className="mt-2 text-muted-foreground">
            Notre équipe va vérifier votre identité et vous recontacter à{" "}
            <span className="font-medium text-foreground">{newEmail}</span> sous 24 à 48h pour
            réactiver votre compte.
          </p>
        </div>
        <Link href="/login" className="text-sm font-medium text-primary hover:underline">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-sm">
        <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Retour à la connexion
        </Link>

        <div className="mt-6 flex items-center gap-2.5">
          <Image src="/brand/logo-icon.png" alt="TEKA" width={30} height={30} className="object-contain" />
          <span className="font-heading text-lg font-semibold tracking-tight">TEKA</span>
        </div>

        <div className="mt-6">
          <h1 className="text-2xl font-semibold tracking-tight">Email perdu ou inaccessible ?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Comme votre email sert à vous connecter, nous ne pouvons pas le réinitialiser
            automatiquement. Décrivez votre situation et notre équipe vérifiera votre identité
            avant de réactiver l&apos;accès.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Tabs value={role} onValueChange={(value) => setRole((value as Role) ?? "customer")}>
            <TabsList className="w-full">
              <TabsTrigger value="customer">Client</TabsTrigger>
              <TabsTrigger value="vendor">Fournisseur</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{role === "vendor" ? "Nom de l'entreprise" : "Nom complet"}</Label>
            <Input
              id="name"
              placeholder={role === "vendor" ? "ex. Kin Grossiste SARL" : "ex. Aline Kabeya"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="old-email">Ancien email (si vous vous en souvenez)</Label>
            <Input
              id="old-email"
              type="email"
              placeholder="vous@example.com"
              value={oldEmail}
              onChange={(e) => setOldEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="new-email">Email où vous joindre maintenant</Label>
            <Input
              id="new-email"
              type="email"
              placeholder="vous@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="details">Détails (optionnel)</Label>
            <Textarea
              id="details"
              placeholder="Ex : boîte email piratée, ancien email supprimé…"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "Envoi…" : "Envoyer la demande"}
          </Button>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 flex-shrink-0 text-primary" />
            Une vérification manuelle protège votre compte contre les usurpations.
          </p>
        </form>
      </div>
    </div>
  );
}
