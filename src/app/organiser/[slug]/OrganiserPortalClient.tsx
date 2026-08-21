"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type EventItem = {
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
};

type VideoItem = {
  id: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  category: string | null;
  isFree: boolean;
  price?: number;
};

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
  events: Array<EventItem>;
  videos: Array<VideoItem>;
};

export default function OrganiserPortalClient({ organiser }: { organiser: OrganiserType }) {
  const isGoodFoodPortal = organiser.slug === "steve-pollard" || organiser.slug === "stevepollard";
  const hasPastSummit = isGoodFoodPortal;

  const [activeTab, setActiveTab] = useState<"past-summits" | "events" | "free-videos" | "pay-to-view">(
    hasPastSummit ? "past-summits" : "events"
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const freeVideos = organiser.videos.filter((v) => v.isFree);
  const premiumVideos = organiser.videos.filter((v) => !v.isFree);

  return (
    <div className="min-h-screen bg-[#0d1217] text-white flex flex-col">
      {/* Top Breadcrumb Header */}
      <div className="border-b border-white/10 bg-[#131920]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link
            href="/organisers"
            className="text-xs font-bold text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to All Organisers</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5 text-gray-300"
            >
              {copiedLink ? <span>✓ Link Copied!</span> : <span>🔗 Share Portal</span>}
            </button>
            {organiser.website && (
              <a
                href={organiser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Hero Profile Banner */}
      <div className="relative bg-gradient-to-b from-[#182029] to-[#0d1217] border-b border-white/10 py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-5">
              {/* Avatar / Logo */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-2xl md:text-3xl font-black text-emerald-400 shrink-0 overflow-hidden relative shadow-xl">
                {organiser.profilePhotoUrl ? (
                  <Image
                    src={organiser.profilePhotoUrl}
                    alt={organiser.organization || organiser.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  organiser.avatarInitials || (organiser.organization || organiser.name).substring(0, 2).toUpperCase()
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                    {organiser.organization || organiser.name}
                  </h1>
                  <div className="flex items-center gap-1.5">
                    {organiser.isFounding && (
                      <span className="bg-red-600 text-white text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-extrabold shadow-sm">
                        Founding
                      </span>
                    )}
                    {organiser.isVerified && (
                      <span className="bg-emerald-600 text-white text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1 shadow-sm">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                {organiser.organization && (
                  <p className="text-sm font-semibold text-emerald-400 mb-2">
                    Host: {organiser.name}
                  </p>
                )}

                <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
                  {organiser.bio ||
                    "Official delegate portal on HealthSummits.tv. Explore upcoming workshops, free video vault lectures, and premium passes."}
                </p>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className={`grid ${hasPastSummit ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"} gap-3 w-full md:w-auto shrink-0 bg-white/5 border border-white/10 p-3.5 rounded-2xl`}>
              {hasPastSummit && (
                <div className="text-center px-2">
                  <div className="text-xl font-black text-amber-400">5-Day</div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Summit Archive</div>
                </div>
              )}
              <div className={`text-center px-2 ${hasPastSummit ? "border-l border-white/10" : ""}`}>
                <div className="text-xl font-black text-emerald-400">{organiser.events.length}</div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Upcoming Events</div>
              </div>
              <div className="text-center px-2 border-l border-white/10">
                <div className="text-xl font-black text-blue-400">{freeVideos.length}</div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Free Lectures</div>
              </div>
              <div className="text-center px-2 border-l border-white/10">
                <div className="text-xl font-black text-purple-400">{premiumVideos.length}</div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Pay to View</div>
              </div>
            </div>
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
            {hasPastSummit && (
              <button
                onClick={() => setActiveTab("past-summits")}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "past-summits"
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                }`}
              >
                <span>🏛️</span>
                <span>Past Summits</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    activeTab === "past-summits" ? "bg-black/20 text-black" : "bg-white/10 text-gray-300"
                  }`}
                >
                  5-Day Series
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("events")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "events"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              }`}
            >
              <span>🎟️</span>
              <span>Upcoming Events</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  activeTab === "events" ? "bg-black/20 text-black" : "bg-white/10 text-gray-300"
                }`}
              >
                {organiser.events.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("free-videos")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "free-videos"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              }`}
            >
              <span>📺</span>
              <span>Free Videos</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  activeTab === "free-videos" ? "bg-black/30 text-white" : "bg-white/10 text-gray-300"
                }`}
              >
                {freeVideos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("pay-to-view")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "pay-to-view"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              }`}
            >
              <span>💎</span>
              <span>Pay to View</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  activeTab === "pay-to-view" ? "bg-black/30 text-white" : "bg-white/10 text-gray-300"
                }`}
              >
                {premiumVideos.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Body Area */}
      <div className="container mx-auto max-w-7xl px-4 py-8 flex-1">
        {/* ========================================================================= */}
        {/* TAB 1: PAST SUMMITS (Interactive 5-Day Presentation Menu & Player) */}
        {/* ========================================================================= */}
        {activeTab === "past-summits" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Past Summit Interactive Presentation & Scene Selection</span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Click any Day (Day 1 – Day 5) and choose a session card to stream the video masterclass with full chapter markers.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/summit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>⛶ Fullscreen Cinema Mode</span>
                </Link>
              </div>
            </div>

            {/* Embedded MediaZilla Interactive Presentation Frame */}
            <div className="w-full aspect-[16/9] min-h-[640px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black relative">
              <iframe
                src={`/mediazilla/index.html?organiser=${organiser.slug || "steve-pollard"}`}
                className="w-full h-full border-none"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: UPCOMING EVENTS & WORKSHOPS */}
        {/* ========================================================================= */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span>🎟️</span>
                <span>Upcoming Events & Workshops</span>
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Official virtual summits, live webinars, and in-person UK workshops hosted by {organiser.organization || organiser.name}.
              </p>
            </div>

            {organiser.events.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-gray-400 text-sm">No upcoming events scheduled right now. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organiser.events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-[#151c24] border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {event.imageUrl && (
                        <div className="w-full h-48 relative overflow-hidden bg-black/40">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                            {event.format || "Virtual & In-Person"}
                          </div>
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                            {event.price === 0 ? "FREE" : `£${event.price.toFixed(2)}`}
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span>📅</span>
                          <span>
                            {new Date(event.date).toLocaleDateString("en-GB", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors mb-2 line-clamp-2">
                          {event.title}
                        </h3>

                        {event.location && (
                          <div className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                            <span>📍</span>
                            <span>{event.location}</span>
                          </div>
                        )}

                        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                          {event.description || "Join us for this exclusive health & wellbeing event."}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <a
                        href={event.ticketUrl || "#"}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <span>🎟️ Book Tickets</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FREE VIDEOS (Video Vault) */}
        {/* ========================================================================= */}
        {activeTab === "free-videos" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span>📺</span>
                <span>Free Educational Video Vault</span>
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Complimentary masterclass lectures, keynote previews, and clinical protocol overviews.
              </p>
            </div>

            {freeVideos.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-gray-400 text-sm">No free videos uploaded yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freeVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-[#151c24] border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-blue-500/40 transition-all flex flex-col justify-between group cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div>
                      <div className="w-full h-48 relative overflow-hidden bg-black/60">
                        {video.thumbnailUrl && (
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg pl-0.5 shadow-xl group-hover:scale-110 transition-transform">
                            ▶
                          </div>
                        </div>
                        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                          {video.category || "Free Vault"}
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-base font-black text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                          {video.description || "Watch this masterclass lecture directly on HealthSummits.tv."}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button className="w-full py-2 bg-white/10 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
                        <span>▶ Watch Lecture</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PAY TO VIEW (Masterclasses & Full Summit Passes) */}
        {/* ========================================================================= */}
        {activeTab === "pay-to-view" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span>💎</span>
                <span>Pay to View Masterclasses & Summit Passes</span>
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Unlock full 4K multi-day summit archives, downloadable practitioner guides, and exclusive clinical protocols.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-[#151c24] border border-purple-500/30 rounded-2xl overflow-hidden shadow-xl hover:border-purple-500/60 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-full h-48 relative overflow-hidden bg-black/60">
                      {video.thumbnailUrl && (
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                        {video.category || "Masterclass Pass"}
                      </div>
                      <div className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-lg">
                        £{video.price ? video.price.toFixed(2) : "29.00"}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-black text-white group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
                        {video.description || "Unlock full access to this premium series with lifetime streaming and resource downloads."}
                      </p>

                      <ul className="space-y-1.5 text-xs text-gray-300 mb-2">
                        <li className="flex items-center gap-1.5 text-emerald-400">
                          <span>✓</span>
                          <span>Full 4K Replay Archive</span>
                        </li>
                        <li className="flex items-center gap-1.5 text-emerald-400">
                          <span>✓</span>
                          <span>Downloadable Slide Decks & Audio</span>
                        </li>
                        <li className="flex items-center gap-1.5 text-emerald-400">
                          <span>✓</span>
                          <span>Lifetime Delegate Access</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => alert(`Redirecting to secure checkout for £${video.price || 29.00}...`)}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30"
                    >
                      <span>🔒 Unlock Full Access</span>
                      <span>•</span>
                      <span>£{video.price ? video.price.toFixed(2) : "29.00"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal Player for Free / Selected Videos */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#131920] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-blue-600 px-2 py-0.5 rounded-full text-white mr-2">
                  {selectedVideo.category || "Free Video Vault"}
                </span>
                <span className="text-sm font-bold text-white">{selectedVideo.title}</span>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="w-full aspect-video bg-black relative">
              {isGoodFoodPortal ? (
                <iframe
                  src={`/mediazilla/index.html?organiser=${organiser.slug}`}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0e141b]">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-2xl mb-3">
                    ▶
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{selectedVideo.title}</h4>
                  <p className="text-xs text-gray-400 max-w-md mb-4">
                    {selectedVideo.description || "Video playback stream from organiser video archive."}
                  </p>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                    Complimentary Lecture Stream
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5">
              <p className="text-xs text-gray-300 leading-relaxed">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
