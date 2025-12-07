create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model text,
  serial_number text unique,
  type text,
  status text not null default 'inactive', -- inactive | active | retired
  warehouse_id uuid references public.warehouses(id) on delete set null,
  rack_id uuid references public.racks(id) on delete set null,
  unit text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_devices_rack on public.devices(rack_id);
create index if not exists idx_devices_wh on public.devices(warehouse_id);

drop trigger if exists trg_devices_updated_at on public.devices;
create trigger trg_devices_updated_at
before update on public.devices
for each row execute function public.set_updated_at();

alter table public.devices enable row level security;

create policy "devices_select_all"
on public.devices for select to authenticated
using (true);