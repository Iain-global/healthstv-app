import { prisma } from "@/lib/prisma";
import EventsClient from "./EventsClient";

export default async function EventsPage() {
  // Fetch all events from the database
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      organiser: true,
    }
  });

  const serializedEvents = events.map(event => ({
    ...event,
    price: Number(event.price),
  }));

  return (
    <div className="bg-[#fafcfb] min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#0c1c10] mb-4 font-heading">
            Health & Wellbeing Events
          </h1>
          <div className="w-16 h-1 bg-[#ea8125] mx-auto rounded mb-6"></div>
          <p className="text-[#5e6d62] max-w-2xl mx-auto text-lg font-body">
            Book virtual tickets to watch upcoming summits live, or grab instant access to recorded event replays.
          </p>
        </div>

        {/* Client component handles the search/filter state and renders the grid */}
        <EventsClient initialEvents={serializedEvents} />
      </div>
    </div>
  );
}
