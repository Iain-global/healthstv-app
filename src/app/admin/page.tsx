import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

// Opt out of caching so admin is always fresh
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Fetch data needed for the admin dashboard
  
  const videos = await prisma.video.findMany({
    include: {
      organiser: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const organisers = await prisma.organiserProfile.findMany({
    include: {
      user: true
    },
    orderBy: { id: 'desc' }
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  // Convert decimal fields if any, or pass raw data to Client Component
  // Decimal is not serializable by default to Client Components in some Next.js versions,
  // but Prisma returns it as Decimal object.
  // Actually, Video model doesn't have Decimal. Event model does.
  // We are not fetching Events right now.

  const eventsRaw = await prisma.event.findMany({
    include: { organiser: true },
    orderBy: { createdAt: 'desc' }
  });

  const events = eventsRaw.map(e => ({
    ...e,
    price: e.price ? Number(e.price) : 0
  }));

  return (
    <div className="bg-[#f0f4f2] min-h-screen pb-20">
      <AdminClient 
        initialVideos={videos} 
        initialEvents={events}
        organisers={organisers} 
        users={users} 
      />
    </div>
  );
}
