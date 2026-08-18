"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { CreditCard, Phone } from "lucide-react";

const paymentMethods = [
  { icon: Phone, label: "Orange Money" },
  { icon: Phone, label: "Airtel Money" },
  { icon: Phone, label: "M-Pesa" },
  { icon: CreditCard, label: "Visa" },
  { icon: CreditCard, label: "Mastercard" },
];

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 sm:gap-4 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="flex flex-wrap items-center gap-1.5 border-t pt-3 sm:pt-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <span
                key={method.label}
                className="flex items-center gap-1 rounded-full border bg-background px-2 py-1 text-[11px] text-foreground/70 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs"
              >
                <Icon className="size-3 flex-shrink-0 sm:size-3.5" /> {method.label}
              </span>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
