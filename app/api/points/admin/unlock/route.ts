import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ADMIN_UNLOCK_COOKIE, adminUnlockConfigured, adminUnlockMaxAge, createAdminUnlockToken } from "@/lib/points/admin-unlock";

export async function POST(request: Request) {
  if(!adminUnlockConfigured())return NextResponse.json({error:"Set PORTAL_ADMIN_PASSWORD and PORTAL_ADMIN_UNLOCK_SECRET on the server first."},{status:503});
  const supabase=await createSupabaseServerClient();const admin=createSupabaseAdminClient();const {data:{user}}=supabase?await supabase.auth.getUser():{data:{user:null}};
  if(!user||!admin)return NextResponse.json({error:"Sign in required."},{status:401});
  const {data:profile}=await admin.from("profiles").select("account_role,approved,active").eq("auth_user_id",user.id).maybeSingle();
  if(!profile?.approved||!profile.active||profile.account_role!=="adviser")return NextResponse.json({error:"Adviser access is not assigned to this account."},{status:403});
  const body=await request.json().catch(()=>null);const supplied=String(body?.password||"");const expected=process.env.PORTAL_ADMIN_PASSWORD||"";
  const a=Buffer.from(supplied);const b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))return NextResponse.json({error:"That adviser password is incorrect."},{status:403});
  (await cookies()).set(ADMIN_UNLOCK_COOKIE,createAdminUnlockToken(user.id),{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:adminUnlockMaxAge});
  return NextResponse.json({ok:true,redirect:"/points/admin/dashboard"});
}
