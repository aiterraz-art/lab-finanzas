-- Function to completely delete a user (auth + profile)
-- Only accessible by admins
create or replace function public.delete_user_completely(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Check if the executing user is an admin in public.profiles
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Access denied: Only admins can delete users.';
  end if;

  -- Delete from auth.users (this should cascade to public.profiles if FK is set, 
  -- otherwise we might need to delete profile first, but usually cascade is best)
  -- If you get FK violation, manually delete from profiles first.
  delete from public.profiles where id = user_id; -- Ensure profile is gone first just in case
  delete from auth.users where id = user_id;
end;
$$;
