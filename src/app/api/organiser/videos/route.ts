import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getOrganiserId() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('organiserAuth');
  if (!auth) return null;
  const org = await prisma.organiserProfile.findUnique({ where: { slug: auth.value } });
  return org?.id;
}

export async function GET() {
  const organiserId = await getOrganiserId();
  if (!organiserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const videos = await prisma.video.findMany({
    where: { organiserId },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(videos);
}

export async function POST(req: Request) {
  const organiserId = await getOrganiserId();
  if (!organiserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
        organiserId
      }
    });
    return NextResponse.json(video);
  } catch (err) {
    console.error('Error creating video:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const organiserId = await getOrganiserId();
  if (!organiserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const { id, ...updates } = data;

    const existingVideo = await prisma.video.findFirst({
      where: { id, organiserId }
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

    if (existingVideo.isApproved) {
      // It's a live video, save edits to pendingEdits
      const video = await prisma.video.update({
        where: { id },
        data: {
          pendingEdits: formattedUpdates
        }
      });
      return NextResponse.json(video);
    } else {
      // It's still pending, update fields directly
      const video = await prisma.video.update({
        where: { id },
        data: formattedUpdates
      });
      return NextResponse.json(video);
    }
  } catch (err) {
    console.error('Error updating video:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const orgId = await getOrganiserId();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const url = new URL(req.url);
  const id = Number(url.searchParams.get('id'));
  
  const exists = await prisma.video.findFirst({ where: { id, organiserId: orgId } });
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
