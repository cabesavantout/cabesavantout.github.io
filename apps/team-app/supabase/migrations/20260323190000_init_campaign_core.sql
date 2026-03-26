create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'superadmin',
  'admin',
  'direction',
  'coordinateur',
  'militant',
  'lecture'
);

create type public.task_status as enum (
  'todo',
  'in_progress',
  'blocked',
  'done',
  'cancelled'
);

create type public.task_priority as enum (
  'low',
  'medium',
  'high',
  'critical'
);

create type public.meeting_status as enum (
  'planned',
  'held',
  'cancelled'
);

create type public.support_level as enum (
  'unknown',
  'opposed',
  'skeptical',
  'neutral',
  'supportive',
  'volunteer'
);

create type public.event_source as enum (
  'manual',
  'imported',
  'scraped'
);

create type public.content_kind as enum (
  'post',
  'speech',
  'argumentaire',
  'tract',
  'note'
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'lecture',
  org_function_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.org_functions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table public.users
  add constraint users_org_function_id_fkey
  foreign key (org_function_id) references public.org_functions(id) on delete set null;

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  module text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role public.app_role not null,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role, permission_id)
);

create table public.user_permissions (
  user_id uuid not null references public.users(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (user_id, permission_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete set null,
  phone text,
  neighborhood text,
  notes text,
  joined_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.member_availabilities (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.team_members(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  availability_label text,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  priority public.task_priority not null default 'medium',
  created_by uuid references public.users(id) on delete set null,
  assigned_to uuid references public.users(id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_status_idx on public.tasks(status);
create index tasks_assigned_to_idx on public.tasks(assigned_to);
create index tasks_due_at_idx on public.tasks(due_at);

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid references public.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  status public.meeting_status not null default 'planned',
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index meetings_starts_at_idx on public.meetings(starts_at);

create table public.meeting_notes (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  author_id uuid references public.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.meeting_actions (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  description text,
  owner_id uuid references public.users(id) on delete set null,
  due_at timestamptz,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.citizens (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  address text,
  neighborhood text,
  polling_station_code text,
  support_level public.support_level not null default 'unknown',
  tags text[] not null default '{}',
  notes text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index citizens_support_level_idx on public.citizens(support_level);
create index citizens_neighborhood_idx on public.citizens(neighborhood);

create table public.field_reports (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid references public.citizens(id) on delete set null,
  author_id uuid references public.users(id) on delete set null,
  source text not null default 'terrain',
  neighborhood text,
  topic text,
  summary text not null,
  sentiment integer,
  reported_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index field_reports_neighborhood_idx on public.field_reports(neighborhood);
create index field_reports_reported_at_idx on public.field_reports(reported_at);

create table public.elections (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  election_date date not null,
  round smallint not null default 1,
  created_at timestamptz not null default now()
);

create unique index elections_unique_idx
  on public.elections(label, election_date, round);

create table public.polling_stations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  neighborhood text,
  registered_voters integer,
  created_at timestamptz not null default now()
);

create table public.election_results (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.elections(id) on delete cascade,
  polling_station_id uuid not null references public.polling_stations(id) on delete cascade,
  list_name text not null,
  votes integer not null default 0,
  expressed_votes integer,
  turnout numeric(5,2),
  source_file text,
  created_at timestamptz not null default now()
);

create index election_results_election_idx on public.election_results(election_id);
create index election_results_station_idx on public.election_results(polling_station_id);

create table public.fiscal_years (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  created_at timestamptz not null default now()
);

create table public.budget_entries (
  id uuid primary key default gen_random_uuid(),
  fiscal_year_id uuid not null references public.fiscal_years(id) on delete cascade,
  section text not null,
  category text not null,
  label text not null,
  amount numeric(14,2) not null,
  source_document text,
  created_at timestamptz not null default now()
);

create index budget_entries_year_idx on public.budget_entries(fiscal_year_id);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  source public.event_source not null default 'manual',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  neighborhood text,
  importance_score integer,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_starts_at_idx on public.events(starts_at);
create index events_importance_score_idx on public.events(importance_score);

create table public.event_assignments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role_label text,
  attendance_status text,
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);

create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  input_summary text,
  prompt_version text,
  output_summary text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind public.content_kind not null,
  title text not null,
  brief text,
  body text,
  status text not null default 'draft',
  source_ai_run_id uuid references public.ai_runs(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  validated_by uuid references public.users(id) on delete set null,
  validated_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.team_members enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_notes enable row level security;
alter table public.meeting_actions enable row level security;
alter table public.citizens enable row level security;
alter table public.field_reports enable row level security;
alter table public.events enable row level security;
alter table public.event_assignments enable row level security;
alter table public.content_items enable row level security;

create policy "authenticated users can read own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "authenticated users can update own profile"
on public.users
for update
to authenticated
using (auth.uid() = id);

create policy "authenticated users can read campaign tables"
on public.tasks
for select
to authenticated
using (true);

create policy "authenticated users can read meetings"
on public.meetings
for select
to authenticated
using (true);

create policy "authenticated users can read field reports"
on public.field_reports
for select
to authenticated
using (true);
