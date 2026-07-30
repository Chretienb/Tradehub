// Dev-only seed script: recreates the original mock-data.ts vendors/products
// as real Supabase rows, so local development has something to look at.
//
// Uses the service-role key (bypasses RLS, needed for admin.createUser and
// to backfill vendor fields the signup trigger doesn't set) — never import
// this script or its key into anything that ships to the browser.
//
// Run with: node --env-file=.env.local scripts/seed.mjs

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// id here is the old mock-data.ts slug — used only to link products to
// their vendor below, replaced by a real UUID once the account is created.
const vendors = [
  {
    id: "kin-grossiste",
    email: "vendor+kin-grossiste@teka.dev",
    name: "Kin Grossiste SARL",
    location: "Gombe, Kinshasa",
    province: "Kinshasa",
    rating: 4.9,
    review_count: 210,
    orders_completed: 320,
    verified: true,
    response_time: "Répond généralement en moins de 2 heures",
    response_rate: 98,
    description:
      "Importateur et grossiste de produits alimentaires de base à Kinshasa depuis 2014. Riz, huile, farine et sucre en gros pour supermarchés et revendeurs. Livraison à Kinshasa et provinces.",
    specialties: ["Alimentation", "Boissons", "Import"],
    whatsapp: "+243 8XX XXX XXX",
    rccm: "CD/KIN/RCCM/24-B-XXXX",
    banner_url: "/images/product-rice.jpg",
    payout_method: "Airtel Money",
    payout_number: "+243 81 234 5678",
  },
  {
    id: "matadi-oil",
    email: "vendor+matadi-oil@teka.dev",
    name: "Matadi Oil",
    location: "Matadi, Kongo Central",
    province: "Kongo Central",
    rating: 4.7,
    review_count: 96,
    orders_completed: 168,
    verified: true,
    response_time: "Répond généralement en moins de 3 heures",
    response_rate: 95,
    description:
      "Producteur et grossiste d'huile végétale raffinée. Conditionnement en bidons et cartons pour la distribution en gros partout en RDC.",
    specialties: ["Huiles", "Alimentation", "Distribution"],
    whatsapp: "+243 8XX XXX XXX",
    rccm: "CD/MAT/RCCM/21-B-XXXX",
    banner_url: "/images/product-oil.jpg",
    payout_method: "Orange Money",
    payout_number: "+243 89 345 6789",
  },
  {
    id: "congo-batir",
    email: "vendor+congo-batir@teka.dev",
    name: "Congo Bâtir",
    location: "Lubumbashi, Haut-Katanga",
    province: "Haut-Katanga",
    rating: 4.6,
    review_count: 74,
    orders_completed: 141,
    verified: true,
    response_time: "Répond généralement en moins de 4 heures",
    response_rate: 92,
    description:
      "Grossiste de matériaux de construction — ciment, fer à béton, quincaillerie — pour entrepreneurs et détaillants du Haut-Katanga.",
    specialties: ["Construction", "Quincaillerie", "Livraison chantier"],
    whatsapp: "+243 8XX XXX XXX",
    rccm: "CD/LSH/RCCM/19-B-XXXX",
    banner_url: "/images/product-cement.jpg",
    payout_method: "Airtel Money",
    payout_number: "+243 97 456 7890",
  },
  {
    id: "fermes-kivu",
    email: "vendor+fermes-kivu@teka.dev",
    name: "Fermes Kivu",
    location: "Bukavu, Sud-Kivu",
    province: "Sud-Kivu",
    rating: 4.5,
    review_count: 58,
    orders_completed: 103,
    verified: true,
    response_time: "Répond généralement en moins de 6 heures",
    response_rate: 90,
    description:
      "Coopérative agricole du Sud-Kivu — légumes frais et céréales en gros pour marchés et grossistes, récolte et livraison directes.",
    specialties: ["Agriculture", "Produits frais", "Coopérative"],
    whatsapp: "+243 8XX XXX XXX",
    rccm: "CD/BUK/RCCM/22-B-XXXX",
    banner_url: "/images/product-tomatoes.jpg",
    payout_method: "M-Pesa",
    payout_number: "+243 82 567 8901",
  },
  {
    id: "nzuzi-electronique",
    email: "vendor+nzuzi-electronique@teka.dev",
    name: "Nzuzi Électronique",
    location: "Matonge, Kinshasa",
    province: "Kinshasa",
    rating: 4.3,
    review_count: 41,
    orders_completed: 67,
    verified: false,
    response_time: "Répond généralement en moins de 5 heures",
    response_rate: 85,
    description:
      "Importateur de téléphones et accessoires électroniques — vente en gros pour boutiques et revendeurs, avec service après-vente.",
    specialties: ["Électronique", "Téléphonie", "Import"],
    whatsapp: "+243 8XX XXX XXX",
    rccm: "CD/KIN/RCCM/23-B-XXXX",
    banner_url: "/images/product-phones.jpg",
    payout_method: "Orange Money",
    payout_number: "+243 84 678 9012",
  },
  {
    id: "kin-textile",
    email: "vendor+kin-textile@teka.dev",
    name: "Kin Textile Mode",
    location: "Kinshasa",
    province: "Kinshasa",
    rating: 4.4,
    review_count: 33,
    orders_completed: 52,
    verified: true,
    response_time: "Répond généralement en moins de 4 heures",
    response_rate: 88,
    description:
      "Grossiste de pagnes wax et tissus importés pour couturiers, boutiques et marchés textiles de Kinshasa.",
    specialties: ["Mode & Textile", "Pagnes", "Import"],
    whatsapp: "+243 8XX XXX XXX",
    rccm: "CD/KIN/RCCM/23-B-YYYY",
    banner_url: "/images/product-fabric.jpg",
    payout_method: "Airtel Money",
    payout_number: "+243 99 789 0123",
  },
];

const products = [
  {
    vendorId: "kin-grossiste",
    name: "Riz blanc 25 kg — Grain long",
    category_slug: "alimentation",
    image_url: "/images/product-rice.jpg",
    price: 28.5,
    unit: "sac",
    moq: 100,
    moq_unit: "sacs",
    stock: 5200,
    featured: true,
  },
  {
    vendorId: "matadi-oil",
    name: "Huile végétale 4 L — Carton de 4",
    category_slug: "alimentation",
    image_url: "/images/product-oil.jpg",
    price: 34.9,
    unit: "carton",
    moq: 80,
    moq_unit: "cartons",
    stock: 3600,
    featured: false,
  },
  {
    vendorId: "congo-batir",
    name: "Ciment 35 kg — CEM II 32,5 R",
    category_slug: "construction",
    image_url: "/images/product-cement.jpg",
    price: 9.8,
    unit: "sac",
    moq: 200,
    moq_unit: "sacs",
    stock: 18000,
    featured: true,
  },
  {
    vendorId: "fermes-kivu",
    name: "Tomates fraîches — Caisse de 10 kg",
    category_slug: "agriculture",
    image_url: "/images/product-tomatoes.jpg",
    price: 12,
    unit: "caisse",
    moq: 50,
    moq_unit: "caisses",
    stock: 900,
    featured: false,
  },
  {
    vendorId: "nzuzi-electronique",
    name: "Téléphones Android — Lot de gros",
    category_slug: "electronique",
    image_url: "/images/product-phones.jpg",
    price: 65,
    unit: "pièce",
    moq: 50,
    moq_unit: "pièces",
    stock: 1200,
    featured: false,
  },
  {
    vendorId: "kin-textile",
    name: "Pagnes wax — Rouleau de 12 yards",
    category_slug: "mode-textile",
    image_url: "/images/product-fabric.jpg",
    price: 42,
    unit: "rouleau",
    moq: 20,
    moq_unit: "rouleaux",
    stock: 640,
    featured: true,
  },
];

async function findExistingUserIdByEmail(email) {
  // Admin API has no get-by-email; page through (fine at this seed's scale).
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  return data.users.find((u) => u.email === email)?.id ?? null;
}

async function seedVendor(v) {
  let userId = await findExistingUserIdByEmail(v.email);

  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: v.email,
      password: crypto.randomUUID(), // dev accounts only; nobody needs to log in as these
      email_confirm: true,
      user_metadata: {
        role: "vendor",
        name: v.name,
        location: v.location,
        province: v.province,
        rccm: v.rccm,
      },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`created ${v.name} (${userId})`);
  } else {
    console.log(`${v.name} already exists (${userId}), updating fields`);
  }

  // The handle_new_user trigger only sets id/name/location/province/rccm —
  // backfill the rest of the public storefront fields here.
  const { error: vendorError } = await supabase
    .from("vendors")
    .update({
      rating: v.rating,
      review_count: v.review_count,
      orders_completed: v.orders_completed,
      verified: v.verified,
      response_time: v.response_time,
      response_rate: v.response_rate,
      description: v.description,
      specialties: v.specialties,
      whatsapp: v.whatsapp,
      banner_url: v.banner_url,
    })
    .eq("id", userId);
  if (vendorError) throw vendorError;

  const { error: payoutError } = await supabase
    .from("vendor_payout_info")
    .upsert({ vendor_id: userId, payout_method: v.payout_method, payout_number: v.payout_number });
  if (payoutError) throw payoutError;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ verification_status: v.verified ? "verified" : "pending" })
    .eq("id", userId);
  if (profileError) throw profileError;

  return userId;
}

async function main() {
  const idBySlug = {};
  for (const v of vendors) {
    idBySlug[v.id] = await seedVendor(v);
  }

  for (const p of products) {
    const vendorId = idBySlug[p.vendorId];
    const { vendorId: _slug, ...productFields } = p;
    const { error } = await supabase
      .from("products")
      .upsert({ vendor_id: vendorId, ...productFields }, { onConflict: "vendor_id,name" });
    if (error) throw error;
    console.log(`seeded product: ${p.name}`);
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
