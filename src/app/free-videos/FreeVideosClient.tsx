"use client";

import { useState } from "react";
import Image from "next/image";

type VideoData = {
  id: string;
  title: string;
  speaker: string;
  category: string;
  duration: string;
  views: string;
  description: string;
  imageUrl: string;
  videoSrc: string;
};

const VIDEOS: VideoData[] = [
  {
    id: "vid-advert-1",
    title: "HeathSummit.TV Advert",
    speaker: "HealthSummits Team",
    category: "Featured",
    duration: "1 min",
    views: "1,200 views",
    description: "Watch the official introductory preview and advert for HealthSummits.tv. Discover our livestreaming summits, expert talks, and video vault.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800",
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1&title=HeathSummit.TV+Advert&skin=3&repeat=&brandNW=1&start_volume=100&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floating_player=none&share_options=1"
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
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=g5tf7vci5y8g&is_link=1&w=720&h=405&pause=1" // Simplified URL for demo
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
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1"
  },
  {
    id: "vid-2",
    title: "Circadian Rhythm & Optimizing Melatonin",
    speaker: "Prof. Liam Vance",
    category: "Longevity",
    duration: "24 mins",
    views: "980 views",
    description: "Prof. Liam Vance discusses light hygiene, sleep architecture, and cellular repair.",
    imageUrl: "https://images.unsplash.com/photo-1511295742364-92767fa62d9f?q=80&w=800",
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=g5tf7vci5y8g&is_link=1&w=720&h=405&pause=1"
  },
  {
    id: "vid-3",
    title: "Understanding Food Label Pitfalls",
    speaker: "Coach Marcus Thorne",
    category: "Nutrition",
    duration: "12 mins",
    views: "650 views",
    description: "A practical guide to decoding deceptive marketing terms on food packaging and avoiding seed oils.",
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800",
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1"
  },
  {
    id: "vid-4",
    title: "Breathing Protocols for Vagus Activation",
    speaker: "Fiona Gallagher",
    category: "Mental Wellbeing",
    duration: "15 mins",
    views: "820 views",
    description: "Physiological techniques to stimulate vagal tone and improve heart rate variability.",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=g5tf7vci5y8g&is_link=1&w=720&h=405&pause=1"
  },
  {
    id: "vid-5",
    title: "Herbal Extracts & Infusion Basics",
    speaker: "Jeanette Cole",
    category: "Natural Medicine",
    duration: "21 mins",
    views: "540 views",
    description: "An introduction to water infusions, decoctions, and tincture preparations using UK plants.",
    imageUrl: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=800",
    videoSrc: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1"
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
  
  // Combine DB videos (if any) with hardcoded fallbacks
  const vaultVideos = initialVideos.length > 0 ? initialVideos.filter(v => v.isFree).map(v => ({
    id: v.id.toString(),
    title: v.title,
    speaker: v.organiser?.name || "Platform Presenter",
    category: v.category || "Uncategorized",
    duration: "Full Video",
    views: "Recent",
    description: v.description || "Video lecture hosted on HealthSummits.tv",
    imageUrl: v.thumbnailUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800",
    videoSrc: v.videoUrl
  })) : VIDEOS;

  const [activeVideo, setActiveVideo] = useState<VideoData>(vaultVideos[0] || VIDEOS[0]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  const filteredVideos = vaultVideos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) || v.speaker.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All Categories" || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Featured Theater Stage (Active Video Player) */}
      <div className="bg-white border border-[#e0e8e2] rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.07)] overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="bg-black relative w-full aspect-video md:col-span-3">
            <iframe 
              key={activeVideo.id} // Force iframe reload when video changes
              src={activeVideo.videoSrc}
              className="absolute top-0 left-0 w-full h-full border-none" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center md:col-span-2">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="bg-[#e6f7ec] text-[#00873a] text-xs font-black px-3 py-1 rounded-full uppercase">★ Now Playing</span>
              <span className="bg-[#f0f4f1] text-[#5e6d62] text-xs font-bold px-3 py-1 rounded-full">{activeVideo.category}</span>
              <span className="text-[#ea8125] text-sm font-bold ml-auto">HD 1080p</span>
            </div>
            <h2 className="text-[1.65rem] font-black text-[#0c1c10] mb-3 leading-tight">
              {activeVideo.title}
            </h2>
            <p className="text-[#5e6d62] text-[0.95rem] leading-relaxed mb-6">
              {activeVideo.description}
            </p>
            <div className="flex items-center gap-4 text-[0.88rem] text-[#5e6d62] pt-4 border-t border-[#e0e8e2] flex-wrap">
              <span>🎙️ <strong>{activeVideo.speaker}</strong></span>
              <span>•</span>
              <span>⏱️ <strong>{activeVideo.duration}</strong></span>
              <span>•</span>
              <span className="text-[#00873a] font-bold">✓ Free Access</span>
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
          {filteredVideos.map(video => (
            <div 
              key={video.id} 
              onClick={() => setActiveVideo(video)}
              className={`bg-white rounded-xl overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col ${activeVideo.id === video.id ? 'border-[#006818] ring-2 ring-[#006818]/20 shadow-md' : 'border-[#e0e8e2] shadow-sm'}`}
            >
              <div 
                className="h-40 bg-cover bg-center relative group" 
                style={{ backgroundImage: `url('${video.imageUrl}')` }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <span className="absolute top-2 left-2 bg-[#000000]/70 backdrop-blur text-white text-[0.6rem] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {video.category}
                </span>
                <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#3724a6] text-white flex items-center justify-center shadow-lg">
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
                  <span className="text-[#ea8125] font-bold">▶ Watch Free</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Capabilities Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { icon: '📋', title: 'Curated Series Playlist', desc: 'Watch complete multi-part health seminars seamlessly in sequence.' },
          { icon: '⚡', title: 'Low-Latency Cloud HLS', desc: 'Delivered via StreamingVideoProvider CDN with adaptive resolution.' },
          { icon: '🔒', title: 'In-Player Paywall & Passes', desc: 'Instant £1.00 membership and virtual summit ticket purchases.' }
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
