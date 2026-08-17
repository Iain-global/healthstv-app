import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function OrganiserProfile({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const organiser = await prisma.organiserProfile.findUnique({
    where: { slug },
    include: {
      videos: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' }
      },
      events: {
        where: { status: 'ACTIVE' },
        orderBy: { date: 'asc' }
      }
    }
  });

  if (!organiser) {
    notFound();
  }

  return (
    <div className="bg-[#fafcfb] min-h-screen">
      {/* Hero Header */}
      <div className="bg-[#1f2e22] text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center text-4xl font-black shrink-0 border-4 border-white/20 overflow-hidden relative">
            {organiser.profilePhotoUrl ? (
              <Image src={organiser.profilePhotoUrl} alt={organiser.name} fill className="object-cover" />
            ) : (
              organiser.avatarInitials || organiser.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              {organiser.isFounding && <span className="bg-[#d93025] text-white text-xs px-3 py-1 rounded-full font-bold">Founding Organiser</span>}
              {organiser.isVerified && <span className="bg-[#00873a] text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">✓ Verified Host</span>}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">{organiser.name}</h1>
            {organiser.organization && <h2 className="text-xl text-[#00873a] font-bold mb-4">{organiser.organization}</h2>}
            <p className="text-gray-300 max-w-2xl leading-relaxed">
              {organiser.bio || `${organiser.name} is a leading health and wellness professional sharing their expertise on HealthSummits.tv.`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Upcoming Events */}
            <section>
              <h3 className="text-2xl font-black text-[#1f2e22] mb-6 flex items-center gap-2">
                <span>🗓️</span> Upcoming Virtual Summits
              </h3>
              {organiser.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {organiser.events.map(event => (
                    <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 bg-gray-100 relative">
                        {event.imageUrl ? (
                          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-4xl bg-[#1f2e22]/5">🎟️</div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1f2e22]">
                          {event.date}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="text-xs font-bold text-[#00873a] mb-2 uppercase tracking-wide">{event.format || 'Virtual Summit'}</div>
                        <h4 className="font-bold text-[#1f2e22] text-lg mb-2 line-clamp-2">{event.title}</h4>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="font-black text-lg">£{Number(event.price).toFixed(2)}</div>
                          {event.ticketUrl && (
                            <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="bg-[#d93025] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                              Book Tickets
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                  No upcoming virtual events scheduled at this time.
                </div>
              )}
            </section>

            {/* Video Vault */}
            <section>
              <h3 className="text-2xl font-black text-[#1f2e22] mb-6 flex items-center gap-2">
                <span>📺</span> Free Video Vault Lectures
              </h3>
              {organiser.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {organiser.videos.map(video => (
                    <Link href={`/player?v=${video.id}`} key={video.id} className="group flex flex-col">
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-black">
                        {video.thumbnailUrl && <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-[#d93025] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        {video.category && (
                          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                            {video.category}
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-[#1f2e22] line-clamp-2 group-hover:text-[#00873a] transition-colors">{video.title}</h4>
                      {video.description && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{video.description}</p>}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                  No free video lectures available currently.
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-black text-[#1f2e22] mb-4 border-b border-gray-100 pb-2">About the Organiser</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Joined Platform</span>
                  <span className="font-bold text-[#1f2e22]">2026</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Total Vault Videos</span>
                  <span className="font-bold text-[#1f2e22]">{organiser.videos.length} Lectures</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Upcoming Events</span>
                  <span className="font-bold text-[#1f2e22]">{organiser.events.length} Summits</span>
                </div>
                {organiser.website && (
                  <div className="pt-4 border-t border-gray-100">
                    <a href={organiser.website} target="_blank" rel="noopener noreferrer" className="text-[#00873a] font-bold hover:underline flex items-center gap-2">
                      🔗 Visit Official Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
