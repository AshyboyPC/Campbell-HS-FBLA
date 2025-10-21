import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getServerSession();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const ref = db.collection('profiles').doc(user.uid);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ profile: null });
    return NextResponse.json({ profile: { id: snap.id, ...snap.data() } });
  } catch (e) {
    console.error('GET /api/profile error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { classYear } = body as { classYear?: number };
    if (!classYear || typeof classYear !== 'number') {
      return NextResponse.json({ error: 'classYear required' }, { status: 400 });
    }

    const ref = db.collection('profiles').doc(user.uid);
    const data = {
      userId: user.uid,
      classYear,
      updatedAt: db.FieldValue.serverTimestamp(),
      createdAt: db.FieldValue.serverTimestamp(),
    };
    // Upsert behavior
    await ref.set(data, { merge: true } as { merge: boolean });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('POST /api/profile error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
