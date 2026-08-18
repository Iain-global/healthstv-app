import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { tableId, socketId } = await req.json();

    if (!tableId || !socketId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Heartbeat update
    await prisma.loungeParticipant.updateMany({
      where: { socketId },
      data: { updatedAt: new Date() }
    });

    // Check for incoming signals
    const incomingSignals = await prisma.loungeSignal.findMany({
      where: { receiverId: socketId },
      orderBy: { createdAt: 'asc' }
    });

    // If we received them, delete them so we don't process them again
    if (incomingSignals.length > 0) {
      const signalIds = incomingSignals.map(s => s.id);
      await prisma.loungeSignal.deleteMany({
        where: { id: { in: signalIds } }
      });
    }

    // Also get current peers at table just in case someone new joined
    // (though new peers will usually send an offer directly)
    const peers = await prisma.loungeParticipant.findMany({
      where: { tableId, socketId: { not: socketId } }
    });

    return NextResponse.json({ 
      success: true, 
      signals: incomingSignals.map(s => ({
        senderId: s.senderId,
        type: s.type,
        payload: JSON.parse(s.payload)
      })),
      peers: peers.map(p => p.socketId)
    });
  } catch (error) {
    console.error('Lounge Poll Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
