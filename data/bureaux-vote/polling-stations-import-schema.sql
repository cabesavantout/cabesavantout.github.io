-- Zone d'import PostgreSQL pour les bureaux de vote de Cabestany.

create schema if not exists import_campaign;

create table if not exists import_campaign.polling_stations_cabestany (
  id bigserial primary key,
  commune_name text not null,
  commune_code text not null,
  polling_station_code text not null,
  polling_station_number integer not null,
  polling_station_ref text not null,
  place_name text not null,
  address text,
  is_centralizer boolean not null default false,
  source_pdf text,
  geometry_type text,
  imported_at timestamptz not null default now()
);

create unique index if not exists polling_stations_cabestany_unique_idx
  on import_campaign.polling_stations_cabestany(polling_station_ref);

create index if not exists polling_stations_cabestany_code_idx
  on import_campaign.polling_stations_cabestany(polling_station_code);
