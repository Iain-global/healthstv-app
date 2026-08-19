import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider, email, name } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const defaultEmail = email ? email.trim().toLowerCase() : `${provider.toLowerCase()}_user_${Date.now()}@healthsummits.tv`;
    const defaultName = name ? name.trim() : (provider === 'google' ? 'Google Member' : 'Facebook Member');

    // Find existing user or create a new user
    let user = await prisma.user.findFirst({
      where: { email: defaultEmail }
    });

    if (!user) {
      // Create user
      user = await prisma.user.create({
        data: {
          email: defaultEmail,
          name: defaultName,
          password: crypto.randomBytes(16).toString('hex'), // Secure generated password
          role: 'USER',
          isSubscriber: false
        }
      });
    }

    // Set auth cookie
    const cookieStore = await cookies();
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
        isSubscriber: user.isSubscriber
      }
    });
  } catch (error) {
    console.error('Social Auth Error:', error);
    return NextResponse.json({ error: 'Failed to authenticate with social provider' }, { status: 500 });
  }
}