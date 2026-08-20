"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Award,
  Calculator,
  UserPlus,
  Gift,
  DollarSign,
  RotateCcw,
  Server,
  Headphones,
  BarChart3,
  Mail,
  Layout,
  Ticket,
  Mic,
  CreditCard,
  Radio,
  Layers,
  Share2,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Building2,
  Globe,
  Check,
  Info,
  TrendingUp,
} from "lucide-react";

export default function FounderMembersClient() {
  const [currency, setCurrency] = useState<"GBP" | "USD" | "EUR">("GBP");
  const currencySymbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "€";

  // Calculator State
  const [ticketPrice, setTicketPrice] = useState<number>(49);
  const [attendeeCount, setAttendeeCount] = useState<number>(250);
  const [replayPrice, setReplayPrice] = useState<number>(29);
  const [replaySales, setReplaySales] = useState<number>(100);
  const [ppvPrice, setPpvPrice] = useState<number>(75);
  const [ppvSales, setPpvSales] = useState<number>(40);

  // Application Form State
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    website: "",
    niche: "",
    email: "",
    bio: "",
  });
  const [formStatus, setFormStatus] = useState<{
    loading: boolean;
    error: string;
    success: boolean;
  }>({ loading: false, error: "", success: false });

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Refs for smooth scroll
  const calculatorRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToApply = () => {
    applyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculations
  const liveTicketRevenue = ticketPrice * attendeeCount;
  const replayRevenue = replayPrice * replaySales;
  const ppvRevenue = ppvPrice * ppvSales;
  const totalGrossRevenue = liveTicketRevenue + replayRevenue + ppvRevenue;
  const foundingAnnualSavings = currency === "GBP" ? 495 : currency === "USD" ? 645 : 580;
  const estimatedNetEarnings = Math.round(totalGrossRevenue * 0.9); // 90% payout model benchmark

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: "", success: false });

    try {
      const res = await fetch("/api/organiser/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bio: formData.bio || "Founding Member applicant for HealthSummits.tv",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setFormStatus({ loading: false, error: "", success: true });
      } else {
        setFormStatus({
          loading: false,
          error: data.error || "Failed to submit application. Please try again.",
          success: false,
        });
      }
    } catch {
      setFormStatus({
        loading: false,
        error: "Network error occurred. Please check your connection.",
        success: false,
      });
    }
  };

  const benefits = [
    {
      id: 1,
      title: "Registration & Payment Processing",
      description:
        "Seamless checkout in USD ($), GBP (£), and EUR (€) supporting all major cards, Apple Pay, and Google Pay with tax receipts.",
      tag: "GLOBAL CURRENCIES",
      icon: DollarSign,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 2,
      title: "On-Demand Replay Access",
      description:
        "Instant cloud recording ingestion and chaptered replay access for registered delegates and ongoing post-event VOD sales.",
      tag: "AUTOMATED REPLAYS",
      icon: RotateCcw,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 3,
      title: "Video Hosting & Content Delivery",
      description:
        "High-bandwidth, encrypted video infrastructure with zero third-party ads, no Vimeo/YouTube limits, and secure DRM options.",
      tag: "ZERO ADS INFRASTRUCTURE",
      icon: Server,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 4,
      title: "Technical Support (Pre & Live)",
      description:
        "White-glove speaker AV tech checks, rehearsal run-throughs, and live real-time monitoring engineers during broadcast.",
      tag: "DEDICATED ENGINEERS",
      icon: Headphones,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 5,
      title: "Audience Analytics & Reporting",
      description:
        "Detailed attendee retention curves, geographic viewer heatmaps, session engagement metrics, and one-click CSV export.",
      tag: "CME & VIEWER LOGS",
      icon: BarChart3,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 6,
      title: "Mention in Our Newsletter",
      description:
        "Official welcoming announcement and ongoing promotions sent directly to our engaged medical & health professional subscriber database.",
      tag: "EXCLUSIVE MARKETING",
      icon: Mail,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 7,
      title: "A Branded Landing Page",
      description:
        "Your own customized branded hub inside HSTV showcasing your organisation, speaker lineups, courses, and media.",
      tag: "CUSTOM BRANDING",
      icon: Layout,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 8,
      title: "Sell Event Tickets",
      description:
        "Sell virtual, in-person, or hybrid tickets directly through our integrated multi-currency ticketing engine with zero hassle.",
      tag: "TICKETING ENGINE",
      icon: Ticket,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 9,
      title: "Host Videos & Podcasts",
      description:
        "Upload and organise your educational video libraries, clinical keynote recordings, and audio podcast series in one centralized portal.",
      tag: "VIDEO & AUDIO",
      icon: Mic,
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
      title: "Social Mentions + 2 Annual Newsletter Posts",
      description:
        "Regular cross-promotion across our social channels plus two dedicated feature articles/posts per year inside our newsletter.",
      boldSnippet: "two dedicated feature articles/posts per year",
      tag: "MULTI-CHANNEL REACH",
      icon: Share2,
      isHighlight: false,
      isOrangeIcon: false,
    },
    {
      id: 15,
      title: 'One Free "Meet the Expert" Video',
      description:
        "A bespoke interview and video feature produced by HealthSummits.tv highlighting your founder, key clinical expert, or flagship methodology.",
      tag: "FREE VIDEO PRODUCTION",
      icon: Video,
      isHighlight: true,
      badgeText: "PREMIUM HIGHLIGHT",
      isOrangeIcon: true,
    },
  ];

  const faqs = [
    {
      q: "What is the HealthSummits.tv Founding Member Programme?",
      a: "The Founding Member Programme is an exclusive initiative designed for visionary health summit organisers, medical associations, clinical practitioners, wellness educators, and summit hosts. It provides full access to our broadcast-grade streaming platform, ticketing engine, video hosting, and marketing network completely free for your entire first year.",
    },
    {
      q: "Is Year 1 truly £0 free with no setup fee?",
      a: "Yes! There are zero platform membership fees, zero setup costs, and zero lock-in contracts during your first 12 months. You get complete access to every professional tool, AV support, and promotional benefit.",
    },
    {
      q: "What happens after Year 1?",
      a: "After your complimentary 12 months, your annual membership continues at a locked-in founding rate of £495 + VAT per year. You may cancel at any time with zero penalty if you choose not to renew.",
    },
    {
      q: "How does the free 'Meet the Expert' video production work?",
      a: "As a Founding Member, our production team schedules a bespoke video recording session with your founder, lead clinician, or keynote speaker. We professionally edit and produce a high-definition feature video and showcase it across HealthSummits.tv and our marketing channels at no charge to you.",
    },
    {
      q: "Can we sell tickets and monetise our existing video library?",
      a: "Absolutely. You can sell live summit tickets, on-demand replays, single lectures, or masterclass series in GBP (£), USD ($), and EUR (€) with instant automated payouts.",
    },
  ];

  return (
    <div className="bg-[#fafcfb] min-h-screen text-[#1f2e22]">
      {/* Top Banner / Hero Intro */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f9f2] via-[#fafcfb] to-[#fafcfb] pt-14 pb-16 border-b border-[#e0e8e2]">
        <div className="mx-auto w-[90%] max-w-[1200px] px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eaf5eb] border border-[#bbf7d0] text-[#006818] text-xs md:text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#ea8125]" />
              Official Founding Member Invitation
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0c1c10] tracking-tight leading-[1.15] mb-5 font-heading">
              Become a <span className="text-[#006818]">Founding Member</span> of HealthSummits.tv
            </h1>
            <p className="text-lg md:text-xl text-[#5e6d62] leading-relaxed max-w-2xl">
              Partner with the UK and global streaming hub for health summits, expert masterclasses, and on-demand wellness education.
            </p>
          </div>

          {/* EXCLUSIVE FOUNDING MEMBER OFFER BOX (Matches Image 1 exactly) */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-[#bbf7d0] p-6 sm:p-8 md:p-10 shadow-[0_10px_35px_rgba(0,104,24,0.06)] relative mb-8">
              {/* Offer Header with Ribbon */}
              <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-[#ea8125]" />
                <span className="font-extrabold text-[#006818] text-xs sm:text-sm md:text-base uppercase tracking-wider">
                  EXCLUSIVE FOUNDING MEMBER OFFER
                </span>
              </div>

              {/* Main Price Row */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left py-2">
                {/* Left: Year 1: £0 FREE */}
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#006818] tracking-tight whitespace-nowrap">
                  Year 1: £0 FREE
                </div>

                {/* Divider (Desktop) */}
                <div className="hidden md:block w-px h-16 bg-gray-300"></div>

                {/* Right: Terms and Highlight */}
                <div className="flex flex-col justify-center">
                  <div className="text-[#5e6d62] text-sm sm:text-base md:text-lg font-medium">
                    Then £495 + VAT / year thereafter
                  </div>
                  <div className="text-[#ea8125] font-bold text-sm sm:text-base md:text-lg tracking-tight mt-0.5">
                    No setup fee • Zero risk • Full access
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (Matches Image 1 exactly) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {/* Primary Apply Button */}
              <button
                type="button"
                onClick={scrollToApply}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#ea8125] hover:bg-[#d9731b] text-white font-bold text-base md:text-lg rounded-xl shadow-[0_6px_20px_rgba(234,129,37,0.35)] hover:shadow-[0_8px_25px_rgba(234,129,37,0.5)] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <UserPlus className="w-5 h-5 text-white" />
                Apply as a Founding Member
              </button>

              {/* Outline Calculator Button */}
              <button
                type="button"
                onClick={scrollToCalculator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-[#f0f9f2] text-[#006818] border-2 border-[#006818] font-bold text-base md:text-lg rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Calculator className="w-5 h-5 text-[#006818]" />
                Calculate Earning Potential
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETE BENEFITS PACKAGE SECTION (Matches Images 2, 3, 4, 5 exactly) */}
      <section className="py-20 bg-white border-b border-[#e0e8e2]">
        <div className="mx-auto w-[90%] max-w-[1200px] px-4">
          {/* Section Header (Image 2) */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#006818] text-xs sm:text-sm font-bold uppercase tracking-wider mb-5">
              <Gift className="w-4 h-4 text-[#ea8125]" />
              COMPLETE BENEFITS PACKAGE
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0c1c10] tracking-tight mb-4 font-heading">
              What’s Included For Founding Members
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[#5e6d62] font-normal leading-relaxed">
              Everything you receive during your first year as an official HealthSummits.tv Founding Member.
            </p>
          </div>

          {/* 15 Feature Cards Grid (Images 3, 4, 5) */}
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
              onClick={scrollToApply}
              className="px-6 py-3 bg-[#ea8125] hover:bg-[#d9731b] text-white font-bold text-sm md:text-base rounded-xl shadow-md hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
            >
              Claim £0 Free Year 1 Access
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE EARNING POTENTIAL CALCULATOR */}
      <section
        ref={calculatorRef}
        className="py-20 bg-[#fafcfb] border-b border-[#e0e8e2] relative scroll-mt-24"
      >
        <div className="mx-auto w-[90%] max-w-[1200px] px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eaf5eb] border border-[#bbf7d0] text-[#006818] text-xs font-bold uppercase tracking-wider mb-4">
              <Calculator className="w-4 h-4 text-[#006818]" />
              ESTIMATE YOUR REVENUE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0c1c10] tracking-tight mb-4 font-heading">
              Founding Member Earning Potential
            </h2>
            <p className="text-base sm:text-lg text-[#5e6d62]">
              Simulate your revenue across live ticket sales, on-demand event replays, and video library pay-per-view paywalls.
            </p>

            {/* Currency Selector */}
            <div className="inline-flex items-center bg-white p-1 rounded-xl border border-[#e0e8e2] shadow-sm mt-6">
              {(["GBP", "USD", "EUR"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currency === curr
                      ? "bg-[#006818] text-white shadow-sm"
                      : "text-[#5e6d62] hover:text-[#0c1c10]"
                  }`}
                >
                  {curr === "GBP" ? "£ GBP" : curr === "USD" ? "$ USD" : "€ EUR"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#e0e8e2] shadow-sm space-y-6">
              <h3 className="font-bold text-xl text-[#0c1c10] border-b border-gray-100 pb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#006818]" />
                Event & Content Projection Controls
              </h3>

              {/* Control 1: Live Event Tickets */}
              <div className="space-y-3 bg-[#fafcfb] p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-[#0c1c10] flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-[#006818]" /> Live Ticket Price
                  </span>
                  <span className="text-[#006818] font-bold text-base">
                    {currencySymbol}{ticketPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value))}
                  className="w-full accent-[#006818] cursor-pointer"
                />

                <div className="flex justify-between items-center text-sm font-semibold pt-2">
                  <span className="text-[#0c1c10]">Expected Live Attendees</span>
                  <span className="text-[#006818] font-bold text-base">
                    {attendeeCount.toLocaleString()} delegates
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  step="10"
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(Number(e.target.value))}
                  className="w-full accent-[#006818] cursor-pointer"
                />
                <div className="text-right text-xs text-[#5e6d62] font-medium">
                  Live Ticket Subtotal: <strong>{currencySymbol}{liveTicketRevenue.toLocaleString()}</strong>
                </div>
              </div>

              {/* Control 2: On-Demand Replay Passes */}
              <div className="space-y-3 bg-[#fafcfb] p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-[#0c1c10] flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-[#006818]" /> Post-Event Replay Pass Price
                  </span>
                  <span className="text-[#006818] font-bold text-base">
                    {currencySymbol}{replayPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={replayPrice}
                  onChange={(e) => setReplayPrice(Number(e.target.value))}
                  className="w-full accent-[#006818] cursor-pointer"
                />

                <div className="flex justify-between items-center text-sm font-semibold pt-2">
                  <span className="text-[#0c1c10]">Replay Passes Sold (Annual)</span>
                  <span className="text-[#006818] font-bold text-base">
                    {replaySales.toLocaleString()} buyers
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={replaySales}
                  onChange={(e) => setReplaySales(Number(e.target.value))}
                  className="w-full accent-[#006818] cursor-pointer"
                />
                <div className="text-right text-xs text-[#5e6d62] font-medium">
                  Replay Subtotal: <strong>{currencySymbol}{replayRevenue.toLocaleString()}</strong>
                </div>
              </div>

              {/* Control 3: Pay-Per-Video / Masterclasses */}
              <div className="space-y-3 bg-[#fff9f4] p-4 rounded-2xl border border-[#fed7aa]/50">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-[#0c1c10] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#ea8125]" /> Pay-Per-Video / Masterclass Fee
                  </span>
                  <span className="text-[#ea8125] font-bold text-base">
                    {currencySymbol}{ppvPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={ppvPrice}
                  onChange={(e) => setPpvPrice(Number(e.target.value))}
                  className="w-full accent-[#ea8125] cursor-pointer"
                />

                <div className="flex justify-between items-center text-sm font-semibold pt-2">
                  <span className="text-[#0c1c10]">Pay-Per-Video Enrollments</span>
                  <span className="text-[#ea8125] font-bold text-base">
                    {ppvSales.toLocaleString()} buyers
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={ppvSales}
                  onChange={(e) => setPpvSales(Number(e.target.value))}
                  className="w-full accent-[#ea8125] cursor-pointer"
                />
                <div className="text-right text-xs text-[#ea8125] font-medium">
                  Pay-Per-Video Subtotal: <strong>{currencySymbol}{ppvRevenue.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Projection Results Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1c10] to-[#163820] text-white p-7 sm:p-9 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-green-300 mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-[#ea8125]" />
                  Annual Projections
                </div>

                <div className="text-sm font-medium text-gray-300 mb-1">
                  Estimated Gross Turnover
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-6">
                  {currencySymbol}{totalGrossRevenue.toLocaleString()}
                </div>

                {/* Breakdown List */}
                <div className="space-y-3.5 text-sm border-t border-white/15 pt-5 mb-8">
                  <div className="flex justify-between text-gray-300">
                    <span>Live Ticket Revenue:</span>
                    <span className="font-semibold text-white">
                      {currencySymbol}{liveTicketRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>On-Demand Replays:</span>
                    <span className="font-semibold text-white">
                      {currencySymbol}{replayRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Pay-Per-Video Sales:</span>
                    <span className="font-semibold text-white">
                      {currencySymbol}{ppvRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-orange-400 font-bold bg-white/5 p-2.5 rounded-xl">
                    <span>Year 1 Platform Fee:</span>
                    <span>£0 FREE (Save £495+VAT)</span>
                  </div>
                </div>

                {/* Net Earnings Highlight Box */}
                <div className="bg-gradient-to-r from-[#006818] to-[#00873a] p-5 rounded-2xl text-center shadow-lg border border-white/20 mb-6">
                  <div className="text-xs uppercase tracking-widest text-green-200 font-bold mb-1">
                    Your Projected Net Take-Home
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white">
                    ~{currencySymbol}{estimatedNetEarnings.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-100 mt-1">
                    Based on transparent industry-leading revenue splits & zero annual software fee
                  </div>
                </div>
              </div>

              <button
                onClick={scrollToApply}
                className="w-full py-4 bg-[#ea8125] hover:bg-[#d9731b] text-white font-bold text-center rounded-xl shadow-lg transition-all text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                Apply for £0 Founding Status
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM SECTION */}
      <section
        ref={applyRef}
        className="py-20 bg-white border-b border-[#e0e8e2] scroll-mt-24"
      >
        <div className="mx-auto w-[90%] max-w-[900px] px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eaf5eb] border border-[#bbf7d0] text-[#006818] text-xs font-bold uppercase tracking-wider mb-4">
              <UserPlus className="w-4 h-4 text-[#ea8125]" />
              INSTANT APPLICATION
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0c1c10] tracking-tight mb-4 font-heading">
              Apply as a Founding Member
            </h2>
            <p className="text-[#5e6d62] text-base sm:text-lg">
              Secure your Year 1 £0 free membership. No upfront payment required, zero risk.
            </p>
          </div>

          <div className="bg-[#fafcfb] border border-[#e0e8e2] rounded-3xl p-6 sm:p-10 shadow-sm">
            {formStatus.success ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-[#eaf5eb] text-[#006818] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0c1c10] mb-3">
                  Application Submitted!
                </h3>
                <p className="text-[#5e6d62] max-w-md mx-auto mb-8 text-base">
                  Thank you for applying to the HealthSummits.tv Founding Member Programme. Our partnership team will review your application and provision your verified Founding Organiser credentials immediately.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/signin"
                    className="px-8 py-3.5 bg-[#006818] hover:bg-[#005213] text-white font-bold rounded-xl transition-all shadow-md"
                  >
                    Sign In to Organiser Portal
                  </Link>
                  <button
                    onClick={() => {
                      setFormStatus({ loading: false, error: "", success: false });
                      setFormData({
                        name: "",
                        organization: "",
                        website: "",
                        niche: "",
                        email: "",
                        bio: "",
                      });
                    }}
                    className="px-6 py-3.5 border border-[#e0e8e2] text-[#5e6d62] hover:text-[#0c1c10] font-semibold rounded-xl transition-all"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {formStatus.error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-3">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <span>{formStatus.error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#0c1c10] uppercase tracking-wider mb-2">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#e0e8e2] rounded-xl text-[#0c1c10] text-sm focus:outline-none focus:border-[#006818] focus:ring-2 focus:ring-[#006818]/10 transition-all"
                    />
                  </div>

                  {/* Organisation / Brand */}
                  <div>
                    <label className="block text-xs font-bold text-[#0c1c10] uppercase tracking-wider mb-2">
                      Organisation / Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Integrative Health Summit UK"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({ ...formData, organization: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-[#e0e8e2] rounded-xl text-[#0c1c10] text-sm focus:outline-none focus:border-[#006818] focus:ring-2 focus:ring-[#006818]/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#0c1c10] uppercase tracking-wider mb-2">
                      Work Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@integrativehealth.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#e0e8e2] rounded-xl text-[#0c1c10] text-sm focus:outline-none focus:border-[#006818] focus:ring-2 focus:ring-[#006818]/10 transition-all"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-xs font-bold text-[#0c1c10] uppercase tracking-wider mb-2">
                      Website or Social Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://integrativehealth.org"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-[#e0e8e2] rounded-xl text-[#0c1c10] text-sm focus:outline-none focus:border-[#006818] focus:ring-2 focus:ring-[#006818]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Primary Health Niche */}
                <div>
                  <label className="block text-xs font-bold text-[#0c1c10] uppercase tracking-wider mb-2">
                    Primary Healthcare / Wellness Niche
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Functional Medicine, Cardiology, Longevity, Mental Health, Nutrition"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#e0e8e2] rounded-xl text-[#0c1c10] text-sm focus:outline-none focus:border-[#006818] focus:ring-2 focus:ring-[#006818]/10 transition-all"
                  />
                </div>

                {/* Summary / Proposed Events */}
                <div>
                  <label className="block text-xs font-bold text-[#0c1c10] uppercase tracking-wider mb-2">
                    Tell us about your summits or video content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Briefly describe your upcoming summits, past webinars, expert speaker lineups, or video library catalog..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#e0e8e2] rounded-xl text-[#0c1c10] text-sm focus:outline-none focus:border-[#006818] focus:ring-2 focus:ring-[#006818]/10 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Exclusive Terms Checklist */}
                <div className="bg-[#eaf5eb] p-4 rounded-xl border border-[#bbf7d0] space-y-2 text-xs text-[#0c1c10] font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006818] flex-shrink-0" />
                    <span>Year 1 platform membership is 100% free (£0 setup, £0 annual fee).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006818] flex-shrink-0" />
                    <span>Includes free bespoke &quot;Meet the Expert&quot; video production.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006818] flex-shrink-0" />
                    <span>You retain 100% ownership and copyright of all your broadcasts and videos.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="w-full py-4 bg-[#ea8125] hover:bg-[#d9731b] disabled:bg-gray-400 text-white font-bold text-base md:text-lg rounded-xl shadow-[0_6px_20px_rgba(234,129,37,0.35)] hover:shadow-[0_8px_25px_rgba(234,129,37,0.5)] transition-all cursor-pointer"
                >
                  {formStatus.loading ? "Submitting Application..." : "Submit Founding Member Application (£0 Free)"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-[#fafcfb]">
        <div className="mx-auto w-[90%] max-w-[850px] px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0c1c10] mb-3 font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-[#5e6d62]">
              Got questions about the Founding Member offer? Here is everything you need to know.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-[#e0e8e2] rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 sm:p-6 font-bold text-base sm:text-lg text-[#0c1c10] flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#006818] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-[#5e6d62] text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
