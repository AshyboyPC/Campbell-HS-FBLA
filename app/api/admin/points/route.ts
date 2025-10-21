import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';
import { getServerSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Fetch user's entries
    const entriesSnap = await db
      .collection('points_entries')
      .where('userId', '==', userId)
      .limit(1000)
      .get();

    const entries = entriesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Fetch user's profile
    const profileSnap = await db.collection('profiles').doc(userId).get();
    const profile = profileSnap.exists ? { id: profileSnap.id, ...profileSnap.data() } : null;

    return NextResponse.json({ entries, profile });
  } catch (error) {
    console.error('GET /api/admin/points error', error);
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
    const entryId = searchParams.get('entryId');

    if (!entryId) {
      return NextResponse.json({ error: 'entryId required' }, { status: 400 });
    }

    await db.collection('points_entries').doc(entryId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/points error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, activityId, activityName, points, date, notes, hours } = body;

    if (!userId || !activityId || !activityName || points === undefined || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const entryDate = new Date(date);
    const schoolYear = getSchoolYear(entryDate);

    const payload = {
      userId,
      activityId,
      activityName,
      date: db.Timestamp.fromDate(entryDate),
      schoolYear,
      points: Number(points),
      hours: hours ? Number(hours) : undefined,
      notes: notes || '',
      createdAt: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('points_entries').add(payload);

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('POST /api/admin/points error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getSchoolYear(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return m < 4 || (m === 4 && d <= 1) ? y : y + 1;
}
