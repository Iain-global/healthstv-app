import { prisma } from "@/lib/prisma";
import PlayerClient from "./PlayerClient";
import { notFound } from "next/navigation";

export default async function PlayerPage() {
  // For demo, grab the first event
  const event = await prisma.event.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!event) {
    notFound();
  }

  // Serialize the decimal for the client
  const serializedEvent = {
    ...event,
    price: Number(event.price),
  };

  return (
    <div className="bg-[#0b1710] min-h-screen text-white pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-[1180px]">
        <PlayerClient event={serializedEvent} />
      </div>
    </div>
  );
}
