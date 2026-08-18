"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-10">
        <p className="text-xs text-muted-foreground sm:text-sm">
          © {new Date().getFullYear()} {t("footer.copyright")}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:gap-x-6 sm:text-sm">
          <Link href="/products" className="hover:text-foreground">
            {t("nav.products")}
          </Link>
          <Link href="/vendors" className="hover:text-foreground">
            {t("nav.vendors")}
          </Link>
          <Link href="/confiance-securite" className="hover:text-foreground">
            {t("nav.trust")}
          </Link>
          <Link href="/signup?role=vendor" className="hover:text-foreground">
            {t("header.becomeVendor")}
          </Link>
          <Link href="/login" className="hover:text-foreground">
            {t("header.login")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
