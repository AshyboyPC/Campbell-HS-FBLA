-- Campbell FBLA 2026-2027 approval roster.
-- Full administrator access is intentionally limited to four named student
-- leaders and the shared chapter adviser account.

create table if not exists public.portal_access_allowlist (
  email text primary key check (email ~* '^[^@[:space:]]+@campbellhigh\.net$'),
  account_role text not null,
  officer_position text,
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portal_access_allowlist drop constraint if exists portal_access_allowlist_account_role_check;

insert into public.portal_access_allowlist(email,account_role,officer_position,display_name,active)
values
  ('ashwindh.ramesh@campbellhigh.net','admin','Co-President','Ashwindh Ramesh',true),
  ('xavier.thomas@campbellhigh.net','admin','Co-President','Xavier Thomas',true),
  ('harshad.premkumar@campbellhigh.net','admin','Executive Vice President','Harshad Premkumar',true),
  ('vivaan.bendishankara@campbellhigh.net','admin','Secretary','Vivaan Bendishankara',true),
  ('fbla@campbellhigh.net','admin',null,'Campbell FBLA Advisers',true)
on conflict (email) do update set account_role=excluded.account_role,officer_position=excluded.officer_position,display_name=excluded.display_name,active=excluded.active,updated_at=now();

delete from public.portal_access_allowlist
where email not in (
  'ashwindh.ramesh@campbellhigh.net',
  'xavier.thomas@campbellhigh.net',
  'harshad.premkumar@campbellhigh.net',
  'vivaan.bendishankara@campbellhigh.net',
  'fbla@campbellhigh.net'
);

alter table public.portal_access_allowlist
  add constraint portal_access_allowlist_account_role_check check (account_role = 'admin');

alter table public.portal_access_allowlist enable row level security;
revoke all on public.portal_access_allowlist from public,anon,authenticated;
grant all on public.portal_access_allowlist to service_role;

-- Admin inherits every protected portal capability while members and ordinary
-- officers still receive only the roles explicitly named by each policy.
create or replace function public.has_portal_role(allowed text[])
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_account_role() = 'admin' or public.current_account_role() = any(allowed),false)
$$;

create or replace function public.enforce_portal_access_allowlist()
returns trigger language plpgsql security definer set search_path=public as $$
declare allowed public.portal_access_allowlist%rowtype;
begin
  if new.approved_auth_email is not null then
    select * into allowed from public.portal_access_allowlist where email=lower(btrim(new.approved_auth_email)) and active=true;
  end if;
  if allowed.email is not null then
    new.account_role:=allowed.account_role;
    new.officer_position:=coalesce(allowed.officer_position,new.officer_position);
    new.approved:=true;
    new.active:=true;
    new.membership_status:='active';
  elsif new.account_role in ('secretary','executive_leadership','adviser','admin') then
    new.account_role:=case when new.officer_position is not null then 'officer' else 'member' end;
  end if;
  return new;
end $$;

drop trigger if exists profiles_enforce_portal_access on public.profiles;
create trigger profiles_enforce_portal_access before insert or update of approved_auth_email,account_role,officer_position on public.profiles for each row execute function public.enforce_portal_access_allowlist();

create or replace function public.link_profile_to_existing_auth_user()
returns trigger language plpgsql security definer set search_path=public,auth as $$
begin
  if new.auth_user_id is null and new.approved=true and new.active=true and new.approved_auth_email is not null then
    select u.id into new.auth_user_id
    from auth.users u
    where lower(u.email)=lower(btrim(new.approved_auth_email))
    order by u.created_at asc
    limit 1;
  end if;
  return new;
end $$;

drop trigger if exists profiles_link_existing_auth_user on public.profiles;
create trigger profiles_link_existing_auth_user
before insert or update of approved_auth_email,approved,active
on public.profiles for each row execute function public.link_profile_to_existing_auth_user();

update public.profiles p set account_role=a.account_role,officer_position=coalesce(a.officer_position,p.officer_position),approved=true,active=true,membership_status='active',updated_at=now()
from public.portal_access_allowlist a where lower(p.approved_auth_email)=a.email and a.active=true;

update public.profiles p
set auth_user_id=u.id,updated_at=now()
from auth.users u
where p.auth_user_id is null and p.approved=true and p.active=true
  and p.approved_auth_email is not null
  and lower(u.email)=lower(p.approved_auth_email);

update public.profiles p set account_role=case when p.officer_position is not null then 'officer' else 'member' end,updated_at=now()
where p.account_role in ('secretary','executive_leadership','adviser','admin')
and not exists(select 1 from public.portal_access_allowlist a where a.email=lower(p.approved_auth_email) and a.active=true);

-- Replace legacy broad-role policies; the has_portal_role function above makes
-- the five allowlisted administrators inherit every protected capability.
drop policy if exists "users read own profile staff read profiles" on public.profiles;
create policy "users read own profile staff read profiles" on public.profiles for select to authenticated
using (id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "staff manage profiles" on public.profiles;
create policy "staff manage profiles" on public.profiles for all to authenticated
using (public.has_portal_role(array['adviser'])) with check (public.has_portal_role(array['adviser']));

drop policy if exists "published rules or staff" on public.point_categories;
create policy "published rules or staff" on public.point_categories for select to authenticated
using ((published and active) or public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "admin manages rules" on public.point_categories;
create policy "admin manages rules" on public.point_categories for all to authenticated
using (public.has_portal_role(array['adviser'])) with check (public.has_portal_role(array['adviser']));

drop policy if exists "leadership manages events" on public.events;
create policy "leadership manages events" on public.events for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "own attendance or attendance staff" on public.member_attendance;
create policy "own attendance or attendance staff" on public.member_attendance for select to authenticated
using (member_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "attendance staff manage" on public.member_attendance;
create policy "attendance staff manage" on public.member_attendance for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));

drop policy if exists "own ledger or staff" on public.point_transactions;
create policy "own ledger or staff" on public.point_transactions for select to authenticated
using (member_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "own corrections or review staff" on public.correction_requests;
create policy "own corrections or review staff" on public.correction_requests for select to authenticated
using (member_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "staff review corrections" on public.correction_requests;
create policy "staff review corrections" on public.correction_requests for update to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));

drop policy if exists "officer reads own attendance staff read all" on public.officer_attendance;
create policy "officer reads own attendance staff read all" on public.officer_attendance for select to authenticated
using (officer_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "secretary staff manage officer attendance" on public.officer_attendance;
create policy "secretary staff manage officer attendance" on public.officer_attendance for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "officers read and create own absence requests" on public.officer_absence_requests;
create policy "officers read and create own absence requests" on public.officer_absence_requests for select to authenticated
using (officer_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "leadership reviews absence requests" on public.officer_absence_requests;
create policy "leadership reviews absence requests" on public.officer_absence_requests for update to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "officers read own actions staff read all" on public.officer_accountability_actions;
create policy "officers read own actions staff read all" on public.officer_accountability_actions for select to authenticated
using (officer_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "leadership manages actions" on public.officer_accountability_actions;
create policy "leadership manages actions" on public.officer_accountability_actions for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));

drop policy if exists "approved users read published cord rules" on public.graduation_requirements;
create policy "approved users read published cord rules" on public.graduation_requirements for select to authenticated
using (published or public.has_portal_role(array['adviser']));
drop policy if exists "admin manages cord rules" on public.graduation_requirements;
create policy "admin manages cord rules" on public.graduation_requirements for all to authenticated
using (public.has_portal_role(array['adviser'])) with check (public.has_portal_role(array['adviser']));
drop policy if exists "admin manages officer thresholds" on public.officer_policy_thresholds;
create policy "admin manages officer thresholds" on public.officer_policy_thresholds for all to authenticated
using (public.has_portal_role(array['adviser'])) with check (public.has_portal_role(array['adviser']));

drop policy if exists "import staff only" on public.import_batches;
create policy "import staff only" on public.import_batches for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "raw attendance import staff only" on public.attendance_imports;
create policy "raw attendance import staff only" on public.attendance_imports for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "external mappings staff only" on public.external_identity_mappings;
create policy "external mappings staff only" on public.external_identity_mappings for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "teams imports authorized only" on public.teams_attendance_imports;
create policy "teams imports authorized only" on public.teams_attendance_imports for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "audit adviser admin only" on public.audit_log;
create policy "audit adviser admin only" on public.audit_log for select to authenticated
using (public.has_portal_role(array['adviser']));

-- The shared adviser account is not a graduating member.
alter table public.profiles alter column graduation_year drop not null;
insert into public.profiles(member_id,first_name,last_name,display_name,school_email,approved_auth_email,graduation_year,membership_status,account_role,active,approved)
values('STAFF-FBLA','Campbell FBLA','Advisers','Campbell FBLA Advisers','fbla@campbellhigh.net','fbla@campbellhigh.net',null,'active','admin',true,true)
on conflict (member_id) do update set display_name=excluded.display_name,school_email=excluded.school_email,approved_auth_email=excluded.approved_auth_email,graduation_year=null,membership_status='active',account_role='admin',active=true,approved=true,updated_at=now();

drop policy if exists "members read own claims leadership read all" on public.point_claims;
create policy "members read own claims leadership read all" on public.point_claims for select to authenticated
using (member_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser']));
drop policy if exists "leadership reviews claims" on public.point_claims;
create policy "leadership reviews claims" on public.point_claims for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));

drop policy if exists "authorized ledger writes" on public.point_transactions;
create policy "authorized ledger writes" on public.point_transactions for all to authenticated
using (public.has_portal_role(array['secretary','executive_leadership','adviser'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser']));

create or replace function public.review_point_claim(p_claim_id uuid,p_actor_id uuid,p_decision text,p_verified_quantity numeric default null,p_reviewer_notes text default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare claim public.point_claims%rowtype; rule public.point_categories%rowtype; actor_role text; actor_email text; quantity numeric; amount numeric; transaction_id uuid; prior_count integer;
begin
  select p.account_role,lower(p.approved_auth_email) into actor_role,actor_email from public.profiles p where p.id=p_actor_id and p.approved=true and p.active=true;
  if actor_role is null or actor_role <> 'admin' or not exists(select 1 from public.portal_access_allowlist a where a.email=actor_email and a.account_role=actor_role and a.active=true) then raise exception 'Not authorized to review point claims'; end if;
  if p_decision not in ('under_review','approved','rejected') then raise exception 'Invalid point-claim decision'; end if;
  select * into claim from public.point_claims where id=p_claim_id for update;
  if not found then raise exception 'Point claim not found'; end if;
  if claim.status not in ('submitted','under_review') then raise exception 'Point claim has already been finalized'; end if;
  if not exists(select 1 from public.profiles p where p.id=claim.member_id and p.approved=true and p.active=true and p.membership_status='active') then raise exception 'Claim member is not active'; end if;
  if claim.event_id is not null and not exists(select 1 from public.events e where e.id=claim.event_id and e.academic_year_id=claim.academic_year_id and e.active=true) then raise exception 'Claim event is not active in this academic year'; end if;
  if p_decision in ('under_review','rejected') then
    update public.point_claims set status=p_decision,reviewed_by=p_actor_id,reviewed_at=now(),reviewer_notes=p_reviewer_notes where id=p_claim_id;
    insert into public.audit_log(actor_profile_id,action,entity_type,entity_id,academic_year_id,after_data) values(p_actor_id,'point_claim_'||p_decision,'point_claim',p_claim_id,claim.academic_year_id,jsonb_build_object('decision',p_decision,'reviewer_notes',p_reviewer_notes));
    return jsonb_build_object('status',p_decision);
  end if;
  select * into rule from public.point_categories where id=claim.point_category_id and academic_year_id=claim.academic_year_id and active=true and published=true and self_reportable=true;
  if not found then raise exception 'This point category is not eligible for member claims'; end if;
  quantity:=coalesce(p_verified_quantity,claim.quantity);
  if quantity<=0 then raise exception 'Verified quantity must be positive'; end if;
  amount:=case when rule.calculation_type='per_hour' then least(quantity*coalesce(rule.points_per_unit,0),coalesce(rule.max_points,999999)) else coalesce(rule.default_points,0) end;
  if amount<=0 then raise exception 'The selected point rule does not produce a positive award'; end if;
  if rule.max_occurrences is not null then
    select count(*) into prior_count from public.point_transactions where member_id=claim.member_id and academic_year_id=claim.academic_year_id and point_category_id=claim.point_category_id and status='approved' and points>0;
    if prior_count>=rule.max_occurrences then raise exception 'This member has already reached the category occurrence limit'; end if;
  end if;
  if claim.event_id is not null and exists(select 1 from public.point_transactions where member_id=claim.member_id and event_id=claim.event_id and point_category_id=claim.point_category_id and status='approved') then raise exception 'An approved award already exists for this member, event, and category'; end if;
  insert into public.point_transactions(member_id,academic_year_id,point_category_id,event_id,transaction_type,points,quantity,status,source_type,source_reference,description,notes,created_by,approved_by,approved_at)
  values(claim.member_id,claim.academic_year_id,claim.point_category_id,claim.event_id,'earned',amount,quantity,'approved','member_claim','claim:'||claim.id::text,claim.member_description,p_reviewer_notes,claim.member_id,p_actor_id,now()) returning id into transaction_id;
  update public.point_claims set status='approved',quantity=quantity,calculated_points=amount,reviewed_by=p_actor_id,reviewed_at=now(),reviewer_notes=p_reviewer_notes,point_transaction_id=transaction_id where id=p_claim_id;
  insert into public.audit_log(actor_profile_id,action,entity_type,entity_id,academic_year_id,after_data) values(p_actor_id,'point_claim_approved','point_claim',p_claim_id,claim.academic_year_id,jsonb_build_object('transaction_id',transaction_id,'points',amount,'verified_quantity',quantity));
  return jsonb_build_object('status','approved','transactionId',transaction_id,'points',amount);
end $$;

revoke all on function public.review_point_claim(uuid,uuid,text,numeric,text) from public,anon,authenticated;
grant execute on function public.review_point_claim(uuid,uuid,text,numeric,text) to service_role;
