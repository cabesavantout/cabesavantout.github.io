begin;

alter table tasks
  add column if not exists source_field_report_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tasks_source_field_report_id_fkey'
  ) then
    alter table tasks
      add constraint tasks_source_field_report_id_fkey
      foreign key (source_field_report_id) references field_reports(id) on delete set null;
  end if;
end $$;

create index if not exists tasks_source_field_report_idx
  on tasks(source_field_report_id);

commit;
