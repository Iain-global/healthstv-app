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

export default function PlayerClient({ event }: { event: EventType }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [pinError, setPinError] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  
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
              LIVE BROADCAST
            </span>
            <span className="text-[#a7f3d0] text-sm font-bold">Main Stage • Session 1</span>
          </div>
          <h1 className="text-3xl font-black text-white m-0 leading-tight">
            {event.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/15 rounded-full px-4 py-1.5 text-sm text-slate-300 flex items-center gap-2">
            <span>{isUnlocked ? "🔓" : "🔒"}</span>
            <span className="font-medium">{isUnlocked ? "Secure Connection" : "PIN Verification Required"}</span>
          </div>
          <Link href="/events" className="border border-white/30 text-white hover:bg-white/10 px-4 py-1.5 rounded-md text-sm font-bold transition-colors">
            ← Back to Events
          </Link>
        </div>
      </div>

      {!isUnlocked ? (
        /* STATE A: LOCKED GATE */
        <div className="mb-10">
          <div className="relative w-full aspect-video max-h-[540px] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
            
            {/* Thumbnail Backdrop */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-all"
              style={{ backgroundImage: `url('${event.imageUrl || '/menopause-cafe.png'}')` }}
            ></div>

            {/* PIN Dialog */}
            <div className="relative z-10 max-w-[480px] w-[90%] bg-[#0f1e14]/90 backdrop-blur-xl border border-green-300/30 rounded-2xl p-8 md:p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00873a] to-[#035222] flex items-center justify-center mx-auto mb-5 shadow-[0_6px_20px_rgba(0,135,58,0.4)]">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">Ticket Holder Protected Stream</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Enter the <strong>6-digit PIN</strong> sent to your email upon ticket purchase to unlock this live broadcast.
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

                <button type="submit" className="w-full bg-[#ea8125] hover:bg-[#d3701a] text-white py-3.5 rounded-lg font-bold text-lg shadow-[0_4px_14px_rgba(234,129,37,0.4)] transition-all">
                  Unlock Live Stream 🔓
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
            
            {/* Left Column: Video */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="relative w-full aspect-video min-h-[420px] bg-black rounded-xl overflow-hidden border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <LivePlayerEmbed />
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

function LivePlayerEmbed() {
  useEffect(() => {
    const initVapp = () => {
      if (typeof window !== 'undefined' && (window as any).VappController) {
        try {
          new (window as any).VappController(
            { use_div: "dplayer_flash_ao1uksns7egw", player_width: "100%", player_height: "100%" },
            {
              clip_id: "11838096",
              player_id: "4GE35AGFE12D4C4",
              playlist_id: "81923",
              transparent: "1",
              uk: "50c6f6de299d95b7eaa31a8c3b3ac1b0",
              live_id: "ao1uksns7egw",
              sel_playlist: "",
              sel_multiplaylist: "",
              use_html5: "true",
              layout: "default",
              theme: "light",
              is_responsive: "1",
              is_inversed: "",
              is_vertical: "",
              one_thumb_per_row: "1",
              thumbs_size: "medium",
              disable_hash: "",
              widget_height_behavior: "0",
              hide_playlist: "",
              hide_live_chat: "1",
              hide_description: "",
              playlist_position: "",
              chat_position: "",
              description_position: "",
              show_auto_play_next: "1",
              auto_play_next: "1",
              floating_player: "none",
              share_options: "1"
            }
          );
        } catch (err) {
          console.error("VappController init error:", err);
        }
      }
    };

    let script = document.querySelector('script[src*="play.webvideocore.net/js/vapp.js"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://play.webvideocore.net/js/vapp.js';
      script.async = true;
      script.onload = () => {
        initVapp();
      };
      document.body.appendChild(script);
    } else {
      initVapp();
    }
  }, []);

  return (
    <div 
      className="relative w-full h-full min-h-[440px] bg-black flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/menopause-cafe.png')" }}
    >
      <div 
        id="dplayer_flash_ao1uksns7egw" 
        className="w-full h-full min-h-[440px] relative z-10"
        style={{ width: "100%", height: "100%", minHeight: "440px", position: "relative" }}
      ></div>
    </div>
  );
}
