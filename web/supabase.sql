-- ==============================================
-- 📦 FULL SQL SETUP FOR LAPTOP / INVERTER / CAMERA CATEGORIES
-- ==============================================

-- Tables for Laptop category
create table if not exists public.laptop_registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  address text not null,
  card_no text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.laptop_payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.laptop_registrations(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  method text,
  transaction_id text,
  created_at timestamp with time zone default now()
);

create table if not exists public.laptop_lucky_draws (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.laptop_registrations(id) on delete cascade,
  prize text,
  winner_month text,
  created_at timestamp with time zone default now()
);

-- Tables for Inverter category
create table if not exists public.inverter_registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  address text not null,
  card_no text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.inverter_payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.inverter_registrations(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  method text,
  transaction_id text,
  created_at timestamp with time zone default now()
);

create table if not exists public.inverter_lucky_draws (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.inverter_registrations(id) on delete cascade,
  prize text,
  winner_month text,
  created_at timestamp with time zone default now()
);

-- Tables for Camera category
create table if not exists public.camera_registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  address text not null,
  card_no text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.camera_payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.camera_registrations(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  method text,
  transaction_id text,
  created_at timestamp with time zone default now()
);

create table if not exists public.camera_lucky_draws (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.camera_registrations(id) on delete cascade,
  prize text,
  winner_month text,
  created_at timestamp with time zone default now()
);

-- Legacy tables
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  address text not null,
  card_no text not null,
  created_at timestamp with time zone default now()
);

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

alter table if exists public.lucky_draws
  add column if not exists winner_month text;

alter table if exists public.payments
  add column if not exists method text;

alter table if exists public.payments
  add column if not exists transaction_id text;

-- Indexes
create index if not exists idx_laptop_registrations_phone on public.laptop_registrations(phone);
create index if not exists idx_laptop_payments_registration_id on public.laptop_payments(registration_id);
create index if not exists idx_laptop_lucky_registration_id on public.laptop_lucky_draws(registration_id);

create index if not exists idx_inverter_registrations_phone on public.inverter_registrations(phone);
create index if not exists idx_inverter_payments_registration_id on public.inverter_payments(registration_id);
create index if not exists idx_inverter_lucky_registration_id on public.inverter_lucky_draws(registration_id);

create index if not exists idx_camera_registrations_phone on public.camera_registrations(phone);
create index if not exists idx_camera_payments_registration_id on public.camera_payments(registration_id);
create index if not exists idx_camera_lucky_registration_id on public.camera_lucky_draws(registration_id);

create index if not exists idx_registrations_phone on public.registrations(phone);
create index if not exists idx_payments_registration_id on public.payments(registration_id);
create index if not exists idx_lucky_registration_id on public.lucky_draws(registration_id);

-- Row Level Security
alter table public.laptop_registrations enable row level security;
alter table public.laptop_payments enable row level security;
alter table public.laptop_lucky_draws enable row level security;

alter table public.inverter_registrations enable row level security;
alter table public.inverter_payments enable row level security;
alter table public.inverter_lucky_draws enable row level security;

alter table public.camera_registrations enable row level security;
alter table public.camera_payments enable row level security;
alter table public.camera_lucky_draws enable row level security;

alter table public.registrations enable row level security;
alter table public.payments enable row level security;
alter table public.lucky_draws enable row level security;

-- ==========================
-- ✅ Row Level Security Policies
-- ==========================

-- ==========================
-- ✅ Row Level Security Policies (Corrected)
-- ==========================

-- Laptop
create policy "allow select laptop_registrations"
  on public.laptop_registrations
  for select using (true);

create policy "allow insert laptop_registrations"
  on public.laptop_registrations
  for insert with check (true);

create policy "allow select laptop_payments"
  on public.laptop_payments
  for select using (true);

create policy "allow insert laptop_payments"
  on public.laptop_payments
  for insert with check (true);

create policy "allow select laptop_lucky_draws"
  on public.laptop_lucky_draws
  for select using (true);

create policy "allow insert laptop_lucky_draws"
  on public.laptop_lucky_draws
  for insert with check (true);

-- Inverter
create policy "allow select inverter_registrations"
  on public.inverter_registrations
  for select using (true);

create policy "allow insert inverter_registrations"
  on public.inverter_registrations
  for insert with check (true);

create policy "allow select inverter_payments"
  on public.inverter_payments
  for select using (true);

create policy "allow insert inverter_payments"
  on public.inverter_payments
  for insert with check (true);

create policy "allow select inverter_lucky_draws"
  on public.inverter_lucky_draws
  for select using (true);

create policy "allow insert inverter_lucky_draws"
  on public.inverter_lucky_draws
  for insert with check (true);

-- Camera
create policy "allow select camera_registrations"
  on public.camera_registrations
  for select using (true);

create policy "allow insert camera_registrations"
  on public.camera_registrations
  for insert with check (true);

create policy "allow select camera_payments"
  on public.camera_payments
  for select using (true);

create policy "allow insert camera_payments"
  on public.camera_payments
  for insert with check (true);

create policy "allow select camera_lucky_draws"
  on public.camera_lucky_draws
  for select using (true);

create policy "allow insert camera_lucky_draws"
  on public.camera_lucky_draws
  for insert with check (true);

-- Legacy tables
create policy "allow select registrations"
  on public.registrations
  for select using (true);

create policy "allow insert registrations"
  on public.registrations
  for insert with check (true);

create policy "allow select payments"
  on public.payments
  for select using (true);

create policy "allow insert payments"
  on public.payments
  for insert with check (true);

create policy "allow select lucky_draws"
  on public.lucky_draws
  for select using (true);

create policy "allow insert lucky_draws"
  on public.lucky_draws
  for insert with check (true);
  
-- ==========================
-- 📊 Sample Inserts
-- ==========================

-- Laptop category
insert into public.laptop_registrations (name, phone, address, card_no) values
  ('Rajesh Kumar', '9876543211', 'MG Road, Bengaluru', 'LAP001'),
  ('Priya Sharma', '9123456781', 'Andheri, Mumbai', 'LAP002')
on conflict (phone) do nothing;

insert into public.laptop_payments (registration_id, amount)
select id, 1500.00 from public.laptop_registrations where phone = '9876543211'
on conflict do nothing;

insert into public.laptop_lucky_draws (registration_id, prize)
select id, 'Laptop Accessory Kit' from public.laptop_registrations where phone = '9123456781'
on conflict do nothing;

-- Inverter category
insert into public.inverter_registrations (name, phone, address, card_no) values
  ('Suresh Patel', '9876543212', 'Gandhi Road, Delhi', 'INV001'),
  ('Meera Singh', '9123456782', 'Park Street, Kolkata', 'INV002')
on conflict (phone) do nothing;

insert into public.inverter_payments (registration_id, amount)
select id, 2500.00 from public.inverter_registrations where phone = '9876543212'
on conflict do nothing;

insert into public.inverter_lucky_draws (registration_id, prize)
select id, 'Battery Maintenance Kit' from public.inverter_registrations where phone = '9123456782'
on conflict do nothing;

-- Camera category
insert into public.camera_registrations (name, phone, address, card_no) values
  ('Vikram Reddy', '9876543213', 'IT Park, Hyderabad', 'CAM001'),
  ('Sunita Gupta', '9123456783', 'Marine Drive, Mumbai', 'CAM002')
on conflict (phone) do nothing;

insert into public.camera_payments (registration_id, amount)
select id, 800.00 from public.camera_registrations where phone = '9876543213'
on conflict do nothing;

insert into public.camera_lucky_draws (registration_id, prize)
select id, 'Camera Lens Kit' from public.camera_registrations where phone = '9123456783'
on conflict do nothing;

-- Legacy Sample Data
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
