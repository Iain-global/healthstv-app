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

export default function OrganiserPortalClient({ organiser }: { organiser: OrganiserType }) {
  const [showInteractivePlayer, setShowInteractivePlayer] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

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
                    <span>Human Garage Delegate Video Menu</span>
                  </h2>
                  <p className="text-slate-400 text-xs font-medium">
                    Interactive 5-Day Summit Presentation • Scene Selection • 4K Masterclass Player
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
                src="/mediazilla/index.html"
                className="w-full h-full border-none min-h-[560px] lg:min-h-[640px]"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Sub-bar Guidance */}
            <div className="bg-[#121822] px-6 py-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓ Active:</span>
                Delegates can click any chapter or workshop to stream directly.
              </span>
              <span className="text-slate-400">
                Tip: Use <strong>❮ Menu</strong> inside the player to switch between chapters anytime.
              </span>
            </div>
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
