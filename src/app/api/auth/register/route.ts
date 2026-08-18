import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { name, email, password, telephone, addressLine1, addressLine2, city, postcode, country } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        telephone,
        addressLine1,
        addressLine2,
        city,
        postcode,
        country,
        username: email, // use email as username for now
        password, // In a real app, hash this!
        role: 'USER'
      }
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('userAuth', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
