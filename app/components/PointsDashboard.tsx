'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

type Entry = {
  id: string;
  userId: string;
  activityId: string;
  activityName: string;
  date: { seconds?: number; nanoseconds?: number } | string;
  schoolYear: number;
  points: number;
  hours?: number;
  notes?: string;
};

type Activity = {
  id: string;
  name: string;
  type: 'fixed' | 'hours';
  points?: number;
  pointsPerHour?: number;
  max?: number;
};

function tsToDate(ts: Entry['date']): Date {
  if (typeof ts === 'string') return new Date(ts);
  const seconds = (ts?.seconds ?? 0) as number;
  return new Date(seconds * 1000);
}

function getSchoolYear(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return m < 4 || (m === 4 && d <= 1) ? y : y + 1;
}

function classYearRequiredPoints(classYear?: number): number {
  if (!classYear) return 500; // default most strict
  if (classYear === 2026) return 125;
  if (classYear === 2027) return 250;
  if (classYear === 2028) return 375;
  return 500; // 2029 & beyond
}

export default function PointsDashboard() {
  const { isAuthenticated, user, signIn, signOut, loading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [classYear, setClassYear] = useState<number | undefined>();
  const [savingProfile, setSavingProfile] = useState(false);
  const [form, setForm] = useState<{ activityId: string; date: string; hours?: number; notes?: string }>({
    activityId: '',
    date: new Date().toISOString().slice(0, 10),
    hours: undefined,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load activities list
    fetch('/api/points?type=activities')
      .then((r) => r.json())
      .then((d) => setActivities(d.activities || []))
      .catch(() => {});
  }, []);

  const loadData = () => {
    // Profile
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => setClassYear(d?.profile?.classYear))
      .catch(() => {});
    // Entries
    fetch('/api/points')
      .then((r) => r.json())
      .then((d) => setEntries((d.entries || []) as Entry[]))
      .catch(() => {});
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const onSaveProfile = async () => {
    if (!classYear) return;
    setSavingProfile(true);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classYear }),
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const selectedActivity = activities.find((a) => a.id === form.activityId);
  const needsHours = selectedActivity?.id === 'service_project';

  const onSubmit = async () => {
    setError(null);
    if (!form.activityId || !form.date) {
      setError('Please select an activity and date.');
      return;
    }
    if (needsHours && (!form.hours || form.hours <= 0)) {
      setError('Please enter hours for this activity.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: form.activityId,
          dateISO: new Date(form.date + 'T00:00:00Z').toISOString(),
          hours: needsHours ? Number(form.hours) : undefined,
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to add entry.');
      } else {
        setForm({ activityId: '', date: new Date().toISOString().slice(0, 10), hours: undefined, notes: '' });
        loadData();
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: string) => {
    await fetch(`/api/points?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    loadData();
  };

  const currentSchoolYear = getSchoolYear(new Date());

  const { yearTotal, cumulativeTotal } = useMemo(() => {
    const totals = entries.reduce(
      (acc, e) => {
        const d = tsToDate(e.date);
        const sy = getSchoolYear(d);
        acc.cumulative += e.points || 0;
        if (sy === currentSchoolYear) acc.year += e.points || 0;
        return acc;
      },
      { year: 0, cumulative: 0 }
    );
    return { yearTotal: totals.year, cumulativeTotal: totals.cumulative };
  }, [entries, currentSchoolYear]);

  const required = classYearRequiredPoints(classYear);
  const eligibleThisYear = yearTotal >= 125;
  const cumulativeOK = cumulativeTotal >= required;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-[#00205B]/70">Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/70 backdrop-blur-md border border-[#003DA5]/15 p-8 text-center">
          <h1 className="text-2xl text-[#00205B] font-medium">Points Dashboard</h1>
          <p className="mt-2 text-sm text-[#00205B]/80">Sign in to track and manage your FBLA points.</p>
          <Link href="/login">
            <button className="mt-4 text-sm px-3 py-1.5 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A]">Sign In</button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/70 backdrop-blur-md border border-[#003DA5]/15 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl text-[#00205B] font-medium">Points Dashboard</h1>
            <p className="text-xs text-[#00205B]/70">School Year ending May 1, {currentSchoolYear}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#00205B]/70">{user?.displayName || user?.email}</span>
            <button onClick={signOut} className="text-xs px-2.5 py-1.5 rounded-md border border-[#003DA5]/20 text-[#00205B] hover:bg-[#003DA5]/10">Sign out</button>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#003DA5]/15 p-4 bg-white/50">
            <div className="flex items-center justify-between text-[#00205B]">
              <span className="text-sm">This Year</span>
              <Icon icon="mdi:calendar" width={18} />
            </div>
            <div className="mt-2 text-2xl text-[#00205B]">{yearTotal} pts</div>
            <div className="mt-1 h-2 w-full bg-[#003DA5]/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#003DA5]" style={{ width: `${Math.min(100, (yearTotal / 125) * 100)}%` }} />
            </div>
            <div className="mt-1.5 text-xs text-[#00205B]/70">Goal: 125 pts</div>
            <div className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${eligibleThisYear ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              <Icon icon={eligibleThisYear ? 'mdi:check-circle' : 'mdi:alert-circle'} width={16} />
              {eligibleThisYear ? 'On track for cord' : 'Not yet at 125'}
            </div>
          </div>

          <div className="rounded-xl border border-[#003DA5]/15 p-4 bg-white/50">
            <div className="flex items-center justify-between text-[#00205B]">
              <span className="text-sm">Cumulative</span>
              <Icon icon="mdi:trophy" width={18} />
            </div>
            <div className="mt-2 text-2xl text-[#00205B]">{cumulativeTotal} pts</div>
            <div className="mt-1 h-2 w-full bg-[#003DA5]/10 rounded-full overflow-hidden">
              <div className={`h-full ${cumulativeOK ? 'bg-[#003DA5]' : 'bg-[#FFC72C]'}`} style={{ width: `${Math.min(100, (cumulativeTotal / required) * 100)}%` }} />
            </div>
            <div className="mt-1.5 text-xs text-[#00205B]/70">Required by Class of {classYear || '____'}: {required} pts</div>
            <div className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${cumulativeOK ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              <Icon icon={cumulativeOK ? 'mdi:check-circle' : 'mdi:alert-circle'} width={16} />
              {cumulativeOK ? 'Meets cumulative requirement' : 'Not at required total'}
            </div>
          </div>

          <div className="rounded-xl border border-[#003DA5]/15 p-4 bg-white/50">
            <div className="text-sm text-[#00205B]">Profile</div>
            <div className="mt-2 text-xs text-[#00205B]/70">Set your graduation class year</div>
            <div className="mt-2 flex items-center gap-2">
              <select
                className="text-sm px-2 py-1.5 rounded-md border border-[#003DA5]/20 bg-white/70"
                value={classYear || ''}
                onChange={(e) => setClassYear(Number(e.target.value))}
              >
                <option value="" disabled>Select class year</option>
                {Array.from({ length: 8 }).map((_, i) => {
                  const y = 2025 + i;
                  return (
                    <option key={y} value={y}>Class of {y}</option>
                  );
                })}
              </select>
              <button onClick={onSaveProfile} disabled={!classYear || savingProfile} className="text-sm px-3 py-1.5 rounded-md bg-[#FFC72C] text-[#00205B] disabled:opacity-50">{savingProfile ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-[#00205B]">Add Activity</div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              <select
                className="text-sm px-2 py-1.5 rounded-md border border-[#003DA5]/20 bg-white/70"
                value={form.activityId}
                onChange={(e) => setForm((f) => ({ ...f, activityId: e.target.value }))}
              >
                <option value="" disabled>Select activity</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="text-sm px-2 py-1.5 rounded-md border border-[#003DA5]/20 bg-white/70 flex-1"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
                {needsHours && (
                  <input
                    type="number"
                    min={1}
                    className="text-sm px-2 py-1.5 rounded-md border border-[#003DA5]/20 bg-white/70 w-28"
                    placeholder="Hours"
                    value={form.hours ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, hours: Number(e.target.value) }))}
                  />
                )}
              </div>
              <input
                type="text"
                className="text-sm px-2 py-1.5 rounded-md border border-[#003DA5]/20 bg-white/70"
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
              {error && <div className="text-xs text-red-600">{error}</div>}
              <div className="flex gap-2">
                <button onClick={onSubmit} disabled={submitting} className="text-sm px-3 py-1.5 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A] disabled:opacity-50">{submitting ? 'Adding...' : 'Add Entry'}</button>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-[#00205B]">Your Entries</div>
            <div className="mt-2 space-y-2 max-h-[440px] overflow-auto pr-1">
              {entries.length === 0 && (
                <div className="text-xs text-[#00205B]/70">No entries yet.</div>
              )}
              {entries
                .slice()
                .sort((a, b) => tsToDate(b.date).getTime() - tsToDate(a.date).getTime())
                .map((e) => (
                  <motion.div key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-[#003DA5]/15 p-3 bg-white/60">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[#00205B]">{e.activityName}</div>
                      <button onClick={() => onDelete(e.id)} className="text-xs px-2 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50">Delete</button>
                    </div>
                    <div className="mt-1 text-xs text-[#00205B]/70 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><Icon icon="mdi:calendar" width={14} /> {tsToDate(e.date).toLocaleDateString()}</span>
                      <span className="inline-flex items-center gap-1"><Icon icon="mdi:school" width={14} /> SY {e.schoolYear}</span>
                      {typeof e.hours === 'number' && <span className="inline-flex items-center gap-1"><Icon icon="mdi:clock-outline" width={14} /> {e.hours}h</span>}
                      <span className="ml-auto inline-flex items-center gap-1 text-[#003DA5]"><Icon icon="mdi:star" width={14} /> {e.points} pts</span>
                    </div>
                    {e.notes && <div className="mt-1 text-xs text-[#00205B]/70">{e.notes}</div>}
                  </motion.div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-[#00205B]/70">
          Points must be earned by May 1st of every school year. Dues points are only awarded if paid by Oct 1 of the school year.
        </div>
      </motion.div>
    </div>
  );
}