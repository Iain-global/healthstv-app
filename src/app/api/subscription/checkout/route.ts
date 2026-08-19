import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('userAuth');
    const body = await req.json();
    const { name, email, password } = body || {};

    let user: any = null;

    if (authCookie && authCookie.value) {
      const userId = parseInt(authCookie.value, 10);
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Please provide a valid email address to complete registration.' }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      user = await prisma.user.findUnique({ where: { email: cleanEmail } });

      if (!user) {
        // Create new subscriber user
        user = await prisma.user.create({
          data: {
            email: cleanEmail,
            name: name ? name.trim() : cleanEmail.split('@')[0],
            password: password && password.trim() ? password.trim() : crypto.randomBytes(8).toString('hex'),
            role: 'USER',
            isSubscriber: true
          }
        });
      }
    }

    // Set or upgrade user to Subscriber
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        isSubscriber: true
      }
    });

    // Set 30-day userAuth cookie
    cookieStore.set('userAuth', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isSubscriber: true
      }
    });
  } catch (error) {
    console.error('Subscription Checkout Error:', error);
    return NextResponse.json({ error: 'Failed to process subscription checkout.' }, { status: 500 });
  }
}
