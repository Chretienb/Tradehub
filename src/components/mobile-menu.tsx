"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";

const navItems: { href: string; key: TranslationKey; icon: typeof LayoutGrid }[] = [
  { href: "/#categories", key: "nav.categories", icon: LayoutGrid },
  { href: "/products", key: "nav.products", icon: Package },
  { href: "/vendors", key: "nav.vendors", icon: Store },
  { href: "/confiance-securite", key: "nav.trust", icon: ShieldCheck },
];

const itemClass =
  "gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-foreground/80 focus:text-foreground [&_svg]:text-muted-foreground";

export function MobileMenu({ session }: { session: UserSession | null }) {
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex size-9 flex-shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
          aria-label={t("vendorNav.menu")}
        >
          <Menu className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="w-72 rounded-2xl p-2 shadow-lg">
          {session && (
            <>
              <div className="flex items-center gap-3 rounded-xl bg-secondary/60 p-2.5">
                <Avatar size="lg" className="bg-primary/10">
                  <AvatarFallback className="bg-primary/10 font-medium text-primary">
                    {getInitials(session.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{session.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.email ?? t("vendorNav.account")}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="my-2" />
            </>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.href} render={<Link href={item.href} />} className={itemClass}>
                <Icon className="size-[18px]" />
                {t(item.key)}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="my-2" />

          {session ? (
            <>
              {session.role === "vendor" && (
                <DropdownMenuItem render={<Link href="/vendor/dashboard" />} className={itemClass}>
                  <LayoutDashboard className="size-[18px]" /> {t("header.dashboard")}
                </DropdownMenuItem>
              )}
              {session.role === "customer" && (
                <DropdownMenuItem render={<Link href="/account" />} className={itemClass}>
                  <Inbox className="size-[18px]" /> {t("header.myAccount")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleSignOut}
                variant="destructive"
                className="gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium"
              >
                <LogOut className="size-[18px]" /> {t("header.signOut")}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem render={<Link href="/login" />} className={itemClass}>
                <LogIn className="size-[18px]" /> {t("header.login")}
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/signup?role=vendor" />}
                className={cn(
                  itemClass,
                  "mt-1 bg-primary text-primary-foreground [&_svg]:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground"
                )}
              >
                <Store className="size-[18px]" /> {t("header.becomeVendor")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
