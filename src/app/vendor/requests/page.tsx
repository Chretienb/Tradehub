import { createClient } from "@/lib/supabase/server";
import { getVendorQuoteRequests } from "@/lib/data/quote-requests";
import { unwrapOne } from "@/lib/utils";
import { RequestsList, type QuoteRequestRow } from "./requests-list";

export default async function VendorRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rows = user ? await getVendorQuoteRequests(supabase, user.id) : [];
  const requests: QuoteRequestRow[] = rows.map((r) => ({
    id: r.id,
    customerName: unwrapOne<{ name: string }>(r.profiles)?.name ?? "Client",
    productName: unwrapOne<{ name: string }>(r.products)?.name ?? null,
    message: r.message,
    location: r.location,
    status: r.status,
    source: r.source,
    createdAt: r.created_at,
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Demandes</h1>
        <p className="mt-1 text-muted-foreground">
          Demandes de devis des clients, qu&apos;elles viennent du site ou de WhatsApp.
        </p>
      </div>

      <RequestsList initialRequests={requests} />
    </div>
  );
}
