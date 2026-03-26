-- Zone d'import PostgreSQL pour les indicateurs INSEE normalisés.

create schema if not exists import_campaign;

create table if not exists import_campaign.insee_indicators (
  id bigserial primary key,
  commune_code text not null,
  commune_name text not null,
  table_code text not null,
  theme text,
  table_title text not null,
  row_index integer,
  row_label text,
  dimension_label text,
  column_index integer,
  column_label text,
  year integer,
  unit text,
  value_raw text,
  value_numeric numeric(18,4),
  value_kind text,
  imported_at timestamptz not null default now()
);

create unique index if not exists insee_indicators_unique_idx
  on import_campaign.insee_indicators(
    commune_code,
    table_code,
    row_index,
    column_index,
    coalesce(year, -1),
    coalesce(row_label, ''),
    coalesce(column_label, '')
  );

create index if not exists insee_indicators_theme_idx
  on import_campaign.insee_indicators(theme);

create index if not exists insee_indicators_table_idx
  on import_campaign.insee_indicators(table_code);

create index if not exists insee_indicators_year_idx
  on import_campaign.insee_indicators(year);

-- Exemple psql:
-- \copy import_campaign.insee_indicators (
--   commune_code, commune_name, table_code, theme, table_title, row_index, row_label,
--   dimension_label, column_index, column_label, year, unit, value_raw, value_numeric, value_kind
-- ) from 'data/insee/cabestany-normalized.csv' csv header;
