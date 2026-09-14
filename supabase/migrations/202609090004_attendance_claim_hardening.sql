-- Campbell FBLA attendance and claim integrity hardening.
-- Regular attendance is provider-imported. Members may request a correction,
-- but only an authorized reviewer can create or change canonical attendance.

create unique index if not exists correction_requests_one_open_missing_attendance
  on public.correction_requests(member_id,event_id)
  where issue_type='Missing Attendance' and status in ('submitted','under_review');

create or replace function public.validate_member_point_claim()
returns trigger language plpgsql security definer set search_path=public as $$
declare member_ok boolean; category_ok boolean; event_ok boolean:=true; year_start date; year_end date;
begin
  select exists(
    select 1 from public.profiles p
    where p.id=new.member_id and p.approved=true and p.active=true and p.membership_status='active'
  ) into member_ok;
  if not member_ok then raise exception 'Point claims require an active approved member'; end if;

  select ay.start_date,ay.end_date into year_start,year_end
  from public.academic_years ay where ay.id=new.academic_year_id;
  if year_start is null or new.activity_date<year_start or new.activity_date>year_end then
    raise exception 'Claim date must fall inside its academic year';
  end if;

  select exists(
    select 1 from public.point_categories pc
    where pc.id=new.point_category_id and pc.academic_year_id=new.academic_year_id
      and pc.active=true and pc.published=true and pc.self_reportable=true
  ) into category_ok;
  if not category_ok then raise exception 'This category is not eligible for member self-reporting'; end if;

  if new.event_id is not null then
    select exists(
      select 1 from public.events e
      where e.id=new.event_id and e.academic_year_id=new.academic_year_id and e.active=true
    ) into event_ok;
  end if;
  if not event_ok then raise exception 'Claim event does not belong to the active academic year'; end if;
  return new;
end $$;

drop trigger if exists point_claims_validate_member_submission on public.point_claims;
create trigger point_claims_validate_member_submission
before insert or update of member_id,academic_year_id,point_category_id,event_id,activity_date
on public.point_claims for each row execute function public.validate_member_point_claim();

create or replace function public.validate_member_correction_request()
returns trigger language plpgsql security definer set search_path=public as $$
declare member_ok boolean; event_ok boolean:=true; year_start date; year_end date;
begin
  select exists(
    select 1 from public.profiles p
    where p.id=new.member_id and p.approved=true and p.active=true and p.membership_status='active'
  ) into member_ok;
  if not member_ok then raise exception 'Corrections require an active approved member'; end if;

  select ay.start_date,ay.end_date into year_start,year_end
  from public.academic_years ay where ay.id=new.academic_year_id;
  if year_start is null then raise exception 'Correction academic year does not exist'; end if;
  if new.activity_date is not null and (new.activity_date<year_start or new.activity_date>year_end) then
    raise exception 'Correction date must fall inside its academic year';
  end if;

  if new.event_id is not null then
    select exists(
      select 1 from public.events e
      where e.id=new.event_id and e.academic_year_id=new.academic_year_id and e.active=true
    ) into event_ok;
  end if;
  if not event_ok then raise exception 'Correction event does not belong to the active academic year'; end if;
  if new.issue_type in ('Missing Attendance','Incorrect Attendance') and new.event_id is null then
    raise exception 'Attendance corrections require a related event';
  end if;
  return new;
end $$;

drop trigger if exists correction_requests_validate_member_submission on public.correction_requests;
create trigger correction_requests_validate_member_submission
before insert or update of member_id,academic_year_id,event_id,activity_date,issue_type
on public.correction_requests for each row execute function public.validate_member_correction_request();

create or replace function public.resolve_attendance_correction(
  p_correction_id uuid,
  p_actor_id uuid,
  p_attendance_status text default 'present',
  p_service_hours numeric default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=public as $$
declare request_row public.correction_requests%rowtype; actor_role text; attendance_row public.member_attendance%rowtype; event_start timestamptz; now_value timestamptz:=now();
begin
  select account_role into actor_role from public.profiles
  where id=p_actor_id and approved=true and active=true;
  if actor_role is null or actor_role not in ('secretary','executive_leadership','adviser','admin') then
    raise exception 'Not authorized to resolve attendance corrections';
  end if;
  if p_attendance_status not in ('present','absent','late','excused','not_required','pending_review') then
    raise exception 'Invalid attendance status';
  end if;
  if p_service_hours is not null and p_service_hours<0 then raise exception 'Service hours cannot be negative'; end if;

  select * into request_row from public.correction_requests where id=p_correction_id for update;
  if not found then raise exception 'Correction request not found'; end if;
  if request_row.status not in ('submitted','under_review') then raise exception 'Correction request has already been finalized'; end if;
  if request_row.issue_type not in ('Missing Attendance','Incorrect Attendance') or request_row.event_id is null then
    raise exception 'This request is not an attendance correction';
  end if;
  select e.start_datetime into event_start from public.events e
  where e.id=request_row.event_id and e.academic_year_id=request_row.academic_year_id and e.active=true;
  if event_start is null then raise exception 'Correction event is not active in this academic year'; end if;
  if not exists(
    select 1 from public.profiles p
    where p.id=request_row.member_id and p.approved=true and p.active=true and p.membership_status='active'
  ) then raise exception 'Correction member is not active'; end if;

  select * into attendance_row from public.member_attendance
  where id=request_row.attendance_id or (event_id=request_row.event_id and member_id=request_row.member_id)
  order by (id=request_row.attendance_id) desc limit 1 for update;

  if attendance_row.id is null then
    insert into public.member_attendance(
      event_id,member_id,status,check_in_timestamp,source_type,verified,verified_by,verified_at,service_hours,review_reason,notes
    ) values(
      request_row.event_id,request_row.member_id,p_attendance_status,
      case when p_attendance_status in ('present','late') then event_start else null end,
      'manual',true,p_actor_id,now_value,p_service_hours,
      'Verified from missed form correction '||request_row.id::text,p_notes
    ) returning * into attendance_row;
  else
    update public.member_attendance set
      status=p_attendance_status,verified=true,verified_by=p_actor_id,verified_at=now_value,
      service_hours=coalesce(p_service_hours,service_hours),source_type='manual',
      review_reason='Verified from attendance correction '||request_row.id::text,notes=coalesce(p_notes,notes)
    where id=attendance_row.id returning * into attendance_row;
  end if;

  update public.correction_requests set
    attendance_id=attendance_row.id,status='resolved',reviewed_by=p_actor_id,
    review_notes=p_notes,resolved_at=now_value
  where id=request_row.id;

  insert into public.audit_log(actor_profile_id,action,entity_type,entity_id,academic_year_id,before_data,after_data)
  values(
    p_actor_id,'attendance_correction_resolved','correction_request',request_row.id,request_row.academic_year_id,
    to_jsonb(request_row),jsonb_build_object('attendance_id',attendance_row.id,'status',p_attendance_status,'verified',true)
  );
  return jsonb_build_object('status','resolved','attendanceId',attendance_row.id);
end $$;

revoke all on function public.resolve_attendance_correction(uuid,uuid,text,numeric,text) from public,anon,authenticated;
grant execute on function public.resolve_attendance_correction(uuid,uuid,text,numeric,text) to service_role;

-- Recreate claim review with member/event checks inside the same transaction.
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
  if not exists(select 1 from public.profiles p where p.id=claim.member_id and p.approved=true and p.active=true and p.membership_status='active') then raise exception 'Claim member is not active'; end if;
  if claim.event_id is not null and not exists(select 1 from public.events e where e.id=claim.event_id and e.academic_year_id=claim.academic_year_id and e.active=true) then raise exception 'Claim event is not active in this academic year'; end if;
  if p_decision in ('under_review','rejected') then
    update public.point_claims set status=p_decision,reviewed_by=p_actor_id,reviewed_at=now(),reviewer_notes=p_reviewer_notes where id=p_claim_id;
    insert into public.audit_log(actor_profile_id,action,entity_type,entity_id,academic_year_id,after_data)
      values(p_actor_id,'point_claim_'||p_decision,'point_claim',p_claim_id,claim.academic_year_id,jsonb_build_object('decision',p_decision,'reviewer_notes',p_reviewer_notes));
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
