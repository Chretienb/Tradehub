import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Banknote,
  CheckCircle2,
  Landmark,
  Lock,
  PackageCheck,
  Scale,
  ShoppingCart,
  UserCheck,
} from "lucide-react";

const steps = [
  {
    number: 1,
    icon: ShoppingCart,
    title: "L'acheteur commande",
    description: "Il choisit un produit en gros et passe commande sur la plateforme.",
  },
  {
    number: 2,
    icon: Lock,
    title: "Paiement en séquestre",
    description: "L'acheteur paie via Mobile Money. Les fonds sont bloqués, pas encore versés.",
  },
  {
    number: 3,
    icon: PackageCheck,
    title: "Le fournisseur livre",
    description: "Le fournisseur expédie, rassuré : le paiement est déjà sécurisé.",
  },
  {
    number: 4,
    icon: CheckCircle2,
    title: "L'acheteur confirme",
    description: "À réception, l'acheteur valide la conformité de la marchandise.",
  },
  {
    number: 5,
    icon: Banknote,
    title: "Fonds libérés",
    description: "L'argent est versé au fournisseur, moins la commission de la plateforme.",
  },
];

const audiences = [
  {
    icon: UserCheck,
    title: "Pour l'acheteur",
    description: "Aucun risque de payer sans être livré. L'argent n'est versé qu'après réception confirmée.",
  },
  {
    icon: Landmark,
    title: "Pour le fournisseur",
    description: "Garantie d'être payé dès la validation. Plus de mauvais payeurs, plus d'impayés.",
  },
  {
    icon: Scale,
    title: "En cas de litige",
    description: "La plateforme, tiers neutre détenant les fonds, arbitre : remboursement ou libération.",
  },
];

export default function ConfianceSecuritePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 pt-4 pb-14 sm:px-6">
          <div className="relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-3xl p-6 sm:min-h-[360px] sm:p-8">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/security-payment-poster.jpg"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/videos/security-payment.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, #1e1e1eb3 0%, #1e1e1e4d 45%, #1e1e1ee0 100%)",
              }}
            />

            <div className="relative">
              <p className="text-sm font-medium text-white/80">Paiement sécurisé</p>
              <h1 className="mt-2 max-w-xl font-heading text-3xl font-medium tracking-tight text-white sm:text-4xl">
                Le séquestre : votre argent protégé jusqu&apos;à la livraison
              </h1>
              <p className="mt-3 max-w-xl text-white/70">
                Sur TEKA, l&apos;argent de l&apos;acheteur n&apos;est jamais versé
                directement au fournisseur. Il est conservé en sécurité par un
                prestataire de paiement agréé, et n&apos;est libéré qu&apos;une fois
                la marchandise reçue et confirmée. C&apos;est ce qui élimine le
                risque de fraude.
              </p>
            </div>
          </div>

          {/* 5-step flow */}
          <div className="mt-10 grid gap-3 sm:grid-cols-5">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="gap-3">
                  <CardContent className="flex flex-col gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {step.number}
                    </span>
                    <Icon className="size-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium">{step.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Callout */}
          <Card className="mt-8 border-none bg-primary text-primary-foreground">
            <CardContent className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
              <Lock className="size-8 flex-shrink-0" />
              <div>
                <h2 className="font-medium">
                  Tant que la livraison n&apos;est pas confirmée, l&apos;argent reste bloqué.
                </h2>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  Si la marchandise n&apos;arrive pas ou ne correspond pas à la
                  commande, l&apos;acheteur est remboursé. Le fournisseur, lui,
                  est certain d&apos;être payé dès que l&apos;acheteur valide.
                  Partir hors de la plateforme, c&apos;est perdre cette
                  protection — c&apos;est pourquoi tout le monde a intérêt à
                  rester.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Three audiences */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <Card key={a.title} className="gap-3">
                  <CardContent className="flex flex-col gap-2">
                    <Icon className="size-5 text-primary" />
                    <h3 className="text-sm font-medium">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="mt-8 rounded-lg border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
            Les fonds sont gérés par un prestataire de paiement agréé par
            la Banque Centrale du Congo (BCC) — TEKA ne détient jamais
            directement l&apos;argent, garantissant sécurité et conformité.
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            Prêt à commencer ?{" "}
            <Link href="/products" className="font-medium text-primary hover:underline">
              Parcourez les produits
            </Link>{" "}
            ou{" "}
            <Link href="/signup?role=vendor" className="font-medium text-primary hover:underline">
              devenez fournisseur
            </Link>
            .
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
