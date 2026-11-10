-- Personal Google sign-in and role boundaries for the Campbell FBLA portal.
-- Members are matched by the exact email used in FBLA Connect. Officers may
-- review submitted claims; advisers alone manage rules, balances, and policy.

alter table public.profiles drop constraint if exists profiles_approved_email_school_domain;
alter table public.profiles drop constraint if exists profiles_approved_email_valid;
alter table public.profiles add constraint profiles_approved_email_valid
  check (approved_auth_email is null or approved_auth_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

alter table public.portal_access_allowlist drop constraint if exists portal_access_allowlist_email_check;
alter table public.portal_access_allowlist drop constraint if exists portal_access_allowlist_account_role_check;

update public.portal_access_allowlist
set account_role=case when officer_position is not null then 'officer' else 'adviser' end,
    updated_at=now()
where account_role in ('admin','secretary','executive_leadership');

alter table public.portal_access_allowlist
  add constraint portal_access_allowlist_email_check
  check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');
alter table public.portal_access_allowlist
  add constraint portal_access_allowlist_account_role_check
  check (account_role in ('officer','adviser'));

update public.profiles
set account_role=case when officer_position is not null then 'officer' else 'member' end,
    updated_at=now()
where account_role in ('admin','secretary','executive_leadership');

create or replace function public.has_portal_role(allowed text[])
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_account_role() = 'adviser' or public.current_account_role() = any(allowed),false)
$$;

create or replace function public.enforce_portal_access_allowlist()
returns trigger language plpgsql security definer set search_path=public as $$
declare allowed public.portal_access_allowlist%rowtype;
begin
  if new.approved_auth_email is not null then
    select * into allowed from public.portal_access_allowlist
    where email=lower(btrim(new.approved_auth_email)) and active=true;
  end if;
  if allowed.email is not null then
    new.account_role:=allowed.account_role;
    new.officer_position:=coalesce(allowed.officer_position,new.officer_position);
    new.approved:=true;
    new.active:=true;
    new.membership_status:='active';
    new.roster_match_status:=case when allowed.account_role='adviser' then 'adviser' else 'known_member' end;
  elsif new.account_role in ('secretary','executive_leadership','admin') then
    new.account_role:=case when new.officer_position is not null then 'officer' else 'member' end;
  end if;
  return new;
end $$;

drop trigger if exists profiles_enforce_portal_access on public.profiles;
create trigger profiles_enforce_portal_access
before insert or update of approved_auth_email,account_role,officer_position
on public.profiles for each row execute function public.enforce_portal_access_allowlist();

drop policy if exists "members read own claims leadership read all" on public.point_claims;
drop policy if exists "members read own claims officers review all" on public.point_claims;
create policy "members read own claims officers review all" on public.point_claims
for select to authenticated
using (member_id=public.current_profile_id() or public.has_portal_role(array['officer']));

create or replace function public.review_point_claim(
  p_claim_id uuid,
  p_actor_id uuid,
  p_decision text,
  p_verified_quantity numeric default null,
  p_reviewer_notes text default null
)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  claim public.point_claims%rowtype;
  rule public.point_categories%rowtype;
  actor_role text;
  quantity numeric;
  amount numeric;
  transaction_id uuid;
  prior_count integer;
begin
  select p.account_role into actor_role
  from public.profiles p
  where p.id=p_actor_id and p.approved=true and p.active=true;

  if actor_role not in ('officer','adviser') then
    raise exception 'Only officers and advisers may review point claims';
  end if;
  if p_decision not in ('under_review','approved','rejected') then
    raise exception 'Invalid point-claim decision';
  end if;

  select * into claim from public.point_claims where id=p_claim_id for update;
  if not found then raise exception 'Point claim not found'; end if;
  if claim.status not in ('submitted','under_review') then
    raise exception 'Point claim has already been finalized';
  end if;
  if not exists(
    select 1 from public.profiles p
    where p.id=claim.member_id and p.approved=true and p.active=true and p.membership_status='active'
  ) then raise exception 'Claim member is not active'; end if;

  if p_decision in ('under_review','rejected') then
    update public.point_claims
    set status=p_decision,reviewed_by=p_actor_id,reviewed_at=now(),reviewer_notes=p_reviewer_notes
    where id=p_claim_id;
    insert into public.audit_log(actor_profile_id,action,entity_type,entity_id,academic_year_id,after_data)
    values(p_actor_id,'point_claim_'||p_decision,'point_claim',p_claim_id,claim.academic_year_id,
      jsonb_build_object('decision',p_decision,'reviewer_notes',p_reviewer_notes));
    return jsonb_build_object('status',p_decision);
  end if;

  select * into rule from public.point_categories
  where id=claim.point_category_id and academic_year_id=claim.academic_year_id
    and active=true and published=true and self_reportable=true;
  if not found then raise exception 'This point category is not eligible for member claims'; end if;

  -- Officers approve exactly what the member submitted. Only an adviser may
  -- correct the verified quantity before approval.
  quantity:=case when actor_role='adviser' then coalesce(p_verified_quantity,claim.quantity) else claim.quantity end;
  if quantity<=0 then raise exception 'Verified quantity must be positive'; end if;
  amount:=case when rule.calculation_type='per_hour'
    then least(quantity*coalesce(rule.points_per_unit,0),coalesce(rule.max_points,999999))
    else coalesce(rule.default_points,0) end;
  if amount<=0 then raise exception 'The selected point rule does not produce a positive award'; end if;

  if rule.max_occurrences is not null then
    select count(*) into prior_count from public.point_transactions
    where member_id=claim.member_id and academic_year_id=claim.academic_year_id
      and point_category_id=claim.point_category_id and status='approved' and points>0;
    if prior_count>=rule.max_occurrences then
      raise exception 'This member has already reached the category occurrence limit';
    end if;
  end if;
  if claim.event_id is not null and exists(
    select 1 from public.point_transactions
    where member_id=claim.member_id and event_id=claim.event_id
      and point_category_id=claim.point_category_id and status='approved'
  ) then raise exception 'An approved award already exists for this member, event, and category'; end if;

  insert into public.point_transactions(
    member_id,academic_year_id,point_category_id,event_id,transaction_type,points,quantity,
    status,source_type,source_reference,description,notes,created_by,approved_by,approved_at
  ) values(
    claim.member_id,claim.academic_year_id,claim.point_category_id,claim.event_id,'earned',amount,quantity,
    'approved','member_claim','claim:'||claim.id::text,claim.member_description,p_reviewer_notes,
    claim.member_id,p_actor_id,now()
  ) returning id into transaction_id;

  update public.point_claims
  set status='approved',quantity=quantity,calculated_points=amount,reviewed_by=p_actor_id,
      reviewed_at=now(),reviewer_notes=p_reviewer_notes,point_transaction_id=transaction_id
  where id=p_claim_id;
  insert into public.audit_log(actor_profile_id,action,entity_type,entity_id,academic_year_id,after_data)
  values(p_actor_id,'point_claim_approved','point_claim',p_claim_id,claim.academic_year_id,
    jsonb_build_object('transaction_id',transaction_id,'points',amount,'verified_quantity',quantity));
  return jsonb_build_object('status','approved','transactionId',transaction_id,'points',amount);
end $$;

revoke all on function public.review_point_claim(uuid,uuid,text,numeric,text) from public,anon,authenticated;
grant execute on function public.review_point_claim(uuid,uuid,text,numeric,text) to service_role;

notify pgrst,'reload schema';
