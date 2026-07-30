import Link from "next/link";
import { AccountSignOutButton } from "@/components/account-sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { getConversationsForUser, isConversationUnread } from "@/lib/data/conversations";
import { ArrowLeft, ArrowUpRight, Headset, Inbox, Package, Settings } from "lucide-react";

export default async function AccountDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const conversations = user ? await getConversationsForUser(supabase, user.id, "customer") : [];
  const unreadCount = user
    ? conversations.filter((c) => isConversationUnread(c.messages, user.id)).length
    : 0;

  return (
    <div className="min-h-full bg-secondary/10">
      <div className="bg-background">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Retour au site
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/account/settings"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Settings className="size-4" /> Paramètres
            </Link>
            <AccountSignOutButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Que souhaitez-vous faire aujourd&apos;hui ?
        </h1>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
          <Link
            href="/account/orders"
            className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl p-6 text-white transition-transform duration-300 sm:min-h-[320px] sm:p-7 sm:hover:-translate-y-1"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/dash-payments-poster.jpg"
              className="absolute inset-0 size-full object-cover"
            >
              <source src="/videos/dash-payments.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(165deg, #0b6b3ae6 0%, #0b6b3a99 45%, #1e1e1ee6 100%)" }}
            />

            <div className="relative flex items-start justify-between">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur sm:size-12">
                <Package className="size-5 sm:size-6" />
              </span>
              <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <div className="relative">
              <p className="text-xl font-semibold tracking-tight sm:text-2xl">Mes commandes</p>
              <p className="mt-1 text-sm text-white/80">L&apos;historique de vos achats en gros sur TEKA.</p>
            </div>
          </Link>

          <Link
            href="/account/messages"
            className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl p-6 text-[#1e1e1e] transition-transform duration-300 sm:min-h-[320px] sm:p-7 sm:hover:-translate-y-1"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/dash-network-poster.jpg"
              className="absolute inset-0 size-full object-cover"
            >
              <source src="/videos/dash-network.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(165deg, #e0b84a66 0%, #c89b2d99 45%, #c89b2de6 100%)" }}
            />

            <div className="relative flex items-start justify-between">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-[#1e1e1e]/10 backdrop-blur sm:size-12">
                <Inbox className="size-5 sm:size-6" />
              </span>
              <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-[#1e1e1e]/10 backdrop-blur transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <div className="relative">
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold tracking-tight sm:text-2xl">Messages</p>
                {unreadCount > 0 && (
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#1e1e1e] text-xs font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[#1e1e1e]/75">Échangez directement avec vos fournisseurs.</p>
            </div>
          </Link>
        </div>

        <Link
          href="/products"
          className="group relative mt-4 flex min-h-[200px] flex-col justify-between overflow-hidden rounded-3xl p-6 text-white transition-transform duration-300 sm:mt-5 sm:min-h-[240px] sm:p-8 sm:hover:-translate-y-1"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/videos/dash-market-poster.jpg"
            className="absolute inset-0 size-full object-cover"
          >
            <source src="/videos/dash-market.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, #1e1e1ee6 0%, #1e1e1e80 55%, #1e1e1e40 100%)" }}
          />

          <div className="relative flex items-start justify-end">
            <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <div className="relative max-w-sm">
            <p className="text-xl font-semibold tracking-tight sm:text-2xl">Explorez le marché</p>
            <p className="mt-1 text-sm text-white/80">
              Des milliers de produits en gros vous attendent — trouvez votre prochain fournisseur.
            </p>
          </div>
        </Link>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border bg-background p-4 sm:mt-5 sm:p-5">
          <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
            <Headset className="size-5 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Besoin d&apos;aide ?</p>
            <p className="text-xs text-muted-foreground">Notre équipe est disponible 24/7 — support@teka.cd</p>
          </div>
        </div>
      </div>
    </div>
  );
}
