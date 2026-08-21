import LiveLoungeClient from "../live-lounge/LiveLoungeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Lounge | HealthSummits.tv",
  description: "Interactive Airmeet-style social lounge for health summits and conferences.",
};

export default function LoungePage() {
  return (
    <div className="min-h-screen bg-[#0d1519] text-white">
      <LiveLoungeClient />
    </div>
  );
}

