-- Campbell FBLA 2026-2027 Member Portal foundation
-- Private member data is intentionally not seeded by this migration.

create extension if not exists pgcrypto;

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  start_date date not null,
  end_date date not null,
  points_deadline date,
  yearly_goal integer check (yearly_goal is null or yearly_goal >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table if not exists public.member_id_counters (
  graduation_year integer primary key,
  last_value integer not null default 0
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  member_id text not null unique,
  first_name text not null,
  last_name text not null,
  display_name text not null,
  school_email text,
  approved_auth_email text,
  graduation_year integer not null check (graduation_year between 2020 and 2100),
  grade_level text check (grade_level is null or grade_level in ('9','10','11','12')),
  membership_status text not null default 'pending' check (membership_status in ('pending','active','inactive','graduated')),
  membership_tier text,
  dues_status text not null default 'not_paid' check (dues_status in ('not_paid','pending','paid','waived')),
  dues_paid_at timestamptz,
  account_role text not null default 'member' check (account_role in ('member','officer','secretary','executive_leadership','adviser','admin')),
  officer_position text,
  active boolean not null default true,
  approved boolean not null default false,
  join_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_school_email_unique on public.profiles (lower(school_email)) where school_email is not null;
create unique index if not exists profiles_approved_email_unique on public.profiles (lower(approved_auth_email)) where approved_auth_email is not null;
create index if not exists profiles_member_id_idx on public.profiles(member_id);

create or replace function public.generate_member_id(p_graduation_year integer)
returns text language plpgsql security definer set search_path = public as $$
declare next_value integer;
begin
  insert into public.member_id_counters(graduation_year,last_value)
  values (p_graduation_year,1)
  on conflict (graduation_year) do update set last_value=public.member_id_counters.last_value+1
  returning last_value into next_value;
  return 'CFBLA-' || p_graduation_year::text || '-' || lpad(next_value::text,4,'0');
end $$;

create or replace function public.assign_member_id()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.member_id is null or btrim(new.member_id) = '' then
    new.member_id := public.generate_member_id(new.graduation_year);
  end if;
  new.school_email := nullif(lower(btrim(new.school_email)), '');
  new.approved_auth_email := nullif(lower(btrim(new.approved_auth_email)), '');
  new.display_name := coalesce(nullif(btrim(new.display_name),''), btrim(new.first_name || ' ' || new.last_name));
  return new;
end $$;

drop trigger if exists profiles_assign_member_id on public.profiles;
create trigger profiles_assign_member_id before insert or update on public.profiles for each row execute function public.assign_member_id();

create table if not exists public.point_categories (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  code text not null,
  name text not null,
  description text not null,
  group_name text not null,
  calculation_type text not null check (calculation_type in ('fixed','attendance','per_hour','manual','achievement','penalty')),
  default_points numeric(8,2),
  points_per_unit numeric(8,2),
  max_points numeric(8,2),
  max_occurrences integer,
  repeatable boolean not null default false,
  approval_required boolean not null default true,
  attendance_generated boolean not null default false,
  published boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  source_document text,
  source_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(academic_year_id,code)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  event_code text not null unique,
  title text not null,
  event_type text not null check (event_type in ('chapter_meeting','officer_team_meeting','social','service','fundraiser','workshop','competition_study','rally','conference','competition','BAA','leadership','other')),
  description text,
  start_datetime timestamptz not null,
  end_datetime timestamptz not null,
  location text,
  attendance_open_datetime timestamptz,
  attendance_close_datetime timestamptz,
  point_category_id uuid references public.point_categories(id) on delete set null,
  point_override numeric(8,2),
  required_for_members boolean not null default false,
  required_for_officers boolean not null default false,
  attendance_source text not null default 'manual' check (attendance_source in ('google_form','microsoft_form','csv','manual','qr','admin','other')),
  external_event_reference text,
  active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_datetime >= start_datetime)
);
create index if not exists events_event_code_idx on public.events(event_code);
create index if not exists events_academic_year_idx on public.events(academic_year_id,start_datetime);

create table if not exists public.member_attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('present','absent','late','excused','not_required','pending_review')),
  check_in_timestamp timestamptz,
  source_type text not null check (source_type in ('google_form','microsoft_form','csv','manual','qr','admin','other')),
  source_submission_id text,
  verified boolean not null default false,
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  service_hours numeric(7,2) check (service_hours is null or service_hours >= 0),
  review_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id,member_id)
);
create index if not exists member_attendance_member_event_idx on public.member_attendance(member_id,event_id);

create table if not exists public.officer_absence_requests (
  id uuid primary key default gen_random_uuid(),
  officer_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  reason text not null,
  notice_given_at timestamptz not null default now(),
  handoff_required boolean not null default false,
  handoff_to uuid references public.profiles(id) on delete set null,
  handoff_plan text,
  additional_notes text,
  status text not null default 'pending' check (status in ('pending','excused','unexcused','withdrawn')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  decision_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(officer_id,event_id)
);

create table if not exists public.officer_attendance (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  officer_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  status text not null check (status in ('present','late','excused_absence','unexcused_absence','pending_review','not_required')),
  source_type text not null check (source_type in ('microsoft_teams','csv','manual','admin','other')),
  source_record_id text,
  first_join_at timestamptz,
  last_leave_at timestamptz,
  minutes_present integer check (minutes_present is null or minutes_present >= 0),
  late_minutes integer check (late_minutes is null or late_minutes >= 0),
  early_departure_minutes integer check (early_departure_minutes is null or early_departure_minutes >= 0),
  attendance_evidence_status text not null default 'pending_review' check (attendance_evidence_status in ('confirmed','suggested_present','suggested_late','no_attendance_detected','early_departure_review','pending_review')),
  absence_request_id uuid references public.officer_absence_requests(id) on delete set null,
  classified_by uuid references public.profiles(id) on delete set null,
  classified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(officer_id,event_id)
);
create index if not exists officer_attendance_officer_event_idx on public.officer_attendance(officer_id,event_id);

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  point_category_id uuid not null references public.point_categories(id) on delete restrict,
  event_id uuid references public.events(id) on delete set null,
  member_attendance_id uuid references public.member_attendance(id) on delete set null,
  officer_attendance_id uuid references public.officer_attendance(id) on delete set null,
  transaction_type text not null check (transaction_type in ('earned','penalty','adjustment','reversal')),
  points numeric(8,2) not null,
  quantity numeric(8,2),
  status text not null default 'pending' check (status in ('pending','approved','rejected','reversed')),
  source_type text not null,
  source_reference text,
  description text not null,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  reversal_of uuid references public.point_transactions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists point_transactions_member_year_idx on public.point_transactions(member_id,academic_year_id);
create unique index if not exists point_transaction_attendance_award_unique on public.point_transactions(member_attendance_id,point_category_id) where member_attendance_id is not null and transaction_type='earned';
create unique index if not exists point_transaction_source_unique on public.point_transactions(source_type,source_reference) where source_reference is not null;

create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  import_type text not null check (import_type in ('membership','general_attendance','officer_attendance','historical_points')),
  source_type text not null,
  filename text,
  status text not null default 'preview' check (status in ('preview','confirmed','processing','completed','failed','cancelled')),
  row_count integer not null default 0,
  ready_count integer not null default 0,
  duplicate_count integer not null default 0,
  unmatched_count integer not null default 0,
  conflict_count integer not null default 0,
  column_mapping jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  confirmed_by uuid references public.profiles(id) on delete set null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance_imports (
  id uuid primary key default gen_random_uuid(),
  import_batch_id uuid references public.import_batches(id) on delete set null,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  source_type text not null,
  source_submission_id text not null,
  submitted_at timestamptz,
  event_code text,
  external_event_reference text,
  submitted_email text,
  submitted_member_id text,
  submitted_name text,
  matched_member_id uuid references public.profiles(id) on delete set null,
  matched_event_id uuid references public.events(id) on delete set null,
  status text not null check (status in ('received','matched','unmatched_member','unmatched_event','duplicate','outside_window','pending_review','processed','ignored')),
  review_reason text,
  raw_metadata jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(source_type,source_submission_id)
);
create index if not exists attendance_import_lookup_idx on public.attendance_imports(source_type,source_submission_id);

create table if not exists public.external_identity_mappings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  external_identifier text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(provider,external_identifier)
);

create table if not exists public.teams_attendance_imports (
  id uuid primary key default gen_random_uuid(),
  import_batch_id uuid references public.import_batches(id) on delete set null,
  event_id uuid not null references public.events(id) on delete cascade,
  external_meeting_id text,
  participant_name text not null,
  participant_email text,
  first_join_at timestamptz,
  last_leave_at timestamptz,
  total_minutes integer,
  matched_officer_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending_review' check (status in ('matched','unmatched','duplicate','pending_review','processed','ignored')),
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists teams_attendance_event_idx on public.teams_attendance_imports(event_id);

create table if not exists public.correction_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  issue_type text not null check (issue_type in ('Missing Attendance','Incorrect Attendance','Missing Points','Incorrect Points','Incorrect Service Hours','Dues Issue','Other')),
  event_id uuid references public.events(id) on delete set null,
  attendance_id uuid references public.member_attendance(id) on delete set null,
  point_transaction_id uuid references public.point_transactions(id) on delete set null,
  activity_date date,
  description text not null,
  evidence_url text,
  status text not null default 'submitted' check (status in ('submitted','under_review','approved','rejected','resolved')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index if not exists correction_requests_member_status_idx on public.correction_requests(member_id,status);

create table if not exists public.graduation_requirements (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  graduation_year integer not null,
  required_points integer not null check (required_points >= 0),
  published boolean not null default false,
  notes text,
  source_document text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(academic_year_id,graduation_year)
);

create table if not exists public.officer_policy_thresholds (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  threshold integer not null check (threshold > 0),
  cumulative_deduction integer not null check (cumulative_deduction <= 0),
  action_type text not null check (action_type in ('written_warning','leadership_checkin','probation','performance_review','adviser_review','removal_review')),
  action_label text not null,
  active boolean not null default true,
  source_document text,
  source_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(academic_year_id,threshold,action_type)
);

create table if not exists public.officer_accountability_actions (
  id uuid primary key default gen_random_uuid(),
  officer_id uuid not null references public.profiles(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  threshold integer not null,
  action_type text not null check (action_type in ('written_warning','leadership_checkin','probation','performance_review','adviser_review','removal_review')),
  action_label text not null,
  status text not null default 'pending' check (status in ('pending','active','completed','rescinded')),
  issued_by uuid references public.profiles(id) on delete set null,
  issued_at timestamptz,
  acknowledged_at timestamptz,
  review_date date,
  notes text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(officer_id,academic_year_id,threshold,action_type)
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  academic_year_id uuid references public.academic_years(id) on delete set null,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

do $$ declare table_name text; begin
  foreach table_name in array array['academic_years','profiles','point_categories','events','member_attendance','officer_absence_requests','officer_attendance','point_transactions','import_batches','correction_requests','graduation_requirements','officer_policy_thresholds','officer_accountability_actions']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I',table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',table_name);
  end loop;
end $$;
