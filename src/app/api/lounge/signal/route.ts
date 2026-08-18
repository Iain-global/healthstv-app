import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { senderId, receiverId, type, payload } = await req.json();

    if (!senderId || !receiverId || !payload) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify receiver is still active
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
        payload: JSON.stringify(payload)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lounge Signal Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
