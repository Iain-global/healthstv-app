"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { App as MediaZillaApp } from "@/components/mediazilla/App";

type OrganiserType = {
  id: number;
  userId: number;
  slug: string;
  name: string;
  organization: string | null;
  bio: string | null;
  website: string | null;
  avatarInitials: string | null;
  profilePhotoUrl: string | null;
  isVerified: boolean;
  isFounding: boolean;
  subscriptionPrice: number | null;
  events: Array<{
    id: number;
    title: string;
    format: string | null;
    description: string | null;
    date: string;
    endDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    location: string | null;
    imageUrl: string | null;
    price: number;
    isPriceFrom?: boolean;
    ticketUrl: string | null;
  }>;
  videos: Array<{
    id: number;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    category: string | null;
    isFree: boolean;
    price?: number;
  }>;
};

const ORGANISER_SCHEDULE: Array<{
  day: number;
  name: string;
  subtitle: string;
  sessions: Array<{
    id: string;
    number: number;
    title: string;
    duration: string;
    speaker: string;
    chapters: Array<{ time: string; title: string }>;
  }>;
}> = [
  {
    day: 1,
    name: "Day 1",
    subtitle: "Foundations of Longevity & Cellular Health",
    sessions: [
      {
        id: "d1-s1",
        number: 1,
        title: "Keynote: Mitochondrial Biology & Cellular Renewal",
        duration: "42:00",
        speaker: "Steve Pollard",
        chapters: [
          { time: "00:00", title: "Welcome & Summit Overview" },
          { time: "12:00", title: "Cellular Energy & ATP Pathways" },
          { time: "25:00", title: "Mitochondrial Repair Protocols" },
          { time: "35:00", title: "Audience Q&A & Takeaways" }
        ]
      },
      {
        id: "d1-s2",
        number: 2,
        title: "Clinical Protocols: NAD+, Peptides & Fasting Windows",
        duration: "48:00",
        speaker: "Prof. Liam Vance",
        chapters: [
          { time: "00:00", title: "NAD+ Infusions vs Precursors" },
          { time: "15:00", title: "Therapeutic Peptide Stacks" },
          { time: "30:00", title: "Fasting Mimicking & Autophagy" }
        ]
      },
      {
        id: "d1-s3",
        number: 3,
        title: "Masterclass: Autophagy Induction & Biomarker Testing",
        duration: "38:00",
        speaker: "Dr. Jonathan Hayes",
        chapters: [
          { time: "00:00", title: "Advanced Blood Chemistry Analysis" },
          { time: "14:00", title: "Continuous Glucose Tracking Nuances" },
          { time: "28:00", title: "Live Audience Q&A" }
        ]
      },
      {
        id: "d1-s4",
        number: 4,
        title: "Clinical Case Studies & Live Delegate Q&A",
        duration: "40:00",
        speaker: "Panel Discussion",
        chapters: [
          { time: "00:00", title: "Case Study: Chronic Fatigue Reversal" },
          { time: "18:00", title: "Delegate Round-Robin Questions" }
        ]
      }
    ]
  },
  {
    day: 2,
    name: "Day 2",
    subtitle: "Gut-Brain Axis, Microbiome Solutions & Digestion",
    sessions: [
      {
        id: "d2-s1",
        number: 1,
        title: "Keynote: The Microbiome as a Master Regulator",
        duration: "40:00",
        speaker: "Dr. Alistair Ross",
        chapters: [
          { time: "00:00", title: "The Intestinal Mucosal Barrier" },
          { time: "15:00", title: "Microbiome Diversity & SCFA Production" }
        ]
      },
      {
        id: "d2-s2",
        number: 2,
        title: "Clinical Protocols: SIBO, Leaky Gut & Psychobiotics",
        duration: "52:00",
        speaker: "Rachel Davies",
        chapters: [
          { time: "00:00", title: "SIBO Breath Testing & Antimicrobials" },
          { time: "20:00", title: "Targeted Strain-Specific Probiotics" }
        ]
      },
      {
        id: "d2-s3",
        number: 3,
        title: "Workshop: Vagus Nerve & Motility Activation",
        duration: "45:00",
        speaker: "Dr. Elena Rostova",
        chapters: [
          { time: "00:00", title: "Vagal Tone Measurement (HRV)" },
          { time: "18:00", title: "Somatic Exercises for Migrating Motor Complex" }
        ]
      },
      {
        id: "d2-s4",
        number: 4,
        title: "Case Studies: Reversing Chronic Gut Inflammation",
        duration: "45:00",
        speaker: "Clinical Panel",
        chapters: [
          { time: "00:00", title: "Autoimmune & Food Sensitivity Panel" }
        ]
      }
    ]
  },
  {
    day: 3,
    name: "Day 3",
    subtitle: "Hormone Optimization & Metabolic Precision",
    sessions: [
      {
        id: "d3-s1",
        number: 1,
        title: "Endocrine Reset & Thyroid Mastery",
        duration: "38:00",
        speaker: "Dr. Marcus Thorne",
        chapters: [
          { time: "00:00", title: "Complete Thyroid & Adrenal Assessment" }
        ]
      },
      {
        id: "d3-s2",
        number: 2,
        title: "Bio-Identical Hormones & Precision Dosing",
        duration: "49:00",
        speaker: "Dr. Rebecca Sterling",
        chapters: [
          { time: "00:00", title: "BHRT Protocols for Men & Women" }
        ]
      },
      {
        id: "d3-s3",
        number: 3,
        title: "Insulin Sensitivity & Metabolic Flexibility",
        duration: "42:00",
        speaker: "Sophia Martinez",
        chapters: [
          { time: "00:00", title: "Continuous Glucose Monitoring (CGM) Calibration" }
        ]
      },
      {
        id: "d3-s4",
        number: 4,
        title: "Personalized Hormone Therapy Roundtable",
        duration: "38:00",
        speaker: "Expert Roundtable",
        chapters: [
          { time: "00:00", title: "Case Studies & Live Audience Q&A" }
        ]
      }
    ]
  },
  {
    day: 4,
    name: "Day 4",
    subtitle: "Sleep Architecture & Neuroplasticity",
    sessions: [
      {
        id: "d4-s1",
        number: 1,
        title: "Sleep Stages, Glymphatic Clearance & REM",
        duration: "44:00",
        speaker: "David Chen",
        chapters: [
          { time: "00:00", title: "Understanding Deep Sleep & Recovery" }
        ]
      },
      {
        id: "d4-s2",
        number: 2,
        title: "Nootropics, BDNF & Cognitive Longevity",
        duration: "50:00",
        speaker: "Dr. Arthur Pendelton",
        chapters: [
          { time: "00:00", title: "Brain Aging & Synaptic Plasticity" }
        ]
      },
      {
        id: "d4-s3",
        number: 3,
        title: "HRV Tracking & Stress Resilience Masterclass",
        duration: "37:00",
        speaker: "Dr. Sarah Jenkins",
        chapters: [
          { time: "00:00", title: "Autonomic Nervous System Regulation" }
        ]
      },
      {
        id: "d4-s4",
        number: 4,
        title: "Sound Frequencies & Light Hygiene Protocols",
        duration: "50:00",
        speaker: "Wellness Team",
        chapters: [
          { time: "00:00", title: "Circadian Lighting & Sound Therapy" }
        ]
      }
    ]
  },
  {
    day: 5,
    name: "Day 5",
    subtitle: "Integration & Future of Integrative Care",
    sessions: [
      {
        id: "d5-s1",
        number: 1,
        title: "The Daily Health & Longevity Stack",
        duration: "46:30",
        speaker: "Steve Pollard & Guests",
        chapters: [
          { time: "00:00", title: "Opening Remarks & Assessment" },
          { time: "13:00", title: "Daily Habit Stacking Formulation" },
          { time: "28:00", title: "Interactive Calibration & Demos" }
        ]
      },
      {
        id: "d5-s2",
        number: 2,
        title: "Biohacking in Clinical Practice",
        duration: "36:15",
        speaker: "Prof. Liam Vance",
        chapters: [
          { time: "00:00", title: "Hyperbaric, Red Light & Cold Therapy" }
        ]
      },
      {
        id: "d5-s3",
        number: 3,
        title: "Action Plan: Integrating Summit Protocols",
        duration: "55:00",
        speaker: "Dr. Jonathan Hayes",
        chapters: [
          { time: "00:00", title: "Practical Patient Implementation" }
        ]
      },
      {
        id: "d5-s4",
        number: 4,
        title: "Grand Closing Summit Keynote & Awards",
        duration: "48:00",
        speaker: "All Founders & Speakers",
        chapters: [
          { time: "00:00", title: "Closing Remarks & Certificate Awards" }
        ]
      }
    ]
  }
];

export default function OrganiserPortalClient({ organiser }: { organiser: OrganiserType }) {
  const [showInteractivePlayer, setShowInteractivePlayer] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedScheduleDay, setSelectedScheduleDay] = useState(1);
  const playerRef = useRef<HTMLDivElement>(null);

  const currentScheduleDay = ORGANISER_SCHEDULE.find((d) => d.day === selectedScheduleDay) || ORGANISER_SCHEDULE[0];

  const handleLaunchHumanGarage = () => {
    setShowInteractivePlayer(true);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  return (
    <div className="bg-[#fafcfb] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#142318] via-[#1f2e22] to-[#122216] text-white py-14 px-4 border-b border-[#2d4232]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-white/10 flex items-center justify-center text-4xl font-black shrink-0 border-4 border-white/20 shadow-xl overflow-hidden relative">
            {organiser.profilePhotoUrl ? (
              <Image src={organiser.profilePhotoUrl} alt={organiser.name} fill className="object-cover" />
            ) : (
              organiser.avatarInitials || organiser.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2.5 flex-wrap">
              {organiser.isFounding && (
                <span className="bg-[#d93025] text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                  Founding Organiser
                </span>
              )}
              {organiser.isVerified && (
                <span className="bg-[#00873a] text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                  ✓ Verified Summit Host
                </span>
              )}
              <span className="bg-white/15 text-slate-200 text-xs px-3 py-1 rounded-full font-semibold">
                Official Delegate Portal
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight text-white">
              {organiser.name}
            </h1>
            
            {organiser.organization && (
              <h2 className="text-lg md:text-xl text-[#86efac] font-bold mb-3">
                {organiser.organization}
              </h2>
            )}
            
            <p className="text-gray-300 max-w-3xl leading-relaxed text-sm md:text-base">
              {organiser.bio || `${organiser.name} is a leading health and wellness professional sharing their expertise on HealthSummits.tv.`}
            </p>

            {/* Quick Action Bar */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={handleLaunchHumanGarage}
                className="bg-[#ea8125] hover:bg-[#d3701a] text-white px-6 py-3 rounded-xl text-sm font-black shadow-[0_4px_16px_rgba(234,129,37,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-orange-300/30"
              >
                <span>🎬</span>
                <span>Human Garage</span>
                <span className="bg-black/30 text-white text-[11px] px-2 py-0.5 rounded font-bold">
                  Play Videos
                </span>
              </button>

              <Link
                href="/events"
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-sm font-bold border border-white/20 transition-all"
              >
                🗓️ View Virtual Summits
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-10">
        
        {/* ========================================================================= */}
        {/* EMBEDDED INTERACTIVE VIDEO PRESENTATION (MEDIAZILLA MENU & CINEMA PLAYER) */}
        {/* ========================================================================= */}
        <section ref={playerRef} className="mb-14 scroll-mt-6">
          <div className="bg-[#0b0e14] border-2 border-[#00873a]/40 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            
            {/* Player Portal Header Bar */}
            <div className="bg-[#121822] px-6 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#22c55e] animate-pulse"></span>
                <div>
                  <h2 className="text-white font-black text-lg md:text-xl flex items-center gap-2">
                    <span>🎬</span>
                    <span>{organiser.name} Delegate Video Menu</span>
                  </h2>
                  <p className="text-slate-400 text-xs font-medium">
                    Interactive 5-Day Summit Presentation • 4 Sessions Per Day • Chapter Markers & Scene Selection
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/15"
                >
                  <span>{isFullscreen ? "🗗" : "⛶"}</span>
                  <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen Theatre"}</span>
                </button>
              </div>
            </div>

            {/* Embedded MediaZilla App Container */}
            <div 
              className={`relative bg-black transition-all ${
                isFullscreen 
                  ? "fixed inset-0 z-50 w-screen h-screen" 
                  : "w-full aspect-[16/10] md:aspect-video min-h-[520px] lg:min-h-[620px]"
              }`}
            >
              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 z-[100] bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/30 shadow-2xl"
                >
                  ✕ Close Fullscreen
                </button>
              )}
              
              <iframe
                src={`/mediazilla/index.html?organiser=${organiser.slug}`}
                className="w-full h-full border-none min-h-[560px] lg:min-h-[640px]"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Sub-bar Guidance */}
            <div className="bg-[#121822] px-6 py-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓ Active:</span>
                Delegates can click any day, session, or chapter to stream directly.
              </span>
              <span className="text-slate-400">
                Tip: Use <strong>❮ Menu</strong> inside the player to switch between chapters anytime.
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE PROGRAMME: DAYS & CHAPTERS MENU */}
        {/* ========================================================================= */}
        <section className="mb-14 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#00873a] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Complete Summit Menu
                </span>
                <span className="text-xs font-bold text-gray-500">
                  4 Sessions Per Day • Chapters with Timestamps
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#1f2e22]">
                {organiser.name} — Interactive Summit Programme
              </h3>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedScheduleDay(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedScheduleDay === d
                      ? "bg-[#00873a] text-white shadow-md"
                      : "text-gray-600 hover:text-black hover:bg-gray-200"
                  }`}
                >
                  Day {d}
                </button>
              ))}
            </div>
          </div>

          {/* Active Day Subtitle */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs font-black text-[#15803d] uppercase tracking-wider">
                Day {selectedScheduleDay} Focus
              </span>
              <h4 className="text-base font-bold text-[#14532d]">
                {currentScheduleDay.subtitle}
              </h4>
            </div>
            <span className="text-xs font-bold bg-[#16a34a] text-white px-3 py-1 rounded-full">
              4 Full Sessions • Interactive Chapters
            </span>
          </div>

          {/* 4 Sessions Grid with Chapters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentScheduleDay.sessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#fafcfb] border border-gray-200 hover:border-[#00873a]/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-[#1f2e22] text-white text-[11px] font-black px-2.5 py-0.5 rounded-md uppercase">
                      Session {session.number}
                    </span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                      ⏱ {session.duration}
                    </span>
                  </div>

                  <h5 className="text-base font-bold text-[#1f2e22] mb-1.5 leading-snug">
                    {session.title}
                  </h5>

                  <p className="text-xs text-gray-500 mb-4 font-medium">
                    Speaker: <strong className="text-[#00873a]">{session.speaker}</strong>
                  </p>

                  {/* Chapters List */}
                  {session.chapters.length > 0 && (
                    <div className="mb-4 bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <span>📑 Chapters & Timestamps</span>
                      </div>
                      <div className="space-y-1.5">
                        {session.chapters.map((ch, idx) => (
                          <div
                            key={idx}
                            onClick={handleLaunchHumanGarage}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-emerald-50 hover:text-[#00873a] cursor-pointer transition-colors group"
                            title="Click to play from this chapter"
                          >
                            <span className="font-semibold text-gray-700 group-hover:text-[#00873a] truncate">
                              {ch.title}
                            </span>
                            <span className="text-[11px] font-mono text-gray-400 group-hover:text-[#00873a] shrink-0 ml-2 font-bold">
                              {ch.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLaunchHumanGarage}
                  className="w-full mt-2 py-2.5 bg-[#00873a] hover:bg-[#007030] text-white text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>▶ Play Session {session.number}</span>
                  <span className="text-[11px] opacity-80 font-normal">({session.duration})</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-12">
            
            {/* Upcoming Events */}
            <section>
              <h3 className="text-2xl font-black text-[#1f2e22] mb-6 flex items-center gap-2">
                <span>🗓️</span> Upcoming Virtual Summits
              </h3>
              {organiser.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {organiser.events.map(event => (
                    <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 bg-gray-100 relative">
                        {event.imageUrl ? (
                          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-4xl bg-[#1f2e22]/5">🎟️</div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1f2e22]">
                          {event.date}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="text-xs font-bold text-[#00873a] mb-2 uppercase tracking-wide">{event.format || 'Virtual Summit'}</div>
                        <h4 className="font-bold text-[#1f2e22] text-lg mb-2 line-clamp-2">{event.title}</h4>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="font-black text-lg text-[#00873a]">
                            {event.isPriceFrom ? <span className="text-xs text-gray-500 mr-1 font-semibold">From</span> : null}
                            £{Number(event.price).toFixed(2)}
                          </div>
                          {event.ticketUrl && (
                            <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="bg-[#ea8125] hover:bg-[#d3701a] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                              Book Tickets
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                  No upcoming virtual events scheduled at this time.
                </div>
              )}
            </section>

            {/* Video Vault */}
            <section>
              <h3 className="text-2xl font-black text-[#1f2e22] mb-6 flex items-center gap-2">
                <span>📺</span> Free Video Vault Lectures
              </h3>
              {organiser.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {organiser.videos.map(video => (
                    <Link href={`/player?v=${video.id}`} key={video.id} className="group flex flex-col">
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-black">
                        {video.thumbnailUrl && <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-[#00873a] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        {video.category && (
                          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                            {video.category}
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-[#1f2e22] line-clamp-2 group-hover:text-[#00873a] transition-colors">{video.title}</h4>
                      {video.description && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{video.description}</p>}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                  No free video lectures available currently.
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-black text-[#1f2e22] mb-4 border-b border-gray-100 pb-2">About the Organiser</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Summit Host</span>
                  <span className="font-bold text-[#1f2e22]">{organiser.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Organization</span>
                  <span className="font-bold text-[#1f2e22]">{organiser.organization || "HealthSummits Host"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Total Vault Videos</span>
                  <span className="font-bold text-[#1f2e22]">{organiser.videos.length} Lectures</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Scheduled Summits</span>
                  <span className="font-bold text-[#1f2e22]">{organiser.events.length} Events</span>
                </div>
                {organiser.website && (
                  <div className="pt-4 border-t border-gray-100">
                    <a href={organiser.website} target="_blank" rel="noopener noreferrer" className="text-[#00873a] font-bold hover:underline flex items-center gap-2">
                      🔗 Visit Official Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
