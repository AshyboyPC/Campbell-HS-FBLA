import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUnlocked } from "@/lib/points/admin-unlock";

export async function requirePortalRole(roles:string[]){
 const supabase=await createSupabaseServerClient();const admin=createSupabaseAdminClient();
 if(!supabase||!admin)return {error:"Member Portal is not configured.",status:503} as const;
 const {data:{user}}=await supabase.auth.getUser();if(!user)return {error:"Sign in required.",status:401} as const;
 if(!user.email||!user.email_confirmed_at)return {error:"A verified personal email is required.",status:403} as const;
 const {data:profile}=await admin.from("profiles").select("id,account_role,approved,active,membership_status").eq("auth_user_id",user.id).maybeSingle();
 const membershipAllowed=profile&&(profile.account_role==="adviser"||profile.membership_status==="active");
 if(!profile?.approved||!profile.active||!membershipAllowed||!roles.includes(profile.account_role))return {error:"You do not have access to this action.",status:403} as const;
 if(profile.account_role==="adviser"&&!(await isAdminUnlocked(user.id)))return {error:"Unlock the adviser area before making this change.",status:423} as const;
 const {data:year}=await admin.from("academic_years").select("id,label").eq("is_active",true).maybeSingle();if(!year)return {error:"Active academic year is not configured.",status:409} as const;
 return {supabase,admin,profile,year} as const;
}
