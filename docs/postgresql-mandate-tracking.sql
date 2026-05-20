begin;

create table if not exists budget_year_snapshots (
  id uuid primary key default gen_random_uuid(),
  year_label text not null,
  metric_code text not null,
  metric_label text not null,
  metric_value text not null,
  source_label text not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (year_label, metric_code)
);

create table if not exists mandate_commitments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  status text not null,
  summary text not null,
  budget_signal text,
  timeline text,
  evidence text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mandate_commitment_updates (
  id uuid primary key default gen_random_uuid(),
  commitment_id uuid not null references mandate_commitments(id) on delete cascade,
  update_date date not null default current_date,
  status text not null,
  summary text not null,
  source_label text,
  created_at timestamptz not null default now()
);

insert into permissions (code, label, module, description)
values
  ('mandate.read', 'Lire le suivi du mandat', 'mandate', 'Consulter le suivi des engagements et des trajectoires budgetaires.'),
  ('mandate.manage', 'Gerer le suivi du mandat', 'mandate', 'Mettre a jour les engagements, statuts et preuves du mandat.')
on conflict (code) do update
set
  label = excluded.label,
  module = excluded.module,
  description = excluded.description;

insert into role_permissions (role, permission_id)
select role_map.role_name::app_role, p.id
from permissions p
join (
  values
    ('superadmin', 'mandate.read'),
    ('superadmin', 'mandate.manage'),
    ('admin', 'mandate.read'),
    ('admin', 'mandate.manage'),
    ('direction', 'mandate.read'),
    ('direction', 'mandate.manage'),
    ('coordinateur', 'mandate.read'),
    ('lecture', 'mandate.read')
) as role_map(role_name, permission_code)
  on p.code = role_map.permission_code
on conflict do nothing;

commit;
