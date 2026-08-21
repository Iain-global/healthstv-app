import LiveLoungeClient from "./LiveLoungeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Lounge | HealthSummits.tv",
  description:
    "Interactive Airmeet-style live social networking lounge for health summits, medical conferences, keynote Q&As, and delegate networking.",
};

export default function LiveLoungePage() {
  return (
    <div className="min-h-screen bg-[#0d1519] text-white">
      <LiveLoungeClient />
    </div>
  );
}
