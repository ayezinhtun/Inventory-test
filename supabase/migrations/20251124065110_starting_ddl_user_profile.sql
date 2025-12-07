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

