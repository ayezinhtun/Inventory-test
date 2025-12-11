create table user_profile (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    role text check (role in ('admin', 'manager', 'engineer')) default 'engineer',
    created_at timestamp with time zone default now()
);

alter table public.user_profile enable row level security;

create policy "Engineers can read own profile" on public.user_profile
for select
using (auth.uid() = id);

create policy "Engineers can update own profile" on public.user_profile
for update
using (auth.uid() = id);

create policy "Admin full acces" on public.user_profile
for all
using (role = 'admin')


-- create table user_profile (
--     id uuid primary key references auth.users(id) on delete cascade,
--     full_name text not null,
--     role text check (role in ('admin', 'manager', 'engineer')) default 'engineer',
--     created_at timestamp with time zone default now()
-- );


-- create table user_regions (
--     user_id uuid references user_profile(id) on delete cascade,
--     region_id uuid references region(id) on delete cascade,
--     primary key(user_id, region_id)
-- );


-- create table user_warehouses (
--     user_id uuid references user_profile(id) on delete cascade,
--     warehouse_id uuid references warehouses(id) on delete cascade,
--     primary key(user_id, warehouse_id)
-- );

