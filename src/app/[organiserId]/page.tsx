import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

interface PageProps {
  params: Promise<{ organiserId: string }>;
}

export default async function OrganiserPublicPage({ params }: PageProps) {
  const { organiserId } = await params;
  
  const profile = await prisma.organiserProfile.findUnique({
    where: { slug: organiserId },
    include: {
      user: true,
      events: {
        orderBy: { createdAt: "desc" },
      }
    }
  });

  if (!profile) {
    notFound();
  }

  const { user } = profile;

  return (
    <div className="bg-[#fafcfb] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-[#006818] pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {profile.organization || profile.name}
          </h1>
          {profile.isVerified && (
            <span className="inline-flex items-center gap-1 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Verified Organiser
            </span>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 -mt-16 relative z-20">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,50,15,0.05)] border border-[#e0e8e2] p-8 mb-10">
          <h2 className="text-2xl font-bold text-[#0c1c10] mb-4">About the Organiser</h2>
          <div className="text-[#5e6d62] leading-relaxed whitespace-pre-wrap">
            {profile.bio || "No bio provided."}
          </div>
        </div>

        {/* Events List */}
        <div>
          <h2 className="text-3xl font-black text-[#0c1c10] mb-6 flex items-center gap-3">
            Upcoming & Past Events
            <span className="text-[#ea8125] text-lg font-bold bg-[#fff0e6] px-3 py-1 rounded-full">
              {profile.events.length}
            </span>
          </h2>

          {profile.events.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e0e8e2] p-10 text-center">
              <p className="text-[#5e6d62] text-lg">There are no published events from this organiser yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.events.map((event) => (
                <div key={event.id} className="bg-white border border-[#e0e8e2] rounded-xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,50,15,0.12)] transition-all hover:-translate-y-1">
                  <div className="h-48 bg-gradient-to-br from-[#006818] to-[#ea8125] p-6 flex flex-col justify-end text-white">
                    <div className="text-sm font-bold opacity-80 uppercase tracking-wider mb-1">
                      {event.date}
                    </div>
                    <h3 className="text-xl font-bold line-clamp-2 leading-tight">{event.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-[#5e6d62] text-sm line-clamp-3 mb-5">
                      {event.description}
                    </p>
                    <button className="w-full bg-[#eaf5eb] text-[#006818] font-bold py-2.5 rounded-lg hover:bg-[#006818] hover:text-white transition-colors">
                      View Event Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
