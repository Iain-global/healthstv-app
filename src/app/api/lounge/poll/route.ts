import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const staleThreshold = new Date(Date.now() - 45000);
    const activeParticipants = await prisma.loungeParticipant.findMany({
      where: { updatedAt: { gte: staleThreshold } }
    });

    const tableCounts: Record<number, number> = {};
    for (const p of activeParticipants) {
      tableCounts[p.tableId] = (tableCounts[p.tableId] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      totalOnline: activeParticipants.length,
      tableCounts,
    });
  } catch (error) {
    console.error('Lounge Stats Error:', error);
    return NextResponse.json({ success: true, totalOnline: 0, tableCounts: {} });
  }
}

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

    // Get all active participants across the lounge
    const staleThreshold = new Date(Date.now() - 45000);
    const activeParticipants = await prisma.loungeParticipant.findMany({
      where: { updatedAt: { gte: staleThreshold } }
    });

    const tableCounts: Record<number, number> = {};
    for (const p of activeParticipants) {
      tableCounts[p.tableId] = (tableCounts[p.tableId] || 0) + 1;
    }

    // Get current active peers at this table
    const peers = activeParticipants
      .filter(p => p.tableId === numericTableId && p.socketId !== socketId)
      .map(p => p.socketId);

    return NextResponse.json({ 
      success: true, 
      signals: incomingSignals.map(s => ({
        senderId: s.senderId,
        type: s.type,
        payload: typeof s.payload === 'string' ? JSON.parse(s.payload) : s.payload
      })),
      peers,
      totalOnline: activeParticipants.length,
      tableCounts,
    });
  } catch (error) {
    console.error('Lounge Poll Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

