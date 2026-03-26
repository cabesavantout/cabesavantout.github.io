#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

: "${DATABASE_URL:?DATABASE_URL must be set}"

run_sql() {
  local file_path="$1"
  echo "Applying ${file_path}"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$file_path"
}

run_sql "$ROOT_DIR/docs/campaign-core-schema.sql"
run_sql "$ROOT_DIR/docs/postgresql-local-auth.sql"
run_sql "$ROOT_DIR/docs/postgresql-authz-migration.sql"
run_sql "$ROOT_DIR/docs/postgresql-field-reports-upgrade.sql"
run_sql "$ROOT_DIR/docs/postgresql-field-report-tasks-upgrade.sql"
run_sql "$ROOT_DIR/docs/postgresql-contacts-upgrade.sql"

python3 "$ROOT_DIR/scripts/import_election_data.py" --dsn "$DATABASE_URL" --reset
python3 "$ROOT_DIR/scripts/import_municipales_2026_bv_validated.py" --dsn "$DATABASE_URL" --reset
python3 "$ROOT_DIR/scripts/import_insee_data.py" --dsn "$DATABASE_URL" --reset
python3 "$ROOT_DIR/scripts/import_polling_stations.py" --dsn "$DATABASE_URL" --reset

run_sql "$ROOT_DIR/docs/postgresql-sectors-upgrade.sql"
