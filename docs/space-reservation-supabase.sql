-- Space Reservation Supabase schema
-- Run this in Supabase SQL Editor.

create table if not exists public.space_reservation_rooms (
  "id" text primary key,
  "name" text not null,
  "inviteToken" text not null unique,
  "adminParticipantId" text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.space_reservation_participants (
  "id" text primary key,
  "roomId" text not null references public.space_reservation_rooms("id") on delete cascade,
  "grade" text not null,
  "className" text not null,
  "joinedAt" timestamptz not null default now(),
  "role" text not null check ("role" in ('admin', 'member')),
  "kickedAt" timestamptz null
);

create unique index if not exists uq_space_reservation_participants_room_grade_class_active
  on public.space_reservation_participants ("roomId", "grade", "className")
  where "kickedAt" is null;

create table if not exists public.space_reservation_reservations (
  "id" text primary key,
  "roomId" text not null references public.space_reservation_rooms("id") on delete cascade,
  "dateKey" text not null,
  "weekday" text not null check ("weekday" in ('mon', 'tue', 'wed', 'thu', 'fri')),
  "period" integer not null check ("period" between 1 and 6),
  "grade" text not null,
  "className" text not null,
  "purpose" text not null default '',
  "createdByParticipantId" text not null references public.space_reservation_participants("id") on delete cascade,
  "createdAt" timestamptz not null default now()
);

create unique index if not exists uq_space_reservation_reservations_room_slot
  on public.space_reservation_reservations ("roomId", "dateKey", "period");

create table if not exists public.space_reservation_bans (
  "id" text primary key,
  "roomId" text not null references public.space_reservation_rooms("id") on delete cascade,
  "grade" text not null,
  "className" text not null,
  "createdAt" timestamptz not null default now()
);

create unique index if not exists uq_space_reservation_bans_room_grade_class
  on public.space_reservation_bans ("roomId", "grade", "className");

create index if not exists idx_space_reservation_participants_room_joined
  on public.space_reservation_participants ("roomId", "joinedAt");

create index if not exists idx_space_reservation_reservations_room_date
  on public.space_reservation_reservations ("roomId", "dateKey");

-- Minimum RLS for anon key access (same pattern as existing client-direct Supabase usage).
alter table public.space_reservation_rooms enable row level security;
alter table public.space_reservation_participants enable row level security;
alter table public.space_reservation_reservations enable row level security;
alter table public.space_reservation_bans enable row level security;

drop policy if exists "space_reservation_rooms_all" on public.space_reservation_rooms;
create policy "space_reservation_rooms_all"
  on public.space_reservation_rooms
  for all
  to anon
  using (true)
  with check (true);

drop policy if exists "space_reservation_participants_all" on public.space_reservation_participants;
create policy "space_reservation_participants_all"
  on public.space_reservation_participants
  for all
  to anon
  using (true)
  with check (true);

drop policy if exists "space_reservation_reservations_all" on public.space_reservation_reservations;
create policy "space_reservation_reservations_all"
  on public.space_reservation_reservations
  for all
  to anon
  using (true)
  with check (true);

drop policy if exists "space_reservation_bans_all" on public.space_reservation_bans;
create policy "space_reservation_bans_all"
  on public.space_reservation_bans
  for all
  to anon
  using (true)
  with check (true);
