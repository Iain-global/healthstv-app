import FreeVideosClient from "./FreeVideosClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function FreeVideosPage() {
  const dbVideos = await prisma.video.findMany({
    where: { isApproved: true },
    include: { organiser: true },
    orderBy: { createdAt: 'desc' }
  });

  const serializedVideos = dbVideos.map(v => ({
    ...v,
    price: Number(v.price || 0),
  }));

  return (
    <div className="bg-[#f4f7f5] min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Introduction */}
        <div className="mb-8">
          <div className="mb-2">
            <span className="text-[#ea8125] font-bold text-sm">
              ★ Free & Premium Masterclasses
            </span>
          </div>
          <h1 className="text-4xl md:text-[2.4rem] font-black text-[#0c1c10] mb-2 leading-tight">
            Video Vault & Live Masterclass Replays
          </h1>
          <p className="text-[#5e6d62] text-lg max-w-[800px]">
            Watch full-length talks, preview trailers, and masterclasses from leading UK and international natural health summits.
          </p>
        </div>

        <FreeVideosClient initialVideos={serializedVideos} />
        
      </div>
    </div>
  );
}
