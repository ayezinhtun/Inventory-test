create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profile (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'engineer'  -- default role for new users
  );
  return new;
end;
$$ language plpgsql security definer;
