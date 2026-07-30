import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeContent } from "@/components/home-content";
import { getCategories, getFeaturedProducts } from "@/lib/data/catalog";

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([getCategories(), getFeaturedProducts(8)]);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader bordered={false} />
      <HomeContent categories={categories} featuredProducts={featuredProducts} />
      <SiteFooter />
    </div>
  );
}
