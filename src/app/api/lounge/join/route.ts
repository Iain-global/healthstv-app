import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { tableId, socketId } = await req.json();

    if (!tableId || !socketId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const numericTableId = Number(tableId);

    // Clean up stale participants (no heartbeat in 45 seconds)
    const staleThreshold = new Date(Date.now() - 45000);
    await prisma.loungeParticipant.deleteMany({
      where: { updatedAt: { lt: staleThreshold } }
    });

    // Upsert participant
    await prisma.loungeParticipant.upsert({
      where: { socketId },
      update: { tableId: numericTableId, updatedAt: new Date() },
      create: { tableId: numericTableId, socketId, updatedAt: new Date() }
    });

    // Fetch existing participants at the table to initiate connections
    const peers = await prisma.loungeParticipant.findMany({
      where: { tableId: numericTableId, socketId: { not: socketId } }
    });

    return NextResponse.json({ success: true, peers: peers.map(p => p.socketId) });
  } catch (error) {
    console.error('Lounge Join Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

