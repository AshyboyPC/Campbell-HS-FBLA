-- Adviser profiles are oversight identities, not participating member records.
-- Student administrators remain eligible because their account_role is admin,
-- while only the dedicated adviser role is excluded.

create or replace view public.member_point_totals with (security_invoker=true) as
select p.id as member_id,ay.id as academic_year_id,ay.label as academic_year,
 coalesce(sum(pt.points) filter(where pt.status='approved'),0)::numeric(10,2) as official_points,
 coalesce(sum(pt.points) filter(where pt.status='approved' and pt.points>0),0)::numeric(10,2) as points_earned,
 coalesce(sum(pt.points) filter(where pt.status='approved' and pt.points<0),0)::numeric(10,2) as adjustments
from public.profiles p
cross join public.academic_years ay
left join public.point_transactions pt on pt.member_id=p.id and pt.academic_year_id=ay.id
where p.account_role <> 'adviser'
group by p.id,ay.id,ay.label;

create or replace view public.leaderboard_safe with (security_invoker=true) as
select rank() over(partition by t.academic_year_id order by t.official_points desc) as rank,
 p.display_name,p.graduation_year,t.academic_year_id,t.official_points,g.required_points,
 case when g.required_points>0 then least(100,round((t.official_points/g.required_points)*100)) else null end as cord_progress
from public.member_point_totals t
join public.profiles p on p.id=t.member_id
left join public.graduation_requirements g on g.academic_year_id=t.academic_year_id and g.graduation_year=p.graduation_year and g.published=true
where p.approved=true
  and p.active=true
  and p.membership_status='active'
  and p.account_role <> 'adviser';

create or replace function public.get_safe_leaderboard(p_academic_year_id uuid)
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
  where p.approved=true
    and p.active=true
    and p.membership_status='active'
    and p.account_role <> 'adviser'
    and public.current_profile_id() is not null
  group by p.id,p.display_name,p.graduation_year,g.required_points
  order by official_points desc,p.display_name;
$$;

revoke all on function public.get_safe_leaderboard(uuid) from public,anon;
grant execute on function public.get_safe_leaderboard(uuid) to authenticated;
grant select on public.leaderboard_safe to authenticated;
grant select on public.member_point_totals to authenticated;

create or replace function public.reject_adviser_member_activity()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if exists(select 1 from public.profiles where id=new.member_id and account_role='adviser') then
    raise exception 'Adviser accounts are oversight-only and cannot receive member activity.';
  end if;
  return new;
end;
$$;

drop trigger if exists reject_adviser_points on public.point_transactions;
create trigger reject_adviser_points before insert or update of member_id on public.point_transactions
for each row execute function public.reject_adviser_member_activity();

drop trigger if exists reject_adviser_attendance on public.member_attendance;
create trigger reject_adviser_attendance before insert or update of member_id on public.member_attendance
for each row execute function public.reject_adviser_member_activity();

drop trigger if exists reject_adviser_claims on public.point_claims;
create trigger reject_adviser_claims before insert or update of member_id on public.point_claims
for each row execute function public.reject_adviser_member_activity();

drop trigger if exists reject_adviser_corrections on public.correction_requests;
create trigger reject_adviser_corrections before insert or update of member_id on public.correction_requests
for each row execute function public.reject_adviser_member_activity();
