import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('userAuth');

    if (!authCookie || !authCookie.value) {
      return NextResponse.json({ error: 'Please sign in or create an account to purchase this video.' }, { status: 401 });
    }

    const userId = parseInt(authCookie.value, 10);
    const { videoId } = await req.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
    }

    const numVideoId = parseInt(videoId, 10);

    const video = await prisma.video.findUnique({
      where: { id: numVideoId }
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    if (video.isFree) {
      return NextResponse.json({ success: true, message: 'This video is free access.', alreadyUnlocked: true });
    }

    // TODO: Wire up live payment gateway (Stripe Checkout / PayPal webhook)
    // For now, record purchase directly in the database to grant access
    const purchase = await prisma.videoPurchase.upsert({
      where: {
        userId_videoId: {
          userId,
          videoId: numVideoId
        }
      },
      update: {
        status: 'COMPLETED',
        amount: video.price
      },
      create: {
        userId,
        videoId: numVideoId,
        amount: video.price,
        status: 'COMPLETED'
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully unlocked "${video.title}"!`,
      purchase
    });
  } catch (error) {
    console.error('Purchase Error:', error);
    return NextResponse.json({ error: 'Failed to process video purchase' }, { status: 500 });
  }
}