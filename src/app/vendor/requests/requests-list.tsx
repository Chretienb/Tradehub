"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/utils";
import { MapPin, MessageCircle, Phone } from "lucide-react";

export type QuoteRequestRow = {
  id: string;
  customerName: string;
  productName: string | null;
  message: string;
  location: string | null;
  status: "new" | "accepted" | "declined" | "completed";
  source: "web" | "whatsapp";
  createdAt: string;
};

const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  accepted: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  declined: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const statusLabels: Record<string, string> = {
  new: "nouvelle",
  accepted: "acceptée",
  declined: "refusée",
  completed: "terminée",
};

export function RequestsList({ initialRequests }: { initialRequests: QuoteRequestRow[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: "accepted" | "declined") {
    setPendingId(id);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(`/api/vendor/quote-requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });
    setPendingId(null);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
      toast.error(error);
      return;
    }

    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(status === "accepted" ? "Demande acceptée" : "Demande refusée");
  }

  return (
    <div className="flex flex-col gap-3">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{request.customerName}</p>
                <Badge className={statusStyles[request.status]} variant="secondary">
                  {statusLabels[request.status]}
                </Badge>
                <Badge variant="outline" className="gap-1 font-normal">
                  {request.source === "whatsapp" ? (
                    <Phone className="size-3" />
                  ) : (
                    <MessageCircle className="size-3" />
                  )}
                  {request.source === "whatsapp" ? "WhatsApp" : "Site web"}
                </Badge>
              </div>
              {request.productName && (
                <p className="mt-1 text-sm font-medium text-foreground/80">{request.productName}</p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">{request.message}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />
                {request.location} · {formatRelativeTime(request.createdAt)}
              </div>
            </div>

            {request.status === "new" && (
              <div className="flex flex-shrink-0 gap-2">
                <Button
                  size="sm"
                  disabled={pendingId === request.id}
                  onClick={() => updateStatus(request.id, "accepted")}
                >
                  Accepter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pendingId === request.id}
                  onClick={() => updateStatus(request.id, "declined")}
                >
                  Refuser
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
