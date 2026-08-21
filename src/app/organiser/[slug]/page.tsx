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
      events: [
        {
          id: 101,
          title: 'Human Garage UK Tour: Fascial Alignment Workshop',
          format: 'Hybrid / In-Person London',
          description: 'Hands-on fascial unwinding maneuvers and practitioner certification.',
          date: '2026-10-18T10:00:00.000Z',
          location: 'London ExCeL & Virtual Live Stream',
          imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
          price: 49,
          ticketUrl: '#'
        }
      ],
      videos: [
        {
          id: 201,
          title: 'Introduction to Fascia & Lower Body Release',
          description: 'Essential fascial maneuvers for reducing tension and increasing mobility.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
          category: 'Free Lecture',
          isFree: true,
          price: 0
        },
        {
          id: 202,
          title: 'Master Practitioner 5-Day Summit Full Archive Pass',
          description: 'Lifetime access to all 5 days in 4K resolution with downloadable clinical guides.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
          category: 'Pay to View',
          isFree: false,
          price: 39
        }
      ]
    } as any;
  }

  if (!organiser && (slug === 'steve-pollard' || slug === 'stevepollard')) {
    organiser = {
      id: 998,
      userId: 998,
      slug: 'steve-pollard',
      name: 'Steve Pollard',
      organization: 'The Good Food Project',
      bio: 'Primary Sub-Niche: Other. The Good Food Project is an initiative for the people of the UK who want cleaner and more ethically sourced foods, sustainable regenerative agriculture, and holistic longevity.',
      website: 'https://healthsummits.tv',
      avatarInitials: 'ST',
      profilePhotoUrl: null,
      isVerified: true,
      isFounding: true,
      subscriptionPrice: 0,
      events: [
        {
          id: 301,
          title: 'The Good Food Summit 2026: UK National Tour',
          format: 'Hybrid / In-Person & Virtual Stream',
          description: 'A national gathering for ethical food sourcing, soil microbiome revitalization, and functional nutrition protocols.',
          date: '2026-10-15T09:30:00.000Z',
          location: 'London & High-Definition Live Stream',
          imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
          price: 45,
          ticketUrl: '#'
        },
        {
          id: 302,
          title: 'Regenerative Soil, Organic Farming & Nutrient Density Workshop',
          format: 'Live Virtual Masterclass',
          description: 'Discover how soil health directly dictates human cellular longevity and nutrient bioavailability.',
          date: '2026-11-22T14:00:00.000Z',
          location: 'Live Stream & Interactive Q&A',
          imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
          price: 25,
          ticketUrl: '#'
        },
        {
          id: 303,
          title: 'Cellular Longevity, Fasting Protocols & Food as Medicine',
          format: 'Free Live Webinar',
          description: 'Monthly open community roundtable on fasting windows, peptide supplementation, and clean nutrition.',
          date: '2026-12-05T18:00:00.000Z',
          location: 'HealthSummits.tv Live Stage',
          imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
          price: 0,
          ticketUrl: '#'
        }
      ],
      videos: [
        {
          id: 401,
          title: 'Keynote: Sourcing Clean Foods in the UK & Avoiding Chemical Load',
          description: 'A practical, evidence-based guide to navigating pesticides, microplastics, and ultra-processed food traps.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
          category: 'Free Lecture',
          isFree: true,
          price: 0
        },
        {
          id: 402,
          title: 'Mitochondrial Biology, ATP Pathways & Food Synergy Preview',
          description: 'Explore how targeted organic nutrient combinations supercharge ATP production and cellular repair.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
          category: 'Free Lecture',
          isFree: true,
          price: 0
        },
        {
          id: 403,
          title: 'The Good Food Project: Complete 5-Day Summit 4K Pass',
          description: 'Instant full access to all 5 Days (16 sessions) with downloadable audio tracks and practitioner slide decks.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
          category: 'Pay to View',
          isFree: false,
          price: 29
        },
        {
          id: 404,
          title: 'VIP Masterclass: Clinical Protocols & BHRT Hormone Replays',
          description: 'Advanced clinical sessions on bio-identical hormones, continuous glucose monitoring, and thyroid optimization.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
          category: 'Pay to View',
          isFree: false,
          price: 49
        }
      ]
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
