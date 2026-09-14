-- Campbell FBLA member self-reporting workflow.
-- Attendance remains provider-generated; members may only claim approved non-attendance activities.

alter table public.point_categories add column if not exists self_reportable boolean not null default false;

with ay as (select id from public.academic_years where label='2026-2027')
update public.point_categories pc set self_reportable=true
from ay where pc.academic_year_id=ay.id and pc.code in (
  'BAA_CONTRIBUTOR','BAA_LEADER','BAA_ADVOCATE','BAA_CAPSTONE','SERVICE_HOURS',
  'COMPETE','RLC_TOP_10','ADVANCE_SLC','SLC_TOP_10','ADVANCE_NLC','NLC_TOP_10',
  'RECRUITMENT','OFFICER_APPLICATION','ADVISER_APPROVED'
);

do $$ begin
  if not exists (select 1 from pg_constraint where conname='profiles_approved_email_school_domain') then
    alter table public.profiles add constraint profiles_approved_email_school_domain
      check (approved_auth_email is null or approved_auth_email ~* '^[^@[:space:]]+@campbellhigh\.net$');
  end if;
end $$;

create table if not exists public.point_claims (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  point_category_id uuid not null references public.point_categories(id) on delete restrict,
  event_id uuid references public.events(id) on delete set null,
  activity_date date not null,
  quantity numeric(8,2) not null default 1 check (quantity > 0),
  member_description text not null check (char_length(btrim(member_description)) >= 10),
  evidence_url text,
  status text not null default 'submitted' check (status in ('submitted','under_review','approved','rejected','withdrawn')),
  calculated_points numeric(8,2),
  reviewer_notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  point_transaction_id uuid unique references public.point_transactions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists point_claims_member_year_idx on public.point_claims(member_id,academic_year_id,created_at desc);
create index if not exists point_claims_review_queue_idx on public.point_claims(academic_year_id,status,created_at);

drop trigger if exists set_updated_at on public.point_claims;
create trigger set_updated_at before update on public.point_claims for each row execute function public.set_updated_at();

alter table public.point_claims enable row level security;
grant select,insert,update on public.point_claims to authenticated;
grant all on public.point_claims to service_role;
drop policy if exists "members read own claims leadership read all" on public.point_claims;
create policy "members read own claims leadership read all" on public.point_claims for select to authenticated
  using (member_id=public.current_profile_id() or public.has_portal_role(array['executive_leadership','adviser','admin']));
drop policy if exists "members submit eligible own claims" on public.point_claims;
create policy "members submit eligible own claims" on public.point_claims for insert to authenticated
  with check (
    member_id=public.current_profile_id() and status='submitted' and
    exists(select 1 from public.point_categories pc where pc.id=point_category_id and pc.academic_year_id=academic_year_id and pc.self_reportable=true and pc.active=true)
  );
drop policy if exists "members withdraw pending own claims" on public.point_claims;
create policy "members withdraw pending own claims" on public.point_claims for update to authenticated
  using (member_id=public.current_profile_id() and status in ('submitted','under_review'))
  with check (member_id=public.current_profile_id() and status='withdrawn' and reviewed_by is null and point_transaction_id is null);
drop policy if exists "leadership reviews claims" on public.point_claims;
create policy "leadership reviews claims" on public.point_claims for all to authenticated
  using (public.has_portal_role(array['executive_leadership','adviser','admin']))
  with check (public.has_portal_role(array['executive_leadership','adviser','admin']));

create or replace function public.review_point_claim(
  p_claim_id uuid,
  p_actor_id uuid,
  p_decision text,
  p_verified_quantity numeric default null,
  p_reviewer_notes text default null
) returns jsonb language plpgsql security definer set search_path=public as $$
declare claim public.point_claims%rowtype; rule public.point_categories%rowtype; actor_role text; quantity numeric; amount numeric; transaction_id uuid; prior_count integer;
begin
  select account_role into actor_role from public.profiles where id=p_actor_id and approved=true and active=true;
  if actor_role is null or actor_role not in ('executive_leadership','adviser','admin') then raise exception 'Not authorized to review point claims'; end if;
  if p_decision not in ('under_review','approved','rejected') then raise exception 'Invalid point-claim decision'; end if;
  select * into claim from public.point_claims where id=p_claim_id for update;
  if not found then raise exception 'Point claim not found'; end if;
  if claim.status not in ('submitted','under_review') then raise exception 'Point claim has already been finalized'; end if;
  if p_decision in ('under_review','rejected') then
    update public.point_claims set status=p_decision,reviewed_by=p_actor_id,reviewed_at=now(),reviewer_notes=p_reviewer_notes where id=p_claim_id;
    insert into public.audit_log(actor_profile_id,action,entity_type,entity_id,academic_year_id,after_data)
      values(p_actor_id,'point_claim_'||p_decision,'point_claim',p_claim_id,claim.academic_year_id,jsonb_build_object('decision',p_decision,'reviewer_notes',p_reviewer_notes));
    return jsonb_build_object('status',p_decision);
  end if;
  select * into rule from public.point_categories where id=claim.point_category_id and academic_year_id=claim.academic_year_id and active=true and self_reportable=true;
  if not found then raise exception 'This point category is not eligible for member claims'; end if;
  quantity:=coalesce(p_verified_quantity,claim.quantity);
  if quantity<=0 then raise exception 'Verified quantity must be positive'; end if;
  amount:=case when rule.calculation_type='per_hour' then least(quantity*coalesce(rule.points_per_unit,0),coalesce(rule.max_points,999999)) else coalesce(rule.default_points,0) end;
  if amount<=0 then raise exception 'The selected point rule does not produce a positive award'; end if;
  if rule.max_occurrences is not null then
    select count(*) into prior_count from public.point_transactions where member_id=claim.member_id and academic_year_id=claim.academic_year_id and point_category_id=claim.point_category_id and status='approved' and points>0;
    if prior_count>=rule.max_occurrences then raise exception 'This member has already reached the category occurrence limit'; end if;
  end if;
  if claim.event_id is not null and exists(select 1 from public.point_transactions where member_id=claim.member_id and event_id=claim.event_id and point_category_id=claim.point_category_id and status='approved') then
    raise exception 'An approved award already exists for this member, event, and category';
  end if;
  insert into public.point_transactions(member_id,academic_year_id,point_category_id,event_id,transaction_type,points,quantity,status,source_type,source_reference,description,notes,created_by,approved_by,approved_at)
    values(claim.member_id,claim.academic_year_id,claim.point_category_id,claim.event_id,'earned',amount,quantity,'approved','member_claim','claim:'||claim.id::text,claim.member_description,p_reviewer_notes,claim.member_id,p_actor_id,now()) returning id into transaction_id;
  update public.point_claims set status='approved',quantity=quantity,calculated_points=amount,reviewed_by=p_actor_id,reviewed_at=now(),reviewer_notes=p_reviewer_notes,point_transaction_id=transaction_id where id=p_claim_id;
  insert into public.audit_log(actor_profile_id,action,entity_type,entity_id,academic_year_id,after_data)
    values(p_actor_id,'point_claim_approved','point_claim',p_claim_id,claim.academic_year_id,jsonb_build_object('transaction_id',transaction_id,'points',amount,'verified_quantity',quantity));
  return jsonb_build_object('status','approved','transactionId',transaction_id,'points',amount);
end $$;

revoke all on function public.review_point_claim(uuid,uuid,text,numeric,text) from public,anon,authenticated;
grant execute on function public.review_point_claim(uuid,uuid,text,numeric,text) to service_role;

-- Members may create correction requests for missed form attendance, but attendance itself
-- remains writable only by authorized staff and trusted integrations.
