import { Metadata } from "next";
import FoundingOffersClient from "./FoundingOffersClient";

export const metadata: Metadata = {
  title: "Founding Offers! | HealthSummits.tv",
  description:
    "Exclusive launch offers for Event Organisers, Company Profiles, and Keynote Speakers. First 5 sign-ups FREE (First Year Free), next 5 sign-ups 50% OFF.",
  openGraph: {
    title: "Founding Offers! | HealthSummits.tv",
    description:
      "Exclusive launch offers for Event Organisers, Company Profiles, and Keynote Speakers on HealthSummits.tv.",
  },
};

export default function FoundingOffersPage() {
  return <FoundingOffersClient />;
}
