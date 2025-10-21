import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

const ADMIN_PASSWORD = 'chsfbla25';

export async function POST(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { password } = body as { password?: string };

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, isAdmin: true });
    } else {
      return NextResponse.json({ success: false, isAdmin: false, error: 'Incorrect password' }, { status: 401 });
    }
  } catch (error) {
    console.error('POST /api/admin/verify-password error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
