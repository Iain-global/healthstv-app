import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summit Organisers & Portals | HealthSummits.tv",
  description: "Browse verified wellness summit organisers, view upcoming virtual summits, and access interactive video menus."
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
            Platform Organisers
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Summit Organisers & Delegate Portals
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Explore dedicated portals for each summit organiser. Access delegate interactive video menus, upcoming virtual events, and free video vault lectures.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-12">
        {/* Featured Human Garage Interactive Presentation Banner */}
        <div className="bg-gradient-to-br from-[#0c1a11] via-[#132c1c] to-[#0a1f13] border-2 border-[#00873a]/40 rounded-3xl p-8 md:p-10 text-white shadow-[0_15px_40px_rgba(0,104,24,0.18)] mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00873a]/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#00873a]/30 border border-[#00873a]/50 text-[#86efac] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                Featured Delegate Summit Experience
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">
                Human Garage 5-Day Summit Portal
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                Launch the interactive video presentation allowing delegates to browse scene selections, keynote lectures, hands-on fascia therapy workshops, and cinematic 4K player.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/summit"
                  className="inline-flex items-center gap-3 bg-[#ea8125] hover:bg-[#d3701a] text-white px-8 py-4 rounded-xl text-lg font-black shadow-[0_6px_25px_rgba(234,129,37,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-orange-300/30"
                >
                  <span>🎬</span>
                  <span>Human Garage</span>
                  <span className="text-xs bg-black/30 px-2 py-0.5 rounded font-bold ml-1">Launch Menu</span>
                </Link>
                <Link
                  href="/organiser/human-garage"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl text-base font-bold border border-white/20 transition-all"
                >
                  <span>👤 View Organiser Page</span>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
              <div className="text-5xl mb-2">⚡</div>
              <div className="text-lg font-black text-white">Interactive Menu</div>
              <div className="text-xs text-slate-400 mt-1">Delegates Scene Selection</div>
            </div>
          </div>
        </div>

        {/* All Organisers Grid */}
        <h2 className="text-2xl font-black text-[#1f2e22] mb-6 flex items-center gap-2">
          <span>👥</span> Verified Summit Hosts & Organisers
        </h2>

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
                      <Image src={org.profilePhotoUrl} alt={org.name} fill className="object-cover" />
                    ) : (
                      org.avatarInitials || org.name.substring(0, 2).toUpperCase()
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
                  {org.name}
                </h3>
                {org.organization && (
                  <div className="text-xs font-bold text-[#00873a] mb-3">
                    {org.organization}
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
