drop table if exists public.racks cascade;

create table public.racks (
    id uuid primary key default gen_random_uuid(),
    warehouse_id uuid not null references warehouses(id) on delete cascade,
    name text not null,
    capacity int default 0,
    description text,
    created_at timestamp with time zone default now()
);

create index if not exists idx_racks_warehouse_id on racks(warehouse_id);

alter table public.racks enable row level security;

drop policy if exists "Allow read for authenticated" on public.racks;
drop policy if exists "Allow insert for authenticated" on public.racks;
drop policy if exists "Allow update for authenticated" on public.racks;
drop policy if exists "Allow delete for authenticated" on public.racks;

create policy "Allow read for authenticated"
on public.racks
for select
to authenticated
using (true);

create policy "Allow insert for authenticated"
on public.racks
for insert
to authenticated
with check (true);

create policy "Allow update for authenticated"
on public.racks
for update
to authenticated
using (true)
with check (true);

create policy "Allow delete for authenticated"
on public.racks
for delete
to authenticated
using (true);
