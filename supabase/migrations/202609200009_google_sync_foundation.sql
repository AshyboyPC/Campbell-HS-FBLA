-- Secure Google Workspace synchronization foundation.
-- Resource identifiers and field mappings may be stored here. OAuth credentials
-- and webhook secrets belong in server environment variables, never in tables.

create table if not exists public.sync_connections (
  id uuid primary key default gen_random_uuid(),
  purpose text not null check (purpose in ('attendance_source', 'adviser_ledger')),
  provider text not null check (provider in ('google_forms', 'google_sheets')),
  display_name text not null,
  external_resource_id text,
  worksheet_name text,
  status text not null default 'needs_configuration' check (status in ('needs_configuration', 'ready', 'syncing', 'error', 'paused')),
  field_mapping jsonb not null default '{}'::jsonb,
  configuration jsonb not null default '{}'::jsonb,
  cursor_value text,
  active boolean not null default true,
  last_synced_at timestamptz,
  last_success_at timestamptz,
  last_error_at timestamptz,
  last_error text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (purpose)
);

create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.sync_connections(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound', 'reconcile')),
  status text not null default 'running' check (status in ('running', 'completed', 'partial', 'failed')),
  idempotency_key text,
  cursor_before text,
  cursor_after text,
  received_count integer not null default 0,
  processed_count integer not null default 0,
  skipped_count integer not null default 0,
  error_count integer not null default 0,
  error_summary text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  unique (connection_id, idempotency_key)
);

create table if not exists public.sync_inbox_events (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.sync_connections(id) on delete cascade,
  source_event_id text not null,
  event_type text not null,
  payload jsonb not null,
  payload_hash text not null,
  status text not null default 'received' check (status in ('received', 'processed', 'needs_mapping', 'rejected', 'failed')),
  result jsonb not null default '{}'::jsonb,
  error_message text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (connection_id, source_event_id)
);

create table if not exists public.sync_outbox (
  id bigserial primary key,
  topic text not null check (topic in ('member', 'point_transaction', 'attendance', 'event', 'rule')),
  entity_id text not null,
  operation text not null default 'upsert' check (operation in ('upsert', 'delete')),
  dedupe_key text not null unique,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  claimed_at timestamptz,
  processed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

create table if not exists public.external_sync_records (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.sync_connections(id) on delete cascade,
  entity_type text not null,
  internal_id text not null,
  external_row_key text not null,
  external_version text,
  content_hash text,
  last_direction text check (last_direction in ('inbound', 'outbound')),
  conflict_status text not null default 'clean' check (conflict_status in ('clean', 'needs_review', 'resolved')),
  last_synced_at timestamptz not null default now(),
  unique (connection_id, entity_type, internal_id),
  unique (connection_id, external_row_key)
);

create index if not exists sync_outbox_pending_idx on public.sync_outbox(status, available_at, id);
create index if not exists sync_inbox_received_idx on public.sync_inbox_events(status, received_at);
create index if not exists sync_runs_connection_idx on public.sync_runs(connection_id, started_at desc);

alter table public.sync_connections enable row level security;
alter table public.sync_runs enable row level security;
alter table public.sync_inbox_events enable row level security;
alter table public.sync_outbox enable row level security;
alter table public.external_sync_records enable row level security;

drop policy if exists "advisers read sync connections" on public.sync_connections;
create policy "advisers read sync connections" on public.sync_connections for select to authenticated
using (exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.account_role = 'adviser' and p.active));

drop policy if exists "advisers manage sync connections" on public.sync_connections;
create policy "advisers manage sync connections" on public.sync_connections for all to authenticated
using (exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.account_role = 'adviser' and p.active))
with check (exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.account_role = 'adviser' and p.active));

drop policy if exists "advisers read sync runs" on public.sync_runs;
create policy "advisers read sync runs" on public.sync_runs for select to authenticated
using (exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.account_role = 'adviser' and p.active));

create or replace function public.enqueue_points_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  row_id text;
  row_topic text := TG_ARGV[0];
  row_operation text := lower(TG_OP);
  change_stamp text;
begin
  row_id := coalesce((case when TG_OP = 'DELETE' then to_jsonb(OLD) else to_jsonb(NEW) end)->>'id', 'unknown');
  change_stamp := coalesce((case when TG_OP = 'DELETE' then to_jsonb(OLD) else to_jsonb(NEW) end)->>'updated_at', clock_timestamp()::text);
  insert into public.sync_outbox(topic, entity_id, operation, dedupe_key)
  values (row_topic, row_id, case when TG_OP = 'DELETE' then 'delete' else 'upsert' end,
          row_topic || ':' || row_id || ':' || row_operation || ':' || change_stamp)
  on conflict (dedupe_key) do nothing;
  perform pg_notify('points_sync_outbox', row_topic || ':' || row_id);
  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$;

drop trigger if exists profiles_sync_outbox on public.profiles;
create trigger profiles_sync_outbox after insert or update or delete on public.profiles
for each row execute function public.enqueue_points_sync('member');
drop trigger if exists point_transactions_sync_outbox on public.point_transactions;
create trigger point_transactions_sync_outbox after insert or update or delete on public.point_transactions
for each row execute function public.enqueue_points_sync('point_transaction');
drop trigger if exists member_attendance_sync_outbox on public.member_attendance;
create trigger member_attendance_sync_outbox after insert or update or delete on public.member_attendance
for each row execute function public.enqueue_points_sync('attendance');
drop trigger if exists events_sync_outbox on public.events;
create trigger events_sync_outbox after insert or update or delete on public.events
for each row execute function public.enqueue_points_sync('event');
drop trigger if exists point_categories_sync_outbox on public.point_categories;
create trigger point_categories_sync_outbox after insert or update or delete on public.point_categories
for each row execute function public.enqueue_points_sync('rule');

insert into public.sync_connections(purpose, provider, display_name, status)
values
  ('attendance_source', 'google_forms', 'All-activity sign-in form', 'needs_configuration'),
  ('adviser_ledger', 'google_sheets', 'Adviser points ledger', 'needs_configuration')
on conflict (purpose) do nothing;

comment on table public.sync_inbox_events is 'Append-only replay-protected inbound webhook journal; raw payloads are service-role only.';
comment on table public.sync_outbox is 'Minimal change queue. Sensitive row data is fetched server-side only when a trusted destination is flushed.';
