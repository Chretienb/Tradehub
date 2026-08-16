"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoReveal } from "@/components/logo-reveal";
import type { UserRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { BadgeCheck, Headset, Lock } from "lucide-react";

const trustPoints = [
  { icon: BadgeCheck, text: "Fournisseurs vérifiés avant publication" },
  { icon: Lock, text: "Paiement séquestré jusqu'à livraison confirmée" },
  { icon: Headset, text: "Support disponible en cas de litige" },
];

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<UserRole>(
    searchParams.get("role") === "vendor" ? "vendor" : "customer"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [revealing, setRevealing] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Entrez votre email et votre mot de passe.");
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRevealing(true);
  }

  function handleRevealComplete() {
    const from = searchParams.get("from");
    router.push(role === "vendor" ? "/vendor/dashboard" : from || "/account");
  }

  if (revealing) {
    return <LogoReveal onComplete={handleRevealComplete} />;
  }

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
            Content de vous revoir.
          </h2>
          <p className="mt-4 max-w-sm text-white/75">
            Retrouvez vos fournisseurs, vos demandes et vos commandes en gros
            en un seul endroit.
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
      <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-20">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <Image src="/brand/logo-icon.png" alt="TEKA" width={30} height={30} className="object-contain" />
            <span className="font-heading text-lg font-semibold text-foreground">TEKA</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Pas de compte ?{" "}
            <Link href="/signup" className="font-medium text-foreground hover:underline">
              En créer un
            </Link>
          </p>
        </div>

        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Se connecter</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {role === "vendor"
                  ? "Connectez-vous à votre compte fournisseur TEKA."
                  : "Connectez-vous à votre compte TEKA avec votre email."}
              </p>
            </div>

            <Tabs value={role} onValueChange={(value) => setRole((value as UserRole) ?? "customer")}>
              <TabsList className="w-full">
                <TabsTrigger value="customer">Client</TabsTrigger>
                <TabsTrigger value="vendor">Fournisseur</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={role === "vendor" ? "vous@entreprise.com" : "vous@example.com"}
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
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Connexion…" : "Se connecter"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Vous n&apos;avez pas de compte ?{" "}
                <Link
                  href={role === "vendor" ? "/signup?role=vendor" : "/signup"}
                  className="font-medium text-foreground hover:underline"
                >
                  En créer un
                </Link>
              </p>
              <p className="text-center text-xs text-muted-foreground">
                <Link href="/recover-account" className="hover:underline">
                  Mot de passe oublié ?
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
