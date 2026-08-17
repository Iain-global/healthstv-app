import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
          { username: username },
          { email: username },
          { organiserProfile: { slug: username } }
        ],
        role: 'ORGANISER'
      },
      include: { organiserProfile: true }
    });

    if (user && user.password === password) {
      if (!user.organiserProfile?.isVerified) {
        return NextResponse.json({ error: 'Account pending authorisation.' }, { status: 403 });
      }

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('organiserAuth', user.organiserProfile.slug, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return NextResponse.json({ success: true, slug: user.organiserProfile.slug });
    }

    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('organiserAuth');
  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('organiserAuth');
  if (auth && auth.value) {
    const org = await prisma.organiserProfile.findUnique({
      where: { slug: auth.value },
      include: { user: true }
    });
    if (org && org.isVerified) {
      return NextResponse.json({ authenticated: true, slug: org.slug, name: org.name });
    }
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
