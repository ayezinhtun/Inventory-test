create or replace view public.v_user_roles as
select id as user_id, role from public.user_profile;

-- Install RLS
create policy "install_insert_engineer"
on public.install_requests for insert to authenticated
with check (requested_by = auth.uid());

create policy "install_select_scope"
on public.install_requests for select to authenticated
using (
  requested_by = auth.uid()
  or exists (select 1 from public.v_user_roles r where r.user_id=auth.uid() and r.role in ('manager','admin'))
);

create policy "install_manager_update"
on public.install_requests for update to authenticated
using (
  exists (select 1 from public.v_user_roles r where r.user_id=auth.uid() and r.role='manager')
  and status='pending_approval'
)
with check (status in ('pending_admin_approval','rejected_manager'));

create policy "install_admin_update"
on public.install_requests for update to authenticated
using (
  exists (select 1 from public.v_user_roles r where r.user_id=auth.uid() and r.role='admin')
  and status='pending_admin_approval'
)
with check (status in ('pending_physical_install','rejected_admin'));

create policy "install_physical_update"
on public.install_requests for update to authenticated
using (
  exists (select 1 from public.v_user_roles r where r.user_id=auth.uid() and r.role in ('manager','admin'))
  and status='pending_physical_install'
)
with check (status='complete');

-- Relocation RLS
create policy "reloc_insert_engineer"
on public.relocation_requests for insert to authenticated
with check (requested_by = auth.uid());

create policy "reloc_select_scope"
on public.relocation_requests for select to authenticated
using (
  requested_by = auth.uid()
  or exists (select 1 from public.v_user_roles r where r.user_id=auth.uid() and r.role in ('manager','admin'))
);

create policy "reloc_manager_update"
on public.relocation_requests for update to authenticated
using (
  exists (select 1 from public.v_user_roles r where r.user_id=auth.uid() and r.role='manager')
  and status='pending_approval'
)
with check (status in ('pending_admin_approval','rejected_manager'));

create policy "reloc_admin_update"
on public.relocation_requests for update to authenticated
using (
  exists (select 1 from public.v_user_roles r where r.user_id=auth.uid() and r.role='admin')
  and status='pending_admin_approval'
)
with check (status in ('pending_physical_move','rejected_admin'));

create policy "reloc_physical_update"
on public.relocation_requests for update to authenticated
using (
  exists (select 1 from public.v_user_roles r where r.user_id=auth.uid() and r.role in ('manager','admin'))
  and status='pending_physical_move'
)
with check (status='complete');

-- define trigger to bine with table install_requests
create or replace function public.apply_install_on_complete()
returns trigger language plpgsql as $$
declare v_device_id uuid;
begin
  if new.status = 'complete' and old.status is distinct from 'complete' then
    if new.serial_number is not null then
      select id into v_device_id from public.devices where serial_number = new.serial_number;
    end if;

    if v_device_id is null then
      insert into public.devices(name, model, serial_number, type, status, warehouse_id, rack_id, unit)
      values (new.device_name, new.model, new.serial_number, new.type, 'active', new.target_warehouse_id, new.target_rack_id, new.unit);
    else
      update public.devices
      set name=new.device_name, model=new.model, type=new.type, status='active',
          warehouse_id=new.target_warehouse_id, rack_id=new.target_rack_id, unit=new.unit
      where id=v_device_id;
    end if;
  end if;
  return new;
end $$;

--- connect trigger with install_requests
drop trigger if exists trg_apply_install_on_complete on public.install_requests;
create trigger trg_apply_install_on_complete
after update on public.install_requests
for each row
when (new.status = 'complete')
execute function public.apply_install_on_complete();

create or replace function public.apply_relocation_on_complete()
returns trigger language plpgsql as $$
begin
  if new.status = 'complete' and old.status is distinct from 'complete' then
    update public.devices
    set warehouse_id=new.target_warehouse_id, rack_id=new.target_rack_id, unit=new.unit, status='active'
    where id=new.device_id;
  end if;
  return new;
end $$;

drop trigger if exists trg_apply_relocation_on_complete on public.relocation_requests;
create trigger trg_apply_relocation_on_complete
after update on public.relocation_requests
for each row
when (new.status = 'complete')
execute function public.apply_relocation_on_complete();