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
import type { UserSession } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { Inbox, LayoutDashboard, LogOut, Menu } from "lucide-react";

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
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem render={<Link href="/#categories" />}>{t("nav.categories")}</DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/products" />}>{t("nav.products")}</DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/vendors" />}>{t("nav.vendors")}</DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/confiance-securite" />}>{t("nav.trust")}</DropdownMenuItem>

          <DropdownMenuSeparator />

          {session ? (
            <>
              {session.role === "vendor" && (
                <DropdownMenuItem render={<Link href="/vendor/dashboard" />}>
                  <LayoutDashboard className="size-4" /> {t("header.dashboard")}
                </DropdownMenuItem>
              )}
              {session.role === "customer" && (
                <DropdownMenuItem render={<Link href="/account" />}>
                  <Inbox className="size-4" /> {t("header.myAccount")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="size-4" /> {t("header.signOut")}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem render={<Link href="/login" />}>{t("header.login")}</DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/signup?role=vendor" />}>
                {t("header.becomeVendor")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
