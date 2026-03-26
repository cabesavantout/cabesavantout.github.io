begin;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'field_report_status'
  ) then
    create type field_report_status as enum (
      'new',
      'qualified',
      'in_progress',
      'closed'
    );
  end if;
end $$;

alter table field_reports
  add column if not exists polling_station_code text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists support_level support_level not null default 'unknown',
  add column if not exists priority task_priority not null default 'medium',
  add column if not exists status field_report_status not null default 'new';

create index if not exists field_reports_polling_station_idx
  on field_reports(polling_station_code);

commit;
