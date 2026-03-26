-- Schéma PostgreSQL de départ pour la webapp interne de campagne.
-- Conçu pour couvrir le MVP puis les extensions Data, Terrain, Événements et Communication.

create extension if not exists "pgcrypto";

create type app_role as enum (
  'superadmin',
  'admin',
  'direction',
  'coordinateur',
  'militant',
  'lecture'
);

create type task_status as enum (
  'todo',
  'in_progress',
  'blocked',
  'done',
  'cancelled'
);

create type task_priority as enum (
  'low',
  'medium',
  'high',
  'critical'
);

create type meeting_status as enum (
  'planned',
  'held',
  'cancelled'
);

create type field_report_status as enum (
  'new',
  'qualified',
  'in_progress',
  'closed'
);

create type support_level as enum (
  'unknown',
  'opposed',
  'skeptical',
  'neutral',
  'supportive',
  'volunteer'
);

create type event_source as enum (
  'manual',
  'imported',
  'scraped'
);

create type content_kind as enum (
  'post',
  'speech',
  'argumentaire',
  'tract',
  'note'
);

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  role app_role not null default 'lecture',
  org_function_id uuid,
  is_active boolean not null default true,
  password_hash text,
  password_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table org_functions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table users
  add constraint users_org_function_id_fkey
  foreign key (org_function_id) references org_functions(id) on delete set null;

create table permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  module text not null,
  description text,
  created_at timestamptz not null default now()
);

create table role_permissions (
  role app_role not null,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role, permission_id)
);

create table user_permissions (
  user_id uuid not null references users(id) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (user_id, permission_id)
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id) on delete set null,
  phone text,
  neighborhood text,
  notes text,
  joined_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table member_availabilities (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references team_members(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  availability_label text,
  created_at timestamptz not null default now()
);

create table sectors (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  polling_station_code text,
  neighborhood text,
  priority_rank integer not null default 100,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sector_assignments (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid not null references sectors(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role_label text not null default 'responsable',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (sector_id, user_id)
);

create index sector_assignments_sector_idx on sector_assignments(sector_id);
create index sector_assignments_user_idx on sector_assignments(user_id);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status task_status not null default 'todo',
  priority task_priority not null default 'medium',
  source_field_report_id uuid,
  created_by uuid references users(id) on delete set null,
  assigned_to uuid references users(id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_status_idx on tasks(status);
create index tasks_assigned_to_idx on tasks(assigned_to);
create index tasks_due_at_idx on tasks(due_at);

create table task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  author_id uuid references users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  status meeting_status not null default 'planned',
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index meetings_starts_at_idx on meetings(starts_at);

create table meeting_notes (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings(id) on delete cascade,
  author_id uuid references users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table meeting_actions (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  title text not null,
  description text,
  owner_id uuid references users(id) on delete set null,
  due_at timestamptz,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

create table citizens (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  address text,
  neighborhood text,
  polling_station_code text,
  support_level support_level not null default 'unknown',
  tags text[] not null default '{}',
  notes text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index citizens_support_level_idx on citizens(support_level);
create index citizens_neighborhood_idx on citizens(neighborhood);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  contact_kind text not null default 'other',
  organization text,
  role_label text,
  email text,
  phone text,
  location text,
  is_active boolean not null default true,
  tags text[] not null default '{}',
  notes text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contacts_kind_idx on contacts(contact_kind);
create index contacts_active_idx on contacts(is_active);
create index contacts_organization_idx on contacts(organization);

create table field_reports (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid references citizens(id) on delete set null,
  author_id uuid references users(id) on delete set null,
  source text not null default 'terrain',
  neighborhood text,
  polling_station_code text,
  topic text,
  tags text[] not null default '{}',
  summary text not null,
  support_level support_level not null default 'unknown',
  priority task_priority not null default 'medium',
  status field_report_status not null default 'new',
  sentiment integer,
  reported_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index field_reports_neighborhood_idx on field_reports(neighborhood);
create index field_reports_polling_station_idx on field_reports(polling_station_code);
create index field_reports_reported_at_idx on field_reports(reported_at);

alter table tasks
  add constraint tasks_source_field_report_id_fkey
  foreign key (source_field_report_id) references field_reports(id) on delete set null;

create table elections (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  election_date date not null,
  round smallint not null default 1,
  created_at timestamptz not null default now()
);

create unique index elections_unique_idx
  on elections(label, election_date, round);

create table polling_stations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  neighborhood text,
  registered_voters integer,
  created_at timestamptz not null default now()
);

create table election_results (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  polling_station_id uuid not null references polling_stations(id) on delete cascade,
  list_name text not null,
  votes integer not null default 0,
  expressed_votes integer,
  turnout numeric(5,2),
  source_file text,
  created_at timestamptz not null default now()
);

create index election_results_election_idx on election_results(election_id);
create index election_results_station_idx on election_results(polling_station_id);

create table fiscal_years (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  created_at timestamptz not null default now()
);

create table budget_entries (
  id uuid primary key default gen_random_uuid(),
  fiscal_year_id uuid not null references fiscal_years(id) on delete cascade,
  section text not null,
  category text not null,
  label text not null,
  amount numeric(14,2) not null,
  source_document text,
  created_at timestamptz not null default now()
);

create index budget_entries_year_idx on budget_entries(fiscal_year_id);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  source event_source not null default 'manual',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  neighborhood text,
  importance_score integer,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_starts_at_idx on events(starts_at);
create index events_importance_score_idx on events(importance_score);

create table event_assignments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role_label text,
  attendance_status text,
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);

create table ai_runs (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  input_summary text,
  prompt_version text,
  output_summary text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table content_items (
  id uuid primary key default gen_random_uuid(),
  kind content_kind not null,
  title text not null,
  brief text,
  body text,
  status text not null default 'draft',
  source_ai_run_id uuid references ai_runs(id) on delete set null,
  created_by uuid references users(id) on delete set null,
  validated_by uuid references users(id) on delete set null,
  validated_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
