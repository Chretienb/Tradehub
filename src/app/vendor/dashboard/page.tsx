import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/revenue-chart";
import { AddProductDialog } from "@/components/add-product-dialog";
import { readSessionServer } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import { getVendorQuoteRequests } from "@/lib/data/quote-requests";
import { getCategories } from "@/lib/data/catalog";
import { unwrapOne } from "@/lib/utils";
import type { VerificationStatus } from "@/lib/auth";
import {
  ArrowRight,
  Clock,
  FileText,
  Inbox,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  ShieldX,
  TrendingUp,
} from "lucide-react";

const verificationBadgeMeta: Record<
  VerificationStatus,
  { label: string; icon: typeof ShieldCheck; className: string }
> = {
  unsubmitted: {
    label: "Non vérifié",
    icon: ShieldX,
    className: "bg-white/15 text-white",
  },
  pending: {
    label: "Vérification en cours",
    icon: Clock,
    className: "bg-amber-400/20 text-amber-200",
  },
  verified: {
    label: "Entreprise vérifiée",
    icon: ShieldCheck,
    className: "bg-primary/30 text-white",
  },
  rejected: {
    label: "Vérification refusée",
    icon: ShieldX,
    className: "bg-red-500/20 text-red-200",
  },
};

const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  accepted: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  declined: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const statusLabels: Record<string, string> = {
  new: "nouvelle",
  accepted: "acceptée",
  declined: "refusée",
  completed: "terminée",
};

// Revenue/orders/escrow-balance stats below are still hardcoded — wiring
// them to real aggregation queries is flagged as a follow-up (out of scope
// for this migration; they were never backed by mock-data.ts either).
const monthlyRevenue = [
  { label: "Jan", value: 12 },
  { label: "Fév", value: 16 },
  { label: "Mar", value: 14 },
  { label: "Avr", value: 20 },
  { label: "Mai", value: 22 },
  { label: "Juin", value: 24.5 },
];

const recentOrders = [
  { product: "Riz 25kg ×150", buyer: "Supermarché Élite", amount: "4 275 $", status: "En séquestre" },
  { product: "Huile ×80", buyer: "Revendeur Matonge", amount: "2 792 $", status: "Expédiée" },
  { product: "Ciment ×200", buyer: "Distrib. Lemba", amount: "1 960 $", status: "Clôturée" },
  { product: "Tomates ×60", buyer: "Boutique Ngaba", amount: "720 $", status: "En séquestre" },
];
const orderStatusStyles: Record<string, string> = {
  "En séquestre": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "Expédiée": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "Clôturée": "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

export default async function VendorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [session, quoteRequestRows, categories] = await Promise.all([
    readSessionServer(),
    user ? getVendorQuoteRequests(supabase, user.id) : Promise.resolve([]),
    getCategories(),
  ]);

  const recentRequests = quoteRequestRows.slice(0, 3).map((r) => ({
    id: r.id,
    customerName: unwrapOne<{ name: string }>(r.profiles)?.name ?? "Client",
    productName: unwrapOne<{ name: string }>(r.products)?.name ?? "",
    status: r.status,
  }));
  const newRequestCount = quoteRequestRows.filter((r) => r.status === "new").length;

  const stats = [
    { label: "Commandes ce mois", value: "128", change: "+12% vs mois dernier", icon: FileText },
    { label: "Revenus ce mois", value: "24 500 $", change: "+8% vs mois dernier", icon: TrendingUp },
    { label: "Fonds en séquestre", value: "3 200 $", change: "2 commandes en attente", icon: Lock },
    { label: "Demandes de devis", value: String(newRequestCount), change: "nouvelles aujourd'hui", icon: MessageSquare },
  ];

  const verification = verificationBadgeMeta[session?.verificationStatus ?? "unsubmitted"];
  const VerificationIcon = verification.icon;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative mb-6 flex min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl p-6 sm:min-h-[320px] sm:p-8">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/vendor-market-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/vendor-market.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #1e1e1eb3 0%, #1e1e1e4d 45%, #1e1e1ee0 100%)",
          }}
        />

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/vendor/settings"
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-opacity hover:opacity-80 ${verification.className}`}
            >
              <VerificationIcon className="size-3.5" />
              {verification.label}
            </Link>
            <p className="mt-3 text-sm font-medium text-white/80">Espace fournisseur</p>
            <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Tableau de bord
            </h1>
            <p className="mt-2 max-w-md text-white/70">
              Suivez vos ventes, vos demandes de devis et vos paiements en un coup d&apos;œil.
            </p>
          </div>
          <AddProductDialog categories={categories} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="gap-2 py-5">
              <CardContent className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-heading text-2xl font-medium">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Icon className="size-4" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenus des 6 derniers mois</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={monthlyRevenue} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-sm">Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground" />
                <span>{session?.registeredAddress || "Adresse à renseigner dans Paramètres"}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground" />
                <span>{session?.email || "Non renseigné"}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground" />
                <span>{session?.phone || "Non renseigné"}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="font-medium">RCCM :</span>
                <span>{session?.rccm || "À compléter dans Paramètres"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-sm">Mon argent</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Solde disponible (versable)</p>
                <p className="font-heading text-xl font-medium">18 100 $</p>
              </div>
              <Button size="sm" className="w-full">Demander un versement</Button>
              <p className="flex items-start gap-1.5 rounded-md bg-secondary/60 p-2 text-xs text-muted-foreground">
                <Lock className="mt-0.5 size-3.5 flex-shrink-0" />
                3 200 $ en séquestre. Ces fonds seront libérés automatiquement
                dès que les acheteurs confirmeront la réception.
              </p>
            </CardContent>
          </Card>

          <Card className="gap-2 border-none bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-xs font-normal opacity-80">Abonnement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Formule Professionnelle</p>
              <p className="text-xs text-primary-foreground/70">Produits illimités · Badge Vérifié</p>
            </CardContent>
          </Card>

          <div className="relative flex min-h-[160px] flex-col justify-end overflow-hidden rounded-2xl p-4">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/dash-network-poster.jpg"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/videos/dash-network.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, #1e1e1e00 30%, #1e1e1ee0 100%)" }}
            />
            <div className="relative">
              <p className="text-sm font-medium text-white">Votre portée sur TEKA</p>
              <p className="text-xs text-white/70">Visible par des acheteurs partout dans le monde</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Commandes récentes</CardTitle>
            <Button variant="ghost" size="sm">
              Tout voir <ArrowRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {recentOrders.map((order) => (
              <div key={order.product} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm">{order.product}</p>
                  <p className="truncate text-xs text-muted-foreground">{order.buyer}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <span className="font-heading text-sm font-medium">{order.amount}</span>
                  <Badge className={orderStatusStyles[order.status]} variant="secondary">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Demandes de devis</CardTitle>
            <Button render={<Link href="/vendor/requests" />} variant="ghost" size="sm">
              <Inbox className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm">{request.customerName}</p>
                  <p className="truncate text-xs text-muted-foreground">{request.productName}</p>
                </div>
                <Badge className={statusStyles[request.status]} variant="secondary">
                  {statusLabels[request.status]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
