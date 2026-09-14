-- Campbell FBLA 2026-2027 BAND roster and first-login onboarding.
-- Private roster source: authorized BAND audit collected 2026-09-07.

alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists band_display_name text;
alter table public.profiles add column if not exists primary_committee text;
alter table public.profiles add column if not exists roster_match_status text not null default 'pending';

do $$ begin
  if not exists(select 1 from pg_constraint where conname='profiles_roster_match_status_check') then
    alter table public.profiles add constraint profiles_roster_match_status_check
      check (roster_match_status in ('pending','known_member','pending_review','administrator','adviser'));
  end if;
end $$;

create table if not exists public.band_roster_members (
  id uuid primary key default gen_random_uuid(),
  roster_number integer not null unique,
  band_display_name text not null,
  canonical_name text not null,
  aliases text[] not null default '{}',
  grade_level text,
  roster_kind text not null default 'member' check (roster_kind in ('member','officer','adviser','shared')),
  officer_position text,
  active boolean not null default true,
  source_version text not null default 'BAND audit 2026-09-07',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.band_roster_members(roster_number,band_display_name,canonical_name,aliases,grade_level,roster_kind,officer_position)
values
 (1,'ashwindh ramesh','Ashwindh Ramesh',array['ashwindh ramesh'],null,'officer','Co-President'),
 (2,'Campbell FBLA','Campbell FBLA',array['campbell fbla','rachel anthony'],null,'adviser',null),
 (3,'CHS FBLA Officers','CHS FBLA Officers',array['chs fbla officers'],null,'shared',null),
 (4,'Mr. Gilliam','Mr. Gilliam',array['mr gilliam','gilliam'],null,'adviser',null),
 (5,'Xavier Thomas','Michael Xavier Thomas',array['xavier thomas','michael xavier thomas'],'11','officer','Co-President'),
 (6,'Aidan Lewis','Aidan Lewis',array['aidan lewis'],'11','member',null),
 (7,'Alexander Laroche','Alexander Laroche',array['alexander laroche','alex laroche'],'10','member',null),
 (8,'Anna Powolny','Anna Powolny',array['anna powolny'],null,'member',null),
 (9,'Ashton','Ashton Barnes',array['ashton','ashton barnes'],'9','member',null),
 (10,'Ayodeji','Ayodeji Rabiu',array['ayodeji','ayodeji rabiu'],'9','member',null),
 (11,'Ayomide Rabiu','Ayomide Rabiu',array['ayomide rabiu'],'12','member',null),
 (12,'Brylan Thaxter','Brylan Thaxter',array['brylan thaxter'],null,'member',null),
 (13,'Chase mandt','Charles Mandt',array['chase mandt','charles mandt'],'11','member',null),
 (14,'Chigozie Nwachukwu','Chigozie Nwachukwu',array['chigozie nwachukwu'],null,'member',null),
 (15,'Clifford taylor','Clifford Taylor',array['clifford taylor'],null,'member',null),
 (16,'Connor Amos','Connor Amos',array['connor amos'],null,'member',null),
 (17,'conor stewart','Conor Stewart',array['conor stewart'],'11','member',null),
 (18,'Danna','Danna',array['danna'],null,'member',null),
 (19,'Darshita Vemula','Darshita Vemula',array['darshita vemula'],'9','member',null),
 (20,'Dezzalynne','Dezzalynne Halliday',array['dezzalynne','dezzalynne halliday'],null,'officer','VP of Competitions'),
 (21,'Edward Elmgren','Edward J. Elmgren',array['edward elmgren','edward j elmgren'],'9','member',null),
 (22,'Faaris Sheikh','Faaris Sheikh',array['faaris sheikh'],'10','member',null),
 (23,'Garrett Hambrick','Garrett Hambrick',array['garrett hambrick'],null,'member',null),
 (24,'Harshad Premkumar','Harshad Premkumar',array['harshad premkumar'],null,'officer','Executive Vice President'),
 (25,'Jaden Davis','Jaden Davis',array['jaden davis'],null,'member',null),
 (26,'Jelani Otieno','Jelani Otieno',array['jelani otieno'],'10','member',null),
 (27,'Jeremiah','Jeremiah',array['jeremiah'],null,'member',null),
 (28,'Joelle Storey','Joelle Storey',array['joelle storey'],null,'member',null),
 (29,'Josiah Norton','Josiah Norton',array['josiah norton'],null,'member',null),
 (30,'Junaid Asif Abdul Kadar Jeilan','Junaid Asif Abdul Kadar Jeilan',array['junaid asif abdul kadar jeilan','junaid abdul'],'10','member',null),
 (31,'Kaitlynn~!','Kaitlynn Dixie',array['kaitlynn','kaitlynn dixie'],'9','member',null),
 (32,'Kano Okada','Kano Okada',array['kano okada'],null,'member',null),
 (33,'Katia Ochoa','Katia Ochoa',array['katia ochoa'],null,'member',null),
 (34,'Khloe','Khloe',array['khloe'],null,'member',null),
 (35,'Khush Patel','Khush Patel',array['khush patel'],'9','member',null),
 (36,'Kielle','Kielle',array['kielle'],'10','member',null),
 (37,'Liam Fry','Liam Fry',array['liam fry'],null,'member',null),
 (38,'Lucy Blair','Lucy Blair',array['lucy blair'],'9','member',null),
 (39,'Maddox Lewis','Maddox Lewis',array['maddox lewis'],null,'officer','Activities Director'),
 (40,'Madison','Madison Williams',array['madison','madison williams'],'10','member',null),
 (41,'Mahir','Mahir',array['mahir'],null,'member',null),
 (42,'Matthew elmgren','Matthew Elmgren',array['matthew elmgren'],null,'member',null),
 (43,'Miller Caselli','Miller Caselli',array['miller caselli'],'9','member',null),
 (44,'Munachi','Munachi Afulezi',array['munachi','munachi afulezi'],'12','member',null),
 (45,'Nick Johns','Nick Johns',array['nick johns'],null,'member',null),
 (46,'Ona Oli','Ona Oli',array['ona oli'],null,'member',null),
 (47,'prabhash pushpaj','Prabhash Pushpaj',array['prabhash pushpaj'],'10','member',null),
 (48,'Ranvijay Sharma','Ranvijay Sharma',array['ranvijay sharma'],null,'member',null),
 (49,'Rasya Thummalapenta','Rasya Thummalapenta',array['rasya thummalapenta'],'9','member',null),
 (50,'Reagan Rollinson','Reagan Rollinson',array['reagan rollinson'],'9','member',null),
 (51,'Riley Pace','Riley Pace',array['riley pace'],null,'member',null),
 (52,'Sage Williams','Sage Williams',array['sage williams'],'9','member',null),
 (53,'Sameeha Bello','Sameeha Bello',array['sameeha bello'],'10','member',null),
 (54,'Sean','Sean',array['sean'],null,'member',null),
 (55,'Shaarya Perera','Shaarya Perera',array['shaarya perera'],'12','member',null),
 (56,'Shalonda Hicks','Shalonda Hicks',array['shalonda hicks'],null,'member',null),
 (57,'Shekinah','Shekinah Hicks',array['shekinah','shekinah hicks'],'9','member',null),
 (58,'Simone Carter','Simone Carter',array['simone carter'],null,'member',null),
 (59,'Skye Solomon','Skye Solomon',array['skye solomon'],'9','member',null),
 (60,'Sophia','Sophia Chiodi',array['sophia','sophia chiodi'],'9','member',null),
 (61,'Sophia Roman','Sophia Roman',array['sophia roman'],null,'member',null),
 (62,'Sydney','Sydney',array['sydney'],null,'member',null),
 (63,'Thanush Muthukumaran','Thanush Muthukumaran',array['thanush muthukumaran'],'10','member',null),
 (64,'Vihaan Hariharan','Vihaan Hariharan',array['vihaan hariharan'],null,'officer','Treasurer'),
 (65,'Vince DePetro','Vince DePetro',array['vince depetro'],'9','member',null),
 (66,'vivaan reddy','Vivaan Bendishankara',array['vivaan reddy','vivaan bendishankara'],null,'officer','Secretary'),
 (67,'Yug Patel','Yug Patel',array['yug patel'],null,'member',null),
 (68,'Yusuf Sakho','Yusuf Sakho',array['yusuf sakho'],'11','member',null),
 (69,'Zach carter','Zachary Carter',array['zach carter','zachary carter'],'11','member',null)
on conflict (roster_number) do update set band_display_name=excluded.band_display_name,canonical_name=excluded.canonical_name,aliases=excluded.aliases,grade_level=excluded.grade_level,roster_kind=excluded.roster_kind,officer_position=excluded.officer_position,active=true,updated_at=now();

alter table public.band_roster_members enable row level security;
revoke all on public.band_roster_members from public,anon,authenticated;
grant all on public.band_roster_members to service_role;

alter table public.portal_access_allowlist drop constraint if exists portal_access_allowlist_account_role_check;
update public.portal_access_allowlist set account_role='adviser',display_name='Campbell FBLA Advisers',updated_at=now()
where email='fbla@campbellhigh.net';
alter table public.portal_access_allowlist add constraint portal_access_allowlist_account_role_check
  check (account_role in ('admin','adviser'));

update public.profiles set account_role='adviser',officer_position=null,roster_match_status='adviser',onboarding_completed=true,updated_at=now()
where lower(approved_auth_email)='fbla@campbellhigh.net';

update public.profiles set roster_match_status='administrator',onboarding_completed=true,approved=true,active=true,membership_status='active',updated_at=now()
where lower(approved_auth_email) in (
 'ashwindh.ramesh@campbellhigh.net','xavier.thomas@campbellhigh.net',
 'harshad.premkumar@campbellhigh.net','vivaan.bendishankara@campbellhigh.net'
);

create or replace function public.has_portal_role(allowed text[])
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_account_role() in ('admin','adviser') or public.current_account_role() = any(allowed),false)
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
    new.roster_match_status:=case when allowed.account_role='adviser' then 'adviser' else 'administrator' end;
  elsif new.account_role in ('secretary','executive_leadership','adviser','admin') then
    new.account_role:=case when new.officer_position is not null then 'officer' else 'member' end;
  end if;
  return new;
end $$;

drop trigger if exists profiles_enforce_portal_access on public.profiles;
create trigger profiles_enforce_portal_access before insert or update of approved_auth_email,account_role,officer_position
on public.profiles for each row execute function public.enforce_portal_access_allowlist();

-- Both named student administrators and the adviser account may verify claims.
create or replace function public.review_point_claim(p_claim_id uuid,p_actor_id uuid,p_decision text,p_verified_quantity numeric default null,p_reviewer_notes text default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare claim public.point_claims%rowtype; rule public.point_categories%rowtype; actor_role text; actor_email text; quantity numeric; amount numeric; transaction_id uuid; prior_count integer;
begin
  select p.account_role,lower(p.approved_auth_email) into actor_role,actor_email from public.profiles p where p.id=p_actor_id and p.approved=true and p.active=true;
  if actor_role is null or actor_role not in ('admin','adviser') or not exists(select 1 from public.portal_access_allowlist a where a.email=actor_email and a.account_role=actor_role and a.active=true) then raise exception 'Not authorized to review point claims'; end if;
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

notify pgrst,'reload schema';
