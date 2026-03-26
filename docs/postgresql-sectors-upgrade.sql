begin;

create table if not exists sectors (
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

create table if not exists sector_assignments (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid not null references sectors(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role_label text not null default 'responsable',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (sector_id, user_id)
);

create index if not exists sector_assignments_sector_idx
  on sector_assignments(sector_id);

create index if not exists sector_assignments_user_idx
  on sector_assignments(user_id);

insert into sectors (code, label, polling_station_code, priority_rank)
select
  concat('bv-', lower(ps.polling_station_code)),
  concat('Secteur bureau ', ps.polling_station_code, ' · ', ps.place_name),
  ps.polling_station_code,
  ps.polling_station_number
from import_campaign.polling_stations_cabestany ps
where ps.commune_code = '66028'
on conflict (code) do update
set
  label = excluded.label,
  polling_station_code = excluded.polling_station_code,
  priority_rank = excluded.priority_rank,
  updated_at = now();

commit;
