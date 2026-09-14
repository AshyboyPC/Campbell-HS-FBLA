"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  ChevronRight,
  ClipboardCheck,
  Gauge,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { PortalSignOut } from "./portal-actions";

type PortalItem = { label: string; href: string; note: string };
type PortalGroup = {
  id: string;
  label: string;
  note: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  items: PortalItem[];
};

const recordItems: PortalItem[] = [
  { label: "Attendance", href: "/points/attendance", note: "Verified meetings and activities" },
  { label: "Point history", href: "/points/history", note: "Every official ledger entry" },
  { label: "Submit points", href: "/points/claims", note: "Send non-attendance work for review" },
  { label: "Corrections", href: "/points/corrections", note: "Report a missed sign-in or record issue" },
  { label: "Point rules", href: "/points/rules", note: "Published activities and cord targets" },
];

const officerItems: PortalItem[] = [
  { label: "My officer status", href: "/points/officer/status", note: "Private attendance and policy standing" },
  { label: "Absence request", href: "/points/officer/absence-request", note: "Advance notice and responsibility handoff" },
];

const managementItems: PortalItem[] = [
  { label: "Members", href: "/points/manage/members", note: "Roster and access requests" },
  { label: "Point review", href: "/points/manage/point-review", note: "Approve submitted point claims" },
  { label: "Events", href: "/points/manage/events", note: "Create events and open attendance" },
  { label: "Attendance review", href: "/points/manage/attendance-review", note: "Resolve exceptions and corrections" },
  { label: "Officer team", href: "/points/manage/officer-team", note: "Leadership roster and roles" },
  { label: "Officer attendance", href: "/points/manage/officer-attendance", note: "Classify officer meeting evidence" },
  { label: "Imports", href: "/points/manage/imports", note: "Bring in verified form exports" },
  { label: "Reports", href: "/points/manage/reports", note: "Authorized chapter CSV exports" },
];

const adminItems: PortalItem[] = [
  { label: "Admin overview", href: "/points/admin/dashboard", note: "Queues and portal health" },
  { label: "Point rules", href: "/points/admin/point-rules", note: "Configure activity values" },
  { label: "Cord rules", href: "/points/admin/cord-rules", note: "Graduation-class requirements" },
  { label: "Officer policy", href: "/points/admin/officer-policy", note: "Cumulative attendance deductions" },
  { label: "Integrations", href: "/points/admin/integrations", note: "Google, Microsoft, and Teams intake" },
  { label: "Audit log", href: "/points/admin/audit", note: "Administrative history" },
];

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalNavigation({
  adviser,
  staff,
  admin,
  officer,
  year,
  displayName,
  roleLabel,
}: {
  adviser: boolean;
  staff: boolean;
  admin: boolean;
  officer: boolean;
  year?: string;
  displayName: string;
  roleLabel: string;
}) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const groups: PortalGroup[] = [
    ...(!adviser
      ? [{ id: "record", label: "My record", note: "Points, attendance, and requests", icon: ClipboardCheck, items: recordItems }]
      : []),
    ...(officer
      ? [{ id: "officer", label: "Officer", note: "Status and advance notice", icon: UserRoundCheck, items: officerItems }]
      : []),
    ...(staff
      ? [{ id: "manage", label: "Chapter management", note: "Members, evidence, and reports", icon: ShieldCheck, items: managementItems }]
      : []),
    ...(admin
      ? [{ id: "admin", label: "Portal settings", note: "Rules, integrations, and audit", icon: Settings2, items: adminItems }]
      : []),
  ];

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleOpen = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openGroup === id) return;
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setOpenGroup(id), 65);
  };
  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenGroup(null), 170);
  };

  useEffect(() => {
    setOpenGroup(null);
    return clearTimers;
  }, [pathname]);

  return <aside className="portal-sidebar portal-sidebar-energy">
    <Link className="portal-brand" href={adviser ? "/points/admin/dashboard" : "/points/dashboard"}>
      <span>CF</span>
      <b>{adviser ? "Adviser Console" : "Member Portal"}<small>{year}</small></b>
    </Link>

    <nav className="portal-nav-stack" aria-label="Member Portal navigation">
      {!adviser && <>
        <Link className={`portal-nav-direct ${isPathActive(pathname, "/points/dashboard") ? "is-active" : ""}`} href="/points/dashboard">
          <LayoutDashboard size={18} strokeWidth={1.8}/><span><b>Dashboard</b><small>Your chapter snapshot</small></span><ChevronRight size={15}/>
        </Link>
        <Link className={`portal-nav-direct ${isPathActive(pathname, "/points/leaderboard") ? "is-active" : ""}`} href="/points/leaderboard">
          <BarChart3 size={18} strokeWidth={1.8}/><span><b>Leaderboard</b><small>Approved chapter totals</small></span><ChevronRight size={15}/>
        </Link>
      </>}

      {adviser && <Link className={`portal-nav-direct ${isPathActive(pathname, "/points/admin/dashboard") ? "is-active" : ""}`} href="/points/admin/dashboard">
        <Gauge size={18} strokeWidth={1.8}/><span><b>Overview</b><small>Portal queues and health</small></span><ChevronRight size={15}/>
      </Link>}

      {groups.map(group => {
        const active = group.items.some(item => isPathActive(pathname, item.href));
        const expanded = openGroup === group.id;
        const Icon = group.icon;
        return <div
          className={`portal-nav-cluster ${active ? "is-active" : ""} ${expanded ? "is-open" : ""}`}
          data-portal-group={group.id}
          key={group.id}
          onPointerEnter={() => scheduleOpen(group.id)}
          onPointerLeave={scheduleClose}
          onFocus={() => scheduleOpen(group.id)}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleClose(); }}
        >
          <button type="button" aria-expanded={expanded} aria-controls={`portal-flyout-${group.id}`} onClick={() => { clearTimers(); setOpenGroup(expanded ? null : group.id); }} onKeyDown={event => { if (event.key === "Escape") setOpenGroup(null); }}>
            <Icon size={18} strokeWidth={1.8}/><span><b>{group.label}</b><small>{group.note}</small></span><ChevronRight className="portal-nav-chevron" size={15}/>
          </button>
          <div id={`portal-flyout-${group.id}`} className="portal-nav-flyout" aria-hidden={!expanded}>
            <header><span>{group.label}</span><small>{group.note}</small></header>
            <div>{group.items.map((item, index) => <Link className={isPathActive(pathname, item.href) ? "is-active" : ""} href={item.href} key={item.href} tabIndex={expanded ? 0 : -1}>
              <i>{String(index + 1).padStart(2, "0")}</i><span><b>{item.label}</b><small>{item.note}</small></span><ChevronRight size={15}/>
            </Link>)}</div>
          </div>
        </div>;
      })}
    </nav>

    <div className="portal-user">
      <span>{displayName}</span>
      <small>{roleLabel}</small>
      <PortalSignOut/>
    </div>
  </aside>;
}
