create table if not exists public.relocation_requests (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices(id) on delete restrict,
  target_warehouse_id uuid not null references public.warehouses(id),
  target_rack_id uuid not null references public.racks(id),
  unit text,
  requested_by uuid not null references auth.users(id),
  status text not null check (status in (
    'pending_approval',
    'pending_admin_approval',
    'pending_physical_move',
    'complete',
    'rejected_manager',
    'rejected_admin'
  )) default 'pending_approval',
  manager_id uuid references auth.users(id),
  admin_id uuid references auth.users(id),
  physical_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_relocation_requests_status on public.relocation_requests(status);

drop trigger if exists trg_relocation_requests_updated_at on public.relocation_requests;
create trigger trg_relocation_requests_updated_at
before update on public.relocation_requests
for each row execute function public.set_updated_at();

alter table public.relocation_requests enable row level security;