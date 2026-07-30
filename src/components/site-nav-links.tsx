"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export function SiteNavLinks() {
  const { t } = useLanguage();

  return (
    <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
      <Link href="/#categories" className="hover:text-foreground">
        {t("nav.categories")}
      </Link>
      <Link href="/products" className="hover:text-foreground">
        {t("nav.products")}
      </Link>
      <Link href="/vendors" className="hover:text-foreground">
        {t("nav.vendors")}
      </Link>
      <Link href="/confiance-securite" className="hover:text-foreground">
        {t("nav.trust")}
      </Link>
    </nav>
  );
}
