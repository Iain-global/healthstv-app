import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { tableId, socketId } = await req.json();

    if (!tableId || !socketId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const numericTableId = Number(tableId);

    // Heartbeat upsert to ensure participant is always alive in DB
    await prisma.loungeParticipant.upsert({
      where: { socketId },
      update: { tableId: numericTableId, updatedAt: new Date() },
      create: { tableId: numericTableId, socketId, updatedAt: new Date() }
    });

    // Check for incoming signals
    const incomingSignals = await prisma.loungeSignal.findMany({
      where: { receiverId: socketId },
      orderBy: { createdAt: 'asc' }
    });

    // Delete processed signals
    if (incomingSignals.length > 0) {
      const signalIds = incomingSignals.map(s => s.id);
      await prisma.loungeSignal.deleteMany({
        where: { id: { in: signalIds } }
      });
    }

    // Get current active peers at this table
    const peers = await prisma.loungeParticipant.findMany({
      where: { tableId: numericTableId, socketId: { not: socketId } }
    });

    return NextResponse.json({ 
      success: true, 
      signals: incomingSignals.map(s => ({
        senderId: s.senderId,
        type: s.type,
        payload: typeof s.payload === 'string' ? JSON.parse(s.payload) : s.payload
      })),
      peers: peers.map(p => p.socketId)
    });
  } catch (error) {
    console.error('Lounge Poll Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

