-- Testing the vendor signup flow surfaced a real bug: this project requires
-- email confirmation, so supabase.auth.signUp() does NOT return a session
-- immediately. The original design (a POST /api/vendor/signup-details call
-- right after signUp(), authenticated via that session) silently loses the
-- vendor's RCCM/address/storefront fields whenever confirmation is pending,
-- since there's no session yet to call it with.
--
-- Fix: fold vendor row creation into handle_new_user() itself, reading
-- everything from auth.users.raw_user_meta_data. The trigger fires on
-- auth.users insert regardless of confirmation state, so this works
-- identically whether or not email confirmation is required — and removes
-- a network round-trip entirely (signUp() with the right metadata is now
-- the whole vendor signup).
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
    insert into public.vendors (id, name, location, province)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', ''),
      coalesce(new.raw_user_meta_data->>'location', ''),
      new.raw_user_meta_data->>'province'
    );

    update public.profiles
    set rccm = new.raw_user_meta_data->>'rccm',
        registered_address = new.raw_user_meta_data->>'registered_address',
        verification_status = 'pending'
    where id = new.id;
  end if;

  return new;
end;
$$;

-- complete_vendor_signup and /api/vendor/signup-details are now unused —
-- the trigger above replaces both.
drop function if exists public.complete_vendor_signup(text, text, text, text, text);
