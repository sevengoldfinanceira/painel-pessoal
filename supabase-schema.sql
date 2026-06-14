create table if not exists public.painel_pessoal_modules (
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, module)
);

alter table public.painel_pessoal_modules enable row level security;

drop policy if exists "Users can read their panel modules" on public.painel_pessoal_modules;
create policy "Users can read their panel modules"
on public.painel_pessoal_modules
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their panel modules" on public.painel_pessoal_modules;
create policy "Users can insert their panel modules"
on public.painel_pessoal_modules
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their panel modules" on public.painel_pessoal_modules;
create policy "Users can update their panel modules"
on public.painel_pessoal_modules
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
