-- Week plans: one row per user per week
create table if not exists week_plans (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  week_start  date not null,
  days        jsonb not null default '{}',
  updated_at  timestamptz default now(),
  unique(user_id, week_start)
);

-- User dishes: all 4 pool types per user
create table if not exists user_dishes (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  type        text not null check (type in ('main', 'side', 'veggie', 'dessert')),
  name        text not null,
  name_he     text,
  emoji       text not null,
  image_url   text,
  created_at  timestamptz default now()
);

-- Row Level Security: users only see their own data
alter table week_plans  enable row level security;
alter table user_dishes enable row level security;

create policy "own plans"  on week_plans  for all using (auth.uid() = user_id);
create policy "own dishes" on user_dishes for all using (auth.uid() = user_id);

-- Auto-update updated_at on week_plans
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger week_plans_updated_at
  before update on week_plans
  for each row execute function set_updated_at();
