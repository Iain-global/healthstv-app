import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { broadcastRealtimeEvent } from '@/lib/realtime';

async function getOrganiserProfile() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('organiserAuth');
  if (!auth) return null;
  return prisma.organiserProfile.findUnique({ where: { slug: auth.value } });
}

export async function GET() {
  const org = await getOrganiserProfile();
  if (!org) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const videos = await prisma.video.findMany({
    where: { organiserId: org.id },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(videos);
}

export async function POST(req: Request) {
  const org = await getOrganiserProfile();
  if (!org) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const isFree = data.isFree !== undefined ? Boolean(data.isFree) : true;
    const price = !isFree && data.price ? parseFloat(data.price) : 0;

    const video = await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        videoUrl: data.videoUrl,
        category: data.category,
        isFree,
        price,
        isApproved: false,
        organiserId: org.id
      },
      include: { organiser: true }
    });

    // Broadcast to Admin & Listeners
    broadcastRealtimeEvent({
      type: 'video:submitted',
      videoId: video.id,
      title: video.title,
      organiserName: org.name,
      isEdit: false,
      video
    });

    return NextResponse.json(video);
  } catch (err) {
    console.error('Error creating video:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const org = await getOrganiserProfile();
  if (!org) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const { id, ...updates } = data;

    const existingVideo = await prisma.video.findFirst({
      where: { id, organiserId: org.id }
    });

    if (!existingVideo) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const formattedUpdates: any = { ...updates };
    if (updates.isFree !== undefined) {
      formattedUpdates.isFree = Boolean(updates.isFree);
      if (!formattedUpdates.isFree && updates.price !== undefined) {
        formattedUpdates.price = parseFloat(updates.price) || 0;
      } else if (formattedUpdates.isFree) {
        formattedUpdates.price = 0;
      }
    }

    let video;
    if (existingVideo.isApproved) {
      // It's a live video, save edits to pendingEdits
      video = await prisma.video.update({
        where: { id },
        data: {
          pendingEdits: formattedUpdates
        },
        include: { organiser: true }
      });
    } else {
      // It's still pending, update fields directly
      video = await prisma.video.update({
        where: { id },
        data: formattedUpdates,
        include: { organiser: true }
      });
    }

    // Broadcast to Admin & Listeners
    broadcastRealtimeEvent({
      type: 'video:submitted',
      videoId: video.id,
      title: formattedUpdates.title || video.title,
      organiserName: org.name,
      isEdit: true,
      video
    });

    return NextResponse.json(video);
  } catch (err) {
    console.error('Error updating video:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const org = await getOrganiserProfile();
  if (!org) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const url = new URL(req.url);
  const id = Number(url.searchParams.get('id'));
  
  const exists = await prisma.video.findFirst({ where: { id, organiserId: org.id } });
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
