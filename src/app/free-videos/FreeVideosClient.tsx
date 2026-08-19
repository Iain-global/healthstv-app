"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type VideoData = {
  id: string;
  dbId?: number;
  title: string;
  speaker: string;
  category: string;
  duration: string;
  views: string;
  description: string;
  imageUrl: string;
  videoSrc: string;
  isFree: boolean;
  price: number;
};

const DEFAULT_VIDEOS: VideoData[] = [
  {
    id: "vid-advert-1",
    title: "HealthSummit.TV Advert",
    speaker: "HealthSummits Team",
    category: "Featured",
    duration: "1 min",
    views: "1,200 views",
    description: "Watch the official introductory preview and advert for HealthSummits.tv. Discover our livestreaming summits, expert talks, and video vault.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800",
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1",
    isFree: true,
    price: 0
  },
  {
    id: "vid-timeline-1",
    title: "Timeline 1",
    speaker: "HealthSummits Team",
    category: "Featured",
    duration: "3 mins",
    views: "450 views",
    description: "Special feature presentation and video timeline stream from HealthSummits.tv.",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=g5tf7vci5y8g&is_link=1&w=720&h=405&pause=1",
    isFree: true,
    price: 0
  },
  {
    id: "vid-svp-1",
    title: "Introduction to Cellular Detoxification",
    speaker: "Dr. Sarah Jenkins",
    category: "Functional Medicine",
    duration: "24 mins",
    views: "2,480 views",
    description: "Official broadcast showcasing clinical detoxification, cellular regeneration, and integrative medicine.",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1",
    isFree: true,
    price: 0
  },
  {
    id: "vid-ppv-demo",
    title: "Advanced Metabolic & Mitochondrial Masterclass (PPV)",
    speaker: "Dr. Sarah Jenkins",
    category: "Functional Medicine",
    duration: "45 mins",
    views: "1,850 views",
    description: "Exclusive deep-dive lecture exploring mitochondrial dynamics, NAD+ metabolism, and clinical fasting protocols.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800",
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=g5tf7vci5y8g&is_link=1&w=720&h=405&pause=1",
    isFree: false,
    price: 4.99
  }
];

const CATEGORIES = [
  "All Categories",
  "Featured",
  "Functional Medicine",
  "Longevity",
  "Nutrition",
  "Mental Wellbeing",
  "Natural Medicine"
];

export default function FreeVideosClient({ initialVideos = [] }: { initialVideos?: any[] }) {
  // Combine DB videos with fallback defaults
  const initialVaultVideos: VideoData[] = initialVideos.length > 0 ? initialVideos.map(v => ({
    id: v.id.toString(),
    dbId: v.id,
    title: v.title,
    speaker: v.organiser?.name || "Platform Presenter",
    category: v.category || "Uncategorized",
    duration: v.isFree ? "Full Access" : "PPV Session",
    views: "Recent",
    description: v.description || "Video lecture hosted on HealthSummits.tv",
    imageUrl: v.thumbnailUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800",
    videoSrc: v.videoUrl,
    isFree: v.isFree !== undefined ? Boolean(v.isFree) : true,
    price: Number(v.price || 0)
  })) : DEFAULT_VIDEOS;

  const [videosList, setVideosList] = useState<VideoData[]>(initialVaultVideos);
  const [activeVideo, setActiveVideo] = useState<VideoData>(initialVaultVideos[0] || DEFAULT_VIDEOS[0]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  // Real-time EventSource Stream Listener for Viewer Vault
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');

      eventSource.addEventListener('video:approved', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.video) {
            const updatedVid: VideoData = {
              id: data.video.id.toString(),
              dbId: data.video.id,
              title: data.video.title,
              speaker: data.video.organiser?.name || "Platform Presenter",
              category: data.video.category || "Uncategorized",
              duration: data.video.isFree ? "Full Access" : "PPV Session",
              views: "Recent",
              description: data.video.description || "",
              imageUrl: data.video.thumbnailUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800",
              videoSrc: data.video.videoUrl,
              isFree: Boolean(data.video.isFree),
              price: Number(data.video.price || 0)
            };

            setVideosList(prev => {
              const idx = prev.findIndex(v => v.dbId === data.video.id || v.id === data.video.id.toString());
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = updatedVid;
                return next;
              }
              return [updatedVid, ...prev];
            });

            setActiveVideo(current => {
              if (current.dbId === data.video.id || current.id === data.video.id.toString()) {
                return updatedVid;
              }
              return current;
            });
          }
        } catch (err) {
          console.error('SSE error in FreeVideosClient:', err);
        }
      });
    } catch (err) {
      console.error(err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // User auth and purchased video state
  const [user, setUser] = useState<any>(null);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);

  // 30-Second Preview & Playback state (defaults to false so timer only runs when played)
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewSeconds, setPreviewSeconds] = useState(30);
  const [isPaywallTriggered, setIsPaywallTriggered] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // In-paywall quick auth state
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Fetch current user session
  useEffect(() => {
    fetch('/api/auth/update')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          if (data.user.purchasedVideoIds) {
            setPurchasedIds(data.user.purchasedVideoIds);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Determine if viewer has full access to the active video (Free videos only; PPV requires live gateway)
  const hasFullAccess = Boolean(activeVideo.isFree);

  // Reset preview timer and play state when active video changes
  useEffect(() => {
    setPreviewSeconds(30);
    setIsPaywallTriggered(false);
    setPurchaseSuccess(false);
    // Only auto-play if it is free or already unlocked, otherwise wait for user to press play
    setIsPlaying(hasFullAccess);
  }, [activeVideo.id, hasFullAccess]);

  // 30-Second countdown timer for PPV videos (only runs when isPlaying is true)
  useEffect(() => {
    if (hasFullAccess) {
      setIsPaywallTriggered(false);
      return;
    }

    let interval: any = null;
    if (isPlaying && previewSeconds > 0 && !isPaywallTriggered) {
      interval = setInterval(() => {
        setPreviewSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPaywallTriggered(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, previewSeconds, hasFullAccess, isPaywallTriggered]);

  // Generate secure player URL based on access level
  const getVideoEmbedUrl = (rawUrl: string, hasAccess: boolean, playing: boolean) => {
    if (!rawUrl) return "about:blank";
    if (!hasAccess && !playing) return "about:blank";

    // Full access: regular playback with full controls
    if (hasAccess) {
      return rawUrl;
    }

    // Preview mode: Disable internal timeline controls with no_ctrl=1 so users cannot scrub/skip ahead
    let url = rawUrl;
    if (url.includes("no_ctrl=")) {
      url = url.replace(/no_ctrl=[^&]*/, "no_ctrl=1");
    } else if (url.includes("?")) {
      url += "&no_ctrl=1";
    }

    if (playing) {
      if (url.includes("auto_play=")) {
        url = url.replace(/auto_play=[^&]*/, "auto_play=1");
      } else if (url.includes("?")) {
        url += "&auto_play=1";
      }
    }

    return url;
  };

  // Handler to start the 30-second preview
  const startPreview = () => {
    setIsPlaying(true);
  };

  // Purchase / Unlock handler (Strictly called when clicking "Pay £X.XX" button)
  const handlePurchase = async () => {
    if (!user) {
      setIsPaywallTriggered(true);
      return;
    }

    setPurchaseLoading(true);
    try {
      if (activeVideo.dbId) {
        const res = await fetch('/api/videos/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: activeVideo.dbId })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setPurchasedIds(prev => [...prev, activeVideo.dbId!]);
          setPurchaseSuccess(true);
          setTimeout(() => {
            setIsPaywallTriggered(false);
            setIsPlaying(true);
          }, 1000);
        } else {
          alert(data.error || 'Failed to complete unlock.');
        }
      } else {
        // Fallback demo video
        setPurchasedIds(prev => [...prev, 999999]);
        setPurchaseSuccess(true);
        setTimeout(() => {
          setIsPaywallTriggered(false);
          setIsPlaying(true);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Quick In-Paywall Login / Register (Step 1 of PPV)
  const handleQuickAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === "signin") {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authEmail, password: authPassword })
        });
        const data = await res.json();
        if (res.ok) {
          // Re-fetch profile
          const pRes = await fetch('/api/auth/update');
          const pData = await pRes.json();
          if (pData.success) {
            setUser(pData.user);
            if (pData.user.purchasedVideoIds) {
              setPurchasedIds(pData.user.purchasedVideoIds);
            }
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('auth-change'));
            }
          }
        } else {
          setAuthError(data.error || "Login failed. Please check your credentials.");
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: authName.trim() || authEmail.trim().split('@')[0],
            email: authEmail.trim(),
            password: authPassword.trim()
          })
        });
        const data = await res.json();
        if (res.ok) {
          const pRes = await fetch('/api/auth/update');
          const pData = await pRes.json();
          if (pData.success) {
            setUser(pData.user);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('auth-change'));
            }
          }
        } else {
          setAuthError(data.error || "Registration failed.");
        }
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const filteredVideos = videosList.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) || v.speaker.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All Categories" || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Featured Theater Stage (Active Video Player) */}
      <div className="bg-white border border-[#e0e8e2] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-5">
          
          {/* Left Player Area */}
          <div className="bg-black relative w-full aspect-video md:col-span-3 overflow-hidden flex items-center justify-center">
            
            {/* 1. Play Button / Start Preview Overlay (When not playing yet on PPV) */}
            {!hasFullAccess && !isPlaying && !isPaywallTriggered && (
              <div 
                onClick={startPreview}
                className="absolute inset-0 z-30 bg-cover bg-center cursor-pointer group flex flex-col items-center justify-center p-6 text-center"
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4)), url('${activeVideo.imageUrl}')` }}
              >
                <div className="w-20 h-20 rounded-full bg-[#ea8125] text-white flex items-center justify-center shadow-[0_0_30px_rgba(234,129,37,0.6)] group-hover:scale-110 transition-transform mb-4">
                  <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current ml-1"><path d="M8 5v14l11-7z"/></svg>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-wider mb-2">
                  🔒 Pay-Per-View Video (£{activeVideo.price.toFixed(2)})
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white max-w-md mb-1 leading-snug">
                  {activeVideo.title}
                </h3>
                <p className="text-orange-200 text-xs font-medium">
                  Click to start your <strong>30-second free preview</strong>
                </p>
              </div>
            )}

            {/* 2. Active Preview Countdown Indicator (When playing during preview) */}
            {!hasFullAccess && isPlaying && !isPaywallTriggered && (
              <div className="absolute top-3 left-3 z-30 bg-black/85 backdrop-blur-md border border-orange-500/60 text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2.5 shadow-xl animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span>Preview Mode: <strong>{previewSeconds}s</strong> remaining</span>
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="ml-1 bg-white/20 hover:bg-white/30 text-[0.65rem] px-2 py-0.5 rounded text-slate-200"
                >
                  Pause
                </button>
              </div>
            )}

            {/* 3. Interactive Scrubbing Guard (Shields timeline and prevents skipping during 30s preview) */}
            {!hasFullAccess && isPlaying && !isPaywallTriggered && (
              <div 
                onClick={() => setIsPaywallTriggered(true)}
                className="absolute bottom-0 left-0 right-0 h-16 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between px-4 text-xs text-white/90 cursor-pointer hover:bg-black/90 transition-colors select-none"
                title="Timeline scrubbing is disabled during the 30s preview. Click to unlock full video."
              >
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-[0.65rem] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    🔒 Timeline Locked
                  </span>
                  <span className="text-[0.75rem] text-slate-200 hidden sm:inline">
                    Seeking disabled during 30s preview
                  </span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPaywallTriggered(true); }}
                  className="bg-[#ea8125] hover:bg-[#d4701a] text-white text-xs font-bold px-3 py-1 rounded shadow transition-transform hover:scale-105"
                >
                  Unlock Full (£{activeVideo.price.toFixed(2)})
                </button>
              </div>
            )}

            {/* 3. In-Player Paywall Overlay (When 30s preview expires) */}
            {isPaywallTriggered && (
              <div className="absolute inset-0 z-40 bg-[#0c1c10]/95 backdrop-blur-md p-6 sm:p-8 flex flex-col items-center justify-center text-center text-white overflow-y-auto">
                <div className="max-w-md w-full my-auto">
                  
                  {purchaseSuccess ? (
                    <div className="py-8">
                      <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg animate-bounce">
                        ✓
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">Video Access Unlocked!</h3>
                      <p className="text-green-200 text-sm">Enjoy full uninterrupted streaming for this masterclass.</p>
                    </div>
                  ) : (
                    <>
                      <div className="inline-flex items-center gap-2 bg-orange-500/20 text-[#ea8125] border border-orange-500/40 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                        <span>🔒</span> 30-Second Preview Ended
                      </div>

                      <h3 className="text-2xl font-black text-white mb-1.5 leading-tight">
                        Unlock Full Masterclass
                      </h3>
                      <p className="text-slate-300 text-xs mb-4 line-clamp-2">
                        {activeVideo.title} • {activeVideo.speaker}
                      </p>

                      {/* Price Badge */}
                      <div className="bg-white/10 border border-white/15 rounded-xl p-3.5 mb-5 flex items-center justify-between">
                        <div className="text-left">
                          <div className="text-xs text-slate-300 font-medium">One-Time Pay-Per-View Pass</div>
                          <div className="text-xs text-green-400 font-bold">✓ Unlimited Lifetime Replay</div>
                        </div>
                        <div className="text-3xl font-black text-white">
                          £{activeVideo.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Developer Note */}
                      <div className="bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-2 mb-4">
                        <span className="font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded text-[0.6rem]">
                          DEV NOTE
                        </span>
                        <span>TODO: Wire up live payments (Stripe/Gateway)</span>
                      </div>

                      {/* Disabled Pay Button */}
                      <button
                        type="button"
                        disabled
                        className="w-full bg-slate-700/60 text-slate-300 py-3.5 px-6 rounded-xl font-bold text-sm border border-white/10 cursor-not-allowed flex items-center justify-center gap-2 opacity-80 mb-3"
                      >
                        <span>🔒 Pay £{activeVideo.price.toFixed(2)} to Unlock (Payments Coming Soon)</span>
                      </button>

                      <p className="text-[0.75rem] text-slate-400 mb-4">
                        Pay-per-view payment gateway integration is currently pending. Full video access will be available once payments are wired up.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewSeconds(30);
                          setIsPaywallTriggered(false);
                          setIsPlaying(true);
                        }}
                        className="text-xs text-slate-400 hover:text-white underline transition-colors"
                      >
                        Restart 30s Preview
                      </button>
                    </>
                  )}

                </div>
              </div>
            )}

            {/* Video Iframe Player */}
            <iframe 
              key={`${activeVideo.id}-${hasFullAccess ? 'full' : isPlaying ? 'playing' : 'paused'}`}
              src={getVideoEmbedUrl(activeVideo.videoSrc, hasFullAccess, isPlaying)}
              className="absolute top-0 left-0 w-full h-full border-none" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen>
            </iframe>

          </div>

          {/* Right Info Area */}
          <div className="p-8 md:p-10 flex flex-col justify-center md:col-span-2">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="bg-[#e6f7ec] text-[#00873a] text-xs font-black px-3 py-1 rounded-full uppercase">★ Now Playing</span>
              <span className="bg-[#f0f4f1] text-[#5e6d62] text-xs font-bold px-3 py-1 rounded-full">{activeVideo.category}</span>
              
              {activeVideo.isFree ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full ml-auto">
                  🟢 Free Access
                </span>
              ) : hasFullAccess ? (
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full ml-auto">
                  ✓ PPV Unlocked
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-2.5 py-1 rounded-full ml-auto">
                  🔒 PPV £{activeVideo.price.toFixed(2)}
                </span>
              )}
            </div>

            <h2 className="text-[1.65rem] font-black text-[#0c1c10] mb-3 leading-tight">
              {activeVideo.title}
            </h2>
            <p className="text-[#5e6d62] text-[0.95rem] leading-relaxed mb-6">
              {activeVideo.description}
            </p>

            {/* Pricing & Callout */}
            {!activeVideo.isFree && !hasFullAccess && (
              <div className="mb-5 p-3.5 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-orange-900">Pay-Per-View Session</div>
                  <div className="text-[0.75rem] text-orange-700">30s free preview included</div>
                </div>
                <button 
                  onClick={() => setIsPaywallTriggered(true)}
                  className="bg-[#ea8125] hover:bg-[#d3701a] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  Unlock (£{activeVideo.price.toFixed(2)})
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 text-[0.88rem] text-[#5e6d62] pt-4 border-t border-[#e0e8e2] flex-wrap">
              <span>🎙️ <strong>{activeVideo.speaker}</strong></span>
              <span>•</span>
              <span>⏱️ <strong>{activeVideo.duration}</strong></span>
              <span>•</span>
              {activeVideo.isFree ? (
                <span className="text-[#00873a] font-bold">✓ Free Access</span>
              ) : hasFullAccess ? (
                <span className="text-green-700 font-bold">✓ Full Pass</span>
              ) : (
                <span className="text-[#ea8125] font-bold">£{activeVideo.price.toFixed(2)} PPV</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Gallery Header & Controls */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-[1.8rem] font-black text-[#0c1c10] m-0 mb-1">Health Video Gallery</h2>
            <p className="text-[#5e6d62] text-[0.95rem] m-0">Click on any lecture below to watch instantly in the player above.</p>
          </div>
          <div className="relative min-w-[260px]">
            <input 
              type="text" 
              placeholder="Search talks or speakers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 px-4 pl-10 border border-[#e0e8e2] rounded-full text-sm bg-white outline-none focus:border-[#006818] focus:ring-1 focus:ring-[#006818]"
            />
            <svg viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 fill-[#5e6d62]">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2.5 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-[#006818] text-white shadow-md' : 'bg-white text-[#5e6d62] border border-[#e0e8e2] hover:bg-[#e0e8e2]/50 hover:text-[#0c1c10]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Gallery Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">No videos match your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-12">
          {filteredVideos.map(video => {
            const isUnlocked = Boolean(video.isFree);
            return (
              <div 
                key={video.id} 
                onClick={() => setActiveVideo(video)}
                className={`bg-white rounded-xl overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col ${activeVideo.id === video.id ? 'border-[#00873a] ring-2 ring-[#00873a]/20 shadow-md' : 'border-[#e0e8e2] shadow-sm'}`}
              >
                <div 
                  className="h-40 bg-cover bg-center relative group" 
                  style={{ backgroundImage: `url('${video.imageUrl}')` }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  
                  {/* Category Pill */}
                  <span className="absolute top-2 left-2 bg-[#000000]/70 backdrop-blur text-white text-[0.6rem] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {video.category}
                  </span>

                  {/* Access Badge */}
                  <span className={`absolute top-2 right-2 backdrop-blur text-white text-[0.65rem] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${video.isFree ? 'bg-emerald-600/90' : isUnlocked ? 'bg-green-600/90' : 'bg-orange-600/90 border border-orange-400/50'}`}>
                    {video.isFree ? 'Free' : isUnlocked ? '✓ Unlocked' : `PPV £${video.price.toFixed(2)}`}
                  </span>

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg ${video.isFree || isUnlocked ? 'bg-[#00873a]' : 'bg-[#ea8125]'}`}>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current ml-1"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-[0.98rem] font-bold text-[#0c1c10] mb-1.5 leading-tight line-clamp-2">{video.title}</h3>
                  <div className="text-[0.84rem] text-[#006818] font-bold mb-1.5">{video.speaker}</div>
                  <p className="text-[0.8rem] text-[#5e6d62] leading-relaxed mb-3 flex-1 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center justify-between text-[0.78rem] text-[#5e6d62] pt-3 border-t border-[#e0e8e2]">
                    <span>{video.views}</span>
                    {video.isFree ? (
                      <span className="text-[#00873a] font-bold">▶ Watch Free</span>
                    ) : isUnlocked ? (
                      <span className="text-green-700 font-bold">✓ Watch Full</span>
                    ) : (
                      <span className="text-[#ea8125] font-bold">▶ 30s Preview (£{video.price.toFixed(2)})</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Capabilities Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { icon: '📋', title: 'Curated Series Playlist', desc: 'Watch complete multi-part health seminars seamlessly in sequence.' },
          { icon: '⚡', title: 'Low-Latency Cloud Streaming', desc: 'High-definition video playback with adaptive bitrate streaming.' },
          { icon: '🔒', title: 'Pay-Per-View & Free Access', desc: 'Watch free lectures or unlock premium masterclasses with instant passes.' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-[#e0e8e2] shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-bold text-[#0c1c10] mb-1 text-lg">{item.title}</div>
            <div className="text-sm text-[#5e6d62] leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}