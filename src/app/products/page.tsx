import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/data/catalog";
import { ArrowLeft } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const [filtered, categories, activeCategory] = await Promise.all([
    getProducts({ q, category }),
    getCategories(),
    category ? getCategoryBySlug(category) : Promise.resolve(null),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Link
            href="/"
            className="mb-4 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour à l&apos;accueil
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              {activeCategory ? activeCategory.name : "Tous les produits"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {filtered.length} produit{filtered.length === 1 ? "" : "s"} trouvé{filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          <Suspense>
            <ProductFilters categories={categories} />
          </Suspense>

          {filtered.length > 0 ? (
            <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center text-muted-foreground">
              <p>Aucun produit ne correspond à votre recherche pour le moment.</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
