"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Camera, CheckCircle2 } from "lucide-react";

export type OrderRow = {
  id: string;
  productName: string;
  productImage: string;
  productUnit: string;
  vendorName: string;
  quantity: number;
  amount: number;
  status: "sequestre" | "expediee" | "livree" | "annulee";
  orderedAt: string;
};

const statusDot: Record<string, string> = {
  sequestre: "bg-amber-500",
  expediee: "bg-blue-500",
  livree: "bg-green-500",
  annulee: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  sequestre: "En séquestre",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export function OrdersList({ initialOrders }: { initialOrders: OrderRow[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [openId, setOpenId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState<string | null>(null);

  function handlePhoto(orderId: string, file: File | undefined) {
    if (!file) return;
    // Local preview only — Storage upload for delivery photos isn't wired
    // up yet (see the PATCH /api/orders/[id] route comment).
    setPhotos((prev) => ({ ...prev, [orderId]: URL.createObjectURL(file) }));
  }

  async function confirmReceipt(orderId: string) {
    setConfirming(orderId);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ status: "livree" }),
    });
    setConfirming(null);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
      toast.error(error);
      return;
    }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "livree" } : o)));
    setOpenId(null);
    toast.success("Réception confirmée — le paiement est libéré au fournisseur.");
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        <p>Aucune commande pour le moment.</p>
        <Link href="/products" className="font-medium text-foreground hover:underline">
          Parcourir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const canConfirm = order.status === "expediee";
        const isOpen = openId === order.id;
        const photo = photos[order.id];

        return (
          <Card key={order.id} className="gap-0 overflow-hidden rounded-2xl py-0">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="relative size-14 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                <Image src={order.productImage} alt="" fill sizes="56px" className="object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{order.productName}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {order.vendorName} · {order.quantity} {order.productUnit}
                  {order.quantity > 1 ? "s" : ""} · {order.orderedAt}
                </p>
              </div>

              <div className="flex flex-shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-semibold tabular-nums">
                  {order.amount.toLocaleString("fr-FR")} $
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn("size-1.5 rounded-full", statusDot[order.status])} />
                  {statusLabels[order.status]}
                </span>
              </div>
            </CardContent>

            {canConfirm && (
              <div className="border-t bg-secondary/30 px-4 py-3 sm:px-5">
                {!isOpen ? (
                  <button
                    onClick={() => setOpenId(order.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary/10 py-2 text-sm font-medium text-primary hover:bg-primary/15"
                  >
                    <CheckCircle2 className="size-4" /> Confirmer la réception
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground">
                      Ajoutez une photo du produit reçu avec le fournisseur, puis confirmez
                      pour libérer le paiement séquestré.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="relative flex size-16 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary">
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photo} alt="" className="size-full object-cover" />
                        ) : (
                          <Camera className="size-5" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="absolute inset-0 size-full cursor-pointer opacity-0"
                          onChange={(e) => handlePhoto(order.id, e.target.files?.[0])}
                        />
                      </label>
                      <div className="flex flex-1 gap-2">
                        <button
                          onClick={() => confirmReceipt(order.id)}
                          disabled={!photo || confirming === order.id}
                          className="flex-1 rounded-full bg-primary py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40"
                        >
                          Confirmer la réception
                        </button>
                        <button
                          onClick={() => setOpenId(null)}
                          className="rounded-full border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
