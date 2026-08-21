import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organisers - Suppliers - Speakers | HealthSummits.tv",
  description: "Browse verified wellness summit organisers, industry suppliers, and keynote speakers."
};

export default async function OrganisersIndexPage() {
  const dbOrganisers = await prisma.organiserProfile.findMany({
    include: {
      _count: {
        select: {
          events: true,
          videos: true
        }
      }
    },
    orderBy: [
      { isFounding: 'desc' },
      { isVerified: 'desc' },
      { name: 'asc' }
    ]
  });

  // Ensure Human Garage is included in the list
  const hasHG = dbOrganisers.some(o => o.slug === 'human-garage');
  const baseOrganisers = hasHG ? dbOrganisers : [
    {
      id: 999,
      userId: 999,
      slug: 'human-garage',
      name: 'Human Garage',
      organization: 'Human Garage Global Summit',
      bio: 'Pioneering fascia release, motion therapy, and holistic biomechanics. Access the full 5-day interactive summit video master series, keynote lectures, and workshop presentations.',
      website: 'https://humangarage.net',
      avatarInitials: 'HG',
      profilePhotoUrl: null,
      isVerified: true,
      isFounding: true,
      subscriptionPrice: 0,
      _count: { events: 1, videos: 5 }
    },
    ...dbOrganisers
  ];

  // Put Founding Organisers first, then Verified, then Alphabetical
  const organisers = [...baseOrganisers].sort((a, b) => {
    if (a.isFounding && !b.isFounding) return -1;
    if (!a.isFounding && b.isFounding) return 1;
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="bg-[#fafcfb] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#1f2e22] text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <span className="bg-[#00873a] text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3">
            Platform Directory
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Organisers - Suppliers - Speakers
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Explore dedicated portals for organisers, industry suppliers, and keynote speakers. Access delegate interactive video menus, upcoming virtual events, and free video vault lectures.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-12">
        {/* All Organisers Grid */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1f2e22] flex items-center gap-2.5">
              <span>👥</span>
              <span>Verified Hosts, Suppliers & Speakers</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Select any profile below to access their official delegate portal and video sessions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organisers.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#00873a]/10 border border-[#00873a]/20 flex items-center justify-center text-xl font-black text-[#00873a] shrink-0 overflow-hidden relative">
                    {org.profilePhotoUrl ? (
                      <Image src={org.profilePhotoUrl} alt={org.organization || org.name} fill className="object-cover" />
                    ) : (
                      org.avatarInitials || (org.organization || org.name).substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {org.isFounding && (
                      <span className="bg-[#d93025] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                        Founding
                      </span>
                    )}
                    {org.isVerified && (
                      <span className="bg-[#00873a] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#1f2e22] group-hover:text-[#00873a] transition-colors mb-1">
                  {org.organization || org.name}
                </h3>
                {org.organization && org.name && (
                  <div className="text-xs font-bold text-[#00873a] mb-3">
                    {org.name}
                  </div>
                )}
                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-4">
                  {org.bio || "Leading summit organiser on HealthSummits.tv."}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <Link
                  href={`/organiser/${org.slug}`}
                  className="w-full text-center bg-[#00873a] hover:bg-[#007030] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>View Organiser Portal</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
