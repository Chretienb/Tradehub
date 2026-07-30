import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <p className="text-sm font-medium text-primary">Erreur 404</p>
        <h1 className="text-2xl font-semibold tracking-tight">Page introuvable</h1>
        <p className="max-w-sm text-muted-foreground">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Button render={<Link href="/" />} className="mt-2">
          Retour à l&apos;accueil
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
