import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrganiserPortalClient from "./OrganiserPortalClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const organiser = await prisma.organiserProfile.findUnique({
    where: { slug },
    select: { name: true, organization: true }
  });

  const name = organiser?.name || (slug === 'human-garage' ? 'Human Garage' : 'Summit Organiser');
  return {
    title: `${name} | Organiser Portal & Video Presentation`,
    description: `Official delegate portal for ${name}. Access interactive summit presentations, video menu, and upcoming virtual events.`
  };
}

export default async function OrganiserProfile({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  let organiser = await prisma.organiserProfile.findUnique({
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

  if (!organiser && (slug === 'human-garage' || slug === 'humangarage')) {
    organiser = {
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
      events: [],
      videos: []
    } as any;
  }

  if (!organiser && (slug === 'steve-pollard' || slug === 'stevepollard')) {
    organiser = {
      id: 998,
      userId: 998,
      slug: 'steve-pollard',
      name: 'Steve Pollard',
      organization: 'Integrative Longevity & Health Summits',
      bio: 'Pioneering holistic wellness, cellular medicine, and multi-day health conferences. Access the complete interactive video presentation series with structured days, sessions, and chapter markers.',
      website: 'https://healthsummits.tv',
      avatarInitials: 'SP',
      profilePhotoUrl: null,
      isVerified: true,
      isFounding: true,
      subscriptionPrice: 0,
      events: [],
      videos: []
    } as any;
  }

  if (!organiser) {
    notFound();
  }

  // Serialize events and prices for client component
  const serializedOrganiser = JSON.parse(JSON.stringify({
    ...organiser,
    events: (organiser.events || []).map(e => ({
      ...e,
      price: Number(e.price || 0)
    })),
    videos: (organiser.videos || []).map(v => ({
      ...v,
      price: Number(v.price || 0)
    }))
  }));

  return <OrganiserPortalClient organiser={serializedOrganiser} />;
}
