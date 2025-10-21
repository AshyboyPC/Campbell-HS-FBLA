import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';
import { getServerSession } from '@/lib/auth';

function getSchoolYear(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return m < 4 || (m === 4 && d <= 1) ? y : y + 1;
}

export async function GET() {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Fetch all profiles
    const profilesSnap = await db.collection('profiles').get();
    const profiles = profilesSnap.docs.map(doc => ({
      userId: doc.id,
      ...doc.data()
    }));

    // Fetch all points entries
    const entriesSnap = await db.collection('points_entries').limit(10000).get();
    const entries = entriesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Group entries by user
    const userPoints: Record<string, any> = {};
    const currentSchoolYear = getSchoolYear(new Date());

    entries.forEach((entry: any) => {
      const userId = entry.userId;
      if (!userPoints[userId]) {
        userPoints[userId] = {
          userId,
          entries: [],
          yearTotal: 0,
          cumulativeTotal: 0
        };
      }
      userPoints[userId].entries.push(entry);
      userPoints[userId].cumulativeTotal += entry.points || 0;
      
      // Calculate year total
      let entryDate: Date;
      if (entry.date && typeof entry.date === 'object' && 'seconds' in entry.date) {
        entryDate = new Date(entry.date.seconds * 1000);
      } else if (entry.date) {
        entryDate = new Date(entry.date);
      } else {
        entryDate = new Date();
      }
      
      const schoolYear = getSchoolYear(entryDate);
      if (schoolYear === currentSchoolYear) {
        userPoints[userId].yearTotal += entry.points || 0;
      }
    });

    // Combine profiles with point data
    const usersData = profiles.map((profile: any) => {
      const pointsData = userPoints[profile.userId] || {
        entries: [],
        yearTotal: 0,
        cumulativeTotal: 0
      };

      return {
        userId: profile.userId,
        classYear: profile.classYear,
        yearTotal: pointsData.yearTotal,
        cumulativeTotal: pointsData.cumulativeTotal,
        entriesCount: pointsData.entries.length,
        updatedAt: profile.updatedAt
      };
    });

    // Also include users with points but no profile
    Object.keys(userPoints).forEach(userId => {
      if (!profiles.find((p: any) => p.userId === userId)) {
        usersData.push({
          userId,
          classYear: null,
          yearTotal: userPoints[userId].yearTotal,
          cumulativeTotal: userPoints[userId].cumulativeTotal,
          entriesCount: userPoints[userId].entries.length,
          updatedAt: null
        });
      }
    });

    return NextResponse.json({ users: usersData, currentSchoolYear });
  } catch (error) {
    console.error('GET /api/admin/users error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
