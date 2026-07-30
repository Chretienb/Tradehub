-- Correction: the original UI (vendors/[id]/page.tsx) displays RCCM
-- publicly on a vendor's storefront — it's DRC's public business-registry
-- number (like a SIRET/EIN), not private identity data. Phase 1 put it on
-- profiles (private, owner-only RLS) by mistake, alongside registered_address
-- which genuinely is internal-only (never rendered publicly in the UI).
-- Moving rccm to vendors, which already has a public "using (true)" SELECT
-- policy, so no RLS change is needed here.
alter table public.vendors add column rccm text;
alter table public.profiles drop column rccm;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role', 'customer');
begin
  insert into public.profiles (id, role, name, phone, email)
  values (new.id, v_role, coalesce(new.raw_user_meta_data->>'name', ''), new.phone, new.email);

  if v_role = 'vendor' then
    insert into public.vendors (id, name, location, province, rccm)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', ''),
      coalesce(new.raw_user_meta_data->>'location', ''),
      new.raw_user_meta_data->>'province',
      new.raw_user_meta_data->>'rccm'
    );

    update public.profiles
    set registered_address = new.raw_user_meta_data->>'registered_address',
        verification_status = 'pending'
    where id = new.id;
  end if;

  return new;
end;
$$;
