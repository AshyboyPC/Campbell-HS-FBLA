import { AdminUnlockForm } from "@/components/points/admin-unlock-form";
import { adminUnlockConfigured } from "@/lib/points/admin-unlock";
export const dynamic="force-dynamic";
export default function AdminUnlockPage(){return <div className="portal-admin-unlock"><AdminUnlockForm configured={adminUnlockConfigured()}/></div>}

