"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-10">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t("footer.copyright")}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground sm:gap-x-6">
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
