-- vendor/settings/settings-form.tsx has a notification-channel toggle
-- (email/sms/whatsapp) that was pure local UI state in the mock, never
-- persisted anywhere. Wiring it to a real PATCH needs a column to write to.
alter table public.profiles
  add column notification_channels text[] not null default '{"email","sms","whatsapp"}';
