"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Hand,
  LogOut,
  Users,
  MessageSquare,
  Sparkles,
  Search,
  Plus,
  Tv,
  Layers,
  Zap,
  Clock,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Send,
  Share2,
  Check,
  Copy,
  Activity,
} from "lucide-react";

// Standard STUN servers for native WebRTC
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" },
  ],
};

// Remote Live Video Player Component
function RemoteVideoTile({
  stream,
  peerId,
  index,
}: {
  stream: MediaStream;
  peerId: string;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay remote video catch:", err);
          setIsPlaying(true);
        });
    }
  }, [stream]);

  return (
    <div className="relative aspect-video bg-[#101b22] rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl flex items-center justify-center group animate-in fade-in zoom-in-95 duration-300">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Delegate Info Tag */}
      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 z-10">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-1">
            <span>Live Delegate #{index + 1}</span>
            <span className="text-[0.65rem] text-slate-400">({peerId.slice(0, 5)})</span>
          </div>
          <div className="text-[0.65rem] text-emerald-400 font-semibold flex items-center gap-1">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>Live WebRTC Stream</span>
          </div>
        </div>
      </div>

      <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-md shadow z-10 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
        LIVE CAMERA
      </div>
    </div>
  );
}

// Table Data Structure
interface SeatedUser {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  isSpeaking?: boolean;
  isMuted?: boolean;
  isHost?: boolean;
}

interface LoungeTable {
  id: number;
  floor: number;
  number: string;
  title: string;
  topic: string;
  capacity: 2 | 4 | 6 | 8;
  tag: string;
  tagColor: "emerald" | "orange" | "purple" | "blue";
  hostName?: string;
  seatedUsers: SeatedUser[];
  isLocked?: boolean;
  isVip?: boolean;
}

const INITIAL_TABLES: LoungeTable[] = [
  {
    id: 1,
    floor: 1,
    number: "01",
    title: "Cellular Longevity & NAD+ Therapy",
    topic: "Mitochondrial regeneration, rapamycin protocols & fasting windows",
    capacity: 6,
    tag: "Clinical Discussion",
    tagColor: "emerald",
    hostName: "Dr. Sarah Jenkins",
    seatedUsers: [],
  },
  {
    id: 2,
    floor: 1,
    number: "02",
    title: "Gut-Brain Axis & Microbiome Solutions",
    topic: "Vagus nerve stimulation, psychobiotics & digestive wellness",
    capacity: 4,
    tag: "Expert Circle",
    tagColor: "orange",
    hostName: "Dr. Jonathan Hayes",
    seatedUsers: [],
  },
  {
    id: 3,
    floor: 1,
    number: "03",
    title: "Sleep Architecture & Circadian Rhythms",
    topic: "HRV tracking, light therapy, sleep apnea & deep recovery",
    capacity: 6,
    tag: "Open Networking",
    tagColor: "blue",
    seatedUsers: [],
  },
  {
    id: 4,
    floor: 1,
    number: "04",
    title: "Digital Health & AI Diagnostics",
    topic: "Wearable biomarkers, real-time glucose monitoring & predictive care",
    capacity: 8,
    tag: "Tech & Innovation",
    tagColor: "purple",
    seatedUsers: [],
  },
  {
    id: 5,
    floor: 1,
    number: "05",
    title: "Functional Medicine Clinic Owners",
    topic: "Patient onboarding, lab integrations & sustainable clinic growth",
    capacity: 4,
    tag: "Organisers & Clinics",
    tagColor: "emerald",
    seatedUsers: [],
  },
  {
    id: 6,
    floor: 1,
    number: "06",
    title: "1-on-1 Fast Intro Table",
    topic: "Quick 5-minute health founder introductions & collaboration",
    capacity: 2,
    tag: "1:1 Quick Chat",
    tagColor: "orange",
    seatedUsers: [],
  },
  // Floor 2 Tables (Speakers & Keynotes)
  {
    id: 7,
    floor: 2,
    number: "S1",
    title: "Keynote Speaker Q&A: Integrative Oncology",
    topic: "Direct Q&A with morning keynote speakers on metabolic therapies",
    capacity: 6,
    tag: "Speaker VIP Lounge",
    tagColor: "purple",
    isVip: true,
    seatedUsers: [],
  },
  {
    id: 8,
    floor: 2,
    number: "S2",
    title: "Author's Corner: Books & Published Research",
    topic: "Meet the authors of recent longevity & metabolic health publications",
    capacity: 4,
    tag: "Book Signing & Q&A",
    tagColor: "emerald",
    isVip: true,
    seatedUsers: [],
  },
  // Floor 3 Tables (Sponsor Expo)
  {
    id: 9,
    floor: 3,
    number: "E1",
    title: "Advanced Hyperbaric & Oxygen Tech",
    topic: "Live demo of HBOT chambers & clinical trials for recovery",
    capacity: 6,
    tag: "Sponsor Pod",
    tagColor: "blue",
    seatedUsers: [],
  },
  {
    id: 10,
    floor: 3,
    number: "E2",
    title: "Infrared & Cold Exposure Biohacking",
    topic: "Contrast therapy, sauna protocols & mitochondrial density",
    capacity: 4,
    tag: "Sponsor Pod",
    tagColor: "orange",
    seatedUsers: [],
  },
  // Floor 4 Tables (Community)
  {
    id: 11,
    floor: 4,
    number: "C1",
    title: "Nutritional Therapy Practitioner Circle",
    topic: "Case reviews, client compliance tools & clinical protocols",
    capacity: 6,
    tag: "Peer Mastermind",
    tagColor: "emerald",
    seatedUsers: [],
  },
];

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe?: boolean;
}

export default function LiveLoungeClient() {
  const [tables, setTables] = useState<LoungeTable[]>(INITIAL_TABLES);
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"lounge" | "speed" | "stage">("lounge");

  // In-Table State
  const [joinedTableId, setJoinedTableId] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"chat" | "members" | "info">("chat");
  const [copiedLink, setCopiedLink] = useState(false);

  // Hardware AV State
  const [hasPermission, setHasPermission] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamMuted, setIsCamMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  // Video Stream Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Native WebRTC State
  const [socketId, setSocketId] = useState("");
  const [peerStreams, setPeerStreams] = useState<{ [remoteId: string]: MediaStream }>({});
  
  // Keep peer connections & candidate queues in refs to avoid stale closures
  const peerConnections = useRef<{ [remoteId: string]: RTCPeerConnection }>({});
  const candidateQueues = useRef<{ [remoteId: string]: RTCIceCandidateInit[] }>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  localStreamRef.current = localStream;

  // Initialize socket ID once per session
  useEffect(() => {
    const id = "hstv_" + Math.random().toString(36).substring(2, 11);
    setSocketId(id);
  }, []);

  // Close peer connection cleanly
  const closePeer = useCallback((peerId: string) => {
    if (peerConnections.current[peerId]) {
      try {
        peerConnections.current[peerId].close();
      } catch (e) {}
      delete peerConnections.current[peerId];
    }
    delete candidateQueues.current[peerId];
    setPeerStreams((prev) => {
      const updated = { ...prev };
      delete updated[peerId];
      return updated;
    });
  }, []);

  // Create Native RTCPeerConnection
  const getOrCreatePeerConnection = useCallback(
    (remoteSocketId: string, currentMySocketId: string) => {
      if (peerConnections.current[remoteSocketId]) {
        return peerConnections.current[remoteSocketId];
      }

      console.log("🔗 [WebRTC] Creating new RTCPeerConnection with:", remoteSocketId);
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnections.current[remoteSocketId] = pc;

      // Add local media tracks if available
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, localStreamRef.current!);
          } catch (e) {}
        });
      }

      // Handle incoming remote media stream
      pc.ontrack = (event) => {
        console.log("🎥 [WebRTC] Remote camera track received from:", remoteSocketId, event);
        if (event.streams && event.streams[0]) {
          setPeerStreams((prev) => ({
            ...prev,
            [remoteSocketId]: event.streams[0],
          }));
        } else if (event.track) {
          const fallbackStream = new MediaStream([event.track]);
          setPeerStreams((prev) => ({
            ...prev,
            [remoteSocketId]: fallbackStream,
          }));
        }
      };

      // Handle local ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          fetch("/api/lounge/signal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              senderId: currentMySocketId,
              receiverId: remoteSocketId,
              type: "candidate",
              payload: event.candidate,
            }),
          }).catch((err) => console.error("Send candidate error:", err));
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`[WebRTC] Connection state with ${remoteSocketId}:`, pc.connectionState);
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          closePeer(remoteSocketId);
        }
      };

      return pc;
    },
    [closePeer]
  );

  // Initiate call to remote peer (send offer)
  const initiateCall = useCallback(
    async (remoteSocketId: string, currentMySocketId: string) => {
      try {
        const pc = getOrCreatePeerConnection(remoteSocketId, currentMySocketId);
        
        // Guard against calling createOffer when not in stable state
        if (pc.signalingState !== "stable") {
          console.log(`[WebRTC] Skipping offer creation with ${remoteSocketId} because state is '${pc.signalingState}'`);
          return;
        }

        console.log("📤 [WebRTC] Initiating call / creating offer for:", remoteSocketId);
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        if (pc.signalingState !== "stable") return;
        await pc.setLocalDescription(offer);

        await fetch("/api/lounge/signal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: currentMySocketId,
            receiverId: remoteSocketId,
            type: "offer",
            payload: offer,
          }),
        });
      } catch (err) {
        console.error("Initiate call error:", err);
      }
    },
    [getOrCreatePeerConnection]
  );

  // Handle incoming signal (offer, answer, candidate)
  const handleIncomingSignal = useCallback(
    async (senderId: string, type: string, payload: any, currentMySocketId: string) => {
      try {
        let pc = peerConnections.current[senderId];

        if (type === "offer") {
          console.log("📥 [WebRTC] Received offer from:", senderId, "Current state:", pc?.signalingState);
          if (!pc) {
            pc = getOrCreatePeerConnection(senderId, currentMySocketId);
          }

          // Handle offer collision (glare)
          const isOfferCollision = pc.signalingState !== "stable";
          if (isOfferCollision) {
            if (currentMySocketId < senderId) {
              console.log("[WebRTC] Rolling back local offer to accept incoming remote offer");
              try {
                await pc.setRemoteDescription({ type: "rollback" } as any);
              } catch (e) {
                console.warn("Rollback failed:", e);
              }
            } else {
              console.log("[WebRTC] Impolite peer ignoring offer collision from:", senderId);
              return;
            }
          }

          await pc.setRemoteDescription(new RTCSessionDescription(payload));

          // Apply any buffered candidates
          if (candidateQueues.current[senderId]) {
            for (const cand of candidateQueues.current[senderId]) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(cand));
              } catch (e) {}
            }
            delete candidateQueues.current[senderId];
          }

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          console.log("📤 [WebRTC] Sending answer to:", senderId);
          await fetch("/api/lounge/signal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              senderId: currentMySocketId,
              receiverId: senderId,
              type: "answer",
              payload: answer,
            }),
          });
        } else if (type === "answer") {
          console.log("📥 [WebRTC] Received answer from:", senderId, "Current state:", pc?.signalingState);
          if (pc) {
            // Guard: ONLY set remote description if we have a pending local offer
            if (pc.signalingState !== "have-local-offer") {
              console.warn(`[WebRTC] Ignoring duplicate/stale answer from ${senderId} because state is '${pc.signalingState}' (expected 'have-local-offer')`);
              return;
            }

            await pc.setRemoteDescription(new RTCSessionDescription(payload));

            // Apply any buffered candidates
            if (candidateQueues.current[senderId]) {
              for (const cand of candidateQueues.current[senderId]) {
                try {
                  await pc.addIceCandidate(new RTCIceCandidate(cand));
                } catch (e) {}
              }
              delete candidateQueues.current[senderId];
            }
          }
        } else if (type === "candidate") {
          if (pc && pc.remoteDescription && pc.remoteDescription.type) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(payload));
            } catch (e) {}
          } else {
            if (!candidateQueues.current[senderId]) {
              candidateQueues.current[senderId] = [];
            }
            candidateQueues.current[senderId].push(payload);
          }
        }
      } catch (err) {
        console.error("Signal handling error:", err);
      }
    },
    [getOrCreatePeerConnection]
  );

  // Polling loop for active room & WebRTC signals
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (joinedTableId && socketId) {
      // 1. Join room & connect deterministically
      fetch("/api/lounge/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId: joinedTableId, socketId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.peers && Array.isArray(data.peers)) {
            data.peers.forEach((peerId: string) => {
              if (peerId !== socketId) {
                // Deterministic initiator: only peer with higher socketId initiates offer
                if (socketId > peerId) {
                  initiateCall(peerId, socketId);
                } else {
                  getOrCreatePeerConnection(peerId, socketId);
                }
              }
            });
          }
        })
        .catch((err) => console.error("Join Table Error:", err));

      // 2. Poll signals every 1.2 seconds
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch("/api/lounge/poll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tableId: joinedTableId, socketId }),
          });
          const data = await res.json();

          if (data.signals && Array.isArray(data.signals)) {
            for (const sig of data.signals) {
              await handleIncomingSignal(sig.senderId, sig.type, sig.payload, socketId);
            }
          }

          // Check if any peer is at table that we haven't connected to yet
          if (data.peers && Array.isArray(data.peers)) {
            data.peers.forEach((peerId: string) => {
              if (peerId !== socketId && !peerConnections.current[peerId]) {
                if (socketId > peerId) {
                  initiateCall(peerId, socketId);
                } else {
                  getOrCreatePeerConnection(peerId, socketId);
                }
              }
            });
          }
        } catch (e) {
          console.error("Poll Error:", e);
        }
      }, 1200);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [joinedTableId, socketId, initiateCall, handleIncomingSignal, getOrCreatePeerConnection]);

  // Chat in Table
  const [tableMessages, setTableMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "Dr. Sarah Jenkins",
      text: "Welcome to the Live Lounge! Feel free to ask about our recent clinical trials.",
      time: "14:02",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Speed Networking State
  const [speedState, setSpeedState] = useState<"idle" | "searching" | "connected">("idle");
  const [speedTimer, setSpeedTimer] = useState(180);
  const [speedPartner, setSpeedPartner] = useState<SeatedUser | null>(null);

  // Custom Table Modal
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [newTableTitle, setNewTableTitle] = useState("");
  const [newTableTopic, setNewTableTopic] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState<2 | 4 | 6 | 8>(6);

  // Dynamic attachment of local video stream when modal mounts or camera state updates
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current
        .play()
        .catch((e) => console.warn("Local video play catch:", e));
    }
  }, [localStream, joinedTableId, isCamMuted]);

  // Start Camera & Mic
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let stream: MediaStream | null = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true,
          });
        } catch (err1) {
          console.warn("Retrying standard video/audio...", err1);
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          } catch (err2) {
            console.warn("Retrying video only...", err2);
            try {
              stream = await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (err3) {
              console.warn("Retrying audio only...", err3);
              stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }
          }
        }

        if (stream) {
          const hasVideo = stream.getVideoTracks().length > 0;
          const hasAudio = stream.getAudioTracks().length > 0;

          setLocalStream(stream);
          localStreamRef.current = stream;
          setIsCamMuted(!hasVideo);
          setIsMicMuted(!hasAudio);
          setHasPermission(true);

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(() => {});
          }

          // Add tracks to any existing peer connections
          Object.values(peerConnections.current).forEach((pc) => {
            stream!.getTracks().forEach((track) => {
              try {
                pc.addTrack(track, stream!);
              } catch (e) {}
            });
          });

          return stream;
        }
      }
    } catch (err: any) {
      console.warn("Could not access webcam/mic", err);
      setHasPermission(true);
    }
    return null;
  };

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicMuted;
      });
    }
    setIsMicMuted(!isMicMuted);
  };

  // Toggle Cam
  const toggleCam = async () => {
    if (!localStream || localStream.getVideoTracks().length === 0) {
      // If no video track exists yet, request webcam track
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];

        let newStream: MediaStream;
        if (localStream) {
          localStream.addTrack(videoTrack);
          newStream = localStream;
        } else {
          newStream = videoStream;
        }

        setLocalStream(newStream);
        localStreamRef.current = newStream;
        setIsCamMuted(false);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
          localVideoRef.current.play().catch(() => {});
        }

        // Add track to existing peer connections
        Object.values(peerConnections.current).forEach((pc) => {
          try {
            pc.addTrack(videoTrack, newStream);
          } catch (e) {}
        });
      } catch (e) {
        console.warn("Could not start camera on toggle:", e);
        alert("Camera permission denied or camera device in use by another app.");
      }
      return;
    }

    const videoTracks = localStream.getVideoTracks();
    const willBeMuted = !isCamMuted;
    videoTracks.forEach((track) => {
      track.enabled = !willBeMuted;
    });
    setIsCamMuted(willBeMuted);
  };

  // Screen Share
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null;
      }
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          setIsScreenSharing(true);
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = stream;
          }
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
          };
        } else {
          alert("Screen sharing is not supported in this browser.");
        }
      } catch (err) {
        console.warn("Screen share cancelled", err);
      }
    }
  };

  // Trigger Emojis
  const triggerReaction = (emoji: string) => {
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 2500);
  };

  // Join Table
  const handleJoinTable = async (tableId: number) => {
    setJoinedTableId(tableId);
    setIsMinimized(false);
    await startCamera();

    // Add local user to table
    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id === tableId) {
          const alreadyIn = tbl.seatedUsers.some((u) => u.id === "me");
          if (!alreadyIn && tbl.seatedUsers.length < tbl.capacity) {
            return {
              ...tbl,
              seatedUsers: [
                ...tbl.seatedUsers,
                {
                  id: "me",
                  name: "You (Delegate)",
                  role: "Attendee",
                  company: "Health Professional",
                  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&fit=crop",
                  isHost: false,
                },
              ],
            };
          }
        } else {
          return {
            ...tbl,
            seatedUsers: tbl.seatedUsers.filter((u) => u.id !== "me"),
          };
        }
        return tbl;
      })
    );
  };

  // Leave Table
  const handleLeaveTable = () => {
    // 1. Close all RTCPeerConnections
    Object.keys(peerConnections.current).forEach((pId) => {
      closePeer(pId);
    });
    setPeerStreams({});

    // 2. Notify backend
    if (socketId) {
      fetch("/api/lounge/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socketId }),
      }).catch(() => {});
    }

    setJoinedTableId(null);
    setIsMinimized(false);
    setIsScreenSharing(false);
    stopCamera();

    setTables((prev) =>
      prev.map((tbl) => ({
        ...tbl,
        seatedUsers: tbl.seatedUsers.filter((u) => u.id !== "me"),
      }))
    );
  };

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    setTableMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: "You",
        text: chatInput,
        time: timeStr,
        isMe: true,
      },
    ]);
    setChatInput("");

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Copy Table Link
  const copyTableLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Start Speed Networking
  const handleStartSpeedNetworking = () => {
    setSpeedState("searching");
    setSpeedTimer(180);
    setTimeout(() => {
      setSpeedState("connected");
      setSpeedPartner({
        id: "speed-1",
        name: "Dr. Amanda Wright",
        role: "Integrative GP & Functional Medicine Specialist",
        company: "BioHealth Clinic Manchester",
        avatar: "https://images.unsplash.com/photo-1594824813689-138be781e621?q=80&w=200&h=200&fit=crop",
        isSpeaking: true,
      });
      startCamera();
    }, 2500);
  };

  // Speed Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (speedState === "connected" && speedTimer > 0) {
      interval = setInterval(() => {
        setSpeedTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [speedState, speedTimer]);

  // Create Custom Table
  const handleCreateCustomTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableTitle.trim()) return;

    const newTable: LoungeTable = {
      id: Date.now(),
      floor: currentFloor,
      number: `T${tables.length + 1}`,
      title: newTableTitle,
      topic: newTableTopic || "Open interactive discussion",
      capacity: newTableCapacity,
      tag: "Delegate Table",
      tagColor: "emerald",
      hostName: "You",
      seatedUsers: [
        {
          id: "me",
          name: "You (Host)",
          role: "Table Host",
          company: "Delegate",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&fit=crop",
          isHost: true,
        },
      ],
    };

    setTables((prev) => [newTable, ...prev]);
    setShowCreateTableModal(false);
    setNewTableTitle("");
    setNewTableTopic("");
    handleJoinTable(newTable.id);
  };

  const currentJoinedTable = tables.find((t) => t.id === joinedTableId);
  const activePeerEntries = Object.entries(peerStreams);
  const totalLiveParticipants = 1 + activePeerEntries.length;

  // Filter tables by floor, search, and capacity
  const filteredTables = tables.filter((table) => {
    if (table.floor !== currentFloor) return false;
    if (
      searchQuery &&
      !table.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !table.topic.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (capacityFilter !== "all" && table.capacity.toString() !== capacityFilter) {
      return false;
    }
    return true;
  });

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090f14] text-slate-100 font-sans selection:bg-[#00a86b] selection:text-white">
      {/* 1. TOP AIRMEET-STYLE LOUNGE HEADER */}
      <header className="sticky top-0 z-40 bg-[#0c141a]/95 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 flex items-center justify-between shadow-md">
        {/* Left: Branding & Event Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-tight text-white group-hover:text-[#00a86b] transition-colors">
              HealthSummits<span className="text-[#00a86b]">.tv</span>
            </span>
            <span className="bg-[#00a86b] text-white text-[0.65rem] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              LIVE LOUNGE
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-semibold text-white">Global Longevity & Health Summit 2026</span>
          </div>
        </div>

        {/* Center: Navigation Modes */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab("lounge")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "lounge"
                ? "bg-[#00a86b] text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Social Lounge</span>
          </button>

          <button
            onClick={() => setActiveTab("speed")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "speed"
                ? "bg-[#ea8125] text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Speed 1-on-1</span>
          </button>

          <Link
            href="/player"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Tv className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Main Stage</span>
          </Link>
        </div>

        {/* Right: Online delegates & AV Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 px-3 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5" />
            <span>184 Delegates Online</span>
          </div>

          {/* User AV Controls Preview */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-xl">
            <button
              onClick={toggleMic}
              title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMicMuted ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              }`}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleCam}
              title={isCamMuted ? "Start Camera" : "Stop Camera"}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isCamMuted ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              }`}
            >
              {isCamMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-xs font-bold ml-1 shadow-sm">
              ME
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      {activeTab === "lounge" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Floor Navigation & Controls Bar */}
          <div className="bg-[#121c24]/90 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            {/* Floor Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">
                FLOOR:
              </span>
              {[
                { num: 1, label: "Main Lounge" },
                { num: 2, label: "Keynote Speakers & Q&A" },
                { num: 3, label: "Sponsor Pods & Expo" },
                { num: 4, label: "Wellness Masterminds" },
              ].map((f) => (
                <button
                  key={f.num}
                  onClick={() => setCurrentFloor(f.num)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    currentFloor === f.num
                      ? "bg-[#00a86b] text-white shadow-md shadow-emerald-900/30 ring-2 ring-emerald-400/40"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Floor {f.num}: {f.label}
                </button>
              ))}
            </div>

            {/* Actions: Search, Filter, New Table */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search topics or doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00a86b]"
                />
              </div>

              {/* Capacity Filter */}
              <select
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:border-[#00a86b] cursor-pointer"
              >
                <option value="all">All Seats</option>
                <option value="2">2-Seater</option>
                <option value="4">4-Seater</option>
                <option value="6">6-Seater</option>
                <option value="8">8-Seater</option>
              </select>

              {/* Create Table Button */}
              <button
                onClick={() => setShowCreateTableModal(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#00a86b] to-emerald-600 hover:from-[#00915c] hover:to-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Start Table</span>
              </button>
            </div>
          </div>

          {/* Table Floor Plan Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
            {filteredTables.map((table) => {
              const isUserAtThisTable = joinedTableId === table.id;
              const occupiedSeatsCount = table.seatedUsers.length;
              const isFull = occupiedSeatsCount >= table.capacity;

              return (
                <div
                  key={table.id}
                  className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                    isUserAtThisTable
                      ? "bg-gradient-to-b from-[#11241a] to-[#0d1c14] border-[#00a86b] shadow-[0_0_35px_rgba(0,168,107,0.2)] ring-1 ring-[#00a86b]"
                      : "bg-[#111a21]/90 hover:bg-[#152028] border-white/10 hover:border-white/20 shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {/* Top Header info */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black tracking-widest text-[#00a86b] bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                          TABLE {table.number}
                        </span>
                        {table.isVip && (
                          <span className="text-[0.65rem] font-bold text-amber-300 bg-amber-950/50 border border-amber-800/50 px-2 py-0.5 rounded flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> VIP
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {occupiedSeatsCount}/{table.capacity}
                      </span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-white leading-snug mb-1 line-clamp-1">
                      {table.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2 min-h-[2rem]">
                      {table.topic}
                    </p>
                  </div>

                  {/* AIRMEET CIRCULAR TABLE ARENA */}
                  <div className="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto my-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/10"></div>

                    {/* Central Physical Table Surface */}
                    <div
                      className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center p-2 text-center shadow-2xl transition-all ${
                        isUserAtThisTable
                          ? "bg-gradient-to-br from-emerald-900 to-[#005a39] border-2 border-[#00a86b] text-white"
                          : "bg-gradient-to-br from-[#1e2a33] to-[#141d24] border-2 border-white/15 text-slate-300"
                      }`}
                    >
                      <span className="text-[0.65rem] font-black uppercase tracking-wider text-slate-400">
                        {table.tag}
                      </span>
                      <span className="text-xs font-bold text-white mt-0.5">
                        {isUserAtThisTable ? "You're Seated" : "Open Table"}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-[#00a86b] mt-1 animate-ping"></div>
                    </div>

                    {/* Seated Avatars placed around table based on capacity */}
                    {Array.from({ length: table.capacity }).map((_, index) => {
                      const user = table.seatedUsers[index];
                      const totalSeats = table.capacity;
                      const angle = (index * 360) / totalSeats - 90;
                      const radius = 80;
                      const x = Math.round(radius * Math.cos((angle * Math.PI) / 180));
                      const y = Math.round(radius * Math.sin((angle * Math.PI) / 180));

                      if (user) {
                        return (
                          <div
                            key={`seat-${user.id}-${index}`}
                            style={{
                              transform: `translate(${x}px, ${y}px)`,
                            }}
                            className="absolute z-20 group/seat cursor-pointer"
                            title={`${user.name} (${user.role} - ${user.company})`}
                          >
                            <div className="relative">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className={`w-10 h-10 rounded-full object-cover border-2 shadow-lg transition-transform group-hover/seat:scale-110 ${
                                  user.id === "me"
                                    ? "border-emerald-400 ring-2 ring-emerald-500/40"
                                    : user.isSpeaking
                                    ? "border-amber-400 ring-2 ring-amber-400/50 animate-pulse"
                                    : "border-white/30"
                                }`}
                              />
                              {user.isHost && (
                                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[0.6rem] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                                  ★
                                </span>
                              )}
                            </div>

                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 bg-black/90 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded shadow-lg opacity-0 group-hover/seat:opacity-100 pointer-events-none whitespace-nowrap z-30 transition-opacity">
                              {user.name}
                            </div>
                          </div>
                        );
                      }

                      // Empty Seat (+)
                      return (
                        <button
                          key={`empty-seat-${index}`}
                          type="button"
                          onClick={() => handleJoinTable(table.id)}
                          style={{
                            transform: `translate(${x}px, ${y}px)`,
                          }}
                          className="absolute z-20 w-9 h-9 rounded-full bg-white/5 border border-dashed border-white/20 hover:border-[#00a86b] hover:bg-[#00a86b]/20 flex items-center justify-center text-slate-400 hover:text-white transition-all group/empty cursor-pointer hover:scale-110 shadow-sm"
                          title="Click to Take Seat"
                        >
                          <span className="text-sm font-bold group-hover/empty:scale-125 transition-transform">+</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Join / Leave Button */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    {isUserAtThisTable ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsMinimized(false)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#00a86b] hover:bg-[#008f5b] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                        >
                          <Maximize2 className="w-4 h-4" />
                          <span>Open Conference</span>
                        </button>
                        <button
                          onClick={handleLeaveTable}
                          className="py-2.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs transition-colors cursor-pointer"
                          title="Leave Table"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinTable(table.id)}
                        disabled={isFull}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                          isFull
                            ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                            : "bg-white/10 hover:bg-[#00a86b] text-white border border-white/15 hover:border-emerald-500 shadow-sm"
                        }`}
                      >
                        <span>{isFull ? "Table is Full" : "Grab a Seat"}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* 3. SPEED 1-ON-1 NETWORKING TAB */}
      {activeTab === "speed" && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
          <div className="w-full bg-[#121c24] border border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#ea8125]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#00a86b]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 bg-[#ea8125] text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider mb-6 shadow-md shadow-orange-500/20">
              <Zap className="w-4 h-4 text-amber-200" />
              <span>Speed Networking Roulette</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              3-Minute 1-on-1 Health Matching
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
              Instantly connect face-to-face with clinic directors, keynote speakers, researchers, and health practitioners. Quick intros, high-value connections.
            </p>

            {speedState === "idle" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-amber-400 font-bold text-sm mb-1">⏱️ 3-Min Timer</div>
                    <div className="text-xs text-slate-400">Crisp, focused conversations with option to extend.</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-emerald-400 font-bold text-sm mb-1">🎯 Matched Interests</div>
                    <div className="text-xs text-slate-400">Paired with attendees active in your health specialty.</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-blue-400 font-bold text-sm mb-1">📇 Swap Contact</div>
                    <div className="text-xs text-slate-400">1-click exchange of LinkedIn and HSTV profiles.</div>
                  </div>
                </div>

                <button
                  onClick={handleStartSpeedNetworking}
                  className="px-8 py-4 bg-gradient-to-r from-[#ea8125] to-amber-600 hover:from-[#d9731b] hover:to-amber-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-orange-600/30 hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-3"
                >
                  <Zap className="w-5 h-5" />
                  <span>Start Speed Matching Now</span>
                </button>
              </div>
            )}

            {speedState === "searching" && (
              <div className="py-12 space-y-6">
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-[#ea8125]/30 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-t-[#ea8125] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <Users className="w-10 h-10 text-[#ea8125]" />
                </div>
                <h3 className="text-xl font-bold text-white">Searching for your next match...</h3>
                <p className="text-xs text-slate-400">Scanning 184 active delegates across cardiology, longevity & functional clinics</p>
              </div>
            )}

            {speedState === "connected" && speedPartner && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                {/* Timer Bar */}
                <div className="flex items-center justify-between bg-black/50 px-6 py-3 rounded-2xl border border-white/10 max-w-md mx-auto">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400">Time Remaining:</span>
                  </div>
                  <span className="font-mono text-xl font-black text-amber-400">
                    {formatTimer(speedTimer)}
                  </span>
                  <button
                    onClick={() => setSpeedTimer((prev) => prev + 120)}
                    className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-lg hover:bg-emerald-900 transition-colors"
                  >
                    +2 Min
                  </button>
                </div>

                {/* 1:1 Video Split Screen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {/* Remote Match Video */}
                  <div className="relative aspect-video bg-black/80 rounded-2xl overflow-hidden border-2 border-amber-500/50 flex items-center justify-center shadow-xl">
                    <img
                      src={speedPartner.avatar}
                      alt={speedPartner.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-left">
                      <div className="text-xs font-bold text-white">{speedPartner.name}</div>
                      <div className="text-[0.65rem] text-slate-300">{speedPartner.company}</div>
                    </div>
                  </div>

                  {/* Local Video */}
                  <div className="relative aspect-video bg-black/80 rounded-2xl overflow-hidden border-2 border-emerald-500/50 flex items-center justify-center shadow-xl">
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-left">
                      <div className="text-xs font-bold text-white">You</div>
                      <div className="text-[0.65rem] text-emerald-400">Broadcasting</div>
                    </div>
                  </div>
                </div>

                {/* Speed Controls */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={toggleMic}
                    className={`p-3 rounded-xl border ${
                      isMicMuted ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-white/10 border-white/15 text-white"
                    }`}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={toggleCam}
                    className={`p-3 rounded-xl border ${
                      isCamMuted ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-white/10 border-white/15 text-white"
                    }`}
                  >
                    {isCamMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => alert("Contact card shared with " + speedPartner.name)}
                    className="px-5 py-3 bg-[#00a86b] hover:bg-[#008f5b] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Swap Contact Info</span>
                  </button>

                  <button
                    onClick={handleStartSpeedNetworking}
                    className="px-5 py-3 bg-[#ea8125] hover:bg-[#d9731b] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Next Match ➔</span>
                  </button>

                  <button
                    onClick={() => {
                      setSpeedState("idle");
                      stopCamera();
                    }}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                  >
                    End Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* 4. IN-TABLE FULL CONFERENCE THEATRE MODAL (AIRMEET IN-ROOM VIEW) */}
      {joinedTableId && currentJoinedTable && !isMinimized && (
        <div className="fixed inset-0 z-50 bg-[#080d11]/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          {/* In-Table Top Bar */}
          <div className="h-16 px-6 bg-[#0c1419] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase bg-[#00a86b] text-white px-2.5 py-1 rounded">
                TABLE {currentJoinedTable.number}
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {currentJoinedTable.title}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[0.7rem] text-slate-400 hidden sm:inline">
                    {currentJoinedTable.topic}
                  </span>
                  <span className="text-[0.7rem] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.2 rounded-full">
                    🟢 {totalLiveParticipants} Live Camera{totalLiveParticipants > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy Invite Link */}
              <button
                onClick={copyTableLink}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Share link to join this table with another delegate"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Invite 2nd Camera"}</span>
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Minimize Table (Picture in Picture)"
              >
                <Minimize2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleLeaveTable}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Leave Table</span>
              </button>
            </div>
          </div>

          {/* In-Table Main Area (Video Grid + Right Drawer) */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left/Center: Responsive Video Grid */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
              {/* Active Reaction Floating Overlay */}
              {activeReaction && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 text-6xl animate-bounce pointer-events-none">
                  {activeReaction}
                </div>
              )}

              {/* Waiting for other live cameras notification banner if alone */}
              {activePeerEntries.length === 0 && (
                <div className="mb-4 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 rounded-2xl p-3 text-center flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Your camera is live at <strong>Table {currentJoinedTable.number}</strong>. Open this page in a second browser window/device to see 2-way live video!</span>
                  </div>
                  <button
                    onClick={copyTableLink}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    {copiedLink ? "Link Copied ✓" : "Copy Table Link"}
                  </button>
                </div>
              )}

              {/* Screen Share Window if Active */}
              {isScreenSharing && (
                <div className="mb-4 aspect-video bg-black rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-2xl relative">
                  <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
                  <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/40">
                    🖥️ Screen Share Active
                  </div>
                </div>
              )}

              {/* Dynamic Video Tiles Grid (Live Cameras Only) */}
              <div
                className={`flex-1 items-center justify-center gap-4 ${
                  activePeerEntries.length === 0
                    ? "grid grid-cols-1 max-w-4xl mx-auto w-full"
                    : activePeerEntries.length === 1
                    ? "grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto w-full"
                    : activePeerEntries.length <= 3
                    ? "grid grid-cols-1 sm:grid-cols-2 max-w-6xl mx-auto w-full"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full"
                }`}
              >
                {/* 1. Local User Live Video Tile */}
                <div className="relative aspect-video bg-[#152028] rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl flex items-center justify-center group">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${isCamMuted || !localStream ? "hidden" : "block"}`}
                  />
                  {(isCamMuted || !localStream) && (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-800/80 border-2 border-emerald-400 flex items-center justify-center text-white text-lg font-bold mb-2 shadow-lg">
                        ME
                      </div>
                      <span className="text-xs font-bold text-slate-300">Camera is Muted</span>
                      <button
                        onClick={toggleCam}
                        className="mt-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[0.7rem] font-bold rounded-lg transition-colors cursor-pointer shadow"
                      >
                        Turn Camera On
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 z-10">
                    <span className="text-xs font-bold text-white">You</span>
                    <span className="text-[0.65rem] text-emerald-400 font-semibold">
                      {isCamMuted || !localStream ? "• Cam Muted" : "• Live Cam"}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {isMicMuted && (
                      <span className="p-1 rounded bg-red-500/80 text-white text-xs">
                        <MicOff className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {handRaised && (
                      <span className="p-1 rounded bg-amber-500 text-black text-xs animate-bounce font-bold">
                        ✋ Hand Raised
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. REAL WebRTC Remote Live Camera Tiles */}
                {activePeerEntries.map(([peerId, stream], index) => (
                  <RemoteVideoTile
                    key={peerId}
                    peerId={peerId}
                    stream={stream}
                    index={index}
                  />
                ))}
              </div>

              {/* Bottom Conference Control Bar (Airmeet Style) */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                    isMicMuted
                      ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                      : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
                  }`}
                >
                  {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
                  <span className="hidden sm:inline">{isMicMuted ? "Unmute" : "Mute"}</span>
                </button>

                <button
                  onClick={toggleCam}
                  className={`p-3 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                    isCamMuted
                      ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                      : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
                  }`}
                >
                  {isCamMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-emerald-400" />}
                  <span className="hidden sm:inline">{isCamMuted ? "Start Cam" : "Stop Cam"}</span>
                </button>

                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                    isScreenSharing
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
                  }`}
                >
                  <MonitorUp className="w-5 h-5" />
                  <span className="hidden sm:inline">Share Screen</span>
                </button>

                <button
                  onClick={() => setHandRaised(!handRaised)}
                  className={`p-3 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                    handRaised
                      ? "bg-amber-500 text-black shadow-lg"
                      : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
                  }`}
                >
                  <Hand className="w-5 h-5" />
                  <span className="hidden sm:inline">Raise Hand</span>
                </button>

                {/* Emoji Reactions Bar */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
                  {["👏", "❤️", "🔥", "🎉", "💡"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => triggerReaction(emoji)}
                      className="p-1.5 hover:scale-125 transition-transform text-lg cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Drawer: Table Chat & Members */}
            <div className="w-80 lg:w-96 bg-[#0e161c] border-l border-white/10 flex flex-col shrink-0 hidden md:flex">
              {/* Drawer Tabs */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveDrawerTab("chat")}
                  className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                    activeDrawerTab === "chat"
                      ? "border-[#00a86b] text-[#00a86b] bg-white/5"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  💬 Table Chat
                </button>
                <button
                  onClick={() => setActiveDrawerTab("members")}
                  className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                    activeDrawerTab === "members"
                      ? "border-[#00a86b] text-[#00a86b] bg-white/5"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  👥 Members ({totalLiveParticipants})
                </button>
              </div>

              {/* Chat Panel Content */}
              {activeDrawerTab === "chat" && (
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {tableMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl text-xs leading-relaxed ${
                          msg.isMe
                            ? "bg-emerald-950/70 border border-emerald-800/40 text-emerald-100 ml-4"
                            : "bg-white/5 border border-white/10 text-slate-200 mr-4"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 opacity-75">
                          <span className="font-bold text-white">{msg.sender}</span>
                          <span className="text-[0.65rem]">{msg.time}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type table message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00a86b]"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-[#00a86b] hover:bg-[#008f5b] text-white rounded-xl transition-colors cursor-pointer shadow"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* Members Panel Content */}
              {activeDrawerTab === "members" && (
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                        ME
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">You (Local User)</div>
                        <div className="text-[0.7rem] text-emerald-400">Live Camera Active</div>
                      </div>
                    </div>
                  </div>

                  {activePeerEntries.map(([peerId], idx) => (
                    <div
                      key={peerId}
                      className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center">
                          P{idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Live Peer #{idx + 1}</div>
                          <div className="text-[0.7rem] text-slate-400">Connected ({peerId.slice(0, 5)})</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING PICTURE-IN-PICTURE (WHEN MINIMIZED) */}
      {joinedTableId && currentJoinedTable && isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0e161c] border-2 border-[#00a86b] rounded-2xl p-4 shadow-2xl w-80 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live: Table {currentJoinedTable.number}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                title="Expand"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleLeaveTable}
                className="p-1 rounded bg-red-500/30 hover:bg-red-500 text-red-200 hover:text-white"
                title="Leave"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs font-semibold text-white truncate mb-3">
            {currentJoinedTable.title}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
            <span>{totalLiveParticipants} Live Cameras</span>
            <button
              onClick={() => setIsMinimized(false)}
              className="text-[#00a86b] font-bold hover:underline"
            >
              Reopen Room ➔
            </button>
          </div>
        </div>
      )}

      {/* 6. CREATE CUSTOM TABLE MODAL */}
      {showCreateTableModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCreateTableModal(false)}
        >
          <div
            className="bg-[#121c24] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00a86b]" />
                Start Discussion Table
              </h3>
              <button
                onClick={() => setShowCreateTableModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Table Topic / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Longevity Protocols & IV Therapies"
                  value={newTableTitle}
                  onChange={(e) => setNewTableTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00a86b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Description / Agenda (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Practical takeaways from morning keynote session"
                  value={newTableTopic}
                  onChange={(e) => setNewTableTopic(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00a86b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Seat Capacity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 6, 8].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setNewTableCapacity(cap as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        newTableCapacity === cap
                          ? "bg-[#00a86b] border-[#00a86b] text-white"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cap} Seats
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#00a86b] hover:bg-[#008f5b] text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Create & Take Host Seat
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTableModal(false)}
                  className="py-3 px-4 bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
