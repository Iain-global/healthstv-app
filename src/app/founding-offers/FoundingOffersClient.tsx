"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Building2,
  Mic2,
  Users,
  Video,
  Ticket,
  DollarSign,
  Award,
  Zap,
  Globe,
  Radio,
  Clock,
  HelpCircle,
} from "lucide-react";

type OfferCategory = "all" | "organisers" | "companies" | "speakers";

interface OfferCardProps {
  categoryName: string;
  tierTitle: string;
  discountType: "FREE" | "50% OFF";
  description: string;
  savings: string;
  badge: "FIRST YEAR FREE" | "FIRST YEAR DISCOUNT";
  theme: "orange" | "green";
  onSelect: () => void;
}

function OfferCard({
  categoryName,
  tierTitle,
  discountType,
  description,
  savings,
  badge,
  theme,
  onSelect,
}: OfferCardProps) {
  const isOrange = theme === "orange";

  return (
    <div
      className={`relative bg-white rounded-3xl p-7 md:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${
        isOrange
          ? "border-[#f6821f]/50 hover:border-[#f6821f] shadow-[0_8px_30px_rgba(246,130,31,0.08)]"
          : "border-[#00873a]/40 hover:border-[#00873a] shadow-[0_8px_30px_rgba(0,135,58,0.08)]"
      }`}
    >
      <div>
        {/* Top Row: Icon Badge */}
        <div className="flex items-center justify-between mb-5">
          {isOrange ? (
            <div className="w-12 h-12 rounded-xl bg-[#f6821f] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Star className="w-6 h-6 fill-white stroke-white" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#00873a] shadow-sm">
              <Calendar className="w-6 h-6 stroke-[#00873a]" />
            </div>
          )}

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              isOrange
                ? "bg-orange-50 text-[#f6821f] border border-orange-200"
                : "bg-emerald-50 text-[#00873a] border border-emerald-200"
            }`}
          >
            {isOrange ? "⭐ 5 Spots Only" : "🗓️ 5 Spots Only"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-[#1f2e22] mb-1 tracking-tight">
          {tierTitle}
        </h3>

        {/* Highlight Price */}
        <div
          className={`text-4xl md:text-5xl font-black mb-4 tracking-tight ${
            isOrange ? "text-[#f6821f]" : "text-[#00873a]"
          }`}
        >
          {discountType}
        </div>

        {/* Description */}
        <p className="text-[#55695b] text-[1.02rem] leading-relaxed mb-6 font-normal">
          {description}
        </p>
      </div>

      {/* Footer / Savings / CTA */}
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div
            className={`font-black text-lg md:text-xl ${
              isOrange ? "text-[#f6821f]" : "text-[#00873a]"
            }`}
          >
            {savings}
          </div>
          <div
            className={`text-xs font-black tracking-widest uppercase ${
              isOrange ? "text-[#f6821f]" : "text-[#00873a]"
            }`}
          >
            {badge}
          </div>
        </div>

        <button
          onClick={onSelect}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            isOrange
              ? "bg-[#f6821f] hover:bg-[#df6e10] text-white hover:shadow-orange-500/30"
              : "bg-[#00873a] hover:bg-[#006e2e] text-white hover:shadow-emerald-600/30"
          }`}
        >
          <span>Claim This {discountType === "FREE" ? "Free" : "50% Off"} Tier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function FoundingOffersClient() {
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory>("all");
  const [targetTier, setTargetTier] = useState<string>("Event Organisers (Founder 1–5 - FREE)");

  // Application Form State
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    website: "",
    niche: "",
    email: "",
    bio: "",
    selectedOffer: "Event Organisers (Founder 1–5 - FREE)",
  });

  const [formStatus, setFormStatus] = useState<{
    loading: boolean;
    error: string;
    success: boolean;
  }>({ loading: false, error: "", success: false });

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const applyRef = useRef<HTMLDivElement>(null);

  const scrollToApply = (tierText: string) => {
    setTargetTier(tierText);
    setFormData((prev) => ({ ...prev, selectedOffer: tierText }));
    applyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: "", success: false });

    try {
      const res = await fetch("/api/organiser/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          organization: formData.organization,
          website: formData.website,
          niche: formData.niche,
          email: formData.email,
          bio: `[FOUNDING OFFER APPLIED: ${formData.selectedOffer}]\n\n${
            formData.bio || "Founding Member applicant for HealthSummits.tv"
          }`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormStatus({ loading: false, error: "", success: true });
      } else {
        setFormStatus({
          loading: false,
          error: data.error || "Application submission failed.",
          success: false,
        });
      }
    } catch (err) {
      setFormStatus({
        loading: false,
        error: "Network connection error. Please try again.",
        success: false,
      });
    }
  };

  const faqs = [
    {
      q: "How are the 1–5 Free and 6–10 50% Off slots allocated?",
      a: "Slots are granted on a verified first-come, first-served basis upon receipt of your registration. Once the first 5 approved applications in a category are accepted, the remaining applications automatically qualify for the 50% discount tier (slots 6–10).",
    },
    {
      q: "What happens after the first year concludes?",
      a: "As a Founding Member, you will always be grandfathered into our most preferential, discounted renewal rates and lifetime reduced platform commission fees (90% ticket & pay-per-video revenue retention).",
    },
    {
      q: "Who qualifies for the Event Organiser, Company Profile, and Keynote Speaker tiers?",
      a: "Event Organisers include health summit hosts, medical conference directors, and wellness webinar coordinators. Company Profiles are tailored for health clinics, wellness brands, supplement providers, and technology vendors. Keynote Speakers include researchers, clinical doctors, integrative health practitioners, and wellness keynote presenters.",
    },
    {
      q: "Do I need technical skills to stream or upload videos?",
      a: "No. Our platform provides intuitive dashboards, easy drag-and-drop video uploaders, direct livestream ingestion (RTMP/WebRTC), automated multi-bitrate video transcoding, and full white-glove onboarding support.",
    },
    {
      q: "Are there any hidden setup or onboarding fees?",
      a: "None whatsoever. The Free founding tier is 100% £0 for the entire first year, saving you up to £1,200 + VAT.",
    },
  ];

  return (
    <div className="bg-[#fafcfb] min-h-screen text-[#1f2e22]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1a3824] via-[#16301f] to-[#102316] text-white pt-20 pb-28 px-4">
        {/* Glow and background circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00873a]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#f6821f]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#f6821f] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 shadow-lg shadow-orange-500/20">
            <Sparkles className="w-4 h-4" />
            <span>Limited Launch Opportunities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
            Founding Offers<span className="text-[#f6821f]">!</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
            Be part of the inaugural launch of HealthSummits.tv. The first 5 sign-ups in each category receive their <strong className="text-white font-bold">1st Year 100% Free</strong>, and the next 5 receive a <strong className="text-white font-bold">50% Discount</strong>.
          </p>

          {/* Key metrics / counter banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="p-3 text-center">
              <div className="text-2xl md:text-3xl font-black text-[#f6821f]">10 Spots</div>
              <div className="text-xs uppercase tracking-wider text-green-200 mt-1">Per Category</div>
            </div>
            <div className="p-3 text-center border-y sm:border-y-0 sm:border-x border-white/15">
              <div className="text-2xl md:text-3xl font-black text-white">Up to £1,200</div>
              <div className="text-xs uppercase tracking-wider text-green-200 mt-1">First Year Savings</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl md:text-3xl font-black text-emerald-400">90% Payout</div>
              <div className="text-xs uppercase tracking-wider text-green-200 mt-1">Ticket & Video Revenue</div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-10">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-white text-[#1a3824] shadow-lg scale-105"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              All Founding Offers
            </button>
            <button
              onClick={() => setSelectedCategory("organisers")}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === "organisers"
                  ? "bg-white text-[#1a3824] shadow-lg scale-105"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              <Users className="w-4 h-4" />
              Event Organisers
            </button>
            <button
              onClick={() => setSelectedCategory("companies")}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === "companies"
                  ? "bg-white text-[#1a3824] shadow-lg scale-105"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Company Profiles
            </button>
            <button
              onClick={() => setSelectedCategory("speakers")}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === "speakers"
                  ? "bg-white text-[#1a3824] shadow-lg scale-105"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              <Mic2 className="w-4 h-4" />
              Keynote Speakers
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area: The 3 Launch Offer Groups */}
      <main className="container mx-auto max-w-6xl px-4 py-16">
        {/* Section 1: Event Organisers */}
        {(selectedCategory === "all" || selectedCategory === "organisers") && (
          <section id="event-organisers" className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1f2e22] tracking-tight mb-2">
                Event Organisers
              </h2>
              <p className="text-lg md:text-xl text-[#607367] font-normal">
                Founder Member launch offer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Card 1: Founder Members 1-5 FREE */}
              <OfferCard
                categoryName="Event Organisers"
                tierTitle="Founder Members 1–5"
                discountType="FREE"
                description="The first 5 event organisers to sign up will become Founder Members, and the first year will be free."
                savings="Save £1200 + VAT"
                badge="FIRST YEAR FREE"
                theme="orange"
                onSelect={() => scrollToApply("Event Organisers (Founder 1–5 - FREE)")}
              />

              {/* Card 2: Event Organisers 6-10 50% OFF */}
              <OfferCard
                categoryName="Event Organisers"
                tierTitle="Event Organisers 6–10"
                discountType="50% OFF"
                description="The next 5 event organisers will get a 50% discount for the first year."
                savings="Save £600 + VAT"
                badge="FIRST YEAR DISCOUNT"
                theme="green"
                onSelect={() => scrollToApply("Event Organisers (Tier 6–10 - 50% Off)")}
              />
            </div>
          </section>
        )}

        {/* Section 2: Company Profile */}
        {(selectedCategory === "all" || selectedCategory === "companies") && (
          <section id="company-profile" className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1f2e22] tracking-tight mb-2">
                Company Profile
              </h2>
              <p className="text-lg md:text-xl text-[#607367] font-normal">
                Company Profile launch offer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Card 1: Company Profiles 1-5 FREE */}
              <OfferCard
                categoryName="Company Profile"
                tierTitle="Company Profiles 1–5"
                discountType="FREE"
                description="The first 5 company profiles to sign up will get their first year free."
                savings="Save £240 + VAT"
                badge="FIRST YEAR FREE"
                theme="orange"
                onSelect={() => scrollToApply("Company Profile (Founder 1–5 - FREE)")}
              />

              {/* Card 2: Company Profiles 6-10 50% OFF */}
              <OfferCard
                categoryName="Company Profile"
                tierTitle="Company Profiles 6–10"
                discountType="50% OFF"
                description="The next 5 company profiles to sign up will get a 50% discount for the first year."
                savings="Save £120 + VAT"
                badge="FIRST YEAR DISCOUNT"
                theme="green"
                onSelect={() => scrollToApply("Company Profile (Tier 6–10 - 50% Off)")}
              />
            </div>
          </section>
        )}

        {/* Section 3: Keynote Speakers */}
        {(selectedCategory === "all" || selectedCategory === "speakers") && (
          <section id="keynote-speakers" className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1f2e22] tracking-tight mb-2">
                Keynote Speakers
              </h2>
              <p className="text-lg md:text-xl text-[#607367] font-normal">
                Speakers launch offer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Card 1: Speakers 1-5 FREE */}
              <OfferCard
                categoryName="Keynote Speakers"
                tierTitle="Speakers 1–5"
                discountType="FREE"
                description="The first 5 speakers to sign up will get their first year free."
                savings="Save £120 + VAT"
                badge="FIRST YEAR FREE"
                theme="orange"
                onSelect={() => scrollToApply("Keynote Speaker (Founder 1–5 - FREE)")}
              />

              {/* Card 2: Speakers 6-10 50% OFF */}
              <OfferCard
                categoryName="Keynote Speakers"
                tierTitle="Speakers 6–10"
                discountType="50% OFF"
                description="The next 5 speakers to sign up will get a 50% discount for the first year."
                savings="Save £60 + VAT"
                badge="FIRST YEAR DISCOUNT"
                theme="green"
                onSelect={() => scrollToApply("Keynote Speaker (Tier 6–10 - 50% Off)")}
              />
            </div>
          </section>
        )}

        {/* Benefits Grid / What You Get */}
        <section className="bg-white rounded-3xl p-8 md:p-12 border border-[#e0e8e2] shadow-sm mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#00873a] bg-green-50 px-3.5 py-1.5 rounded-full border border-green-200">
              Platform Features
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-[#1f2e22] mt-3">
              Included in Every Founding Tier
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Everything you need to host, broadcast, monetize, and amplify your health events and professional presence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#fafcfb] border border-gray-100 hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#00873a]/10 text-[#00873a] flex items-center justify-center mb-4">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1f2e22] mb-2">90% Revenue Share</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Retain 90% of ticket sales and pay-per-video lecture passes with direct Stripe settlements.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafcfb] border border-gray-100 hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#00873a]/10 text-[#00873a] flex items-center justify-center mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1f2e22] mb-2">Live & On-Demand Video</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ultra-low latency adaptive streaming player with interactive scene chapters and replay vault.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafcfb] border border-gray-100 hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#00873a]/10 text-[#00873a] flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1f2e22] mb-2">Branded Portal Page</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Customized showcase page featuring your bio, company links, past talks, and upcoming tickets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafcfb] border border-gray-100 hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#f6821f]/10 text-[#f6821f] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1f2e22] mb-2">Founding Badge & Spotlight</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Official Founding Member badge displayed permanently across directory rankings and featured rows.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafcfb] border border-gray-100 hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#00873a]/10 text-[#00873a] flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1f2e22] mb-2">Subscriber Pool Royalties</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Publish free or premium video vault content and earn monthly watch-time royalties from platform subscribers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafcfb] border border-gray-100 hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#00873a]/10 text-[#00873a] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1f2e22] mb-2">Priority Tech Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Direct onboarding support, speaker AV tech checks, and dedicated engineer assistance during broadcasts.
              </p>
            </div>
          </div>
        </section>

        {/* Application / Registration Form Section */}
        <section
          ref={applyRef}
          id="claim-offer"
          className="bg-gradient-to-b from-[#1f2e22] to-[#142217] rounded-3xl p-8 md:p-14 text-white shadow-2xl relative overflow-hidden mb-20 border border-[#2e4232]"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="bg-[#f6821f] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block mb-3">
                Fast-Track Application
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3">
                Claim Your Founding Offer
              </h2>
              <p className="text-green-100 text-base md:text-lg">
                Fill out the short form below to secure your Free or 50% Off launch tier. Our team reviews submissions within 24 hours.
              </p>
            </div>

            {formStatus.success ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  Application Received!
                </h3>
                <p className="text-green-100 mb-6 max-w-md mx-auto">
                  Thank you for claiming your Founding Offer. We will review your application and confirm your tier placement shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/signin"
                    className="px-6 py-3 bg-[#00873a] hover:bg-[#007030] text-white font-bold rounded-xl transition-all"
                  >
                    Sign In to Portal
                  </Link>
                  <Link
                    href="/organisers"
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all"
                  >
                    View Directory
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {formStatus.error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-semibold">
                    {formStatus.error}
                  </div>
                )}

                {/* Offer Selection */}
                <div>
                  <label className="block text-sm font-bold text-green-200 mb-2">
                    Selected Founding Tier
                  </label>
                  <select
                    value={formData.selectedOffer}
                    onChange={(e) =>
                      setFormData({ ...formData, selectedOffer: e.target.value })
                    }
                    className="w-full bg-[#16271a] border border-[#334d39] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#f6821f] text-base"
                    required
                  >
                    <optgroup label="Event Organisers">
                      <option value="Event Organisers (Founder 1–5 - FREE)">
                        Event Organisers 1–5 (FREE — Save £1200 + VAT)
                      </option>
                      <option value="Event Organisers (Tier 6–10 - 50% Off)">
                        Event Organisers 6–10 (50% OFF — Save £600 + VAT)
                      </option>
                    </optgroup>
                    <optgroup label="Company Profile">
                      <option value="Company Profile (Founder 1–5 - FREE)">
                        Company Profiles 1–5 (FREE — Save £240 + VAT)
                      </option>
                      <option value="Company Profile (Tier 6–10 - 50% Off)">
                        Company Profiles 6–10 (50% OFF — Save £120 + VAT)
                      </option>
                    </optgroup>
                    <optgroup label="Keynote Speakers">
                      <option value="Keynote Speaker (Founder 1–5 - FREE)">
                        Speakers 1–5 (FREE — Save £120 + VAT)
                      </option>
                      <option value="Keynote Speaker (Tier 6–10 - 50% Off)">
                        Speakers 6–10 (50% OFF — Save £60 + VAT)
                      </option>
                    </optgroup>
                  </select>
                </div>

                {/* Two columns: Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-green-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-[#16271a] border border-[#334d39] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f6821f]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-green-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#16271a] border border-[#334d39] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f6821f]"
                    />
                  </div>
                </div>

                {/* Two columns: Organisation & Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-green-200 mb-2">
                      Organisation / Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Holistic Health UK"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({ ...formData, organization: e.target.value })
                      }
                      className="w-full bg-[#16271a] border border-[#334d39] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f6821f]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-green-200 mb-2">
                      Website / LinkedIn URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="w-full bg-[#16271a] border border-[#334d39] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f6821f]"
                    />
                  </div>
                </div>

                {/* Specialty / Sub-Niche */}
                <div>
                  <label className="block text-sm font-bold text-green-200 mb-2">
                    Primary Sub-Niche / Health Specialty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Functional Medicine, Longevity, Gut Health, Biohacking"
                    value={formData.niche}
                    onChange={(e) =>
                      setFormData({ ...formData, niche: e.target.value })
                    }
                    className="w-full bg-[#16271a] border border-[#334d39] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f6821f]"
                  />
                </div>

                {/* Brief Summary / Bio */}
                <div>
                  <label className="block text-sm font-bold text-green-200 mb-2">
                    Brief Background & Goals *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about your events, speaking topics, or products and what you want to achieve on HealthSummits.tv..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full bg-[#16271a] border border-[#334d39] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f6821f]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="w-full py-4 bg-[#f6821f] hover:bg-[#df6e10] text-white font-black rounded-xl text-lg transition-all cursor-pointer shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  {formStatus.loading ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Lock In My Founding Offer Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  🔒 No upfront credit card required. Applications are verified to maintain clinical & summit hosting standards.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[#00873a] bg-green-50 px-3.5 py-1.5 rounded-full border border-green-200">
              Questions & Answers
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#1f2e22] mt-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left font-bold text-[#1f2e22] flex items-center justify-between gap-4 cursor-pointer hover:text-[#00873a]"
                >
                  <span className="text-base md:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                      openFaq === idx ? "rotate-180 text-[#00873a]" : ""
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="px-6 pb-6 pt-2 text-[#55695b] text-sm md:text-base leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
