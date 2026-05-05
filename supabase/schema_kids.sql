-- Kids table
create table if not exists kids (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  icon        text not null default '🧒',
  created_at  timestamptz default now()
);

alter table kids enable row level security;
create policy "own kids" on kids for all using (auth.uid() = user_id);

-- Add kid_id to week_plans (text so we can use UUID strings or 'default')
alter table week_plans add column if not exists kid_id text not null default 'default';

-- Replace the old unique constraint with one that includes kid_id
alter table week_plans drop constraint if exists week_plans_user_id_week_start_key;
alter table week_plans add constraint week_plans_user_kid_week unique (user_id, kid_id, week_start);
