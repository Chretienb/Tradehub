import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { VendorSummary } from "@/lib/data/catalog";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";

export function VendorCard({ vendor }: { vendor: VendorSummary }) {
  const { productCount } = vendor;

  return (
    <Link href={`/vendors/${vendor.id}`} className="block">
      <Card className="h-full gap-0 overflow-hidden rounded-3xl py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-40 w-full overflow-hidden bg-secondary">
          <Image src={vendor.banner} alt="" fill sizes="500px" className="object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, #1e1e1e8c 0%, transparent 60%)" }}
          />
          {vendor.verified && (
            <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-primary backdrop-blur-sm">
              <BadgeCheck className="size-3.5" />
              Vérifié
            </span>
          )}
        </div>

        <CardHeader className="-mt-7 flex flex-row items-start gap-3 pt-0">
          <Avatar className="size-14 flex-shrink-0 border-4 border-background bg-secondary shadow-sm">
            <AvatarFallback className="bg-secondary text-base text-secondary-foreground">
              {vendor.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 pt-7">
            <h3 className="truncate font-heading text-base font-medium">{vendor.name}</h3>
            <p className="text-xs text-muted-foreground">{vendor.location}</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">{vendor.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {vendor.specialties.slice(0, 2).map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t py-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-current text-amber-500" />
              <span className="font-heading font-medium">{vendor.rating}</span>
              <span className="text-muted-foreground">({vendor.reviewCount})</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {productCount} produit{productCount === 1 ? "" : "s"}
            </span>
          </div>
          <span className="flex items-center gap-1 text-sm text-primary">
            Voir la boutique
            <ArrowRight className="size-3.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
