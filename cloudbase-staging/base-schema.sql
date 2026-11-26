create table if not exists goodwork_tasks (
  id character varying primary key,
  applicant character varying not null default '',
  amount numeric not null default 0,
  department character varying not null default '',
  category character varying not null default '',
  applied_at timestamptz not null default now(),
  content text not null default '',
  status character varying not null default 'pending',
  has_invoice boolean not null default false,
  invoice_received boolean not null default false,
  invoice_received_at timestamptz,
  reimbursed_at timestamptz,
  reimbursed_from character varying,
  high_value_part boolean,
  cross_month boolean,
  stocking_cost boolean,
  order_num integer not null default 0,
  cloud_file_ids jsonb not null default '[]'::jsonb,
  writer_device_id character varying not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists goodwork_attachments (
  id character varying primary key,
  task_id character varying not null references goodwork_tasks(id) on delete cascade,
  name character varying not null default '',
  size integer not null default 0,
  mime_type character varying not null default '',
  cloud_file_id character varying not null default '',
  blob_hash character varying,
  created_at timestamptz not null default now()
);

create table if not exists goodwork_processed (
  task_id character varying not null,
  event_date date not null,
  amount numeric not null default 0,
  applicant character varying not null default '',
  category character varying not null default '',
  writer_device_id character varying not null default '',
  created_at timestamptz not null default now(),
  primary key (task_id, event_date)
);

create table if not exists goodwork_meta (
  key character varying primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
