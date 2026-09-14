import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_UNLOCK_COOKIE = "campbell_portal_admin_unlock";
const lifetimeSeconds = 30 * 60;
const secret = () => process.env.PORTAL_ADMIN_UNLOCK_SECRET || process.env.SUPABASE_SECRET_KEY || "";
const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");

export function adminUnlockConfigured() { return Boolean(process.env.PORTAL_ADMIN_PASSWORD && secret()); }
export function createAdminUnlockToken(userId: string) {
  const value = `${userId}.${Math.floor(Date.now()/1000)+lifetimeSeconds}`;
  return `${value}.${sign(value)}`;
}
export async function isAdminUnlocked(userId: string) {
  if (!adminUnlockConfigured()) return false;
  const token=(await cookies()).get(ADMIN_UNLOCK_COOKIE)?.value; if(!token)return false;
  const parts=token.split("."); if(parts.length!==3)return false;
  const [tokenUser,expires,signature]=parts; if(tokenUser!==userId||Number(expires)<Date.now()/1000)return false;
  const expected=sign(`${tokenUser}.${expires}`); const a=Buffer.from(signature);const b=Buffer.from(expected);
  return a.length===b.length&&timingSafeEqual(a,b);
}
export const adminUnlockMaxAge = lifetimeSeconds;
