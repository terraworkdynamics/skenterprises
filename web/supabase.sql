-- Tables
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  address text not null,
  card_no text not null,
  created_at timestamp with time zone default now()
);

-- In case the table already exists without the new column, add it
alter table if exists public.registrations
  add column if not exists card_no text;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  method text,
  transaction_id text,
  created_at timestamp with time zone default now()
);

create table if not exists public.lucky_draws (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  prize text,
  winner_month text,
  created_at timestamp with time zone default now()
);

-- Add winner_month if it doesn't exist
alter table if exists public.lucky_draws
  add column if not exists winner_month text;

-- Add missing columns to payments table if they don't exist
alter table if exists public.payments
  add column if not exists method text;

alter table if exists public.payments
  add column if not exists transaction_id text;

-- Recommended indexes
create index if not exists idx_registrations_phone on public.registrations(phone);
create index if not exists idx_payments_registration_id on public.payments(registration_id);
create index if not exists idx_lucky_registration_id on public.lucky_draws(registration_id);

-- Row Level Security
alter table public.registrations enable row level security;
alter table public.payments enable row level security;
alter table public.lucky_draws enable row level security;

-- Simple open policies for anon role (adjust for production)
create policy if not exists "allow read and insert registrations"
  on public.registrations
  for select using (true)
  with check (true);

create policy if not exists "allow read and insert payments"
  on public.payments
  for select using (true)
  with check (true);

create policy if not exists "allow read and insert lucky draws"
  on public.lucky_draws
  for select using (true)
  with check (true);

-- Sample Inserts
insert into public.registrations (name, phone, address, card_no) values
  ('Ravi Kumar', '9876543210', 'MG Road, Bengaluru', 'CARD9876'),
  ('Anita Sharma', '9123456780', 'Andheri, Mumbai', 'CARD1234')
on conflict (phone) do nothing;

insert into public.payments (registration_id, amount)
select id, 500.00 from public.registrations where phone = '9876543210'
on conflict do nothing;

insert into public.lucky_draws (registration_id, prize)
select id, 'Gift Hamper' from public.registrations where phone = '9123456780'
on conflict do nothing;


