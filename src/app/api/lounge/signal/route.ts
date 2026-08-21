import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { senderId, receiverId, type, payload } = await req.json();

    if (!senderId || !receiverId || !payload) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Ensure sender exists in DB
    await prisma.loungeParticipant.upsert({
      where: { socketId: senderId },
      update: { updatedAt: new Date() },
      create: { socketId: senderId, tableId: 1, updatedAt: new Date() }
    });

    // Ensure receiver exists in DB
    const receiver = await prisma.loungeParticipant.findUnique({
      where: { socketId: receiverId }
    });

    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    await prisma.loungeSignal.create({
      data: {
        senderId,
        receiverId,
        type: type || 'signal',
        payload: typeof payload === 'string' ? payload : JSON.stringify(payload)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lounge Signal Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

