import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, organization, website, niche, email, bio } = data;

    // Validate inputs
    if (!name || !email || !bio) {
      return NextResponse.json({ error: 'Name, email, and summary are required.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }

    // Generate slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.organiserProfile.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Default password (first name lowercase)
    const firstName = name.split(' ')[0].toLowerCase();

    // Combine niche into bio if provided
    const fullBio = niche ? `Primary Sub-Niche: ${niche}\n\n${bio}` : bio;

    // Create user and profile in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: firstName, // Set username to first name for the login challenge
          email,
          password: firstName, // Save as plain text for the current login challenge
          role: 'ORGANISER',
        }
      });

      await tx.organiserProfile.create({
        data: {
          userId: user.id,
          slug,
          name,
          organization: organization || null,
          website: website || null,
          bio: fullBio,
          isVerified: false,
          isFounding: true, // They applied via the "Founding Host" button
          subscriptionPrice: 0
        }
      });

      return user;
    });

    try {
      const { broadcastRealtimeEvent } = await import('@/lib/realtime');
      broadcastRealtimeEvent({
        type: 'organiser:applied',
        name,
        organization: organization || undefined,
        email
      });
    } catch (e) {
      console.warn('Realtime broadcast warning:', e);
    }

    return NextResponse.json({ success: true, userId: newUser.id });
  } catch (err) {
    console.error('Registration Error:', err);
    return NextResponse.json({ error: 'Failed to process registration.' }, { status: 500 });
  }
}
