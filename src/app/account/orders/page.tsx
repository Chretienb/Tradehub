import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCustomerOrders } from "@/lib/data/orders";
import { unwrapOne, formatRelativeTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { OrdersList, type OrderRow } from "./orders-list";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rows = user ? await getCustomerOrders(supabase, user.id) : [];
  const orders: OrderRow[] = rows.map((o) => {
    const product = unwrapOne<{ name: string; image_url: string | null; unit: string }>(o.products);
    const vendor = unwrapOne<{ name: string }>(o.vendors);
    return {
      id: o.id,
      productName: product?.name ?? "Produit",
      productImage: product?.image_url ?? "",
      productUnit: product?.unit ?? "unité",
      vendorName: vendor?.name ?? "Fournisseur",
      quantity: o.quantity,
      amount: Number(o.amount),
      status: o.status,
      orderedAt: formatRelativeTime(o.created_at),
    };
  });

  return (
    <div className="min-h-full bg-secondary/10 p-6 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/account"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Tableau de bord
        </Link>
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">Mon compte</p>
          <h1 className="text-2xl font-semibold tracking-tight">Mes commandes</h1>
          <p className="mt-1 text-muted-foreground">L&apos;historique de vos achats en gros sur TEKA.</p>
        </div>

        <OrdersList initialOrders={orders} />
      </div>
    </div>
  );
}
