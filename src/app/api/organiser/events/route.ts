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
  
  const events = await prisma.event.findMany({ where: { organiserId: org.id }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const org = await getOrganiserProfile();
  if (!org) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await req.json();
  const event = await prisma.event.create({
    data: { ...data, organiserId: org.id, isApproved: false, status: "PENDING" },
    include: { organiser: true }
  });

  broadcastRealtimeEvent({
    type: 'event:submitted',
    eventId: event.id,
    title: event.title,
    organiserName: org.name,
    isEdit: false,
    event
  });

  return NextResponse.json(event);
}

export async function PUT(req: Request) {
  const org = await getOrganiserProfile();
  if (!org) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { id, ...data } = await req.json();
  const existingEvent = await prisma.event.findFirst({ where: { id, organiserId: org.id } });
  if (!existingEvent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let event;
  if (existingEvent.isApproved) {
    event = await prisma.event.update({
      where: { id },
      data: {
        pendingEdits: data
      },
      include: { organiser: true }
    });
  } else {
    event = await prisma.event.update({
      where: { id },
      data,
      include: { organiser: true }
    });
  }

  broadcastRealtimeEvent({
    type: 'event:submitted',
    eventId: event.id,
    title: data.title || event.title,
    organiserName: org.name,
    isEdit: true,
    event
  });

  return NextResponse.json(event);
}

export async function DELETE(req: Request) {
  const org = await getOrganiserProfile();
  if (!org) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const url = new URL(req.url);
  const id = Number(url.searchParams.get('id'));
  
  const exists = await prisma.event.findFirst({ where: { id, organiserId: org.id } });
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
