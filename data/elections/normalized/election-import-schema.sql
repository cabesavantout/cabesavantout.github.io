-- Zone d'import pour les CSV électoraux normalisés de Cabestany.
-- Cette couche sert d'atterrissage technique avant transformation métier.

create schema if not exists import_campaign;

create table if not exists import_campaign.election_turnout_by_bv (
  id bigserial primary key,
  source_file text not null,
  source_format text not null,
  election_id text not null,
  election_year integer not null,
  election_type text not null,
  round_number smallint not null,
  department_code text,
  department_name text,
  canton_code text,
  canton_name text,
  circonscription_code text,
  circonscription_name text,
  commune_code text not null,
  commune_name text not null,
  polling_station_code text not null,
  polling_station_ref text not null,
  inscrits integer,
  abstentions integer,
  votants integer,
  blancs integer,
  nuls integer,
  exprimes integer,
  abstentions_pct_inscrits numeric(6,2),
  votants_pct_inscrits numeric(6,2),
  blancs_pct_inscrits numeric(6,2),
  blancs_pct_votants numeric(6,2),
  nuls_pct_inscrits numeric(6,2),
  nuls_pct_votants numeric(6,2),
  exprimes_pct_inscrits numeric(6,2),
  exprimes_pct_votants numeric(6,2),
  imported_at timestamptz not null default now()
);

create unique index if not exists election_turnout_by_bv_unique_idx
  on import_campaign.election_turnout_by_bv(election_id, polling_station_ref);

create index if not exists election_turnout_by_bv_type_year_idx
  on import_campaign.election_turnout_by_bv(election_type, election_year, round_number);

create index if not exists election_turnout_by_bv_station_idx
  on import_campaign.election_turnout_by_bv(polling_station_code);

create table if not exists import_campaign.election_results_commune (
  id bigserial primary key,
  source_file text not null,
  source_format text not null,
  election_type text not null,
  election_year integer not null,
  round_number smallint not null,
  date_scrutin date,
  commune_code text not null,
  commune_name text not null,
  status text,
  inscrits integer,
  abstentions integer,
  votants integer,
  blancs integer,
  nuls integer,
  exprimes integer,
  abstentions_pct_inscrits numeric(6,2),
  votants_pct_inscrits numeric(6,2),
  blancs_pct_inscrits numeric(6,2),
  blancs_pct_votants numeric(6,2),
  nuls_pct_inscrits numeric(6,2),
  nuls_pct_votants numeric(6,2),
  exprimes_pct_inscrits numeric(6,2),
  exprimes_pct_votants numeric(6,2),
  liste text not null,
  conduite_par text,
  nuance text,
  voix integer,
  voix_pct_inscrits numeric(6,2),
  voix_pct_exprimes numeric(6,2),
  sieges_conseil_municipal integer,
  sieges_conseil_communautaire integer,
  source_url text,
  imported_at timestamptz not null default now()
);

create unique index if not exists election_results_commune_unique_idx
  on import_campaign.election_results_commune(
    election_type,
    election_year,
    round_number,
    commune_code,
    liste
  );

create index if not exists election_results_commune_date_idx
  on import_campaign.election_results_commune(date_scrutin);

create table if not exists import_campaign.election_results_bv (
  id bigserial primary key,
  commune_code text not null,
  commune_name text not null,
  election_type text not null,
  election_year integer not null,
  round_number smallint not null,
  date_scrutin date,
  polling_station_code text not null,
  inscrits integer,
  votants integer,
  blancs integer,
  nuls integer,
  exprimes integer,
  candidate_label text not null,
  candidate_last_name text,
  candidate_group text,
  votes integer not null,
  source_status text not null default 'validated_partial',
  source_note text,
  imported_at timestamptz not null default now()
);

create unique index if not exists election_results_bv_unique_idx
  on import_campaign.election_results_bv(
    election_type,
    election_year,
    round_number,
    commune_code,
    polling_station_code,
    candidate_label
  );

create index if not exists election_results_bv_station_idx
  on import_campaign.election_results_bv(polling_station_code);

create index if not exists election_results_bv_date_idx
  on import_campaign.election_results_bv(date_scrutin);

-- Exemples d'import psql:
-- \copy import_campaign.election_turnout_by_bv (
--   source_file, source_format, election_id, election_year, election_type, round_number,
--   department_code, department_name, canton_code, canton_name, circonscription_code,
--   circonscription_name, commune_code, commune_name, polling_station_code,
--   polling_station_ref, inscrits, abstentions, votants, blancs, nuls, exprimes,
--   abstentions_pct_inscrits, votants_pct_inscrits, blancs_pct_inscrits,
--   blancs_pct_votants, nuls_pct_inscrits, nuls_pct_votants, exprimes_pct_inscrits,
--   exprimes_pct_votants
-- ) from 'data/elections/normalized/cabestany-election-turnout-by-bv.csv' csv header;
--
-- \copy import_campaign.election_results_commune (
--   source_file, source_format, election_type, election_year, round_number, date_scrutin,
--   commune_code, commune_name, status, inscrits, abstentions, votants, blancs, nuls,
--   exprimes, abstentions_pct_inscrits, votants_pct_inscrits, blancs_pct_inscrits,
--   blancs_pct_votants, nuls_pct_inscrits, nuls_pct_votants, exprimes_pct_inscrits,
--   exprimes_pct_votants, liste, conduite_par, nuance, voix, voix_pct_inscrits,
--   voix_pct_exprimes, sieges_conseil_municipal, sieges_conseil_communautaire, source_url
-- ) from 'data/elections/normalized/cabestany-election-results-commune.csv' csv header;
--
-- \copy import_campaign.election_results_bv (
--   commune_code, commune_name, election_type, election_year, round_number, date_scrutin,
--   polling_station_code, inscrits, votants, blancs, nuls, exprimes, candidate_label,
--   candidate_last_name, candidate_group, votes, source_status, source_note
-- ) from 'data/elections/municipales/2026-municipales-cabestany-bv-validated-long.csv' csv header;
