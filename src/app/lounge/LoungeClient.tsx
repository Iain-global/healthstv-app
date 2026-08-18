"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

let Peer: any;
if (typeof window !== "undefined") {
  Peer = require("simple-peer");
}

const VideoPlayer = ({ stream }: { stream: MediaStream }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return <video ref={ref} autoPlay playsInline></video>;
};

export default function LoungeClient() {
  const [activeTableId, setActiveTableId] = useState<number | null>(null);
  const [hasGrantedPermission, setHasGrantedPermission] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isCamMuted, setIsCamMuted] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [socketId, setSocketId] = useState("");
  const [peers, setPeers] = useState<{ [id: string]: any }>({});
  const [peerStreams, setPeerStreams] = useState<{ [id: string]: MediaStream }>({});

  const peersRef = useRef(peers);
  useEffect(() => { peersRef.current = peers; }, [peers]);

  useEffect(() => {
    setSocketId(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    return () => {
      stopLocalStream();
    };
  }, []);

  const removePeer = (peerId: string) => {
    setPeers(prev => {
      const newPeers = { ...prev };
      if (newPeers[peerId]) {
        try { newPeers[peerId].destroy(); } catch (e) {}
        delete newPeers[peerId];
      }
      return newPeers;
    });
    setPeerStreams(prev => {
      const newStreams = { ...prev };
      delete newStreams[peerId];
      return newStreams;
    });
  };

  const leaveTable = () => {
    setActiveTableId(null);
    Object.values(peersRef.current).forEach((p: any) => {
      try { p.destroy(); } catch(e){}
    });
    setPeers({});
    setPeerStreams({});
    if (socketId) {
      fetch('/api/lounge/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socketId })
      });
    }
  };

  const createPeer = (peerId: string, initiator: boolean, myStream: MediaStream) => {
    if (peersRef.current[peerId]) return peersRef.current[peerId];

    const peer = new Peer({
      initiator,
      stream: myStream,
      trickle: false // Extremely important for DB signaling (one payload only)
    });

    peer.on("signal", (signal: any) => {
      fetch('/api/lounge/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: socketId,
          receiverId: peerId,
          type: signal.type,
          payload: signal
        })
      });
    });

    peer.on("stream", (remoteStream: MediaStream) => {
      setPeerStreams(prev => ({ ...prev, [peerId]: remoteStream }));
    });

    peer.on("close", () => removePeer(peerId));
    peer.on("error", () => removePeer(peerId));

    setPeers(prev => ({ ...prev, [peerId]: peer }));
    peersRef.current[peerId] = peer;
    return peer;
  };

  const handleIncomingSignal = (senderId: string, type: string, payload: any, myStream: MediaStream) => {
    let peer = peersRef.current[senderId];
    
    if (type === 'offer') {
      if (!peer) {
        peer = createPeer(senderId, false, myStream);
      }
      peer.signal(payload);
    } else if (type === 'answer') {
      if (peer) {
        peer.signal(payload);
      }
    }
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    
    if (activeTableId && hasGrantedPermission && socketId && stream) {
      // Join Table
      fetch('/api/lounge/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: activeTableId, socketId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.peers) {
          data.peers.forEach((peerId: string) => {
            createPeer(peerId, true, stream);
          });
        }
      });

      // Poll for signals and heartbeats
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch('/api/lounge/poll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableId: activeTableId, socketId })
          });
          const data = await res.json();
          if (data.signals) {
            data.signals.forEach((sig: any) => {
              handleIncomingSignal(sig.senderId, sig.type, sig.payload, stream);
            });
          }
        } catch (e) {
          console.error("Poll error", e);
        }
      }, 2000); // 2 second polling
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [activeTableId, hasGrantedPermission, socketId, stream]);

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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support camera access, or you are not using a secure HTTPS connection.");
      }
      
      let newStream: MediaStream;
      try {
        // Try both video and audio
        newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err: any) {
        if (err.name === 'NotFoundError' || err.message.includes('object can not be found')) {
          console.warn("Could not find both camera and mic, trying video only...");
          try {
            newStream = await navigator.mediaDevices.getUserMedia({ video: true });
          } catch (vidErr) {
            console.warn("Video failed, trying audio only...");
            newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          }
        } else {
          throw err;
        }
      }

      newStream.getAudioTracks().forEach(track => track.enabled = !isMicMuted);
      newStream.getVideoTracks().forEach(track => track.enabled = !isCamMuted);
      setStream(newStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.warn("Camera/Mic access denied or unavailable", err);
      alert("Hardware access failed: " + err.message + "\n\nMake sure your webcam AND microphone are plugged in and not being used by another app (like Zoom).");
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
      stream.getAudioTracks().forEach(track => track.enabled = isMicMuted);
    }
  };

  const toggleCam = () => {
    setIsCamMuted(!isCamMuted);
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = isCamMuted);
    }
  };

  const joinTable = (id: number) => {
    leaveTable(); // clean up if already at a table
    setActiveTableId(id);
  };

  // Render dynamic seats for the active table
  const renderDynamicSeats = () => {
    const remotePeers = Object.entries(peerStreams);
    const maxSeats = 6;
    const seats = [];

    // 1. Render local user
    seats.push(
      <div key="local" className="seat seat-1 occupied my-seat">
        <video ref={localVideoRef} autoPlay muted playsInline></video>
        <div className="seat-badge">ME</div>
        <div className="my-seat-controls">
          <button type="button" className={`seat-ctrl-btn ${isMicMuted ? 'muted' : ''}`} onClick={toggleMic}>🎙️</button>
          <button type="button" className={`seat-ctrl-btn ${isCamMuted ? 'muted' : ''}`} onClick={toggleCam}>📹</button>
        </div>
      </div>
    );

    // 2. Render connected remote peers
    remotePeers.forEach(([peerId, peerStream], index) => {
      seats.push(
        <div key={peerId} className={`seat seat-${index + 2} occupied`}>
          <VideoPlayer stream={peerStream} />
          <div className="seat-badge">P{index + 1}</div>
        </div>
      );
    });

    // 3. Fill remaining with empty seats
    const currentSeats = seats.length;
    for (let i = currentSeats; i < maxSeats; i++) {
      seats.push(
        <div key={`empty-${i}`} className={`seat seat-${i + 1} empty`} onClick={() => {}}>
          <span>+</span>
        </div>
      );
    }

    return seats;
  };

  return (
    <>
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

      <div className="lounge-tables-container font-sans">
        
        {/* Table 1 */}
        <div className={`lounge-table-card ${activeTableId === 1 ? 'border-[#00a469] shadow-[0_0_20px_rgba(0,164,105,0.1)]' : ''}`} id="table-1">
          <div className="table-card-header">
            <div className="table-info">
              <span className="table-number">TABLE 01</span>
              <h3 className="table-title">Cellular Longevity & NAD+</h3>
              <span className="table-topic">Mitochondrial Health & Fasting</span>
            </div>
            <div className="table-capacity">👥 {activeTableId === 1 ? `${Object.keys(peerStreams).length + 1}/6` : '2/6'}</div>
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
            
            {activeTableId === 1 ? renderDynamicSeats() : (
              <>
                <div className="seat seat-1 occupied"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&h=100&fit=crop" alt="User" /></div>
                <div className="seat seat-2 empty" onClick={() => joinTable(1)}><span>+</span></div>
                <div className="seat seat-3 empty" onClick={() => joinTable(1)}><span>+</span></div>
                <div className="seat seat-4 occupied"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop" alt="User" /></div>
                <div className="seat seat-5 empty" onClick={() => joinTable(1)}><span>+</span></div>
                <div className="seat seat-6 empty" onClick={() => joinTable(1)}><span>+</span></div>
              </>
            )}
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
            <div className="table-capacity">👥 {activeTableId === 2 ? `${Object.keys(peerStreams).length + 1}/6` : '1/4'}</div>
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
            
            {activeTableId === 2 ? renderDynamicSeats() : (
              <>
                <div className="seat seat-pos-top occupied"><img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&fit=crop" alt="User" /></div>
                <div className="seat seat-pos-right empty" onClick={() => joinTable(2)}><span>+</span></div>
                <div className="seat seat-pos-bottom empty" onClick={() => joinTable(2)}><span>+</span></div>
                <div className="seat seat-pos-left empty" onClick={() => joinTable(2)}><span>+</span></div>
              </>
            )}
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
            <div className="table-capacity">👥 {activeTableId === 3 ? `${Object.keys(peerStreams).length + 1}/6` : '2/6'}</div>
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
            
            {activeTableId === 3 ? renderDynamicSeats() : (
              <>
                <div className="seat seat-1 occupied"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&h=100&fit=crop" alt="User" /></div>
                <div className="seat seat-2 occupied"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop" alt="User" /></div>
                <div className="seat seat-3 empty" onClick={() => joinTable(3)}><span>+</span></div>
                <div className="seat seat-4 empty" onClick={() => joinTable(3)}><span>+</span></div>
                <div className="seat seat-5 empty" onClick={() => joinTable(3)}><span>+</span></div>
                <div className="seat seat-6 empty" onClick={() => joinTable(3)}><span>+</span></div>
              </>
            )}
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
                // Don't auto-join table 1 anymore, wait for them to click a table
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
