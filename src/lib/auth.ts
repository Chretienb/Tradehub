// Shared session types. Both customers and vendors are TEKA accounts —
// buying, messaging a vendor, or selling all require one. `role` is what
// tells the rest of the app which kind of account this is.
//
// Session reads/writes themselves live in lib/supabase (real Supabase Auth
// + @supabase/ssr cookies) and lib/auth-server.ts (server-side read). This
// file only holds the shape every consumer imports.

export type UserRole = "customer" | "vendor";

export type VerificationStatus = "unsubmitted" | "pending" | "verified" | "rejected";

export type UserSession = {
  role: UserRole;
  name: string; // person's name for customers, business name for vendors
  // Customers log in with phone (SMS OTP) — vendors log in with email
  // (password), since B2B accounts run through business email anyway.
  // `phone` on a vendor session is just a business contact number (used to
  // notify vendors by SMS about new messages/orders), not a login credential.
  phone?: string;
  email?: string;
  // Vendor-only — the storefront's public city/area, editable in Settings.
  location?: string;
  // KYB (know-your-business) fields — vendor-only. RCCM + registered address
  // are what TEKA screens before showing a "Vérifié" badge to buyers.
  rccm?: string;
  registeredAddress?: string;
  verificationStatus?: VerificationStatus;
};
