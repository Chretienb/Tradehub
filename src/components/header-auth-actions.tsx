"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { UserSession } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { Inbox, LayoutDashboard, LogOut } from "lucide-react";

export function HeaderAuthActions({ session }: { session: UserSession | null }) {
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button render={<Link href="/login" />} variant="ghost" size="sm">
          {t("header.login")}
        </Button>
        <Button render={<Link href="/signup?role=vendor" />} size="sm">
          {t("header.becomeVendor")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {session.role === "vendor" && (
        <Button render={<Link href="/vendor/dashboard" />} variant="ghost" size="sm">
          <LayoutDashboard className="size-4" /> {t("header.dashboard")}
        </Button>
      )}
      {session.role === "customer" && (
        <Button render={<Link href="/account" />} variant="ghost" size="sm">
          <Inbox className="size-4" /> {t("header.myAccount")}
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="size-4" /> {t("header.signOut")}
      </Button>
    </div>
  );
}
