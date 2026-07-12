create table if not exists public.game_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  slot text not null default 'primary',
  state jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, slot)
);

alter table public.game_saves enable row level security;

drop policy if exists "Players can read their own saves" on public.game_saves;
drop policy if exists "Players can insert their own saves" on public.game_saves;
drop policy if exists "Players can update their own saves" on public.game_saves;
drop policy if exists "Players can delete their own saves" on public.game_saves;

create policy "Players can read their own saves"
on public.game_saves
for select
to authenticated
using (auth.uid() = user_id);

create policy "Players can insert their own saves"
on public.game_saves
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Players can update their own saves"
on public.game_saves
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Players can delete their own saves"
on public.game_saves
for delete
to authenticated
using (auth.uid() = user_id);
