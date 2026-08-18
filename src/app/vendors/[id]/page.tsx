import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VendorQuoteActions } from "@/components/vendor-quote-actions";
import { readSessionServer } from "@/lib/auth-server";
import { getProductsByVendor, getVendorById, getVendorIds } from "@/lib/data/catalog";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

export async function generateStaticParams() {
  const ids = await getVendorIds();
  return ids.map((id) => ({ id }));
}

// New vendors (not in the build-time set above) still render on first
// visit via dynamicParams' default of true, then get cached for an hour.
// revalidatePath is called from the vendor-profile Route Handler (Phase 5)
// so a vendor's own edits show up immediately instead of waiting the hour.
export const revalidate = 3600;

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await getVendorById(id);
  if (!vendor) notFound();

  const [vendorProducts, session] = await Promise.all([
    getProductsByVendor(vendor.id),
    readSessionServer(),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-40 w-full overflow-hidden sm:h-52">
          <Image src={vendor.banner} alt="" fill priority sizes="100vw" className="object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #1e1e1e59 0%, #1e1e1ed9 100%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <Link
            href="/vendors"
            className="mt-4 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour aux fournisseurs
          </Link>

          {/* Store header — the avatar breaks the banner, but the text block
              always starts in normal flow below it, so long names or wrapped
              badges can never bleed up into the photo. */}
          <div className="-mt-10 sm:-mt-12">
            <Avatar className="size-20 flex-shrink-0 border-4 border-background bg-secondary shadow-md sm:size-24">
              <AvatarFallback className="bg-secondary text-2xl text-secondary-foreground">
                {vendor.initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{vendor.name}</h1>
              {vendor.verified && (
                <Badge variant="secondary" className="gap-1">
                  <BadgeCheck className="size-3.5" /> Fournisseur Vérifié
                </Badge>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {vendor.location} — Membre depuis {vendor.memberSince}
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profil de la boutique</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">{vendor.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {vendor.specialties.map((s) => (
                      <Badge key={s} variant="secondary" className="font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <div className="mt-6">
                <h2 className="mb-3 text-lg font-medium">
                  Produits en vitrine
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({vendorProducts.length})
                  </span>
                </h2>
                {vendorProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {vendorProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Ce fournisseur n&apos;a pas encore publié de produits.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-base">Contacter ce fournisseur</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">{vendor.responseTime}.</p>
                  <VendorQuoteActions
                    session={session}
                    vendorId={vendor.id}
                    vendorName={vendor.name}
                    vendorPath={`/vendors/${vendor.id}`}
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 border-t pt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Lock className="size-3.5 flex-shrink-0" />
                    Paiement séquestré — libéré après confirmation de réception.
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 flex-shrink-0" />
                    Orange Money, Airtel Money, M-Pesa, Visa, Mastercard.
                  </span>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground" />
                    <span>{vendor.whatsapp}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">RCCM :</span>
                    <span>{vendor.rccm}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Statistiques publiques</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Note moyenne</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Star className="size-3.5 fill-current text-amber-500" /> {vendor.rating} / 5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Commandes réalisées</span>
                    <span className="font-medium">{vendor.ordersCompleted}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Taux de réponse</span>
                    <span className="font-medium">{vendor.responseRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Délai moyen</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="size-3.5" /> {vendor.responseTime.match(/\d+.*$/)?.[0]}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
