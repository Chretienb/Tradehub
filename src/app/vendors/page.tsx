import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VendorCard } from "@/components/vendor-card";
import { Input } from "@/components/ui/input";
import { getVendors } from "@/lib/data/catalog";
import { Search } from "lucide-react";

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const filtered = await getVendors({ q });

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl p-6 sm:min-h-[320px] sm:p-8">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/dash-market-poster.jpg"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/videos/dash-market.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, #1e1e1eb3 0%, #1e1e1e4d 45%, #1e1e1ee0 100%)",
              }}
            />

            <div className="relative">
              <h1 className="font-heading text-3xl font-medium tracking-tight text-white">
                Fournisseurs vérifiés
              </h1>
              <p className="mt-1 text-white/70">
                {filtered.length} fournisseur{filtered.length === 1 ? "" : "s"} sur TEKA
              </p>

              <form action="/vendors" className="relative mt-5 max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Rechercher un fournisseur…"
                  className="h-11 border-white/15 bg-background/95 pl-9 backdrop-blur-sm"
                />
              </form>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-8 grid gap-5 pb-10 sm:grid-cols-2">
              {filtered.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="mt-16 pb-10 text-center text-muted-foreground">
              <p>Aucun fournisseur ne correspond à votre recherche pour le moment.</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
