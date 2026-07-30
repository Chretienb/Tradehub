-- payVendorFromChat's replacement: creates an order + a payment-kind
-- message atomically. security invoker (default) so it runs under the
-- caller's own JWT — RLS applies normally, no service-role needed.
-- product_id is left null: the schema already allows this for
-- chat-negotiated deals that aren't tied to one catalog SKU (see the
-- comment on orders.product_id in the schema migration), which is cleaner
-- than the mock's original fallback-to-vendor's-first-product hack.
create or replace function public.create_escrow_payment(p_vendor_id uuid, p_amount numeric)
returns public.orders
language plpgsql
security invoker
as $$
declare
  v_conversation_id uuid;
  v_order public.orders;
begin
  insert into public.conversations (customer_id, vendor_id)
  values (auth.uid(), p_vendor_id)
  on conflict (customer_id, vendor_id) do update set last_message_at = now()
  returning id into v_conversation_id;

  insert into public.messages (conversation_id, sender_id, body, kind, payment_amount)
  values (
    v_conversation_id,
    auth.uid(),
    'Paiement de ' || p_amount || ' $ envoyé — en séquestre.',
    'payment',
    p_amount
  );

  insert into public.orders (customer_id, vendor_id, conversation_id, quantity, amount, status)
  values (auth.uid(), p_vendor_id, v_conversation_id, 1, p_amount, 'sequestre')
  returning * into v_order;

  return v_order;
end;
$$;
