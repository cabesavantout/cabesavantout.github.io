begin;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'app_role_v2'
  ) then
    create type app_role_v2 as enum (
      'superadmin',
      'admin',
      'direction',
      'coordinateur',
      'militant',
      'lecture'
    );
  end if;
end $$;

alter table users
  alter column role drop default;

alter table users
  alter column role type app_role_v2
  using (
    case role::text
      when 'terrain' then 'coordinateur'
      when 'communication' then 'direction'
      else role::text
    end
  )::app_role_v2;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'role_permissions'
      and column_name = 'role'
  ) then
    alter table role_permissions
      alter column role type app_role_v2
      using (
        case role::text
          when 'terrain' then 'coordinateur'
          when 'communication' then 'direction'
          else role::text
        end
      )::app_role_v2;
  end if;
end $$;

drop type if exists app_role;
alter type app_role_v2 rename to app_role;

alter table users
  alter column role set default 'lecture';

create table if not exists org_functions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table users
  add column if not exists org_function_id uuid references org_functions(id) on delete set null;

create table if not exists permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  module text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists role_permissions (
  role app_role not null,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role, permission_id)
);

create table if not exists user_permissions (
  user_id uuid not null references users(id) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (user_id, permission_id)
);

insert into org_functions (code, label, description)
values
  ('candidat', 'Candidat', 'Tete de liste ou candidat principal.'),
  ('directeur_campagne', 'Directeur de campagne', 'Pilotage general de la campagne.'),
  ('directeur_communication', 'Directeur communication', 'Pilotage du pole communication.'),
  ('directeur_terrain', 'Directeur terrain', 'Pilotage du pole terrain.'),
  ('directeur_data', 'Directeur data', 'Pilotage de la data et des analyses.'),
  ('responsable_quartier', 'Responsable quartier', 'Responsable d un quartier ou secteur.'),
  ('referent_bureau', 'Referent bureau', 'Referent d un bureau de vote.'),
  ('militant', 'Militant', 'Benevole ou adherent actif.'),
  ('invite', 'Invite', 'Compte de consultation ou d appoint.')
on conflict (code) do update
set
  label = excluded.label,
  description = excluded.description;

insert into permissions (code, label, module, description)
values
  ('users.read', 'Lire les utilisateurs', 'users', 'Consulter les comptes utilisateurs.'),
  ('users.manage', 'Gerer les utilisateurs', 'users', 'Creer, modifier, activer et desactiver des comptes.'),
  ('roles.manage', 'Gerer les roles', 'users', 'Attribuer roles, fonctions et permissions.'),
  ('team.read', 'Lire l equipe', 'team', 'Consulter membres, disponibilites et affectations.'),
  ('team.manage', 'Gerer l equipe', 'team', 'Modifier membres, disponibilites et affectations.'),
  ('tasks.read', 'Lire les taches', 'tasks', 'Consulter les taches.'),
  ('tasks.manage', 'Gerer les taches', 'tasks', 'Creer, assigner et modifier les taches.'),
  ('meetings.read', 'Lire les reunions', 'meetings', 'Consulter reunions, notes et actions.'),
  ('meetings.manage', 'Gerer les reunions', 'meetings', 'Creer et modifier reunions, notes et actions.'),
  ('events.read', 'Lire les evenements', 'events', 'Consulter agenda et evenements.'),
  ('events.manage', 'Gerer les evenements', 'events', 'Creer et modifier agenda et evenements.'),
  ('surveys.answer', 'Repondre aux sondages', 'surveys', 'Participer aux sondages internes.'),
  ('surveys.manage', 'Gerer les sondages', 'surveys', 'Creer et exploiter les sondages.'),
  ('field_reports.create', 'Creer des retours terrain', 'field_reports', 'Saisir des retours terrain.'),
  ('field_reports.read', 'Lire les retours terrain', 'field_reports', 'Consulter les retours terrain.'),
  ('field_reports.manage', 'Gerer les retours terrain', 'field_reports', 'Corriger, qualifier et piloter les retours terrain.'),
  ('citizens.read', 'Lire le CRM citoyens', 'citizens', 'Consulter les fiches habitants et soutiens.'),
  ('citizens.manage', 'Gerer le CRM citoyens', 'citizens', 'Creer et modifier les fiches habitants.'),
  ('contacts.read', 'Lire les contacts', 'contacts', 'Consulter le carnet de contacts de campagne.'),
  ('contacts.manage', 'Gerer les contacts', 'contacts', 'Creer et modifier les contacts de campagne.'),
  ('elections.read', 'Lire les donnees electorales', 'elections', 'Consulter les analyses et resultats electoraux.'),
  ('elections.import', 'Importer les donnees electorales', 'elections', 'Charger ou corriger les imports electoraux.'),
  ('insee.read', 'Lire les donnees INSEE', 'insee', 'Consulter les indicateurs socio-demographiques.'),
  ('budget.read', 'Lire le budget', 'budget', 'Consulter finances et budget.'),
  ('budget.manage', 'Gerer le budget', 'budget', 'Importer ou corriger les donnees budgetaires.'),
  ('budget.analyze', 'Analyser le budget', 'budget', 'Executer ou valider les analyses budgetaires.'),
  ('communication.create', 'Creer des contenus', 'communication', 'Produire contenus et brouillons.'),
  ('communication.validate', 'Valider les contenus', 'communication', 'Relire et valider les contenus.'),
  ('communication.publish', 'Publier les contenus', 'communication', 'Publier les contenus.'),
  ('imports.manage', 'Gerer les imports', 'imports', 'Lancer et corriger les imports de donnees.'),
  ('settings.manage', 'Gerer les parametres', 'settings', 'Modifier les parametres critiques.')
on conflict (code) do update
set
  label = excluded.label,
  module = excluded.module,
  description = excluded.description;

insert into role_permissions (role, permission_id)
select 'superadmin'::app_role, p.id
from permissions p
on conflict do nothing;

insert into role_permissions (role, permission_id)
select role_map.role_name::app_role, p.id
from permissions p
join (
  values
    ('admin', 'users.read'),
    ('admin', 'users.manage'),
    ('admin', 'team.read'),
    ('admin', 'team.manage'),
    ('admin', 'tasks.read'),
    ('admin', 'tasks.manage'),
    ('admin', 'meetings.read'),
    ('admin', 'meetings.manage'),
    ('admin', 'events.read'),
    ('admin', 'events.manage'),
    ('admin', 'field_reports.read'),
    ('admin', 'field_reports.manage'),
    ('admin', 'citizens.read'),
    ('admin', 'citizens.manage'),
    ('admin', 'contacts.read'),
    ('admin', 'contacts.manage'),
    ('admin', 'elections.read'),
    ('admin', 'insee.read'),
    ('admin', 'budget.read'),
    ('admin', 'communication.create'),
    ('admin', 'communication.validate'),
    ('admin', 'imports.manage'),
    ('direction', 'team.read'),
    ('direction', 'tasks.read'),
    ('direction', 'tasks.manage'),
    ('direction', 'meetings.read'),
    ('direction', 'meetings.manage'),
    ('direction', 'events.read'),
    ('direction', 'events.manage'),
    ('direction', 'field_reports.read'),
    ('direction', 'field_reports.manage'),
    ('direction', 'citizens.read'),
    ('direction', 'citizens.manage'),
    ('direction', 'contacts.read'),
    ('direction', 'contacts.manage'),
    ('direction', 'elections.read'),
    ('direction', 'insee.read'),
    ('direction', 'budget.read'),
    ('direction', 'budget.analyze'),
    ('direction', 'communication.create'),
    ('direction', 'communication.validate'),
    ('coordinateur', 'team.read'),
    ('coordinateur', 'tasks.read'),
    ('coordinateur', 'tasks.manage'),
    ('coordinateur', 'meetings.read'),
    ('coordinateur', 'meetings.manage'),
    ('coordinateur', 'events.read'),
    ('coordinateur', 'events.manage'),
    ('coordinateur', 'field_reports.create'),
    ('coordinateur', 'field_reports.read'),
    ('coordinateur', 'citizens.read'),
    ('coordinateur', 'citizens.manage'),
    ('coordinateur', 'contacts.read'),
    ('coordinateur', 'contacts.manage'),
    ('militant', 'events.read'),
    ('militant', 'surveys.answer'),
    ('militant', 'field_reports.create'),
    ('militant', 'tasks.read'),
    ('lecture', 'events.read'),
    ('lecture', 'contacts.read'),
    ('lecture', 'tasks.read'),
    ('lecture', 'meetings.read')
) as role_map(role_name, permission_code)
  on role_map.permission_code = p.code
on conflict do nothing;

commit;
