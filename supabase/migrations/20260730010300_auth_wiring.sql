-- Profile creation is a DB trigger, not application code, because a future
-- mobile client will call Supabase Auth directly with no Next.js route in
-- the path — a trigger is the only way every auth.users row is guaranteed
-- a matching profiles row regardless of which client created the account.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.phone,
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Called right after a vendor's signUp() succeeds, via POST
-- /api/vendor/signup-details. security invoker (the default) so it runs
-- under the caller's own JWT — RLS on vendors/profiles applies normally,
-- no service-role bypass needed. Wraps both writes in one transaction.
create or replace function public.complete_vendor_signup(
  p_name text,
  p_location text,
  p_province text,
  p_rccm text,
  p_registered_address text
)
returns void
language plpgsql
security invoker
as $$
begin
  insert into public.vendors (id, name, location, province)
  values (auth.uid(), p_name, p_location, p_province);

  update public.profiles
  set rccm = p_rccm,
      registered_address = p_registered_address,
      verification_status = 'pending',
      updated_at = now()
  where id = auth.uid();
end;
$$;
