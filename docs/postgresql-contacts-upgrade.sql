begin;

create table if not exists contacts (
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

create index if not exists contacts_kind_idx on contacts(contact_kind);
create index if not exists contacts_active_idx on contacts(is_active);
create index if not exists contacts_organization_idx on contacts(organization);

insert into permissions (code, label, module, description)
values
  ('contacts.read', 'Lire les contacts', 'contacts', 'Consulter le carnet de contacts de campagne.'),
  ('contacts.manage', 'Gerer les contacts', 'contacts', 'Creer et modifier les contacts de campagne.')
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
    ('admin', 'contacts.read'),
    ('admin', 'contacts.manage'),
    ('direction', 'contacts.read'),
    ('direction', 'contacts.manage'),
    ('coordinateur', 'contacts.read'),
    ('coordinateur', 'contacts.manage'),
    ('lecture', 'contacts.read')
) as role_map(role_name, permission_code)
  on role_map.permission_code = p.code
on conflict do nothing;

commit;
