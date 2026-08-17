import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('adminAuth')?.value === 'true';
}

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: { organiser: true }
  });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, isApproved } = await req.json();
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updateData: any = {
      isApproved,
      status: isApproved ? 'ACTIVE' : 'PENDING'
    };

    if (isApproved && existing.pendingEdits) {
      const edits = existing.pendingEdits as any;
      Object.assign(updateData, edits);
      updateData.pendingEdits = null; // Clear pending edits
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData
    });
    return NextResponse.json(event);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get('id'));
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
