import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();

    // Check if user already exists
    const existingSnap = await db.collection('users').where('email', '==', emailLower).limit(1).get();

    if (!existingSnap.empty) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Create new user
    // In production, hash the password with bcrypt
    const userRef = await db.collection('users').add({
      email: emailLower,
      password, // In production: await bcrypt.hash(password, 10)
      displayName,
      createdAt: db.FieldValue.serverTimestamp(),
    });

    const user = {
      uid: userRef.id,
      email: emailLower,
      displayName,
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
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
