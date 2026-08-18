"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import type { UserSession } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { getInitials, cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n/translations";
import {
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  LogIn,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  Store,
  X,
} from "lucide-react";

const navItems: { href: string; key: TranslationKey; icon: typeof LayoutGrid }[] = [
  { href: "/#categories", key: "nav.categories", icon: LayoutGrid },
  { href: "/products", key: "nav.products", icon: Package },
  { href: "/vendors", key: "nav.vendors", icon: Store },
  { href: "/confiance-securite", key: "nav.trust", icon: ShieldCheck },
];

const sectionLabelClass =
  "px-3.5 pb-2 font-mono text-[11px] font-medium uppercase tracking-[.14em] text-muted-foreground";

const itemClass =
  "flex items-center gap-3.5 rounded-xl px-3.5 py-3.5 text-base font-medium text-foreground/85 transition-colors hover:bg-secondary hover:text-foreground active:bg-secondary [&_svg]:text-muted-foreground";

export function MobileMenu({ session }: { session: UserSession | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  // Close on route change rather than in each Link's onClick — closing
  // synchronously on click raced against next/link's own navigation and
  // the dialog's exit animation, occasionally landing on the wrong page
  // (a stale click target from before the close transition finished).
  // Compared during render (React's documented pattern for resetting
  // state when a derived value changes) rather than in an effect, which
  // would fire the setState one render late. Watches search params too,
  // since some links only change those (/signup -> /signup?role=vendor
  // keeps the same pathname).
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const [lastRouteKey, setLastRouteKey] = useState(routeKey);
  if (routeKey !== lastRouteKey) {
    setLastRouteKey(routeKey);
    if (open) setOpen(false);
  }

  async function handleSignOut() {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="md:hidden">
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger
          className="flex size-9 flex-shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
          aria-label={t("vendorNav.menu")}
        >
          <Menu className="size-5" />
        </DialogPrimitive.Trigger>

        <DialogPrimitive.Portal>
          <DialogPrimitive.Popup className="fixed inset-0 z-50 flex h-dvh w-screen flex-col overflow-y-auto bg-background outline-none duration-200 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-4 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-top-4">
            <div className="flex flex-shrink-0 items-center justify-between border-b px-5 py-4">
              <Logo iconSize={32} />
              <DialogPrimitive.Close
                className="flex size-9 flex-shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                aria-label={t("common.close")}
              >
                <X className="size-5" />
              </DialogPrimitive.Close>
            </div>

            <div className="flex-1 px-4 py-6">
              {session && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-secondary/60 p-3.5">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-primary/10 font-medium text-primary">
                      {getInitials(session.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{session.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {session.email ?? t("vendorNav.account")}
                    </p>
                  </div>
                </div>
              )}

              <p className={sectionLabelClass}>{t("vendorNav.menu")}</p>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className={itemClass}>
                      <Icon className="size-5" />
                      {t(item.key)}
                    </Link>
                  );
                })}
              </nav>

              <div className="my-6 h-px bg-border" />

              <p className={sectionLabelClass}>{t("common.account")}</p>
              <nav className="flex flex-col gap-1">
                {session ? (
                  <>
                    {session.role === "vendor" && (
                      <Link href="/vendor/dashboard" className={itemClass}>
                        <LayoutDashboard className="size-5" /> {t("header.dashboard")}
                      </Link>
                    )}
                    {session.role === "customer" && (
                      <Link href="/account" className={itemClass}>
                        <Inbox className="size-5" /> {t("header.myAccount")}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className={cn(itemClass, "text-destructive [&_svg]:text-destructive")}
                    >
                      <LogOut className="size-5" /> {t("header.signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className={itemClass}>
                      <LogIn className="size-5" /> {t("header.login")}
                    </Link>
                    <Link
                      href="/signup?role=vendor"
                      className={cn(
                        itemClass,
                        "mt-1 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 [&_svg]:text-primary-foreground"
                      )}
                    >
                      <Store className="size-5" /> {t("header.becomeVendor")}
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
