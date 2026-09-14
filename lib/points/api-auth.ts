import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUnlocked } from "@/lib/points/admin-unlock";

export async function requirePortalRole(roles:string[]){
 const supabase=await createSupabaseServerClient();const admin=createSupabaseAdminClient();
 if(!supabase||!admin)return {error:"Member Portal is not configured.",status:503} as const;
 const {data:{user}}=await supabase.auth.getUser();if(!user)return {error:"Sign in required.",status:401} as const;
 if(!user.email||!/^(?:[a-z0-9]+\.[a-z0-9]+|fbla)@campbellhigh\.net$/i.test(user.email))return {error:"A valid Campbell High School account is required.",status:403} as const;
 const {data:profile}=await admin.from("profiles").select("id,account_role,approved,active,membership_status").eq("auth_user_id",user.id).maybeSingle();
 const membershipAllowed=profile&&(["admin","adviser"].includes(profile.account_role)||profile.membership_status==="active");
 if(!profile?.approved||!profile.active||!membershipAllowed||!roles.includes(profile.account_role))return {error:"You do not have access to this action.",status:403} as const;
 if(["admin","adviser"].includes(profile.account_role)&&!(await isAdminUnlocked(user.id)))return {error:"Unlock the administrator area before making this change.",status:423} as const;
 const {data:year}=await admin.from("academic_years").select("id,label").eq("is_active",true).maybeSingle();if(!year)return {error:"Active academic year is not configured.",status:409} as const;
 return {supabase,admin,profile,year} as const;
}
