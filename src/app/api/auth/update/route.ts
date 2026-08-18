import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('userAuth');

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(authCookie.value, 10);
    const { name, telephone, addressLine1, addressLine2, city, postcode, country, password } = await req.json();

    const dataToUpdate: any = {
      name,
      telephone,
      addressLine1,
      addressLine2,
      city,
      postcode,
      country,
    };

    if (password && password.trim() !== '') {
      dataToUpdate.password = password; // In a real app, hash this!
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('userAuth');

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(authCookie.value, 10);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        telephone: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        postcode: true,
        country: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Fetch User Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
