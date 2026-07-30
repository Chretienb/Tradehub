"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Category } from "@/lib/data/catalog";
import { useState } from "react";
import { Search } from "lucide-react";

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const categoryLabels: Record<string, string> = Object.fromEntries(
    categories.map((c) => [c.slug, c.name])
  );
  categoryLabels.all = "Toutes les catégories";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <form
        className="relative flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          updateParam("q", query);
        }}
      >
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit… ex. ciment, riz, huile"
          className="pl-9"
        />
      </form>

      <Select
        value={searchParams.get("category") ?? "all"}
        onValueChange={(value) => updateParam("category", value ?? "")}
      >
        <SelectTrigger className="sm:w-56">
          <SelectValue placeholder="Catégorie">
            {(value: string | null) => (value ? categoryLabels[value] : "Catégorie")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les catégories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.slug} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
