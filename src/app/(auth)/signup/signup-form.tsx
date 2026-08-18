"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Category } from "@/lib/data/catalog";
import type { UserRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock,
  Headset,
  Lock,
  PartyPopper,
  ShieldCheck,
} from "lucide-react";

const trustPoints = [
  { icon: BadgeCheck, text: "Fournisseurs vérifiés avant publication" },
  { icon: Lock, text: "Paiement séquestré jusqu'à livraison confirmée" },
  { icon: Headset, text: "Support disponible en cas de litige" },
];

type VendorStep = "details" | "congrats" | "verification" | "submitted";

export function SignupForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<UserRole>(
    searchParams.get("role") === "vendor" ? "vendor" : "customer"
  );
  const [vendorStep, setVendorStep] = useState<VendorStep>("details");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rccm, setRccm] = useState("");
  const [registeredAddress, setRegisteredAddress] = useState("");
  const [certified, setCertified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categoryLabels: Record<string, string> = Object.fromEntries(
    categories.map((c) => [c.slug, c.name])
  );

  async function handleCustomerSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Remplissez tous les champs pour continuer.");
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    // handle_new_user trigger reads role/name from this signup's metadata
    // and creates the profiles row — nothing else to write for customers.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { role: "customer", name } },
    });
    setSubmitting(false);
    if (signUpError) {
      toast.error(signUpError.message);
      return;
    }

    if (!data.session) {
      toast.success("Compte créé — confirmez votre email pour vous connecter.");
      router.push("/login");
      return;
    }

    toast.success("Bienvenue sur TEKA.");
    const from = searchParams.get("from");
    router.push(from || "/account");
  }

  async function handleVendorDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !category || !email || !password) {
      toast.error("Remplissez tous les champs pour continuer.");
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    // handle_new_user trigger creates the profiles + vendors rows from this
    // signup's metadata. RCCM/address/certification are collected next, in
    // the verification step, and submitted separately via
    // /api/vendor/verification — not bundled into this call.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          role: "vendor",
          name,
          location: "Kinshasa",
        },
      },
    });
    setSubmitting(false);
    if (signUpError) {
      toast.error(signUpError.message);
      return;
    }

    if (!data.session) {
      toast.success("Compte créé — confirmez votre email pour vous connecter.");
      router.push("/login?role=vendor");
      return;
    }

    setVendorStep("congrats");
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
    setSubmitting(true);
    const res = await fetch("/api/vendor/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rccm: rccm.trim(), registeredAddress: registeredAddress.trim() }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
      toast.error(error);
      return;
    }
    setVendorStep("submitted");
  }

  const isVendorOnboarding = role === "vendor" && vendorStep !== "details";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14"
        style={{ background: "linear-gradient(160deg, #0e7d43 0%, #0b6b3a 55%, #094f2c 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(oklch(1 0 0 / .6) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 80% 60% at 30% 20%, black 40%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-16 size-[420px] rounded-full blur-[110px]"
          style={{ background: "#c89b2d33" }}
        />

        <Link href="/" className="relative flex items-center gap-2.5">
          <Image
            src="/brand/logo-icon.png"
            alt="TEKA"
            width={36}
            height={36}
            className="flex-shrink-0 object-contain brightness-0 invert"
          />
          <span className="font-heading text-xl font-semibold tracking-tight">TEKA</span>
        </Link>

        <div className="relative">
          <h2 className="max-w-sm text-3xl font-semibold leading-[1.15] tracking-tight xl:text-4xl">
            Commerce. Connexion. Croissance.
          </h2>
          <p className="mt-4 max-w-sm text-white/75">
            TEKA bâtit des ponts commerciaux pour propulser la croissance des
            entreprises congolaises — acheteurs comme fournisseurs.
          </p>

          <ul className="mt-9 flex flex-col gap-4">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <li key={point.text} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                    <Icon className="size-4" />
                  </span>
                  {point.text}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative flex gap-8 border-t border-white/15 pt-6">
          <div>
            <p className="font-heading text-2xl font-semibold tabular-nums">1 200+</p>
            <p className="mt-0.5 text-xs text-white/60">Fournisseurs vérifiés</p>
          </div>
          <div>
            <p className="font-heading text-2xl font-semibold tabular-nums">48 000+</p>
            <p className="mt-0.5 text-xs text-white/60">Produits en gros</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col px-8 py-14 sm:px-8 sm:py-10 lg:overflow-y-auto lg:px-12 xl:px-20">
        {!isVendorOnboarding && (
          <>
            <Link
              href="/"
              className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Retour à l&apos;accueil
            </Link>

            <div className="mt-4 flex items-center justify-between lg:justify-end">
              <Link href="/" className="flex items-center gap-2 lg:hidden">
                <Image src="/brand/logo-icon.png" alt="TEKA" width={30} height={30} className="object-contain" />
                <span className="font-heading text-lg font-semibold text-foreground">TEKA</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link href="/login" className="font-medium text-foreground hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </>
        )}

        {role === "vendor" && vendorStep === "congrats" ? (
          <div className="flex flex-1 items-center py-10">
            <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <PartyPopper className="size-8 text-primary" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Bravo, {name || "bienvenue"} !
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Votre compte fournisseur TEKA est créé. Encore une étape — faites
                  vérifier votre entreprise pour débloquer le badge « Vérifié » et
                  rassurer vos acheteurs.
                </p>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={() => setVendorStep("verification")}
              >
                Continuer
              </Button>
              <button
                type="button"
                onClick={() => router.push("/vendor/dashboard")}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                Plus tard, aller au tableau de bord
              </button>
            </div>
          </div>
        ) : role === "vendor" && vendorStep === "verification" ? (
          <div className="flex flex-1 items-center py-10">
            <form
              onSubmit={handleSubmitVerification}
              className="mx-auto flex w-full max-w-sm flex-col gap-6"
            >
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[.14em] text-primary">
                    Étape 2 sur 2
                  </span>
                  <div className="flex flex-1 gap-1">
                    <span className="h-1 flex-1 rounded-full bg-primary" />
                    <span className="h-1 flex-1 rounded-full bg-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                    <Building2 className="size-5 text-primary" />
                  </span>
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                      Vérification de l&apos;entreprise
                    </h1>
                    <p className="text-xs text-muted-foreground">Processus de conformité (KYB)</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Nous vérifions chaque fournisseur avant d&apos;activer son badge
                  « Vérifié » — c&apos;est ce qui garantit la confiance des acheteurs
                  sur TEKA. Ces informations sont transmises uniquement à notre
                  équipe de conformité.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rccm">
                    Numéro RCCM{" "}
                    <span className="text-muted-foreground">
                      (Registre du Commerce et du Crédit Mobilier)
                    </span>
                  </Label>
                  <Input
                    id="rccm"
                    placeholder="CD/KNG/RCCM/24-B-1234"
                    className="font-mono tracking-wide"
                    value={rccm}
                    onChange={(e) => setRccm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="registered-address">Adresse enregistrée</Label>
                  <Input
                    id="registered-address"
                    placeholder="Ex : 12 Avenue du Commerce, Gombe, Kinshasa"
                    value={registeredAddress}
                    onChange={(e) => setRegisteredAddress(e.target.value)}
                  />
                </div>

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
                  Toute fausse déclaration entraînera le blocage immédiat du compte et de
                  la personne responsable, avec signalement aux autorités compétentes.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
                  <Lock className="size-3.5 flex-shrink-0 text-primary" />
                  Connexion chiffrée — vos données ne sont jamais partagées avec des tiers.
                </p>
                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? "Envoi sécurisé…" : "Envoyer pour vérification"}
                </Button>
                <button
                  type="button"
                  onClick={() => router.push("/vendor/dashboard")}
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Plus tard, aller au tableau de bord
                </button>
              </div>
            </form>
          </div>
        ) : role === "vendor" && vendorStep === "submitted" ? (
          <div className="flex flex-1 items-center py-10">
            <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                <Clock className="size-8 text-amber-600 dark:text-amber-400" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dossier envoyé</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Votre demande de vérification a bien été transmise à notre équipe
                  de conformité. Vous serez notifié dès que votre badge « Vérifié »
                  sera actif.
                </p>
              </div>

              <div className="flex w-full items-center justify-between rounded-xl border p-3.5">
                <span className="text-sm font-medium">Statut du dossier</span>
                <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <Clock className="size-3.5" /> Vérification en cours
                </span>
              </div>

              <p className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 flex-shrink-0 text-primary" />
                Délai de traitement habituel : 24 à 48 heures ouvrées.
              </p>

              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push("/vendor/dashboard")}
              >
                Aller au tableau de bord <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center py-10">
            <form
              onSubmit={role === "vendor" ? handleVendorDetails : handleCustomerSignup}
              className="mx-auto flex w-full max-w-sm flex-col gap-6"
            >
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Créez votre compte TEKA</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Un compte acheteur ou fournisseur — au choix. Gratuit, et nécessaire
                  pour contacter un fournisseur ou vendre sur TEKA.
                </p>
              </div>

              <Tabs value={role} onValueChange={(value) => setRole((value as UserRole) ?? "customer")}>
                <TabsList className="w-full">
                  <TabsTrigger value="customer">Client</TabsTrigger>
                  <TabsTrigger value="vendor">Fournisseur</TabsTrigger>
                </TabsList>
                <TabsContent value="customer" className="mt-2 text-sm text-muted-foreground">
                  Trouvez des fournisseurs vérifiés et achetez en gros en toute sécurité.
                </TabsContent>
                <TabsContent value="vendor" className="mt-2 text-sm text-muted-foreground">
                  Publiez votre boutique et recevez des demandes d&apos;acheteurs.
                </TabsContent>
              </Tabs>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">{role === "vendor" ? "Nom de l'entreprise" : "Nom complet"}</Label>
                  <Input
                    id="name"
                    placeholder={role === "vendor" ? "ex. Kin Grossiste SARL" : "ex. Aline Kabeya"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {role === "vendor" && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Catégorie de produits</Label>
                    <Select value={category} onValueChange={(value) => setCategory(value ?? "")}>
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Que vendez-vous en gros ?">
                          {(value: string | null) =>
                            value ? categoryLabels[value] : "Que vendez-vous en gros ?"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {role === "vendor" ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="vous@entreprise.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">Téléphone de contact (optionnel)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="vous@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="signup-password">Mot de passe</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {role === "vendor"
                    ? submitting
                      ? "Création du compte…"
                      : "Continuer"
                    : submitting
                      ? "Création du compte…"
                      : "Créer le compte"}
                </Button>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 flex-shrink-0 text-primary" />
                  Vos informations sont protégées et ne sont jamais partagées sans votre accord.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
