import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';
import { getServerSession } from '@/lib/auth';

// Activity definitions and point rules
const ACTIVITIES = [
  { id: 'join_dues', name: 'Join & Pay Dues (by Oct 1)', type: 'fixed', points: 50 },
  { id: 'attend_meeting', name: 'Attend Chapter Meeting', type: 'fixed', points: 5 },
  { id: 'social_event', name: 'Attend FBLA Social Event', type: 'fixed', points: 3 },
  { id: 'workshop', name: 'Attend FBLA Workshop', type: 'fixed', points: 3 },
  { id: 'study_session', name: 'Attend Competitive Event Study Session', type: 'fixed', points: 3 },
  { id: 'baa_contributor', name: 'BAA Contributor Level', type: 'fixed', points: 5 },
  { id: 'baa_leader', name: 'BAA Leader Level', type: 'fixed', points: 8 },
  { id: 'baa_advocate', name: 'BAA Advocate Level', type: 'fixed', points: 10 },
  { id: 'baa_capstone', name: 'BAA Capstone Level', type: 'fixed', points: 15 },
  { id: 'callis_event', name: 'Attend Callis Foundation Workshop or Service Event', type: 'fixed', points: 10 },
  { id: 'service_project', name: 'Participate in School/Community Service Project/Fundraiser (2 pts/hr, 10 max)', type: 'hours', pointsPerHour: 2, max: 10 },
  { id: 'rally_rlc_slots', name: 'Attend Motivational Rally, RLC, or SLOTS', type: 'fixed', points: 10 },
  { id: 'flc_slc', name: 'Attend FLC or SLC', type: 'fixed', points: 10 },
  { id: 'compete_event', name: 'Compete in an event at FLC, RLC, SLC, or NLC', type: 'fixed', points: 15 },
  { id: 'top10_rlc', name: 'Top 10 at RLC', type: 'fixed', points: 3 },
  { id: 'advance_slc', name: 'Advance to SLC', type: 'fixed', points: 5 },
  { id: 'top10_slc', name: 'Top 10 at SLC', type: 'fixed', points: 8 },
  { id: 'advance_nlc', name: 'Advance to NLC', type: 'fixed', points: 10 },
  { id: 'top10_nlc', name: 'Top 10 at NLC', type: 'fixed', points: 15 },
  { id: 'attend_nlc', name: 'Attend National Leadership Conference', type: 'fixed', points: 20 },
  { id: 'recruitment_referrals', name: 'Recruitment Referrals', type: 'fixed', points: 3 },
  { id: 'submit_officer_application', name: 'Submit Officer Application', type: 'fixed', points: 2 },
  { id: 'other_duties', name: 'Other duties as assigned by Advisers (approved)', type: 'fixed', points: 3 },
] as const;

type ActivityId = typeof ACTIVITIES[number]['id'];

type AddEntryBody = {
  activityId: ActivityId;
  dateISO: string;
  hours?: number;
  notes?: string;
};

function getActivityById(id: string) {
  return ACTIVITIES.find((a) => a.id === id);
}

// Determine school year based on May 1st cutoff.
// Returns the calendar year of the May 1 deadline that the date falls under.
function getSchoolYear(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth(); // 0-based
  const day = date.getUTCDate();
  // If date is on/before May 1, it belongs to that year's school year
  if (month < 4 || (month === 4 && day <= 1)) {
    return year;
  }
  // Otherwise, it's the next year's May 1 deadline
  return year + 1;
}

function getOct1ForSchoolYear(schoolYear: number): Date {
  // Oct 1 that occurs before the May 1 cutoff (same academic year)
  // If schoolYear is 2026 (deadline May 1, 2026), Oct 1 is 2025-10-01
  return new Date(Date.UTC(schoolYear - 1, 9, 1)); // month 9 = October
}

export async function GET(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'activities') {
      return NextResponse.json({ activities: ACTIVITIES });
    }

    // Fetch all entries for the current user
    const snapshot = await db
      .collection('points_entries')
      .where('userId', '==', user.uid)
      .limit(500)
      .get();

    const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('GET /api/points error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = (await request.json()) as AddEntryBody;
    const activity = getActivityById(body.activityId);
    if (!activity) {
      return NextResponse.json({ error: 'Invalid activity' }, { status: 400 });
    }

    const date = new Date(body.dateISO);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const schoolYear = getSchoolYear(date);

    // Calculate points per rules
    let points = 0;
    if (activity.type === 'fixed') {
      points = (activity as { points: number }).points;
    } else if (activity.type === 'hours') {
      const hours = Math.max(0, Math.floor(Number(body.hours ?? 0)));
      const perHour = (activity as { pointsPerHour: number }).pointsPerHour;
      const max = (activity as { max: number }).max;
      points = Math.min(hours * perHour, max);
      if (hours <= 0) {
        return NextResponse.json({ error: 'Hours required for this activity' }, { status: 400 });
      }
    }

    // Enforce dues by Oct 1 rule and once-per-year for dues
    if (activity.id === 'join_dues') {
      const oct1 = getOct1ForSchoolYear(schoolYear);
      if (date.getTime() > oct1.getTime()) {
        return NextResponse.json({ error: 'Dues points only awarded if paid by Oct 1 of the school year.' }, { status: 400 });
      }
      const dedupKey = `${user.uid}_${activity.id}_${schoolYear}`;
      const dupSnap = await db
        .collection('points_entries')
        .where('userActivityYear', '==', dedupKey)
        .limit(1)
        .get();
      if (!dupSnap.empty) {
        return NextResponse.json({ error: 'Dues already recorded for this school year.' }, { status: 409 });
      }
    }

    const payload = {
      userId: user.uid,
      activityId: activity.id,
      activityName: activity.name,
      date: db.Timestamp.fromDate(date),
      schoolYear,
      points,
      hours: body.hours ? Math.floor(Number(body.hours)) : undefined,
      notes: body.notes ?? '',
      userActivityYear: activity.id === 'join_dues' ? `${user.uid}_${activity.id}_${schoolYear}` : undefined,
      createdAt: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    } as Record<string, unknown>;

    const docRef = await db.collection('points_entries').add(payload);

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('POST /api/points error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const docRef = db.collection('points_entries').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const data = doc.data() as { userId?: string };
    if (data.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/points error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
