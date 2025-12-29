-- thi is for when signup to add data into the user and userproifle

-- create or replace function public.handle_new_user()
-- returns trigger as $$
-- begin
--   insert into public.user_profile (id, full_name)
--   values (new.id, new.raw_user_meta_data->>'full_name');
--   return new;
-- end;
-- $$ language plpgsql security definer;

-- create trigger on_auth_user_created
-- after insert on auth.users
-- for each row execute procedure public.handle_new_user();


-- This trigger automatically creates a user_profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profile (
    id,
    full_name,
    email
    -- role, regions, warehouses will use table defaults
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after a new user is inserted in auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
