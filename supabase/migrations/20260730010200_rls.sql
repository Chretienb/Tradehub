-- RLS is the second line of defense here — Route Handlers verify the
-- session and check business rules (status transitions, etc.) before
-- ever issuing a query. Policies below deliberately stay to simple
-- row-ownership / one-hop EXISTS checks, not per-status-transition logic.

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.vendors enable row level security;
alter table public.vendor_payout_info enable row level security;
alter table public.products enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.orders enable row level security;
alter table public.quote_requests enable row level security;

-- profiles: private to the owner
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
-- no insert policy: rows are created only by the handle_new_user trigger
-- (security definer), never directly by a client.

-- categories: public read, migration-managed writes only
create policy "categories_select_all" on public.categories
  for select using (true);

-- vendors: public storefront read; vendor manages their own row
create policy "vendors_select_all" on public.vendors
  for select using (true);
create policy "vendors_insert_own" on public.vendors
  for insert with check (
    auth.uid() = id
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'vendor')
  );
create policy "vendors_update_own" on public.vendors
  for update using (auth.uid() = id);

-- vendor_payout_info: private to the vendor
create policy "vendor_payout_info_select_own" on public.vendor_payout_info
  for select using (auth.uid() = vendor_id);
create policy "vendor_payout_info_insert_own" on public.vendor_payout_info
  for insert with check (auth.uid() = vendor_id);
create policy "vendor_payout_info_update_own" on public.vendor_payout_info
  for update using (auth.uid() = vendor_id);

-- products: public catalog read; vendor manages their own rows
create policy "products_select_all" on public.products
  for select using (true);
create policy "products_insert_own" on public.products
  for insert with check (
    auth.uid() = vendor_id
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'vendor')
  );
create policy "products_update_own" on public.products
  for update using (auth.uid() = vendor_id);
create policy "products_delete_own" on public.products
  for delete using (auth.uid() = vendor_id);

-- conversations: visible to either party; only the customer can start one
create policy "conversations_select_participant" on public.conversations
  for select using (auth.uid() = customer_id or auth.uid() = vendor_id);
create policy "conversations_insert_customer" on public.conversations
  for insert with check (auth.uid() = customer_id);
create policy "conversations_update_participant" on public.conversations
  for update using (auth.uid() = customer_id or auth.uid() = vendor_id);

-- messages: visible/writable by either party of the parent conversation
create policy "messages_select_participant" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.customer_id = auth.uid() or c.vendor_id = auth.uid())
    )
  );
create policy "messages_insert_participant" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.customer_id = auth.uid() or c.vendor_id = auth.uid())
    )
  );
create policy "messages_update_participant" on public.messages
  for update using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.customer_id = auth.uid() or c.vendor_id = auth.uid())
    )
  );

-- orders: visible/writable by either party; handler enforces valid status transitions
create policy "orders_select_participant" on public.orders
  for select using (auth.uid() = customer_id or auth.uid() = vendor_id);
create policy "orders_insert_customer" on public.orders
  for insert with check (auth.uid() = customer_id);
create policy "orders_update_participant" on public.orders
  for update using (auth.uid() = customer_id or auth.uid() = vendor_id);

-- quote_requests: visible to either party; customer creates, vendor updates status
create policy "quote_requests_select_participant" on public.quote_requests
  for select using (auth.uid() = customer_id or auth.uid() = vendor_id);
create policy "quote_requests_insert_customer" on public.quote_requests
  for insert with check (auth.uid() = customer_id);
create policy "quote_requests_update_vendor" on public.quote_requests
  for update using (auth.uid() = vendor_id);
