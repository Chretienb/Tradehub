-- change-phone-dialog.tsx updates the phone on auth.users via
-- supabase.auth.updateUser({phone}) + verifyOtp({type:'phone_change'}).
-- readSessionServer reads phone from public.profiles, not auth.users, so
-- that column needs to stay in sync or a customer's session would keep
-- showing their old number after a successful change.
create or replace function public.handle_user_phone_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles set phone = new.phone, updated_at = now() where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_phone_changed
  after update of phone on auth.users
  for each row
  when (old.phone is distinct from new.phone)
  execute function public.handle_user_phone_change();
