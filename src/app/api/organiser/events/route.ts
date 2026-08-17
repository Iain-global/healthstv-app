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
  const orgId = await getOrganiserId();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const events = await prisma.event.findMany({ where: { organiserId: orgId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const orgId = await getOrganiserId();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const data = await req.json();
  const event = await prisma.event.create({
    data: { ...data, organiserId: orgId, isApproved: false, status: "PENDING" }
  });
  return NextResponse.json(event);
}

export async function PUT(req: Request) {
  const orgId = await getOrganiserId();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { id, ...data } = await req.json();
  const existingEvent = await prisma.event.findFirst({ where: { id, organiserId: orgId } });
  if (!existingEvent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (existingEvent.isApproved) {
    const event = await prisma.event.update({
      where: { id },
      data: {
        pendingEdits: data
      }
    });
    return NextResponse.json(event);
  } else {
    const event = await prisma.event.update({
      where: { id },
      data
    });
    return NextResponse.json(event);
  }
}

export async function DELETE(req: Request) {
  const orgId = await getOrganiserId();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const url = new URL(req.url);
  const id = Number(url.searchParams.get('id'));
  
  const exists = await prisma.event.findFirst({ where: { id, organiserId: orgId } });
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
