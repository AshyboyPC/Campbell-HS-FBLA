import { cookies } from 'next/headers';

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie?.value) {
      return null;
    }

    const user = JSON.parse(sessionCookie.value);
    return user;
  } catch (error) {
    return null;
  }
}
