import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";

// List/create the current vendor's own products. Public catalog reads
// (anyone browsing /products) go through src/lib/data/catalog.ts directly —
// this route is specifically the authenticated "my products" surface.
export async function GET(request: Request) {
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "vendor") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, categorySlug, imageUrl, price, unit, moq, moqUnit, stock } = body ?? {};
  if (!name || !categorySlug || !price || !unit || !moq || !moqUnit) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      vendor_id: user.id,
      name,
      category_slug: categorySlug,
      image_url: imageUrl ?? null,
      price,
      unit,
      moq,
      moq_unit: moqUnit,
      stock: stock ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ product }, { status: 201 });
}
