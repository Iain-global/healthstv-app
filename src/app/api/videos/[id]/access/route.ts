import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const videoId = parseInt(id, 10);

    if (isNaN(videoId)) {
      return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        organiser: true
      }
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Check if video is free
    if (video.isFree) {
      return NextResponse.json({
        hasAccess: true,
        isFree: true,
        price: 0,
        isLoggedIn: false,
        isSubscriber: false
      });
    }

    // Check user authentication
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('userAuth');
    const organiserAuth = cookieStore.get('organiserAuth');
    const adminAuth = cookieStore.get('adminAuth');

    // Admin has access
    if (adminAuth?.value === 'true') {
      return NextResponse.json({
        hasAccess: true,
        isFree: false,
        price: Number(video.price),
        isLoggedIn: true,
        isAdmin: true
      });
    }

    // Organiser who owns the video has access
    if (organiserAuth?.value && video.organiser?.slug === organiserAuth.value) {
      return NextResponse.json({
        hasAccess: true,
        isFree: false,
        price: Number(video.price),
        isLoggedIn: true,
        isOwner: true
      });
    }

    // Check customer login
    if (!authCookie || !authCookie.value) {
      return NextResponse.json({
        hasAccess: false,
        isFree: false,
        price: Number(video.price),
        isLoggedIn: false
      });
    }

    const userId = parseInt(authCookie.value, 10);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        videoPurchases: {
          where: { videoId }
        }
      }
    });

    if (!user) {
      return NextResponse.json({
        hasAccess: false,
        isFree: false,
        price: Number(video.price),
        isLoggedIn: false
      });
    }

    const hasPurchased = user.videoPurchases.length > 0;
    const isSubscriber = Boolean(user.isSubscriber);
    const hasAccess = hasPurchased || isSubscriber;

    return NextResponse.json({
      hasAccess,
      isFree: false,
      price: Number(video.price),
      isLoggedIn: true,
      isSubscriber,
      hasPurchased,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Video Access Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}