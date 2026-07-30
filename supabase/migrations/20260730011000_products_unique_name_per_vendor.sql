-- Needed for the dev seed script's upsert (onConflict: vendor_id,name) to
-- be re-runnable, and a reasonable real constraint regardless: a vendor
-- shouldn't have two products with the identical name.
alter table public.products add constraint products_vendor_id_name_key unique (vendor_id, name);
