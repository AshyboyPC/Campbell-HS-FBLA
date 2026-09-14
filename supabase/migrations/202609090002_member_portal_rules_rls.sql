-- Campbell FBLA 2026-2027 rules, ledger automation, policy engine, and RLS.

insert into public.academic_years(label,start_date,end_date,points_deadline,yearly_goal,is_active)
values ('2026-2027','2026-08-01','2027-07-31','2027-05-01',null,true)
on conflict (label) do update set points_deadline=excluded.points_deadline,yearly_goal=excluded.yearly_goal,is_active=true;

with ay as (select id from public.academic_years where label='2026-2027'), rules(code,name,description,group_name,calculation_type,default_points,points_per_unit,max_points,max_occurrences,repeatable,approval_required,attendance_generated,sort_order) as (values
 ('DUES','Membership dues','Join and pay annual FBLA dues. Current-year payment must be adviser verified.','Membership','fixed',50::numeric,null,null,1,false,true,false,10),
 ('CHAPTER_MEETING','Chapter meeting','Attend a Campbell FBLA chapter meeting.','Attendance','attendance',5,null,null,null,true,false,true,20),
 ('SOCIAL','Social event','Attend an FBLA social event.','Attendance','attendance',3,null,null,null,true,false,true,30),
 ('WORKSHOP','Workshop','Attend an FBLA workshop.','Career Development','attendance',3,null,null,null,true,false,true,40),
 ('COMP_STUDY','Competition study session','Attend a competitive-event study session.','Competition','attendance',3,null,null,null,true,false,true,50),
 ('BAA_CONTRIBUTOR','BAA Contributor Level','Complete the BAA Contributor Level.','Achievement','achievement',5,null,null,1,false,true,false,60),
 ('BAA_LEADER','BAA Leader Level','Complete the BAA Leader Level.','Achievement','achievement',8,null,null,1,false,true,false,61),
 ('BAA_ADVOCATE','BAA Advocate Level','Complete the BAA Advocate Level.','Achievement','achievement',10,null,null,1,false,true,false,62),
 ('BAA_CAPSTONE','BAA Capstone Level','Complete the BAA Capstone Level.','Achievement','achievement',15,null,null,1,false,true,false,63),
 ('CALLIS','Callis Foundation activity','Attend a Callis Foundation workshop or service event.','Service','attendance',10,null,null,null,true,true,true,70),
 ('SERVICE_HOURS','Service or fundraiser hours','Participate in an approved school/community service project or fundraiser activity.','Service','per_hour',null,2,10,null,true,true,true,80),
 ('RALLY_RLC_SLOTS','Rally, RLC, or SLOTS attendance','Attend Motivational Rally, Region Leadership Conference, or SLOTS.','Conferences','attendance',10,null,null,null,true,true,true,90),
 ('FLC_SLC_ATTEND','FLC or SLC attendance','Attend Fall Leadership Conference or State Leadership Conference.','Conferences','attendance',10,null,null,null,true,true,true,91),
 ('COMPETE','Competitive-event participation','Compete at FLC, RLC, SLC, or NLC.','Competition','achievement',15,null,null,null,true,true,false,100),
 ('RLC_TOP_10','RLC Top 10','Place in the Top 10 at RLC.','Competition','achievement',3,null,null,null,true,true,false,110),
 ('ADVANCE_SLC','Advance to SLC','Advance from regional competition to SLC.','Competition','achievement',5,null,null,null,true,true,false,111),
 ('SLC_TOP_10','SLC Top 10','Place in the Top 10 at SLC.','Competition','achievement',8,null,null,null,true,true,false,112),
 ('ADVANCE_NLC','Advance to NLC','Advance from state competition to NLC.','Competition','achievement',10,null,null,null,true,true,false,113),
 ('NLC_TOP_10','NLC Top 10','Place in the Top 10 at NLC.','Competition','achievement',15,null,null,null,true,true,false,114),
 ('NLC_ATTEND','National Leadership Conference attendance','Attend the National Leadership Conference.','Conferences','attendance',20,null,null,null,true,true,true,115),
 ('RECRUITMENT','Recruitment referral','Receive credit for an approved member recruitment referral.','Leadership','manual',3,null,null,null,true,true,false,120),
 ('OFFICER_APPLICATION','Officer application','Submit an officer application.','Leadership','manual',2,null,null,1,false,true,false,121),
 ('ADVISER_APPROVED','Adviser-approved duty','Complete another adviser-approved chapter duty.','Leadership','manual',3,null,null,null,true,true,false,122),
 ('OFFICER_ATTENDANCE_POLICY','Officer attendance policy adjustment','Cumulative officer attendance deduction or correction for the current school year.','Officer Accountability','penalty',null,null,null,null,true,true,false,900)
)
insert into public.point_categories(academic_year_id,code,name,description,group_name,calculation_type,default_points,points_per_unit,max_points,max_occurrences,repeatable,approval_required,attendance_generated,published,active,sort_order,source_document,source_version)
select ay.id,r.code,r.name,r.description,r.group_name,r.calculation_type,r.default_points,r.points_per_unit,r.max_points,r.max_occurrences,r.repeatable,r.approval_required,r.attendance_generated,(r.code <> 'OFFICER_ATTENDANCE_POLICY'),true,r.sort_order,'Campbell FBLA Points System','2025-2026 schedule confirmed unchanged for 2026-2027 on 2026-09-09' from ay cross join rules r
on conflict (academic_year_id,code) do update set name=excluded.name,description=excluded.description,group_name=excluded.group_name,calculation_type=excluded.calculation_type,default_points=excluded.default_points,points_per_unit=excluded.points_per_unit,max_points=excluded.max_points,max_occurrences=excluded.max_occurrences,repeatable=excluded.repeatable,approval_required=excluded.approval_required,attendance_generated=excluded.attendance_generated,published=excluded.published,active=true,sort_order=excluded.sort_order,source_document=excluded.source_document,source_version=excluded.source_version;

with ay as (select id from public.academic_years where label='2026-2027')
insert into public.graduation_requirements(academic_year_id,graduation_year,required_points,published,notes,source_document)
select ay.id,v.graduation_year,v.required_points,true,v.notes,'Campbell FBLA Points System; carried forward for 2026-2027' from ay cross join (values
 (2027,250,'Class of 2027'),(2028,375,'Class of 2028'),(2029,500,'Class of 2029 and beyond'),(2030,500,'Class of 2029 and beyond'),(2031,500,'Class of 2029 and beyond'),(2032,500,'Class of 2029 and beyond')
) v(graduation_year,required_points,notes)
on conflict (academic_year_id,graduation_year) do update set required_points=excluded.required_points,published=true,notes=excluded.notes,source_document=excluded.source_document;

with ay as (select id from public.academic_years where label='2026-2027'), t(threshold,deduction,action_type,label) as (values
 (1,-5,'written_warning','Written warning'),
 (3,-10,'probation','President / VP check-in + probation'),
 (5,-15,'performance_review','Adviser involvement + performance review'),
 (7,-20,'removal_review','Removal threshold reached — adviser / executive review required')
)
insert into public.officer_policy_thresholds(academic_year_id,threshold,cumulative_deduction,action_type,action_label,source_document,source_version)
select ay.id,t.threshold,t.deduction,t.action_type,t.label,'Campbell FBLA Officer Attendance Policy','Effective 2026-08-28' from ay cross join t
on conflict (academic_year_id,threshold,action_type) do update set cumulative_deduction=excluded.cumulative_deduction,action_label=excluded.action_label,active=true,source_document=excluded.source_document,source_version=excluded.source_version;

create or replace function public.current_profile_id() returns uuid language sql stable security definer set search_path=public as $$
  select id from public.profiles where auth_user_id=auth.uid() limit 1
$$;
create or replace function public.current_account_role() returns text language sql stable security definer set search_path=public as $$
  select account_role from public.profiles where auth_user_id=auth.uid() and approved=true and active=true limit 1
$$;
create or replace function public.has_portal_role(allowed text[]) returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_account_role() = any(allowed),false)
$$;

create or replace function public.link_approved_auth_profile()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  update public.profiles
  set auth_user_id=new.id,updated_at=now()
  where auth_user_id is null and approved=true and active=true
    and approved_auth_email is not null and lower(approved_auth_email)=lower(new.email);
  return new;
end $$;
drop trigger if exists link_approved_portal_profile on auth.users;
create trigger link_approved_portal_profile after insert or update of email on auth.users for each row execute function public.link_approved_auth_profile();

create or replace function public.link_existing_auth_user_from_profile()
returns trigger language plpgsql security definer set search_path=public,auth as $$
begin
  if new.auth_user_id is null and new.approved=true and new.active=true and new.approved_auth_email is not null then
    select id into new.auth_user_id from auth.users where lower(email)=lower(new.approved_auth_email) limit 1;
  end if;
  return new;
end $$;
drop trigger if exists profiles_link_existing_auth_user on public.profiles;
create trigger profiles_link_existing_auth_user before insert or update of approved_auth_email,approved,active on public.profiles for each row execute function public.link_existing_auth_user_from_profile();

create or replace function public.award_verified_attendance_points()
returns trigger language plpgsql security definer set search_path=public as $$
declare ev public.events%rowtype; rule public.point_categories%rowtype; desired numeric(8,2):=0; existing_total numeric(8,2):=0; delta numeric(8,2):=0; transaction_count integer:=0;
begin
  select * into ev from public.events where id=new.event_id;
  if ev.point_category_id is null then return new; end if;
  select * into rule from public.point_categories where id=ev.point_category_id and active=true;
  if not found or not rule.attendance_generated then return new; end if;
  if new.verified and new.status in ('present','late') then
    desired := coalesce(ev.point_override,case when rule.calculation_type='per_hour' then least(coalesce(new.service_hours,0)*coalesce(rule.points_per_unit,0),coalesce(rule.max_points,999999)) else rule.default_points end,0);
  end if;
  select coalesce(sum(points),0),count(*) into existing_total,transaction_count
    from public.point_transactions where member_attendance_id=new.id and point_category_id=rule.id and status='approved';
  delta:=desired-existing_total;
  if delta=0 then return new; end if;
  insert into public.point_transactions(member_id,academic_year_id,point_category_id,event_id,member_attendance_id,transaction_type,points,quantity,status,source_type,source_reference,description,notes,created_by,approved_by,approved_at)
  values(new.member_id,ev.academic_year_id,rule.id,ev.id,new.id,
    case when transaction_count=0 and delta>0 then 'earned' when delta<0 then 'reversal' else 'adjustment' end,
    delta,new.service_hours,'approved',new.source_type,
    case when transaction_count=0 then new.source_submission_id else 'attendance-adjustment:'||new.id::text||':'||gen_random_uuid()::text end,
    ev.title,
    case when transaction_count=0 then null else 'Attendance ledger recalculated from '||existing_total||' to '||desired end,
    new.verified_by,new.verified_by,coalesce(new.verified_at,now()));
  return new;
end $$;
drop trigger if exists member_attendance_award_points on public.member_attendance;
create trigger member_attendance_award_points after insert or update of verified,status,service_hours on public.member_attendance for each row execute function public.award_verified_attendance_points();

create or replace function public.recalculate_officer_attendance_policy(p_officer_id uuid,p_academic_year_id uuid,p_actor_id uuid default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare unexcused integer; required_total integer:=0; existing_total numeric:=0; delta numeric:=0; penalty_category uuid; reached_threshold integer:=0; row_action record;
begin
  select count(*) into unexcused from public.officer_attendance where officer_id=p_officer_id and academic_year_id=p_academic_year_id and status='unexcused_absence' and classified_at is not null;
  select cumulative_deduction,threshold into required_total,reached_threshold from public.officer_policy_thresholds where academic_year_id=p_academic_year_id and active=true and threshold<=unexcused order by threshold desc limit 1;
  required_total:=coalesce(required_total,0); reached_threshold:=coalesce(reached_threshold,0);
  select id into penalty_category from public.point_categories where academic_year_id=p_academic_year_id and code='OFFICER_ATTENDANCE_POLICY';
  if penalty_category is null then raise exception 'Officer policy point category is not configured'; end if;
  select coalesce(sum(points),0) into existing_total from public.point_transactions where member_id=p_officer_id and academic_year_id=p_academic_year_id and point_category_id=penalty_category and status='approved';
  delta:=required_total-existing_total;
  if delta<>0 then
    insert into public.point_transactions(member_id,academic_year_id,point_category_id,transaction_type,points,status,source_type,source_reference,description,notes,created_by,approved_by,approved_at)
    values(p_officer_id,p_academic_year_id,penalty_category,case when delta>0 then 'reversal' else 'penalty' end,delta,'approved','officer_policy',gen_random_uuid()::text,'Officer attendance policy recalculation','Required cumulative total '||required_total||'; previous active total '||existing_total,p_actor_id,p_actor_id,now());
  end if;
  for row_action in select * from public.officer_policy_thresholds where academic_year_id=p_academic_year_id and active=true loop
    insert into public.officer_accountability_actions(officer_id,academic_year_id,threshold,action_type,action_label,status,issued_by,issued_at,resolved_at)
    values(p_officer_id,p_academic_year_id,row_action.threshold,row_action.action_type,row_action.action_label,case when unexcused>=row_action.threshold then 'active' else 'rescinded' end,p_actor_id,case when unexcused>=row_action.threshold then now() else null end,case when unexcused<row_action.threshold then now() else null end)
    on conflict (officer_id,academic_year_id,threshold,action_type) do update set status=excluded.status,issued_by=coalesce(public.officer_accountability_actions.issued_by,excluded.issued_by),issued_at=coalesce(public.officer_accountability_actions.issued_at,excluded.issued_at),resolved_at=excluded.resolved_at,updated_at=now();
  end loop;
  insert into public.audit_log(actor_profile_id,action,entity_type,entity_id,academic_year_id,after_data)
  values(p_actor_id,'officer_policy_recalculated','profile',p_officer_id,p_academic_year_id,jsonb_build_object('unexcused',unexcused,'required_total',required_total,'existing_total',existing_total,'delta',delta,'removal_requires_human_review',unexcused>=7));
  return jsonb_build_object('unexcused',unexcused,'requiredTotal',required_total,'previousTotal',existing_total,'delta',delta,'threshold',reached_threshold,'removalRequiresHumanReview',unexcused>=7);
end $$;

create or replace function public.officer_policy_recalc_trigger()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  perform public.recalculate_officer_attendance_policy(coalesce(new.officer_id,old.officer_id),coalesce(new.academic_year_id,old.academic_year_id),coalesce(new.classified_by,old.classified_by));
  return coalesce(new,old);
end $$;
drop trigger if exists officer_attendance_policy_recalc_write on public.officer_attendance;
drop trigger if exists officer_attendance_policy_recalc_delete on public.officer_attendance;
create trigger officer_attendance_policy_recalc_write after insert or update of status,classified_at on public.officer_attendance for each row execute function public.officer_policy_recalc_trigger();
create trigger officer_attendance_policy_recalc_delete after delete on public.officer_attendance for each row execute function public.officer_policy_recalc_trigger();

create or replace view public.member_point_totals with (security_invoker=true) as
select p.id as member_id,ay.id as academic_year_id,ay.label as academic_year,
 coalesce(sum(pt.points) filter(where pt.status='approved'),0)::numeric(10,2) as official_points,
 coalesce(sum(pt.points) filter(where pt.status='approved' and pt.points>0),0)::numeric(10,2) as points_earned,
 coalesce(sum(pt.points) filter(where pt.status='approved' and pt.points<0),0)::numeric(10,2) as adjustments
from public.profiles p cross join public.academic_years ay left join public.point_transactions pt on pt.member_id=p.id and pt.academic_year_id=ay.id
group by p.id,ay.id,ay.label;

create or replace view public.leaderboard_safe with (security_invoker=true) as
select rank() over(partition by t.academic_year_id order by t.official_points desc) as rank,p.display_name,p.graduation_year,t.academic_year_id,t.official_points,g.required_points,
 case when g.required_points>0 then least(100,round((t.official_points/g.required_points)*100)) else null end as cord_progress
from public.member_point_totals t join public.profiles p on p.id=t.member_id left join public.graduation_requirements g on g.academic_year_id=t.academic_year_id and g.graduation_year=p.graduation_year and g.published=true
where p.approved=true and p.active=true and p.membership_status='active';

drop function if exists public.get_safe_leaderboard(uuid);
create function public.get_safe_leaderboard(p_academic_year_id uuid)
returns table(rank bigint,is_current_member boolean,display_name text,graduation_year integer,official_points numeric,required_points integer,cord_progress numeric)
language sql stable security definer set search_path=public as $$
  select rank() over(order by coalesce(sum(pt.points) filter(where pt.status='approved'),0) desc),
    p.id=public.current_profile_id(),p.display_name,p.graduation_year,
    coalesce(sum(pt.points) filter(where pt.status='approved'),0)::numeric as official_points,
    g.required_points,
    case when g.required_points>0 then least(100,round((coalesce(sum(pt.points) filter(where pt.status='approved'),0)/g.required_points)*100)) else null end
  from public.profiles p
  left join public.point_transactions pt on pt.member_id=p.id and pt.academic_year_id=p_academic_year_id
  left join public.graduation_requirements g on g.academic_year_id=p_academic_year_id and g.graduation_year=p.graduation_year and g.published=true
  where p.approved=true and p.active=true and p.membership_status='active' and public.current_profile_id() is not null
  group by p.id,p.display_name,p.graduation_year,g.required_points
  order by official_points desc,p.display_name asc
$$;

alter table public.academic_years enable row level security;
alter table public.profiles enable row level security;
alter table public.point_categories enable row level security;
alter table public.events enable row level security;
alter table public.member_attendance enable row level security;
alter table public.point_transactions enable row level security;
alter table public.attendance_imports enable row level security;
alter table public.import_batches enable row level security;
alter table public.external_identity_mappings enable row level security;
alter table public.teams_attendance_imports enable row level security;
alter table public.officer_attendance enable row level security;
alter table public.officer_absence_requests enable row level security;
alter table public.officer_policy_thresholds enable row level security;
alter table public.officer_accountability_actions enable row level security;
alter table public.correction_requests enable row level security;
alter table public.graduation_requirements enable row level security;
alter table public.audit_log enable row level security;

create policy "approved users read academic years" on public.academic_years for select to authenticated using (public.current_profile_id() is not null);
create policy "users read own profile staff read profiles" on public.profiles for select to authenticated using (id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "staff manage profiles" on public.profiles for all to authenticated using (public.has_portal_role(array['adviser','admin'])) with check (public.has_portal_role(array['adviser','admin']));
create policy "published rules or staff" on public.point_categories for select to authenticated using ((published and active) or public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "admin manages rules" on public.point_categories for all to authenticated using (public.has_portal_role(array['adviser','admin'])) with check (public.has_portal_role(array['adviser','admin']));
create policy "approved users read events" on public.events for select to authenticated using (active and public.current_profile_id() is not null);
create policy "leadership manages events" on public.events for all to authenticated using (public.has_portal_role(array['secretary','executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "own attendance or attendance staff" on public.member_attendance for select to authenticated using (member_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "attendance staff manage" on public.member_attendance for all to authenticated using (public.has_portal_role(array['secretary','executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "own ledger or staff" on public.point_transactions for select to authenticated using (member_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "authorized ledger writes" on public.point_transactions for all to authenticated using (public.has_portal_role(array['executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['executive_leadership','adviser','admin']));
create policy "own corrections or review staff" on public.correction_requests for select to authenticated using (member_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "members submit corrections" on public.correction_requests for insert to authenticated with check (member_id=public.current_profile_id());
create policy "staff review corrections" on public.correction_requests for update to authenticated using (public.has_portal_role(array['secretary','executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "officer reads own attendance staff read all" on public.officer_attendance for select to authenticated using (officer_id=public.current_profile_id() or public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "secretary staff manage officer attendance" on public.officer_attendance for all to authenticated using (public.has_portal_role(array['secretary','executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "officers read and create own absence requests" on public.officer_absence_requests for select to authenticated using (officer_id=public.current_profile_id() or public.has_portal_role(array['executive_leadership','adviser','admin']));
create policy "officers submit own absence requests" on public.officer_absence_requests for insert to authenticated with check (officer_id=public.current_profile_id() and status='pending');
create policy "leadership reviews absence requests" on public.officer_absence_requests for update to authenticated using (public.has_portal_role(array['executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['executive_leadership','adviser','admin']));
create policy "officers read own actions staff read all" on public.officer_accountability_actions for select to authenticated using (officer_id=public.current_profile_id() or public.has_portal_role(array['executive_leadership','adviser','admin']));
create policy "leadership manages actions" on public.officer_accountability_actions for all to authenticated using (public.has_portal_role(array['executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['executive_leadership','adviser','admin']));
create policy "approved users read published cord rules" on public.graduation_requirements for select to authenticated using (published or public.has_portal_role(array['adviser','admin']));
create policy "admin manages cord rules" on public.graduation_requirements for all to authenticated using (public.has_portal_role(array['adviser','admin'])) with check (public.has_portal_role(array['adviser','admin']));
create policy "approved users read officer thresholds" on public.officer_policy_thresholds for select to authenticated using (active and public.current_profile_id() is not null);
create policy "admin manages officer thresholds" on public.officer_policy_thresholds for all to authenticated using (public.has_portal_role(array['adviser','admin'])) with check (public.has_portal_role(array['adviser','admin']));
create policy "import staff only" on public.import_batches for all to authenticated using (public.has_portal_role(array['secretary','executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "raw attendance import staff only" on public.attendance_imports for all to authenticated using (public.has_portal_role(array['secretary','executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "external mappings staff only" on public.external_identity_mappings for all to authenticated using (public.has_portal_role(array['secretary','adviser','admin'])) with check (public.has_portal_role(array['secretary','adviser','admin']));
create policy "teams imports authorized only" on public.teams_attendance_imports for all to authenticated using (public.has_portal_role(array['secretary','executive_leadership','adviser','admin'])) with check (public.has_portal_role(array['secretary','executive_leadership','adviser','admin']));
create policy "audit adviser admin only" on public.audit_log for select to authenticated using (public.has_portal_role(array['adviser','admin']));

revoke all on function public.generate_member_id(integer) from public,anon,authenticated;
revoke all on function public.recalculate_officer_attendance_policy(uuid,uuid,uuid) from public,anon,authenticated;
grant execute on function public.recalculate_officer_attendance_policy(uuid,uuid,uuid) to service_role;
revoke all on function public.get_safe_leaderboard(uuid) from public,anon;
grant execute on function public.get_safe_leaderboard(uuid) to authenticated;
grant select on public.leaderboard_safe to authenticated;
grant select on public.member_point_totals to authenticated;
