import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists (case-insensitive email)
    const user = await prisma.user.findFirst({
      where: { 
        email: cleanEmail
      }
    });

    if (user && user.password === password) {
      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('userAuth', user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return NextResponse.json({ success: true, userId: user.id });
    }

    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
