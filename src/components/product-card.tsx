import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/data/catalog";
import { ArrowUpRight, BadgeCheck } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { vendor } = product;

  return (
    <Card className="group h-full gap-0 overflow-hidden rounded-2xl py-0 ring-1 ring-foreground/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/vendors/${vendor.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.featured && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-[#1e1e1e]/85 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              Vedette
            </span>
          )}
          <span className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </Link>

      <CardContent className="flex flex-col gap-2 p-4">
        <Link href={`/vendors/${vendor.id}`} className="block">
          <p className="truncate text-sm font-medium group-hover:text-primary">{product.name}</p>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-lg font-semibold tracking-tight">
              {product.price.toFixed(2)} $
            </span>
            <span className="text-xs text-muted-foreground">/ {product.unit}</span>
          </div>
          <span className="flex-shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
            MOQ {product.moq}
          </span>
        </div>

        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
          {vendor.verified && <BadgeCheck className="size-3.5 flex-shrink-0 text-primary" />}
          {vendor.name} · {vendor.location.split(",")[0]}
        </p>

        <Link
          href={`/vendors/${vendor.id}`}
          className="mt-2 flex h-9 w-full items-center justify-center rounded-full border text-sm font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          Contacter
        </Link>
      </CardContent>
    </Card>
  );
}
