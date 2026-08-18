"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Headset,
  Lock,
  Send,
  ShieldCheck,
} from "lucide-react";

const quickSearches = ["Riz en sac", "Ciment", "Huile végétale", "Téléphones", "Tomates"];

const paymentMethods = [
  { src: "/brand/payments/orange-money.svg", label: "Orange Money", width: 375, height: 100 },
  { src: "/brand/payments/airtel.svg", label: "Airtel Money", width: 96, height: 100 },
  { src: "/brand/payments/mpesa.svg", label: "M-Pesa", width: 188, height: 100 },
  { src: "/brand/payments/visa.svg", label: "Visa", width: 308, height: 100 },
  { src: "/brand/payments/mastercard.svg", label: "Mastercard", width: 129, height: 100 },
];

const eyebrow = "flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[.14em] text-primary";

export function HomeContent({
  categories,
  featuredProducts,
}: {
  categories: Category[];
  featuredProducts: Product[];
}) {
  const { t } = useLanguage();

  const securityPillars = [
    { icon: BadgeCheck, title: t("security.pillar1Title"), description: t("security.pillar1Desc") },
    { icon: Lock, title: t("security.pillar2Title"), description: t("security.pillar2Desc") },
    { icon: Headset, title: t("security.pillar3Title"), description: t("security.pillar3Desc") },
  ];

  return (
    <main className="flex-1">
      {/* Hero — bento grid */}
      <section className="relative overflow-hidden bg-background py-6 sm:py-10">
        {/* Dot grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: "radial-gradient(oklch(0.13 0.028 261.692 / .12) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="pointer-events-none absolute -top-24 right-[-6%] size-[420px] rounded-full blur-[110px]"
          style={{ background: "#c89b2d2e" }}
        />
        <div
          className="pointer-events-none absolute bottom-[-15%] left-[-8%] size-[380px] rounded-full blur-[110px]"
          style={{ background: "#0b6b3a1f" }}
        />

        <div className="relative mx-auto max-w-6xl px-6 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Big video card */}
            <div className="relative flex min-h-[560px] flex-col overflow-hidden rounded-3xl lg:min-h-[600px]">
              <video
                autoPlay
                loop
                muted
                playsInline
                poster="/videos/hero-market-poster.jpg"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/videos/hero-market.mp4" type="video/mp4" />
              </video>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, #1e1e1ed1 0%, #1e1e1e59 38%, #1e1e1e8c 68%, #1e1e1eeb 100%)",
                }}
              />

              <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                <div>
                  <h1 className="max-w-md text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl">
                    {t("hero.title1")}{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(90deg, #c89b2d, #e0b84a)" }}
                    >
                      {t("hero.titleHighlight")}
                    </span>
                  </h1>
                  <p className="mt-4 max-w-sm text-balance text-white/70">{t("hero.subtitle")}</p>

                  <div className="mt-10 grid max-w-xs grid-cols-3 gap-4 border-t border-white/15 pt-4">
                    <div>
                      <p className="font-heading text-lg font-semibold tabular-nums text-white">1 200+</p>
                      <p className="mt-0.5 text-[11px] text-white/50">{t("hero.statVendors")}</p>
                    </div>
                    <div>
                      <p className="font-heading text-lg font-semibold tabular-nums text-white">48 000+</p>
                      <p className="mt-0.5 text-[11px] text-white/50">{t("hero.statProducts")}</p>
                    </div>
                    <div>
                      <p className="font-heading text-lg font-semibold tabular-nums text-white">10</p>
                      <p className="mt-0.5 text-[11px] text-white/50">{t("hero.statProvinces")}</p>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Button
                      render={<Link href="/products" />}
                      size="lg"
                      className="h-12 rounded-full bg-white pl-6 pr-2 text-[15px] text-foreground hover:bg-white/90"
                    >
                      {t("hero.ctaFindProducts")}
                      <span className="ml-2 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <ArrowRight className="size-4" />
                      </span>
                    </Button>
                    <Button
                      render={<Link href="/signup?role=vendor" />}
                      variant="outline"
                      size="lg"
                      className="h-12 rounded-full border-white/20 bg-white/5 px-6 text-[15px] text-white backdrop-blur hover:bg-white/10"
                    >
                      {t("hero.ctaBecomeVendor")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4 lg:justify-between">
              {/* Search card */}
              <div className="relative overflow-hidden rounded-3xl bg-background p-6 ring-1 ring-foreground/[0.06] sm:p-7">
                <span className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-secondary text-foreground">
                  <ArrowUpRight className="size-4" />
                </span>
                <p className={eyebrow}>{t("search.eyebrow")}</p>
                <h2 className="mt-2 max-w-xs text-2xl font-semibold tracking-tight">{t("search.title")}</h2>
                <form action="/products" className="relative mt-5 flex max-w-xs gap-2">
                  <Input name="q" placeholder={t("search.placeholder")} className="h-11 bg-background" />
                  <Button type="submit" size="icon" className="h-11 w-11 flex-shrink-0" aria-label="Rechercher">
                    <ArrowRight className="size-4" />
                  </Button>
                </form>
                <div className="relative mt-6 flex max-w-xs flex-col gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {quickSearches.map((term) => (
                      <Link
                        key={term}
                        href={`/products?q=${encodeURIComponent(term.split(" ")[0])}`}
                        className="rounded-full bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                  <p className="flex items-center gap-1.5 border-t pt-4 text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5 flex-shrink-0 text-primary" />
                    {t("search.trust")}
                  </p>
                </div>
              </div>

              {/* Two small cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Link
                  href="/signup?role=vendor"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl p-7 text-white"
                  style={{ background: "linear-gradient(150deg, #0e7d43, #0b6b3a)" }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-medium uppercase tracking-[.1em] text-white/85">
                      {t("card.becomeVendorLabel")}
                    </p>
                    <span className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  <p className="text-xl font-semibold tracking-tight">{t("card.becomeVendorTitle")}</p>
                </Link>

                <Link
                  href="/confiance-securite"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl p-7 text-[#1e1e1e]"
                  style={{ background: "linear-gradient(150deg, #e0b84a, #c89b2d)" }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-medium uppercase tracking-[.1em] text-[#1e1e1e]/70">
                      {t("card.escrowLabel")}
                    </p>
                    <span className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1e1e1e]/10 backdrop-blur transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <Send className="size-3.5" />
                    </span>
                  </div>
                  <p className="text-xl font-semibold tracking-tight">{t("card.escrowTitle")}</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-6xl px-6 py-14 sm:px-6 sm:py-24">
        <p className={eyebrow}>{t("categories.eyebrow")}</p>
        <div className="mb-6 mt-2 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("categories.title")}</h2>
          <Button render={<Link href="/products" />} variant="ghost" size="sm" className="w-fit">
            {t("categories.viewAll")} <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link key={category.slug} href={`/products?category=${category.slug}`} className="group">
              <Card className="h-full gap-0 overflow-hidden py-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(0deg, #1e1e1ed9 0%, transparent 65%)" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <h3 className="text-sm font-medium text-white">{category.name}</h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-white/70">{category.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-6 sm:py-24">
          <p className={eyebrow}>{t("featured.eyebrow")}</p>
          <div className="mb-6 mt-2 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("featured.title")}</h2>
            <Button render={<Link href="/products" />} variant="ghost" size="sm" className="w-fit">
              {t("featured.viewAll")} <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-xl text-center">
            <p className={cn(eyebrow, "justify-center")}>{t("security.eyebrow")}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t("security.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("security.subtitle")}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
            {securityPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card key={pillar.title} className="gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="flex flex-col items-center gap-3 pt-2 text-center">
                    <span
                      className="flex size-14 items-center justify-center rounded-2xl text-primary"
                      style={{ background: "linear-gradient(160deg, #f6ead0, #eeda9f)" }}
                    >
                      <Icon className="size-6" />
                    </span>
                    <h3 className="font-heading font-medium">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-12">
            <p className="text-sm font-medium text-muted-foreground">{t("security.paymentMethods")}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {paymentMethods.map((method) => (
                <span
                  key={method.label}
                  className="flex h-9 items-center justify-center rounded-lg border bg-white px-3 sm:h-10"
                >
                  <Image
                    src={method.src}
                    alt={method.label}
                    width={method.width}
                    height={method.height}
                    className="h-4 w-auto sm:h-5"
                  />
                </span>
              ))}
            </div>
            <Button render={<Link href="/confiance-securite" />} variant="link" size="sm">
              {t("security.howEscrowWorks")} <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-6 sm:py-24">
          <Card
            className="relative overflow-hidden border-none py-10 text-white sm:py-14"
            style={{ background: "linear-gradient(135deg, #0e7d43, #0b6b3a)" }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
            <CardContent className="relative flex flex-col items-center gap-4 px-4 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <ShieldCheck className="size-7" />
              </span>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("vendorCta.title")}</h2>
              <p className="max-w-md text-white/85">{t("vendorCta.subtitle")}</p>
              <Button render={<Link href="/signup?role=vendor" />} variant="secondary" size="lg" className="h-11 px-6 text-[15px]">
                {t("vendorCta.button")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
