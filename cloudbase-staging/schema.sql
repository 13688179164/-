-- GOODWORK staging schema (CloudBase PostgreSQL)
create table if not exists goodwork_users (
  username      text primary key,
  auth_uid      text unique not null,
  name          text not null,
  role          text not null default 'member' check (role in ('admin','member')),
  status        text not null default 'active' check (status in ('active','disabled')),
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

alter table goodwork_tasks add column if not exists applicant_uid text;
alter table goodwork_tasks add column if not exists reviewed_by text;
alter table goodwork_tasks add column if not exists reviewed_at timestamptz;
alter table goodwork_tasks add column if not exists review_note text;
alter table goodwork_tasks add column if not exists version integer not null default 1;
alter table goodwork_tasks add column if not exists legacy_unclaimed boolean not null default false;

alter table goodwork_attachments add column if not exists uploader_uid text;
alter table goodwork_attachments add column if not exists storage_path text;

create table if not exists goodwork_audit (
  id          bigserial primary key,
  actor_uid   text not null,
  actor_name  text,
  action      text not null,
  target_type text not null,
  target_id   text,
  from_status text,
  to_status   text,
  detail      jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_tasks_applicant on goodwork_tasks(applicant_uid);
create index if not exists idx_tasks_status    on goodwork_tasks(status);
create index if not exists idx_audit_target    on goodwork_audit(target_type, target_id);

insert into goodwork_users(username, auth_uid, name, role, status)
values ('1258046614', '1258046614', '李嘉航', 'admin', 'active')
on conflict (username) do update
  set auth_uid = excluded.auth_uid, name = excluded.name, role = excluded.role, status = excluded.status;
