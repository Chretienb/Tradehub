"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const itemClass =
  "flex items-center gap-3.5 rounded-xl px-3.5 py-3.5 text-base font-medium text-foreground/85 transition-colors hover:bg-secondary hover:text-foreground active:bg-secondary [&_svg]:text-muted-foreground";

export function MobileMenu({ session }: { session: UserSession | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  function close() {
    setOpen(false);
  }

  async function handleSignOut() {
    close();
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
          <DialogPrimitive.Popup className="fixed inset-0 z-50 flex h-dvh w-screen flex-col overflow-y-auto bg-background outline-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0">
            <div className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3">
              <Logo iconSize={32} />
              <DialogPrimitive.Close
                className="flex size-9 flex-shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                aria-label={t("common.close")}
              >
                <X className="size-5" />
              </DialogPrimitive.Close>
            </div>

            <div className="flex-1 px-4 py-5">
              {session && (
                <div className="mb-5 flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
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

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={close} className={itemClass}>
                      <Icon className="size-5" />
                      {t(item.key)}
                    </Link>
                  );
                })}
              </nav>

              <div className="my-5 h-px bg-border" />

              <nav className="flex flex-col gap-1">
                {session ? (
                  <>
                    {session.role === "vendor" && (
                      <Link href="/vendor/dashboard" onClick={close} className={itemClass}>
                        <LayoutDashboard className="size-5" /> {t("header.dashboard")}
                      </Link>
                    )}
                    {session.role === "customer" && (
                      <Link href="/account" onClick={close} className={itemClass}>
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
                    <Link href="/login" onClick={close} className={itemClass}>
                      <LogIn className="size-5" /> {t("header.login")}
                    </Link>
                    <Link
                      href="/signup?role=vendor"
                      onClick={close}
                      className={cn(
                        itemClass,
                        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 [&_svg]:text-primary-foreground"
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
