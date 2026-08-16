"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";
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

const navItems: { href: string; labelKey: TranslationKey; icon: typeof LayoutDashboard }[] = [
  { href: "/vendor/dashboard", labelKey: "header.dashboard", icon: LayoutDashboard },
  { href: "/vendor/requests", labelKey: "vendorNav.requests", icon: Inbox },
  { href: "/vendor/payments", labelKey: "vendorNav.payments", icon: Wallet },
  { href: "/vendor/settings", labelKey: "vendorNav.settings", icon: Settings },
];

export function VendorNav({ session }: { session: UserSession | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b bg-background px-4 py-2.5 sm:hidden">
        <Logo iconSize={28} className="text-base" />
        <div className="flex items-center gap-1">
          <LanguageSwitcher className="h-8 w-auto gap-1 border-none bg-transparent px-2 shadow-none" />
          <button
            type="button"
            onClick={handleSignOut}
            className="flex size-8 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={t("header.signOut")}
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t bg-background/95 backdrop-blur-sm sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="truncate px-1">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden flex-col justify-between border-r bg-background p-4 transition-[width] duration-200 sm:flex sm:h-full",
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
              aria-label={collapsed ? t("vendorNav.expandSidebar") : t("vendorNav.collapseSidebar")}
            >
              {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
          </div>

          {!collapsed && (
            <p className="mt-8 px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("vendorNav.menu")}
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
                  title={collapsed ? t(item.labelKey) : undefined}
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
                  {!collapsed && t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          {!collapsed && <LanguageSwitcher className="w-full" />}
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
                <p className="truncate text-sm font-medium">{session?.name ?? t("vendorNav.company")}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {session?.email ?? t("vendorNav.account")}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-2.5 text-muted-foreground", collapsed ? "justify-center px-0" : "justify-start")}
            onClick={handleSignOut}
            title={collapsed ? t("header.signOut") : undefined}
          >
            <LogOut className="size-4 flex-shrink-0" />
            {!collapsed && t("header.signOut")}
          </Button>
        </div>
      </aside>
    </>
  );
}
