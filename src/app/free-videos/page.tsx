import FreeVideosClient from "./FreeVideosClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function FreeVideosPage() {
  const dbVideos = await prisma.video.findMany({
    where: { isApproved: true },
    include: { organiser: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-[#f4f7f5] min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Introduction */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="bg-[#006818] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
              Official Vault
            </span>
            <span className="text-[#ea8125] font-bold text-sm">
              ★ 100% Free Public Access
            </span>
          </div>
          <h1 className="text-4xl md:text-[2.4rem] font-black text-[#0c1c10] mb-2 leading-tight">
            Free Video Vault & Live Replays
          </h1>
          <p className="text-[#5e6d62] text-lg max-w-[800px]">
            Watch full-length talks, preview trailers, and masterclasses from leading UK and international natural health summits without requiring a subscription.
          </p>
        </div>

        <FreeVideosClient initialVideos={dbVideos} />
        
      </div>
    </div>
  );
}
