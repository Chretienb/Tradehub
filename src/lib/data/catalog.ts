import "server-only";
import { createClient, createStaticClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";

// Public catalog reads — categories, vendors, products. These are queried
// directly from Supabase in Server Components (no Route Handler in front):
// the RLS policy on all three tables is `using (true)`, identical for a
// browser SSR request, a future mobile client, or a WhatsApp bot, so a
// handler here would just be a redundant proxy. Field names below match
// the original mock-data.ts shapes (image vs image_url, etc.) so consuming
// components needed minimal changes when this replaced the mock import.

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type ProductVendor = {
  id: string;
  name: string;
  location: string;
  verified: boolean;
};

export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  moq: number;
  moqUnit: string;
  featured: boolean;
  vendor: ProductVendor;
};

export type VendorSummary = {
  id: string;
  name: string;
  location: string;
  description: string;
  specialties: string[];
  banner: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  initials: string;
  productCount: number;
};

export type VendorDetail = {
  id: string;
  name: string;
  location: string;
  province: string | null;
  description: string;
  specialties: string[];
  banner: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  initials: string;
  ordersCompleted: number;
  responseTime: string;
  responseRate: number;
  whatsapp: string;
  rccm: string;
  memberSince: number;
};

// Products are always read with their vendor embedded (a single joined
// query) rather than each ProductCard doing its own vendor lookup — that
// per-card pattern was fine against an in-memory mock array but would be
// an N+1 query pattern against Postgres.
const PRODUCT_SELECT =
  "id, name, image_url, price, unit, moq, moq_unit, featured, vendor:vendors!inner(id, name, location, verified)";

function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    image: row.image_url ?? "",
    price: Number(row.price),
    unit: row.unit,
    moq: row.moq,
    moqUnit: row.moq_unit,
    featured: row.featured,
    vendor: row.vendor,
  };
}

function mapCategory(row: any): Category {
  return { slug: row.slug, name: row.name, description: row.description ?? "", image: row.image_url ?? "" };
}

function mapVendorSummary(row: any): VendorSummary {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    description: row.description ?? "",
    specialties: row.specialties ?? [],
    banner: row.banner_url ?? "",
    verified: row.verified,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    initials: getInitials(row.name),
    // Embedded aggregate: PostgREST returns products(count) as [{ count }].
    productCount: row.products?.[0]?.count ?? 0,
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, description, image_url")
    .order("sort_order");
  if (error) {
    console.error("getCategories", error);
    return [];
  }
  return (data ?? []).map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, description, image_url")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapCategory(data);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getFeaturedProducts", error);
    return [];
  }
  return (data ?? []).map(mapProduct);
}

export async function getProducts({ q, category }: { q?: string; category?: string } = {}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select(PRODUCT_SELECT);
  if (category && category !== "all") query = query.eq("category_slug", category);
  if (q) query = query.ilike("name", `%${q}%`);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("getProducts", error);
    return [];
  }
  return (data ?? []).map(mapProduct);
}

export async function getProductsByVendor(vendorId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProductsByVendor", error);
    return [];
  }
  return (data ?? []).map(mapProduct);
}

export async function getVendors({ q }: { q?: string } = {}): Promise<VendorSummary[]> {
  const supabase = await createClient();
  let query = supabase
    .from("vendors")
    .select("id, name, location, description, specialties, banner_url, verified, rating, review_count, products(count)");
  if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("getVendors", error);
    return [];
  }
  return (data ?? []).map(mapVendorSummary);
}

export async function getVendorById(id: string): Promise<VendorDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select(
      "id, name, location, province, description, specialties, banner_url, verified, rating, review_count, orders_completed, response_time, response_rate, whatsapp, rccm, created_at"
    )
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    location: data.location,
    province: data.province,
    description: data.description ?? "",
    specialties: data.specialties ?? [],
    banner: data.banner_url ?? "",
    verified: data.verified,
    rating: Number(data.rating),
    reviewCount: data.review_count,
    initials: getInitials(data.name),
    ordersCompleted: data.orders_completed,
    responseTime: data.response_time ?? "",
    responseRate: data.response_rate ?? 0,
    whatsapp: data.whatsapp ?? "",
    rccm: data.rccm ?? "",
    memberSince: new Date(data.created_at).getFullYear(),
  };
}

// Used only by generateStaticParams (vendors/[id]/page.tsx) — id list only.
// Runs at build time (no request/cookies available), hence the static
// client rather than createClient().
export async function getVendorIds(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase.from("vendors").select("id");
  if (error) {
    console.error("getVendorIds", error);
    return [];
  }
  return (data ?? []).map((v: { id: string }) => v.id);
}
