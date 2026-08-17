import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Opt out of caching
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = await prisma.securityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // limit to last 100 logs
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Logs GET error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
