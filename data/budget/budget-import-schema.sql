-- Tables d'import budget pour PostgreSQL

create table if not exists budget_documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  document_type text not null,
  year_label text not null,
  source_pdf text not null,
  extracted_text_file text,
  pages integer,
  has_extractable_text boolean not null default false,
  ocr_needed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists budget_sections (
  id uuid primary key default gen_random_uuid(),
  document_slug text not null references budget_documents(slug) on delete cascade,
  section_order integer not null,
  section_title text not null,
  created_at timestamptz not null default now()
);

create table if not exists budget_amount_lines (
  id uuid primary key default gen_random_uuid(),
  document_slug text not null references budget_documents(slug) on delete cascade,
  document_type text not null,
  year_label text not null,
  page text,
  section_title text,
  line_text text not null,
  value_raw text not null,
  value_numeric numeric(18,2),
  created_at timestamptz not null default now()
);

create index if not exists budget_amount_lines_slug_idx on budget_amount_lines(document_slug);
create index if not exists budget_amount_lines_section_idx on budget_amount_lines(section_title);
