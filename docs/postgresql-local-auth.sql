alter table users
  add column if not exists password_hash text,
  add column if not exists password_updated_at timestamptz;

comment on column users.password_hash is
  'Hash scrypt utilise pour l authentification locale de la webapp.';

comment on column users.password_updated_at is
  'Date de mise a jour du mot de passe local.';
