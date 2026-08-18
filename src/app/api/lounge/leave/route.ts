import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { socketId } = await req.json();

    if (!socketId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    await prisma.loungeParticipant.deleteMany({
      where: { socketId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lounge Leave Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
