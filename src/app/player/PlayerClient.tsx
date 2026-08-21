"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";

type EventType = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  imageUrl: string | null;
  price: number;
  organiserId: number;
  createdAt: Date;
  format?: string | null;
  ticketingMethod?: string | null;
  ticketUrl?: string | null;
};

const SUMMIT_SCHEDULE = [
  {
    day: 1,
    name: "Day 1",
    theme: "Cellular Health & Longevity Foundations",
    sessions: [
      { id: "s1-1", number: 1, time: "09:00 - 10:30", title: "Keynote: Mitochondrial Biology & Cellular Renewal", speaker: "Dr. Sarah Jenkins", status: "Completed" },
      { id: "s1-2", number: 2, time: "11:00 - 12:30", title: "Clinical Protocols: NAD+, Peptides & Fasting Windows", speaker: "Prof. Liam Vance", status: "Live Broadcast" },
      { id: "s1-3", number: 3, time: "14:00 - 15:30", title: "Masterclass: Autophagy Induction & Biomarker Testing", speaker: "Dr. Jonathan Hayes", status: "Upcoming" },
      { id: "s1-4", number: 4, time: "16:00 - 17:30", title: "Interactive Panel & Live Audience Q&A", speaker: "All Keynote Speakers", status: "Upcoming" },
    ]
  },
  {
    day: 2,
    name: "Day 2",
    theme: "Microbiome, Gut-Brain Axis & Inflammation",
    sessions: [
      { id: "s2-1", number: 1, time: "09:00 - 10:30", title: "Keynote: The Microbiome as a Master Regulator", speaker: "Dr. Alistair Ross", status: "Upcoming" },
      { id: "s2-2", number: 2, time: "11:00 - 12:30", title: "Clinical Protocols: Dysbiosis, SIBO & Psychobiotics", speaker: "Rachel Davies", status: "Upcoming" },
      { id: "s2-3", number: 3, time: "14:00 - 15:30", title: "Workshop: Vagus Nerve Stimulation & Gut Motility", speaker: "Dr. Elena Rostova", status: "Upcoming" },
      { id: "s2-4", number: 4, time: "16:00 - 17:30", title: "Case Studies: Reversing Chronic Gut Inflammation", speaker: "Clinical Panel", status: "Upcoming" },
    ]
  },
  {
    day: 3,
    name: "Day 3",
    theme: "Hormone Optimization & Metabolic Precision",
    sessions: [
      { id: "s3-1", number: 1, time: "09:00 - 10:30", title: "Keynote: Endocrine Reset & Metabolic Flexibility", speaker: "Dr. Marcus Thorne", status: "Upcoming" },
      { id: "s3-2", number: 2, time: "11:00 - 12:30", title: "Bio-Identical Hormones & Thyroid Mastery", speaker: "Dr. Rebecca Sterling", status: "Upcoming" },
      { id: "s3-3", number: 3, time: "14:00 - 15:30", title: "Continuous Glucose Monitoring & Insulin Sensitivity", speaker: "Sophia Martinez", status: "Upcoming" },
      { id: "s3-4", number: 4, time: "16:00 - 17:30", title: "Evening Roundtable: Personalized Hormone Therapies", speaker: "Expert Roundtable", status: "Upcoming" },
    ]
  },
  {
    day: 4,
    name: "Day 4",
    theme: "Neuroplasticity, Sleep Architecture & Mental Wellness",
    sessions: [
      { id: "s4-1", number: 1, time: "09:00 - 10:30", title: "Keynote: Sleep Architecture, Glymphatic Clearance & REM", speaker: "David Chen", status: "Upcoming" },
      { id: "s4-2", number: 2, time: "11:00 - 12:30", title: "Cognitive Longevity: Nootropics, BDNF & Focus", speaker: "Dr. Arthur Pendelton", status: "Upcoming" },
      { id: "s4-3", number: 3, time: "14:00 - 15:30", title: "Heart Rate Variability (HRV) & Stress Resilience", speaker: "Dr. Sarah Jenkins", status: "Upcoming" },
      { id: "s4-4", number: 4, time: "16:00 - 17:30", title: "Sound Frequencies, Light Hygiene & Evening Reset", speaker: "Wellness Team", status: "Upcoming" },
    ]
  },
  {
    day: 5,
    name: "Day 5",
    theme: "Integrative Protocols, Longevity & Future of Health",
    sessions: [
      { id: "s5-1", number: 1, time: "09:00 - 10:30", title: "Keynote: The 15-Minute Daily Longevity Protocol", speaker: "Dr. Sarah Jenkins", status: "Upcoming" },
      { id: "s5-2", number: 2, time: "11:00 - 12:30", title: "Biohacking & Regenerative Medicine in Clinical Practice", speaker: "Prof. Liam Vance", status: "Upcoming" },
      { id: "s5-3", number: 3, time: "14:00 - 15:30", title: "Action Plan: Integrating Multi-Day Summit Protocols", speaker: "Dr. Jonathan Hayes", status: "Upcoming" },
      { id: "s5-4", number: 4, time: "16:00 - 17:30", title: "Grand Closing Summit Keynote & Certificate Awards", speaker: "All Founders & Speakers", status: "Upcoming" },
    ]
  }
];

export default function PlayerClient({ event }: { event: EventType }) {
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [pinError, setPinError] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSessionId, setSelectedSessionId] = useState("s1-2");

  const currentDayData = SUMMIT_SCHEDULE.find((d) => d.day === selectedDay) || SUMMIT_SCHEDULE[0];
  const currentSession = currentDayData.sessions.find((s) => s.id === selectedSessionId) || currentDayData.sessions[0];

  const [activeTab, setActiveTab] = useState<"chat" | "qa" | "notes">("chat");
  const [chatMessages, setChatMessages] = useState<{sender: string, text: string, isMe: boolean}[]>([
    { sender: "System", text: "Welcome to the live chat!", isMe: false }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [notes, setNotes] = useState("");

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`event_notes_${event.id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [event.id]);

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`event_notes_${event.id}`, notes);
  }, [notes, event.id]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    setPinError(false);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto advance
    if (value !== "" && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    const enteredPin = pin.join("");
    if (enteredPin === "123456") {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const autofillDemoPin = () => {
    setPin(["1", "2", "3", "4", "5", "6"]);
    setPinError(false);
  };

  const sendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages([...chatMessages, { sender: "You", text: chatInput, isMe: true }]);
    setChatInput("");
  };

  const liveStreamUrl = (event.ticketUrl && event.ticketUrl.includes('webvideocore.net')) 
    ? event.ticketUrl 
    : "https://play.webvideocore.net/popplayer.php?it=ao1uksns7egw&is_link=1&w=720&h=405&pause=1&title=HealthSummits.tv&skin=3&repeat=&brandNW=1&start_volume=100&bg_gradient1=%23ffffff&bg_gradient2=%23e9e9e9&fullscreen=1&fs_mode=2&skinAlpha=50&colorBase=%23250864&colorIcon=%23ffffff&colorHighlight=%237f54f8&direct=false&no_ctrl=&auto_hide=1&viewers_limit=0&cc_position=bottom&cc_positionOffset=70&cc_multiplier=0.03&cc_textColor=%23ffffff&cc_textOutlineColor=%23ffffff&cc_bkgColor=%23000000&cc_bkgAlpha=0.1&image=https%3A%2F%2Fmember.streamingvideoprovider.com%2Fpanel%2Fserver%2Fclip%3Fa%3DGenerateThumbnail%26clip_id%3D11838096%26size%3Dlarge&mainBg_Color=%23ffffff&aspect_ratio=16%3A9&play_button=1&play_button_style=pulsing&sleek_player=1&stretch=&auto_play=0&auto_play_type=unMute&floating_player=none&share_options=1";

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-custom {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .animate-pulse-custom {
          animation: pulse-custom 1.5s infinite;
        }
      `}} />

      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse-custom"></span>
              {currentSession.status === "Live Broadcast" ? "LIVE BROADCAST" : currentSession.status.toUpperCase()}
            </span>
            <span className="text-[#a7f3d0] text-sm font-bold">
              {currentDayData.name} • Session {currentSession.number} ({currentSession.time})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white m-0 leading-tight">
            {currentSession.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Speaker: <strong className="text-emerald-400">{currentSession.speaker}</strong> • {currentDayData.theme}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsUnlocked(!isUnlocked)}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white flex items-center gap-2 transition-colors font-semibold"
          >
            <span>{isUnlocked ? "🔓" : "🔒"}</span>
            <span>{isUnlocked ? "Stream Unlocked (Click to Lock)" : "Unlock Stream"}</span>
          </button>
          <Link href="/events" className="border border-white/30 text-white hover:bg-white/10 px-4 py-1.5 rounded-md text-sm font-bold transition-colors">
            ← Back to Events
          </Link>
        </div>
      </div>

      {!isUnlocked ? (
        /* STATE A: LOCKED GATE */
        <div className="mb-10">
          <div className="relative w-full aspect-[4/3] md:aspect-video min-h-[500px] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
            
            {/* Thumbnail Backdrop */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-60 scale-105 transition-all"
              style={{ backgroundImage: `url('${event.imageUrl || '/menopause-cafe.png'}')` }}
            ></div>

            {/* PIN Dialog */}
            <div className="relative z-10 max-w-[480px] w-[90%] bg-[#0f1e14]/92 backdrop-blur-xl border border-green-300/30 rounded-2xl p-8 md:p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00873a] to-[#035222] flex items-center justify-center mx-auto mb-5 shadow-[0_6px_20px_rgba(0,135,58,0.4)]">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">Ticket Holder Protected Stream</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Enter your <strong>6-digit PIN</strong> or click below to launch the live stream player.
              </p>

              <form onSubmit={handleUnlock}>
                <div className="flex justify-center gap-2 mb-6">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { pinRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(index, e)}
                      className="w-12 h-14 bg-white text-black text-2xl font-bold text-center rounded-lg border-2 border-transparent focus:border-[#00873a] focus:outline-none"
                    />
                  ))}
                </div>

                {pinError && (
                  <div className="text-red-400 text-sm font-bold mb-4">
                    ⚠️ Invalid PIN. Please try again.
                  </div>
                )}

                <button type="submit" className="w-full bg-[#ea8125] hover:bg-[#d3701a] text-white py-3.5 rounded-lg font-bold text-lg shadow-[0_4px_14px_rgba(234,129,37,0.4)] transition-all mb-3">
                  Unlock Live Stream 🔓
                </button>

                <button 
                  type="button" 
                  onClick={() => setIsUnlocked(true)} 
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg font-bold text-sm border border-white/20 transition-all"
                >
                  ▶️ Instant Live Player Preview
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/10 text-xs flex justify-between items-center font-medium">
                <Link href="/events" className="text-green-400 hover:text-green-300">🎟️ Book a Ticket</Link>
                <span className="text-white/40">•</span>
                <button onClick={autofillDemoPin} className="text-blue-300 hover:text-blue-200 underline">Demo PIN: 123456</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STATE B: UNLOCKED STAGE */
        <div>
          {/* Active Pass Banner */}
          <div className="bg-gradient-to-r from-[#064e22] to-[#065f2a] border border-green-500 rounded-lg py-2.5 px-4 mb-5 flex items-center justify-between flex-wrap gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="bg-green-500 text-black text-xs font-black px-2.5 py-1 rounded-md">ACTIVE PASS</span>
              <span className="text-sm font-bold text-white">Access Verified: attendee@healthsummits.tv</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-200 font-medium">🔒 256-Bit Secure Stream</span>
              <button onClick={() => setIsUnlocked(false)} className="bg-black/30 border border-white/20 text-white text-xs px-3 py-1.5 rounded hover:bg-black/50 transition-colors font-medium">
                Exit / Lock
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Video & Multi-Day 4-Session Schedule Menu */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="relative w-full aspect-[4/3] md:aspect-video min-h-[520px] bg-black rounded-xl overflow-hidden border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <iframe 
                  src={liveStreamUrl}
                  className="absolute top-0 left-0 w-full h-full border-none"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Multi-Day Tabs & 4 Sessions Menu */}
              <div className="bg-[#101b22] border border-white/10 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>📅 Summit Schedule</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                        4 Sessions Per Day
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select any day and session below to switch broadcasts or view past session replays.
                    </p>
                  </div>

                  {/* Day Tabs */}
                  <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                    {SUMMIT_SCHEDULE.map((d) => (
                      <button
                        key={d.day}
                        onClick={() => {
                          setSelectedDay(d.day);
                          setSelectedSessionId(d.sessions[0].id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedDay === d.day
                            ? "bg-[#00a86b] text-white shadow-md"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Sessions Grid / List for the selected day */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentDayData.sessions.map((session) => {
                    const isCurrent = session.id === selectedSessionId;
                    return (
                      <button
                        key={session.id}
                        onClick={() => setSelectedSessionId(session.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                          isCurrent
                            ? "bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-400/40"
                            : "bg-white/5 hover:bg-white/10 border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`text-[0.7rem] font-black uppercase px-2 py-0.5 rounded ${
                            isCurrent
                              ? "bg-emerald-500 text-black font-black"
                              : "bg-white/10 text-slate-300"
                          }`}>
                            Session {session.number}
                          </span>
                          <span className="text-[0.7rem] text-slate-400 font-semibold">
                            {session.time}
                          </span>
                        </div>

                        <h4 className={`text-xs sm:text-sm font-bold leading-snug mb-1 line-clamp-2 ${
                          isCurrent ? "text-white" : "text-slate-200 group-hover:text-white"
                        }`}>
                          {session.title}
                        </h4>

                        <div className="flex items-center justify-between text-[0.7rem] text-slate-400 pt-2 border-t border-white/5 mt-auto">
                          <span className="text-emerald-400 font-semibold truncate">{session.speaker}</span>
                          <span className={`text-[0.65rem] font-bold ${
                            session.status === "Live Broadcast"
                              ? "text-red-400 font-black flex items-center gap-1"
                              : session.status === "Completed"
                              ? "text-slate-400"
                              : "text-amber-400"
                          }`}>
                            {session.status === "Live Broadcast" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>}
                            {session.status}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Link href="/lounge" className="bg-[#ea8125] hover:bg-[#d3701a] text-white py-3.5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(234,129,37,0.4)] transition-all w-full">
                <span className="text-xl">⚄</span> Enter Virtual Social Lounge
              </Link>
            </div>

            {/* Right Column: Sidebar */}
            <div className="bg-white/5 border border-white/10 rounded-xl flex flex-col h-[500px] lg:h-auto overflow-hidden">
              
              {/* Tabs */}
              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('chat')} 
                  className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'chat' ? 'border-green-400 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  Chat
                </button>
                <button 
                  onClick={() => setActiveTab('qa')} 
                  className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'qa' ? 'border-green-400 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  Q&A
                </button>
                <button 
                  onClick={() => setActiveTab('notes')} 
                  className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'notes' ? 'border-green-400 text-white bg-white/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  Notes
                </button>
              </div>

              {/* Chat View */}
              {activeTab === 'chat' && (
                <div className="flex flex-col flex-1 p-4 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <span className="text-sm font-black text-white">💬 Live Audience</span>
                    <span className="bg-green-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">142 Online</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 mb-4 scrollbar-thin scrollbar-thumb-white/20">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`bg-black/30 rounded-lg p-3 text-sm ${msg.isMe ? 'border border-green-500/30 bg-green-900/10' : ''}`}>
                        <div className="font-bold text-xs text-slate-400 mb-1">{msg.sender}</div>
                        <div className="text-white/90">{msg.text}</div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={sendChatMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Say hello..." 
                      className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-400"
                    />
                    <button type="submit" className="bg-[#006818] hover:bg-[#004d11] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                      Send
                    </button>
                  </form>
                </div>
              )}

              {/* Q&A View */}
              {activeTab === 'qa' && (
                <div className="flex flex-col flex-1 p-4">
                  <div className="text-sm font-black text-white border-b border-white/10 pb-3 mb-4">
                    ❓ Q&A
                  </div>
                  <div className="text-center text-slate-400 text-sm mt-10">
                    No open questions currently.
                  </div>
                </div>
              )}

              {/* Notes View */}
              {activeTab === 'notes' && (
                <div className="flex flex-col flex-1 p-4">
                  <div className="text-sm font-black text-white border-b border-white/10 pb-3 mb-4">
                    📝 My Private Notes
                  </div>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type your personal notes here. They will auto-save to your browser..." 
                    className="flex-1 bg-transparent border-none text-slate-300 resize-none text-sm leading-relaxed focus:outline-none p-0"
                  ></textarea>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
