import { prisma } from "@/lib/prisma";
import PlayerClient from "./PlayerClient";
import { notFound } from "next/navigation";

export default async function PlayerPage() {
  // Grab latest event or default demo
  let event = await prisma.event.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const serializedEvent = event ? {
    ...event,
    price: Number(event.price),
    imageUrl: event.imageUrl || '/menopause-cafe.png'
  } : {
    id: 1,
    title: "Menopause Cafe' - Live Virtual Summit",
    description: "A Conversation with Dr Laura Jarvis, Specialty Doctor in Sexual and Reproductive Health.",
    date: "2027-01-23",
    endDate: "2027-01-23",
    startTime: "10:00",
    endTime: "16:00",
    location: "Online Stream",
    imageUrl: "/menopause-cafe.png",
    price: 10,
    isPriceFrom: false,
    ticketingMethod: "Internal Platform",
    ticketUrl: "https://healthv2.deploybox.uk/player",
    organiserId: 1,
    createdAt: new Date()
  };

  return (
    <div className="bg-[#0b1710] min-h-screen text-white pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-[1180px]">
        <PlayerClient event={serializedEvent} />
      </div>
    </div>
  );
}
