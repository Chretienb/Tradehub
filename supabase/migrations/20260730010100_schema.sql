-- TEKA core schema.
-- profiles/vendors are split so the public storefront read policy
-- (using (true)) never has to apply to a table holding phone/email/KYB data.
-- vendor_payout_info is split from vendors for the same reason at finer
-- grain, since Postgres RLS is row- not column-level.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('customer', 'vendor')),
  name text not null,
  phone text,
  email text,
  rccm text,
  registered_address text,
  verification_status text not null default 'unsubmitted'
    check (verification_status in ('unsubmitted', 'pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  slug text primary key,
  name text not null,
  description text,
  image_url text,
  sort_order integer not null default 0
);

create table public.vendors (
  id uuid primary key references public.profiles(id) on delete cascade,
  name text not null,
  location text not null,
  province text,
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  orders_completed integer not null default 0,
  verified boolean not null default false, -- only ever flipped by the manual KYB-approval step
  response_time text,
  response_rate integer,
  description text,
  specialties text[] not null default '{}',
  whatsapp text,
  banner_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index vendors_verified_idx on public.vendors (verified);

create table public.vendor_payout_info (
  vendor_id uuid primary key references public.vendors(id) on delete cascade,
  payout_method text,
  payout_number text,
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  category_slug text not null references public.categories(slug),
  name text not null,
  image_url text,
  price numeric(10,2) not null check (price >= 0),
  unit text not null,
  moq integer not null check (moq > 0),
  moq_unit text not null,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_vendor_id_idx on public.products (vendor_id);
create index products_category_slug_idx on public.products (category_slug);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (customer_id, vendor_id)
);
create index conversations_customer_id_idx on public.conversations (customer_id);
create index conversations_vendor_id_idx on public.conversations (vendor_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  vendor_id uuid not null references public.vendors(id),
  product_id uuid references public.products(id) on delete set null, -- nullable: chat-negotiated deals may not map to a catalog SKU
  conversation_id uuid references public.conversations(id) on delete set null,
  quantity integer not null check (quantity > 0),
  amount numeric(10,2) not null check (amount > 0),
  status text not null default 'sequestre'
    check (status in ('sequestre', 'expediee', 'livree', 'annulee')),
  delivery_photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_customer_id_idx on public.orders (customer_id);
create index orders_vendor_id_idx on public.orders (vendor_id);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  kind text not null default 'text' check (kind in ('text', 'payment')),
  payment_amount numeric(10,2),
  order_id uuid references public.orders(id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index messages_conversation_id_idx on public.messages (conversation_id, created_at);

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  vendor_id uuid not null references public.vendors(id),
  product_id uuid references public.products(id) on delete set null,
  message text not null,
  location text,
  status text not null default 'new'
    check (status in ('new', 'accepted', 'declined', 'completed')),
  source text not null default 'web' check (source in ('web', 'whatsapp')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index quote_requests_vendor_id_idx on public.quote_requests (vendor_id, status);
