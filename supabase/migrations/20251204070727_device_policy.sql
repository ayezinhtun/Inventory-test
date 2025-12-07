-- Insert: allow admin and manager to add devices
create policy "devices_insert_admin_manager"
on public.devices
for insert to authenticated
with check (
  exists (
    select 1 from public.v_user_roles r
    where r.user_id = auth.uid() and r.role in ('admin','manager')
  )
);

-- Update (optional)
create policy "devices_update_admin_manager"
on public.devices
for update to authenticated
using (
  exists (
    select 1 from public.v_user_roles r
    where r.user_id = auth.uid() and r.role in ('admin','manager')
  )
)
with check (true);

-- Delete (optional)
create policy "devices_delete_admin_manager"
on public.devices
for delete to authenticated
using (
  exists (
    select 1 from public.v_user_roles r
    where r.user_id = auth.uid() and r.role in ('admin','manager')
  )
);