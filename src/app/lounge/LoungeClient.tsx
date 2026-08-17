"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoungeClient() {
  const [activeTableId, setActiveTableId] = useState<number | null>(null); // Start with no table
  const [hasGrantedPermission, setHasGrantedPermission] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isCamMuted, setIsCamMuted] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Stop camera when component unmounts or leaves a table
  useEffect(() => {
    return () => {
      stopLocalStream();
    };
  }, []);

  // When activeTable changes, start/stop stream
  useEffect(() => {
    if (activeTableId && hasGrantedPermission) {
      startLocalStream();
    } else {
      stopLocalStream();
    }
  }, [activeTableId, hasGrantedPermission]);

  const startLocalStream = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Apply current mute state
      newStream.getAudioTracks().forEach(track => track.enabled = !isMicMuted);
      newStream.getVideoTracks().forEach(track => track.enabled = !isCamMuted);
      
      setStream(newStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.warn("Camera/Mic access denied or unavailable", err);
    }
  };

  const stopLocalStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = isMicMuted); // Enable if previously muted
    }
  };

  const toggleCam = () => {
    setIsCamMuted(!isCamMuted);
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = isCamMuted); // Enable if previously muted
    }
  };

  const joinTable = (id: number) => {
    setActiveTableId(id);
  };

  const leaveTable = () => {
    setActiveTableId(null);
  };

  return (
    <>
      {/* Top Lounge Header */}
      <header className="lounge-top-nav font-sans">
        <div className="lounge-nav-left">
          <div className="lounge-logo">
            <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>Health Summits</span>
            <span className="lounge-badge">LOUNGE</span>
          </div>
          <div className="lounge-event-pill">
            <span className="pulse-dot"></span> Annual Longevity Summit 2026
          </div>
        </div>
        
        <div className="lounge-nav-center">
          <div className="lounge-nav-tabs">
            <Link href="/lounge" className="lounge-tab active"><span className="icon">⚄</span> Social Lounge</Link>
            <Link href="/player" className="lounge-tab"><span className="icon">🖥️</span> Main Stage</Link>
            <a href="#" className="lounge-tab"><span className="icon">⚡</span> Speed 1-on-1</a>
          </div>
        </div>
        
        <div className="lounge-nav-right">
          <div className="lounge-online-count">
            <span className="icon">👤</span> 342 Online
          </div>
          <div className="lounge-user-profile">
            <div className="user-avatar">D9</div>
            <span>Delegate 968</span>
            <span style={{ marginLeft: "5px", opacity: 0.5 }}>▼</span>
          </div>
        </div>
      </header>

      {/* Floor Navigation Bar */}
      <div className="lounge-floor-nav font-sans">
        <div className="floor-nav-left">
          <span style={{ color: "#64748b", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.5px" }}>FLOOR:</span>
          <button className="floor-btn active">Floor 1: Main Lounge</button>
          <button className="floor-btn">Floor 2: VIP & Speakers</button>
        </div>
        <div className="floor-nav-right">
          <div className="lounge-search">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search tables or topics..." />
          </div>
          <button className="btn-start-table">+ Start Discussion Table</button>
        </div>
      </div>

      {/* Tables Container */}
      <div className="lounge-tables-container font-sans">
        
        {/* Table 1 */}
        <div className={`lounge-table-card ${activeTableId === 1 ? 'border-[#00a469] shadow-[0_0_20px_rgba(0,164,105,0.1)]' : ''}`} id="table-1">
          <div className="table-card-header">
            <div className="table-info">
              <span className="table-number">TABLE 01</span>
              <h3 className="table-title">Cellular Longevity & NAD+</h3>
              <span className="table-topic">Mitochondrial Health & Fasting</span>
            </div>
            <div className="table-capacity">👥 {activeTableId === 1 ? '3/6' : '2/6'}</div>
          </div>
          
          <div className="table-arena">
            {activeTableId === 1 ? (
              <button className="table-hub joined" onClick={leaveTable}>
                <span className="hub-icon">⏹</span>
                <span>Leave</span>
              </button>
            ) : (
              <button className="table-hub" onClick={() => joinTable(1)}>
                <span className="hub-icon">▶</span>
                <span>Join Table</span>
              </button>
            )}
            
            {/* Seats (6 positions) */}
            <div className="seat seat-1 occupied">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&h=100&fit=crop" alt="User" />
            </div>
            
            {activeTableId === 1 ? (
              <div className="seat seat-2 occupied my-seat">
                <video ref={localVideoRef} autoPlay muted playsInline></video>
                <div className="seat-badge">D9</div>
                <div className="my-seat-controls">
                  <button type="button" className={`seat-ctrl-btn ${isMicMuted ? 'muted' : ''}`} onClick={toggleMic}>🎙️</button>
                  <button type="button" className={`seat-ctrl-btn ${isCamMuted ? 'muted' : ''}`} onClick={toggleCam}>📹</button>
                </div>
              </div>
            ) : (
              <div className="seat seat-2 empty" onClick={() => joinTable(1)}><span>+</span></div>
            )}
            
            <div className="seat seat-3 empty" onClick={() => { if(activeTableId !== 1) joinTable(1) }}>
              <span>+</span>
            </div>
            <div className="seat seat-4 occupied">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop" alt="User" />
            </div>
            <div className="seat seat-5 empty" onClick={() => { if(activeTableId !== 1) joinTable(1) }}><span>+</span></div>
            <div className="seat seat-6 empty" onClick={() => { if(activeTableId !== 1) joinTable(1) }}><span>+</span></div>
          </div>
          
          {activeTableId === 1 ? (
            <button className="table-action-btn joined" onClick={leaveTable}>Leave Discussion ➔</button>
          ) : (
            <button className="table-action-btn" onClick={() => joinTable(1)}>Grab a Seat ➔</button>
          )}
        </div>

        {/* Table 2 */}
        <div className={`lounge-table-card ${activeTableId === 2 ? 'border-[#00a469] shadow-[0_0_20px_rgba(0,164,105,0.1)]' : ''}`} id="table-2">
          <div className="table-card-header">
            <div className="table-info">
              <span className="table-number">TABLE 02</span>
              <h3 className="table-title">Gut-Brain Axis & Microbiome</h3>
              <span className="table-topic">Probiotics & Vagus Nerve Stimulation</span>
            </div>
            <div className="table-capacity">👥 {activeTableId === 2 ? '2/4' : '1/4'}</div>
          </div>
          
          <div className="table-arena capacity-4">
            {activeTableId === 2 ? (
              <button className="table-hub joined" onClick={leaveTable}>
                <span className="hub-icon">⏹</span>
                <span>Leave</span>
              </button>
            ) : (
              <button className="table-hub" onClick={() => joinTable(2)}>
                <span className="hub-icon">▶</span>
                <span>Join Table</span>
              </button>
            )}
            
            <div className="seat seat-pos-top occupied">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&fit=crop" alt="User" />
            </div>
            
            {activeTableId === 2 ? (
              <div className="seat seat-pos-right occupied my-seat">
                <video ref={localVideoRef} autoPlay muted playsInline></video>
                <div className="seat-badge">D9</div>
                <div className="my-seat-controls">
                  <button type="button" className={`seat-ctrl-btn ${isMicMuted ? 'muted' : ''}`} onClick={toggleMic}>🎙️</button>
                  <button type="button" className={`seat-ctrl-btn ${isCamMuted ? 'muted' : ''}`} onClick={toggleCam}>📹</button>
                </div>
              </div>
            ) : (
              <div className="seat seat-pos-right empty" onClick={() => joinTable(2)}><span>+</span></div>
            )}
            
            <div className="seat seat-pos-bottom empty" onClick={() => { if(activeTableId !== 2) joinTable(2) }}><span>+</span></div>
            <div className="seat seat-pos-left empty" onClick={() => { if(activeTableId !== 2) joinTable(2) }}><span>+</span></div>
          </div>
          
          {activeTableId === 2 ? (
            <button className="table-action-btn joined" onClick={leaveTable}>Leave Discussion ➔</button>
          ) : (
            <button className="table-action-btn" onClick={() => joinTable(2)}>Grab a Seat ➔</button>
          )}
        </div>

        {/* Table 3 */}
        <div className={`lounge-table-card ${activeTableId === 3 ? 'border-[#00a469] shadow-[0_0_20px_rgba(0,164,105,0.1)]' : ''}`} id="table-3">
          <div className="table-card-header">
            <div className="table-info">
              <span className="table-number">TABLE 03</span>
              <h3 className="table-title">Sleep Architecture & Circadian Rhythms</h3>
              <span className="table-topic">HRV Tracking & Light Therapy</span>
            </div>
            <div className="table-capacity">👥 {activeTableId === 3 ? '3/6' : '2/6'}</div>
          </div>
          
          <div className="table-arena">
            {activeTableId === 3 ? (
              <button className="table-hub joined" onClick={leaveTable}>
                <span className="hub-icon">⏹</span>
                <span>Leave</span>
              </button>
            ) : (
              <button className="table-hub" onClick={() => joinTable(3)}>
                <span className="hub-icon">▶</span>
                <span>Join Table</span>
              </button>
            )}
            
            <div className="seat seat-1 occupied">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&h=100&fit=crop" alt="User" />
            </div>
            <div className="seat seat-2 occupied">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop" alt="User" />
            </div>
            
            {activeTableId === 3 ? (
              <div className="seat seat-3 occupied my-seat">
                <video ref={localVideoRef} autoPlay muted playsInline></video>
                <div className="seat-badge">D9</div>
                <div className="my-seat-controls">
                  <button type="button" className={`seat-ctrl-btn ${isMicMuted ? 'muted' : ''}`} onClick={toggleMic}>🎙️</button>
                  <button type="button" className={`seat-ctrl-btn ${isCamMuted ? 'muted' : ''}`} onClick={toggleCam}>📹</button>
                </div>
              </div>
            ) : (
              <div className="seat seat-3 empty" onClick={() => joinTable(3)}><span>+</span></div>
            )}
            
            <div className="seat seat-4 empty" onClick={() => { if(activeTableId !== 3) joinTable(3) }}><span>+</span></div>
            <div className="seat seat-5 empty" onClick={() => { if(activeTableId !== 3) joinTable(3) }}><span>+</span></div>
            <div className="seat seat-6 empty" onClick={() => { if(activeTableId !== 3) joinTable(3) }}><span>+</span></div>
          </div>
          
          {activeTableId === 3 ? (
            <button className="table-action-btn joined" onClick={leaveTable}>Leave Discussion ➔</button>
          ) : (
            <button className="table-action-btn" onClick={() => joinTable(3)}>Grab a Seat ➔</button>
          )}
        </div>

      </div>

      {/* Permission Overlay */}
      {!hasGrantedPermission && (
        <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-[#10161b]/95 backdrop-blur-md">
          <div className="bg-[#151d23] border border-[#1f2933] p-8 rounded-2xl text-center max-w-md w-[90%] shadow-[0_0_40px_rgba(0,164,105,0.15)]">
            <div className="bg-[#00a469]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🍹</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Join the Social Lounge</h2>
            <p className="text-[#94a3b8] text-[0.95rem] mb-8 leading-relaxed">
              Connect face-to-face with other attendees, speakers, and experts. You can mute your mic or turn off your camera at any time.
            </p>
            <button
              onClick={() => {
                setHasGrantedPermission(true);
                setActiveTableId(1);
              }}
              className="w-full bg-[#00a469] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(0,164,105,0.4)] hover:bg-[#008f5b] transition-colors text-lg"
            >
              Allow Camera & Mic
            </button>
            <Link href="/player" className="block mt-4 text-[#94a3b8] hover:text-white text-sm">
              Return to Main Stage
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
