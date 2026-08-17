import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getOrganiserId() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('organiserAuth');
  if (!auth) return null;
  const org = await prisma.organiserProfile.findUnique({
    where: { slug: auth.value },
  });
  return org?.id || null;
}

export async function POST(req: Request) {
  const organiserId = await getOrganiserId();
  if (!organiserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const { organization, bio, username, password, profilePhotoUrl, subscriptionPrice } = data;

    // Update Profile
    const org = await prisma.organiserProfile.update({
      where: { id: organiserId },
      data: {
        organization: organization,
        bio: bio,
        profilePhotoUrl: profilePhotoUrl,
        ...(subscriptionPrice !== undefined ? { subscriptionPrice: parseFloat(subscriptionPrice) } : {})
      },
      include: { user: true }
    });

    // Update User (username and password)
    const userUpdateData: any = {};
    if (username) userUpdateData.username = username;
    if (password) userUpdateData.password = password;

    if (Object.keys(userUpdateData).length > 0) {
      // Check if username is already taken by someone else
      if (username && username !== org.user.username) {
        const existing = await prisma.user.findFirst({ where: { username } });
        if (existing) {
          return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 });
        }
      }

      await prisma.user.update({
        where: { id: org.userId },
        data: userUpdateData
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('organiserAuth');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const org = await prisma.organiserProfile.findUnique({
    where: { slug: auth.value },
    include: { user: true }
  });

  if (!org) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({
    organization: org.organization,
    bio: org.bio,
    username: org.user.username,
    profilePhotoUrl: org.profilePhotoUrl,
    subscriptionPrice: org.subscriptionPrice,
  });
}
