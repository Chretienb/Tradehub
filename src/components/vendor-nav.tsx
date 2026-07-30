"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import type { UserSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  Inbox,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Store,
  Wallet,
} from "lucide-react";

const navItems = [
  { href: "/vendor/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/vendor/requests", label: "Demandes de devis", icon: Inbox },
  { href: "/vendor/payments", label: "Paiements", icon: Wallet },
  { href: "/vendor/settings", label: "Paramètres", icon: Settings },
];

export function VendorNav({ session }: { session: UserSession | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside
      className={cn(
        "flex w-full flex-col justify-between border-r bg-background p-4 transition-[width] duration-200 sm:h-full",
        collapsed ? "sm:w-[76px]" : "sm:w-64"
      )}
    >
      <div>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between px-2")}>
          {!collapsed && <Logo />}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="flex size-8 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={collapsed ? "Ouvrir la barre latérale" : "Réduire la barre latérale"}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        </div>

        {!collapsed && (
          <p className="mt-8 px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Menu
          </p>
        )}
        <nav className={cn("flex flex-col gap-1", collapsed ? "mt-8" : "mt-2")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {active && (
                  <span className="absolute top-1/2 left-0 h-4 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
                <Icon className="size-4 flex-shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl bg-secondary/60 p-2.5",
            collapsed && "justify-center"
          )}
        >
          <span className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-background">
            <Store className="size-4 text-muted-foreground" />
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{session?.name ?? "Votre entreprise"}</p>
              <p className="truncate text-xs text-muted-foreground">{session?.email ?? "Compte fournisseur"}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2.5 text-muted-foreground", collapsed ? "justify-center px-0" : "justify-start")}
          onClick={handleSignOut}
          title={collapsed ? "Se déconnecter" : undefined}
        >
          <LogOut className="size-4 flex-shrink-0" />
          {!collapsed && "Se déconnecter"}
        </Button>
      </div>
    </aside>
  );
}
