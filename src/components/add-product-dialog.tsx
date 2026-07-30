"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/lib/data/catalog";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";

export function AddProductDialog({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [moq, setMoq] = useState("");
  const [moqUnit, setMoqUnit] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setCategory("");
    setPrice("");
    setUnit("");
    setMoq("");
    setMoqUnit("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Number(price);
    const moqNum = Number(moq);
    if (!name.trim() || !category || !priceNum || !unit.trim() || !moqNum || !moqUnit.trim()) {
      toast.error("Renseignez tous les champs pour publier ce produit.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch("/api/vendor/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({
        name: name.trim(),
        categorySlug: category,
        price: priceNum,
        unit: unit.trim(),
        moq: moqNum,
        moqUnit: moqUnit.trim(),
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Une erreur est survenue." }));
      toast.error(error);
      return;
    }

    toast.success(`« ${name.trim()} » a été ajouté à votre catalogue.`);
    reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        Ajouter un produit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Il sera visible dans votre catalogue une fois publié.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-name">Nom du produit</Label>
            <Input
              id="product-name"
              placeholder="Ex : Riz blanc 25 kg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="product-price">Prix (USD)</Label>
              <Input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex : 28.50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="product-unit">Unité</Label>
              <Input
                id="product-unit"
                placeholder="Ex : sac"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="product-moq">MOQ</Label>
              <Input
                id="product-moq"
                type="number"
                min="1"
                placeholder="Ex : 100"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="product-moq-unit">Unité MOQ</Label>
              <Input
                id="product-moq-unit"
                placeholder="Ex : sacs"
                value={moqUnit}
                onChange={(e) => setMoqUnit(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Catégorie</Label>
            <Select value={category || undefined} onValueChange={(value) => setCategory(value ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="-mx-0 -mb-0 border-none bg-transparent p-0">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Publication…" : "Publier le produit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
