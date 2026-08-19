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
  const vaultVideos: VideoData[] = initialVideos.length > 0 ? initialVideos.map(v => ({
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

  const [activeVideo, setActiveVideo] = useState<VideoData>(vaultVideos[0] || DEFAULT_VIDEOS[0]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  // User auth and purchased video state
  const [user, setUser] = useState<any>(null);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);

  // 30-Second Preview & Paywall state
  const [previewSeconds, setPreviewSeconds] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
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

  // Determine if viewer has full access to the active video
  const hasFullAccess = activeVideo.isFree || 
    Boolean(user?.isSubscriber) || 
    (activeVideo.dbId !== undefined && purchasedIds.includes(activeVideo.dbId));

  // Reset preview timer when active video changes
  useEffect(() => {
    setPreviewSeconds(30);
    setIsPaywallTriggered(false);
    setPurchaseSuccess(false);
    setIsPlaying(true);
  }, [activeVideo.id]);

  // 30-Second countdown timer for PPV videos
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

  // Purchase / Unlock handler
  const handlePurchase = async () => {
    if (!user) {
      setIsPaywallTriggered(true);
      return;
    }

    if (!activeVideo.dbId) {
      // Demo fallback video
      setPurchasedIds(prev => [...prev, 999999]);
      setPurchaseSuccess(true);
      setIsPaywallTriggered(false);
      return;
    }

    setPurchaseLoading(true);
    try {
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
        }, 1200);
      } else {
        alert(data.error || 'Failed to complete purchase.');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Quick In-Paywall Login / Register
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
          }
        } else {
          setAuthError(data.error || "Login failed");
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: authName,
            email: authEmail,
            password: authPassword
          })
        });
        const data = await res.json();
        if (res.ok) {
          const pRes = await fetch('/api/auth/update');
          const pData = await pRes.json();
          if (pData.success) {
            setUser(pData.user);
          }
        } else {
          setAuthError(data.error || "Registration failed");
        }
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const filteredVideos = vaultVideos.filter(v => {
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
            
            {/* 30-Second Preview Countdown Indicator */}
            {!hasFullAccess && !isPaywallTriggered && (
              <div className="absolute top-3 left-3 z-30 bg-black/80 backdrop-blur-md border border-orange-500/50 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span>Preview Mode: <strong>{previewSeconds}s</strong> remaining</span>
              </div>
            )}

            {/* Paywall Overlay */}
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

                      {/* Case 1: User is Logged In */}
                      {user ? (
                        <div className="space-y-3">
                          <div className="text-xs text-slate-300 bg-white/5 py-1.5 px-3 rounded-lg">
                            Logged in as <strong className="text-white">{user.name || user.email}</strong>
                          </div>

                          <button
                            onClick={handlePurchase}
                            disabled={purchaseLoading}
                            className="w-full bg-[#ea8125] hover:bg-[#d4701a] text-white py-3 px-6 rounded-xl font-black text-base shadow-lg transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {purchaseLoading ? "Processing..." : `💳 Unlock Now for £${activeVideo.price.toFixed(2)}`}
                          </button>

                          <button
                            onClick={() => {
                              setPreviewSeconds(30);
                              setIsPaywallTriggered(false);
                            }}
                            className="text-xs text-slate-400 hover:text-white underline transition-colors"
                          >
                            Restart 30s Preview
                          </button>
                        </div>
                      ) : (
                        /* Case 2: User is NOT Logged In */
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-left">
                          <div className="flex border-b border-white/10 pb-2 mb-3 gap-4 text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => { setAuthMode("signin"); setAuthError(""); }}
                              className={`pb-1 transition-colors ${authMode === "signin" ? "text-white border-b-2 border-[#00873a]" : "text-slate-400 hover:text-white"}`}
                            >
                              Sign In to Purchase
                            </button>
                            <button
                              type="button"
                              onClick={() => { setAuthMode("register"); setAuthError(""); }}
                              className={`pb-1 transition-colors ${authMode === "register" ? "text-white border-b-2 border-[#00873a]" : "text-slate-400 hover:text-white"}`}
                            >
                              Create Account
                            </button>
                          </div>

                          {authError && (
                            <div className="bg-red-500/20 border border-red-500 text-red-200 text-xs p-2 rounded mb-3">
                              {authError}
                            </div>
                          )}

                          <form onSubmit={handleQuickAuth} className="space-y-2.5">
                            {authMode === "register" && (
                              <input
                                required
                                type="text"
                                placeholder="Your Name"
                                value={authName}
                                onChange={e => setAuthName(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 outline-none focus:border-green-400"
                              />
                            )}
                            <input
                              required
                              type="email"
                              placeholder="Email address"
                              value={authEmail}
                              onChange={e => setAuthEmail(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 outline-none focus:border-green-400"
                            />
                            <input
                              required
                              type="password"
                              placeholder="Password"
                              value={authPassword}
                              onChange={e => setAuthPassword(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 outline-none focus:border-green-400"
                            />

                            <button
                              type="submit"
                              disabled={authLoading}
                              className="w-full bg-[#00873a] hover:bg-[#00682d] text-white py-2.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60"
                            >
                              {authLoading ? "Authenticating..." : (authMode === "signin" ? "Sign In & Continue" : "Register & Continue")}
                            </button>
                          </form>
                        </div>
                      )}
                    </>
                  )}

                </div>
              </div>
            )}

            {/* Video Iframe Player */}
            <iframe 
              key={`${activeVideo.id}-${hasFullAccess ? 'full' : 'preview'}`}
              src={activeVideo.videoSrc}
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
            const isUnlocked = video.isFree || Boolean(user?.isSubscriber) || (video.dbId !== undefined && purchasedIds.includes(video.dbId));
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