import { NextResponse } from "next/server";
import { createClient, getRequestUser } from "@/lib/supabase/server";

// vendor_id-scoped update/delete — RLS's products_update_own/delete_own
// policies already restrict these to the owning vendor, so the .eq below
// is belt-and-suspenders, not the actual security boundary.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, categorySlug, imageUrl, price, unit, moq, moqUnit, stock, featured } = body ?? {};
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  if (categorySlug !== undefined) updates.category_slug = categorySlug;
  if (imageUrl !== undefined) updates.image_url = imageUrl;
  if (price !== undefined) updates.price = price;
  if (unit !== undefined) updates.unit = unit;
  if (moq !== undefined) updates.moq = moq;
  if (moqUnit !== undefined) updates.moq_unit = moqUnit;
  if (stock !== undefined) updates.stock = stock;
  if (featured !== undefined) updates.featured = featured;

  const { data: product, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .eq("vendor_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ product });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getRequestUser(request, supabase);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { error } = await supabase.from("products").delete().eq("id", id).eq("vendor_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
