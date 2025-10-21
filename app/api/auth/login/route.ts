import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user by email
    const usersSnap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get();

    if (usersSnap.empty) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const userDoc = usersSnap.docs[0];
    const userData = userDoc.data() as any;

    // In production, use proper password hashing (bcrypt)
    // For now, simple comparison
    if (userData.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = {
      uid: userDoc.id,
      email: userData.email,
      displayName: userData.displayName,
    };

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
