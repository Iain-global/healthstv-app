"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  Gift,
  RotateCcw,
  Server,
  Headphones,
  BarChart3,
  Mail,
  Layout,
  Mic,
  CreditCard,
  Layers,
  Share2,
  X,
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
  const [showReasonsModal, setShowReasonsModal] = useState(false);
  const [showCompanyReasonsModal, setShowCompanyReasonsModal] = useState(false);
  const [showSpeakersReasonsModal, setShowSpeakersReasonsModal] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowReasonsModal(false);
        setShowCompanyReasonsModal(false);
        setShowSpeakersReasonsModal(false);
      }
    };
    if (showReasonsModal || showCompanyReasonsModal || showSpeakersReasonsModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showReasonsModal, showCompanyReasonsModal, showSpeakersReasonsModal]);

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

  const scrollToApply = (tierText?: string) => {
    if (tierText) {
      setTargetTier(tierText);
      setFormData((prev) => ({ ...prev, selectedOffer: tierText }));
    }
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

  // 15 Complete Benefits Data Array (from Founder Members page to FREE VIDEO PRODUCTION)
  const benefits = [
    {
      id: 1,
      title: "A Branded Landing Page",
      description:
        "Your own customized branded hub inside HSTV showcasing your organisation, speaker lineups, courses, and media.",
      tag: "CUSTOM BRANDING",
      icon: Layout,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 2,
      title: "Sell Event Tickets",
      description:
        "Sell virtual, in-person, or hybrid tickets directly through our integrated multi-currency ticketing engine with zero hassle.",
      tag: "TICKETING ENGINE",
      icon: Ticket,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 3,
      title: "Host Videos & Podcasts",
      description:
        "Upload and organise your educational video libraries, clinical keynote recordings, and audio podcast series in one centralized portal.",
      tag: "VIDEO & AUDIO",
      icon: Mic,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 4,
      title: "Registration & Payment Processing",
      description:
        "Seamless checkout in USD ($), GBP (£), and EUR (€) supporting all major cards, Apple Pay, and Google Pay with tax receipts.",
      tag: "GLOBAL CURRENCIES",
      icon: DollarSign,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 5,
      title: "On-Demand Replay Access",
      description:
        "Instant cloud recording ingestion and chaptered replay access for registered delegates and ongoing post-event VOD sales.",
      tag: "AUTOMATED REPLAYS",
      icon: RotateCcw,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 6,
      title: "Video Hosting & Content Delivery",
      description:
        "High-bandwidth, encrypted video infrastructure with zero third-party ads, no Vimeo/YouTube limits, and secure DRM options.",
      tag: "ZERO ADS INFRASTRUCTURE",
      icon: Server,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 7,
      title: "Technical Support (Pre & Live)",
      description:
        "White-glove speaker AV tech checks, rehearsal run-throughs, and live real-time monitoring engineers during broadcast.",
      tag: "DEDICATED ENGINEERS",
      icon: Headphones,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 8,
      title: "Audience Analytics & Reporting",
      description:
        "Detailed attendee retention curves, geographic viewer heatmaps, session engagement metrics, and one-click CSV export.",
      tag: "CME & VIEWER LOGS",
      icon: BarChart3,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 9,
      title: "Mention in Our Newsletter",
      description:
        "Official welcoming announcement and ongoing promotions sent directly to our engaged medical & health professional subscriber database.",
      tag: "EXCLUSIVE MARKETING",
      icon: Mail,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 10,
      title: "Sell Videos via Pay-Per-Video",
      description:
        "Monetize single lectures, masterclasses, or entire series through secure pay-per-view paywalls with instant automated payouts.",
      tag: "PAY-PER-VIDEO VOD",
      icon: CreditCard,
      isHighlight: false,
      isOrangeIcon: true,
    },
    {
      id: 11,
      title: "Livestream Hosting & Delivery",
      description:
        "Broadcast-grade, multi-bitrate adaptive 4K & HD streaming powered by an enterprise low-latency CDN for global reach.",
      tag: "4K / HD STREAMING",
      icon: Radio,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 12,
      title: "Virtual Ticket Sales Platform",
      description:
        "Tiered pricing structures (Standard, VIP, Group Institutional, Student passes) with automated attendee ticketing provisioning.",
      tag: "TIERED PASSES",
      icon: Layers,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 13,
      title: "Listed as a Founding Member",
      description:
        "Permanent recognition with an official Founding Member badge on our platform directory and header partner spotlight.",
      tag: "VIP RECOGNITION",
      icon: Award,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 14,
      title: 'One Free "Meet the Expert" Video',
      description:
        "A bespoke interview and video feature produced by HealthSummits.tv highlighting your founder, key clinical expert, or flagship methodology.",
      tag: "FREE VIDEO PRODUCTION",
      icon: Video,
      isHighlight: true,
      badgeText: "PREMIUM HIGHLIGHT",
      isOrangeIcon: true,
    },
    {
      id: 15,
      title: "Social Mentions + 2 Annual Newsletter Posts",
      description:
        "Regular cross-promotion across our social channels plus two dedicated feature articles/posts per year inside our newsletter.",
      boldSnippet: "two dedicated feature articles/posts per year",
      tag: "MULTI-CHANNEL REACH",
      icon: Share2,
      isHighlight: false,
      isOrangeIcon: false,
    },
  ];

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

            {/* Pop-up Box Trigger */}
            <div className="mt-8 max-w-4xl mx-auto text-center">
              <button
                type="button"
                onClick={() => setShowReasonsModal(true)}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/70 border-2 border-[#00873a]/30 hover:border-[#00873a] text-[#006818] font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-full bg-[#00873a] text-white flex items-center justify-center shadow-sm text-sm group-hover:scale-110 transition-transform shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <span>Why should event organisers use HealthSummits.tv?</span>
                <span className="text-xs font-black uppercase tracking-wider bg-[#00873a] text-white px-2.5 py-1 rounded-full">
                  5 Key Reasons
                </span>
                <ArrowRight className="w-4 h-4 text-[#00873a] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>
          </section>
        )}

        {/* 5 Reasons Pop-up Box Modal */}
        {showReasonsModal && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowReasonsModal(false)}
          >
            <div
              className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowReasonsModal(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6 pr-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#00873a] text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#f6821f]" />
                  Event Organiser Benefits
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1f2e22] tracking-tight leading-snug">
                  Here are five strong reasons event organisers should use{" "}
                  <span className="text-[#00873a]">HealthSummits.tv (HSTV):</span>
                </h3>
              </div>

              {/* 5 Reasons List */}
              <div className="space-y-4">
                {/* Reason 1 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#00873a]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#00873a] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Reach a Bigger Audience
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Take your event beyond the venue by offering livestream and on-demand access to people across the UK and internationally.
                    </p>
                  </div>
                </div>

                {/* Reason 2 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#f6821f]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#f6821f] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Create Additional Revenue
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Sell virtual tickets, event replays and recorded sessions, turning one event into an ongoing source of income.
                    </p>
                  </div>
                </div>

                {/* Reason 3 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#00873a]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#00873a] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Give Your Event a Longer Life
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Instead of your content disappearing when the event finishes, HSTV can keep sessions available for viewers to discover afterwards.
                    </p>
                  </div>
                </div>

                {/* Reason 4 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#f6821f]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#f6821f] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Promote Your Organisation and Speakers
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Showcase your organisation, forthcoming events, speakers and expert content to an audience specifically interested in health and wellbeing.
                    </p>
                  </div>
                </div>

                {/* Reason 5 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#00873a]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#00873a] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Everything in One Place
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      HSTV can support event promotion, virtual ticket sales, livestreaming, video hosting and on-demand viewing — making it easier for organisers to reach and manage an online audience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowReasonsModal(false);
                    scrollToApply("Event Organisers (Founder 1–5 - FREE)");
                  }}
                  className="flex-1 py-3 px-5 rounded-xl bg-[#00873a] hover:bg-[#006e2e] text-white font-bold text-sm sm:text-base text-center transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>Claim Free Event Organiser Tier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowReasonsModal(false)}
                  className="py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
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

            {/* Pop-up Box Trigger for Company Profile */}
            <div className="mt-8 max-w-4xl mx-auto text-center">
              <button
                type="button"
                onClick={() => setShowCompanyReasonsModal(true)}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/70 border-2 border-[#00873a]/30 hover:border-[#00873a] text-[#006818] font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-full bg-[#00873a] text-white flex items-center justify-center shadow-sm text-sm group-hover:scale-110 transition-transform shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <span>Why should businesses list their Company Profile?</span>
                <span className="text-xs font-black uppercase tracking-wider bg-[#00873a] text-white px-2.5 py-1 rounded-full">
                  5 Key Reasons
                </span>
                <ArrowRight className="w-4 h-4 text-[#00873a] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>
          </section>
        )}

        {/* 5 Reasons Pop-up Box Modal for Company Profile */}
        {showCompanyReasonsModal && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowCompanyReasonsModal(false)}
          >
            <div
              className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowCompanyReasonsModal(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6 pr-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#00873a] text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#f6821f]" />
                  Company Profile Benefits
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1f2e22] tracking-tight leading-snug">
                  Here are five key reasons why businesses should list their{" "}
                  <span className="text-[#00873a]">Company Profile on HealthSummits.tv:</span>
                </h3>
              </div>

              {/* 5 Reasons List */}
              <div className="space-y-4">
                {/* Reason 1 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#00873a]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#00873a] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Increase Your Visibility
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Put your business in front of a targeted audience interested in health, wellbeing and related services.
                    </p>
                  </div>
                </div>

                {/* Reason 2 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#f6821f]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#f6821f] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Showcase What You Offer
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Highlight your products, services, expertise, website, contact details and video content all in one place.
                    </p>
                  </div>
                </div>

                {/* Reason 3 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#00873a]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#00873a] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Build Trust and Credibility
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      A professional company profile helps potential customers understand who you are, what you do and why they should choose you.
                    </p>
                  </div>
                </div>

                {/* Reason 4 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#f6821f]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#f6821f] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Generate New Enquiries
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Make it easier for viewers, event organisers, speakers and potential partners to discover and contact your business.
                    </p>
                  </div>
                </div>

                {/* Reason 5 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#00873a]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#00873a] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Connect With the Health & Wellbeing Community
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Position your company alongside events, experts and organisations already active within the health and wellbeing sector.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCompanyReasonsModal(false);
                    scrollToApply("Company Profile (Founder 1–5 - FREE)");
                  }}
                  className="flex-1 py-3 px-5 rounded-xl bg-[#00873a] hover:bg-[#006e2e] text-white font-bold text-sm sm:text-base text-center transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>Claim Free Company Profile Tier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompanyReasonsModal(false)}
                  className="py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
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

            {/* Pop-up Box Trigger for Keynote Speakers */}
            <div className="mt-8 max-w-4xl mx-auto text-center">
              <button
                type="button"
                onClick={() => setShowSpeakersReasonsModal(true)}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/70 border-2 border-[#00873a]/30 hover:border-[#00873a] text-[#006818] font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-full bg-[#00873a] text-white flex items-center justify-center shadow-sm text-sm group-hover:scale-110 transition-transform shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <span>Why should Keynote Speakers join HealthSummits.tv?</span>
                <span className="text-xs font-black uppercase tracking-wider bg-[#00873a] text-white px-2.5 py-1 rounded-full">
                  5 Key Reasons
                </span>
                <ArrowRight className="w-4 h-4 text-[#00873a] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>
          </section>
        )}

        {/* 5 Reasons Pop-up Box Modal for Keynote Speakers */}
        {showSpeakersReasonsModal && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowSpeakersReasonsModal(false)}
          >
            <div
              className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowSpeakersReasonsModal(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6 pr-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#00873a] text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#f6821f]" />
                  Keynote Speaker Benefits
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1f2e22] tracking-tight leading-snug">
                  Here are five strong reasons <span className="text-[#00873a]">Keynote Speakers</span> should join{" "}
                  <span className="text-[#00873a]">HealthSummits.tv (HSTV):</span>
                </h3>
              </div>

              {/* 5 Reasons List */}
              <div className="space-y-4">
                {/* Reason 1 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#00873a]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#00873a] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Build Your Profile
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Create a dedicated presence on HSTV showcasing your expertise, experience, topics and speaking credentials.
                    </p>
                  </div>
                </div>

                {/* Reason 2 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#f6821f]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#f6821f] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Reach New Audiences
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Put your talks and expertise in front of event organisers, businesses and viewers interested specifically in health and wellbeing.
                    </p>
                  </div>
                </div>

                {/* Reason 3 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#00873a]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#00873a] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Generate More Speaking Opportunities
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Make it easier for event organisers to discover you and contact you for conferences, summits, webinars and other events.
                    </p>
                  </div>
                </div>

                {/* Reason 4 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#f6821f]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#f6821f] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Showcase Your Expertise on Video
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Feature interviews, keynote clips, presentations and expert videos so potential clients can see you in action before booking you.
                    </p>
                  </div>
                </div>

                {/* Reason 5 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] hover:border-[#00873a]/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#00873a] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-sm">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[#1f2e22] mb-1">
                      Promote Your Events and Services
                    </h4>
                    <p className="text-sm sm:text-base text-[#526357] leading-relaxed">
                      Use HSTV to highlight forthcoming appearances, programmes, books, courses or other services connected with your expertise.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSpeakersReasonsModal(false);
                    scrollToApply("Keynote Speaker (Founder 1–5 - FREE)");
                  }}
                  className="flex-1 py-3 px-5 rounded-xl bg-[#00873a] hover:bg-[#006e2e] text-white font-bold text-sm sm:text-base text-center transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>Claim Free Keynote Speaker Tier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowSpeakersReasonsModal(false)}
                  className="py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* What's Included For Founding Members (15 Feature Cards to FREE VIDEO PRODUCTION) */}
        <section className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#006818] text-xs sm:text-sm font-bold uppercase tracking-wider mb-5">
              <Gift className="w-4 h-4 text-[#ea8125]" />
              COMPLETE BENEFITS PACKAGE
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0c1c10] tracking-tight mb-4 font-heading">
              What’s Included For Founding Members
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-[#5e6d62] font-normal leading-relaxed">
              Everything you receive during your first year as an official HealthSummits.tv Founding Member.
            </p>
          </div>

          {/* 15 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={benefit.id}
                  className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    benefit.isHighlight
                      ? "bg-white border-2 border-[#ea8125] shadow-[0_10px_30px_rgba(234,129,37,0.15)] ring-1 ring-[#ea8125]/20 hover:-translate-y-1"
                      : "bg-white border border-[#e0e8e2] hover:border-[#bbf7d0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,104,24,0.08)] hover:-translate-y-1"
                  }`}
                >
                  {/* Premium Highlight Badge if applicable */}
                  {benefit.badgeText && (
                    <div className="absolute -top-3.5 right-6 bg-[#ea8125] text-white text-[0.7rem] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {benefit.badgeText}
                    </div>
                  )}

                  {/* Card Top / Body */}
                  <div>
                    {/* Icon in Rounded Box */}
                    <div className="mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          benefit.isHighlight
                            ? "bg-[#ea8125] text-white shadow-sm"
                            : benefit.isOrangeIcon
                            ? "bg-[#fff3eb] text-[#ea8125]"
                            : "bg-[#eaf5eb] text-[#006818]"
                        }`}
                      >
                        <IconComponent className="w-6 h-6 stroke-[2.2]" />
                      </div>
                    </div>

                    {/* Title with Checkmark */}
                    <div className="flex items-start gap-2.5 mb-3">
                      <CheckCircle2
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          benefit.isOrangeIcon || benefit.isHighlight
                            ? "text-[#ea8125]"
                            : "text-[#006818]"
                        }`}
                      />
                      <h3 className="font-bold text-lg sm:text-xl text-[#0c1c10] leading-snug">
                        {benefit.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-[#5e6d62] text-[0.92rem] leading-relaxed mb-6">
                      {benefit.boldSnippet ? (
                        <>
                          Regular cross-promotion across our social channels plus{" "}
                          <strong className="text-[#0c1c10] font-bold">
                            {benefit.boldSnippet}
                          </strong>{" "}
                          inside our newsletter.
                        </>
                      ) : (
                        benefit.description
                      )}
                    </p>
                  </div>

                  {/* Bottom Uppercase Tag */}
                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <span
                      className={`text-xs font-black tracking-wider uppercase ${
                        benefit.isOrangeIcon || benefit.isHighlight
                          ? "text-[#ea8125]"
                          : "text-[#006818]"
                      }`}
                    >
                      {benefit.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Offer Callout Bar */}
          <div className="mt-14 p-6 md:p-8 rounded-2xl bg-[#eaf5eb] border border-[#bbf7d0] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#006818] text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#0c1c10]">
                  Ready to activate all 15 Founding Member privileges?
                </h4>
                <p className="text-sm text-[#5e6d62]">
                  Join hundreds of medical experts and health organisations broadcasting on HSTV.
                </p>
              </div>
            </div>
            <button
              onClick={() => scrollToApply("Event Organisers (Founder 1–5 - FREE)")}
              className="px-6 py-3 bg-[#ea8125] hover:bg-[#d9731b] text-white font-bold text-sm md:text-base rounded-xl shadow-md hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
            >
              Claim Your Founding Offer
            </button>
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
