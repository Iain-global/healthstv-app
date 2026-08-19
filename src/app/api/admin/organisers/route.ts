import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { broadcastRealtimeEvent } from '@/lib/realtime';

async function verifyAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('adminAuth')?.value === 'true';
}

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const organisers = await prisma.organiserProfile.findMany({
      include: { user: true },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(organisers);
  } catch (error) {
    console.error('Error fetching organisers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { id, isVerified } = data;

    if (!id || isVerified === undefined) {
      return NextResponse.json({ error: 'Missing required parameters (id, isVerified).' }, { status: 400 });
    }

    const existing = await prisma.organiserProfile.findUnique({
      where: { id: Number(id) },
      include: { user: true }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Organiser not found' }, { status: 404 });
    }

    const updated = await prisma.organiserProfile.update({
      where: { id: Number(id) },
      data: {
        isVerified: Boolean(isVerified)
      },
      include: { user: true }
    });

    // Broadcast real-time event
    try {
      broadcastRealtimeEvent({
        type: isVerified ? 'organiser:verified' : 'organiser:revoked',
        organiserId: updated.id,
        name: updated.name,
        slug: updated.slug
      });
    } catch (e) {
      console.warn('SSE broadcast warning:', e);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating organiser verification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;

    if (!id) {
      return NextResponse.json({ error: 'Missing organiser id' }, { status: 400 });
    }

    const existing = await prisma.organiserProfile.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Organiser not found' }, { status: 404 });
    }

    // Delete associated user which cascades to organiserProfile
    if (existing.userId) {
      await prisma.user.delete({
        where: { id: existing.userId }
      });
    } else {
      await prisma.organiserProfile.delete({
        where: { id }
      });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting organiser:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
