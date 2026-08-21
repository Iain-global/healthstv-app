"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Hand,
  Smile,
  LogOut,
  Users,
  MessageSquare,
  Sparkles,
  Search,
  Plus,
  Radio,
  Tv,
  Layers,
  Zap,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  X,
  Send,
  ExternalLink,
  Share2,
  Settings,
  HelpCircle,
  Lock,
  Compass,
  Flame,
  Heart,
  ThumbsUp,
  PartyPopper,
  Lightbulb,
} from "lucide-react";

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
    seatedUsers: [
      {
        id: "u1",
        name: "Dr. Sarah Jenkins",
        role: "Keynote Speaker",
        company: "Longevity Institute UK",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop",
        isSpeaking: true,
        isHost: true,
      },
      {
        id: "u2",
        name: "Marcus Vance",
        role: "Health Clinic Director",
        company: "Vance Cellular Health",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
      },
      {
        id: "u3",
        name: "Elena Rostova",
        role: "Biochemist & Author",
        company: "NutriGen Labs",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop",
      },
    ],
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
    seatedUsers: [
      {
        id: "u4",
        name: "Dr. Jonathan Hayes",
        role: "Gastroenterologist",
        company: "GutHealth Medical",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
        isSpeaking: false,
        isHost: true,
      },
      {
        id: "u5",
        name: "Rachel Davies",
        role: "Clinical Nutritionist",
        company: "PureBiome UK",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&fit=crop",
        isSpeaking: true,
      },
    ],
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
    seatedUsers: [
      {
        id: "u6",
        name: "David Chen",
        role: "Sleep Scientist",
        company: "SomnaTech Research",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop",
      },
    ],
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
    seatedUsers: [
      {
        id: "u7",
        name: "Sophia Martinez",
        role: "AI Health Lead",
        company: "MedTech Pulse",
        avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&h=200&fit=crop",
      },
      {
        id: "u8",
        name: "Tom Henderson",
        role: "Founder & CEO",
        company: "VitalTrack Systems",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop",
      },
    ],
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
    seatedUsers: [
      {
        id: "u9",
        name: "Dr. Alistair Ross",
        role: "Clinic Founder",
        company: "London Integrative Care",
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&h=200&fit=crop",
      },
      {
        id: "u10",
        name: "Claire Thomson",
        role: "Operations Director",
        company: "Synergy Wellness Group",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop",
      },
      {
        id: "u11",
        name: "Markus Bailey",
        role: "Health Entrepreneur",
        company: "Holistic Hub",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&fit=crop",
      },
    ],
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
    seatedUsers: [
      {
        id: "u12",
        name: "Jessica White",
        role: "Wellness Consultant",
        company: "Vibrant Living Co.",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&h=200&fit=crop",
      },
    ],
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
    seatedUsers: [
      {
        id: "u13",
        name: "Prof. Arthur Pendelton",
        role: "Keynote Speaker",
        company: "Imperial Health Oncology",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&fit=crop",
        isHost: true,
        isSpeaking: true,
      },
      {
        id: "u14",
        name: "Dr. Maya Patel",
        role: "Integrative Physician",
        company: "Beacon Health UK",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&h=200&fit=crop",
      },
    ],
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
    seatedUsers: [
      {
        id: "u15",
        name: "Gemma Lawson",
        role: "Best-Selling Author",
        company: "Penguin Health Series",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop",
        isHost: true,
      },
    ],
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
    seatedUsers: [
      {
        id: "u16",
        name: "Alexander Fox",
        role: "Chief Product Officer",
        company: "OxyHealth Systems",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
        isHost: true,
      },
    ],
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
    seatedUsers: [
      {
        id: "u17",
        name: "Helen McGregor",
        role: "BANT Registered Nutritionist",
        company: "Edinburgh Holistic",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop",
      },
      {
        id: "u18",
        name: "James Thorne",
        role: "Functional Health Coach",
        company: "Thorne Performance",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
      },
    ],
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

  // Chat in Table
  const [tableMessages, setTableMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "Dr. Sarah Jenkins",
      text: "Welcome everyone! Feel free to ask about our recent NAD+ clinical trial protocol.",
      time: "14:02",
    },
    {
      id: "m2",
      sender: "Marcus Vance",
      text: "Thanks Dr. Jenkins! We're seeing great compliance in our London clinic with the subcutaneous doses.",
      time: "14:04",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Speed Networking State
  const [speedState, setSpeedState] = useState<"idle" | "searching" | "connected">("idle");
  const [speedTimer, setSpeedTimer] = useState(180); // 3 minutes
  const [speedPartner, setSpeedPartner] = useState<SeatedUser | null>(null);

  // Custom Table Modal
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [newTableTitle, setNewTableTitle] = useState("");
  const [newTableTopic, setNewTableTopic] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState<2 | 4 | 6 | 8>(6);

  // Initialize Media Stream when joining
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        setHasPermission(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } else {
        setHasPermission(true);
      }
    } catch (err) {
      console.warn("Could not access webcam/mic", err);
      setHasPermission(true);
    }
  };

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
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
  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isCamMuted;
      });
    }
    setIsCamMuted(!isCamMuted);
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
  const handleJoinTable = (tableId: number) => {
    if (!hasPermission) {
      setShowPermissionModal(true);
      setJoinedTableId(tableId);
      return;
    }

    setJoinedTableId(tableId);
    setIsMinimized(false);
    startCamera();

    // Add local user to table if not already
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
          // Remove from other tables
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

  // Create Table
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
                    {/* Outer Orbit / Seating Ring */}
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
                      const angle = (index * 360) / totalSeats - 90; // Top starting
                      const radius = 80; // Radius in pixels
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

                            {/* Name Tooltip */}
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

      {/* 3. SPEED 1-ON-1 NETWORKING TAB (AIRMEET SIGNATURE) */}
      {activeTab === "speed" && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
          <div className="w-full bg-[#121c24] border border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden">
            {/* Background glowing shapes */}
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
                <p className="text-[0.7rem] text-slate-400 hidden sm:block">
                  {currentJoinedTable.topic}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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

              {/* Screen Share Window if Active */}
              {isScreenSharing && (
                <div className="mb-4 aspect-video bg-black rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-2xl relative">
                  <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
                  <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/40">
                    🖥️ Screen Share Active
                  </div>
                </div>
              )}

              {/* Dynamic Video Tiles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 items-center justify-center">
                {/* 1. Local User Video Tile */}
                <div className="relative aspect-video bg-[#152028] rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl flex items-center justify-center group">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${isCamMuted ? "hidden" : "block"}`}
                  />
                  {isCamMuted && (
                    <div className="w-16 h-16 rounded-full bg-emerald-700/60 border-2 border-emerald-400 flex items-center justify-center text-white text-xl font-bold">
                      ME
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">You</span>
                    <span className="text-[0.65rem] text-emerald-400 font-semibold">• Speaking</span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
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

                {/* 2. Other Seated Participants */}
                {currentJoinedTable.seatedUsers
                  .filter((u) => u.id !== "me")
                  .map((user) => (
                    <div
                      key={user.id}
                      className={`relative aspect-video bg-[#152028] rounded-2xl overflow-hidden border shadow-xl flex items-center justify-center group ${
                        user.isSpeaking ? "border-amber-400 ring-2 ring-amber-400/30" : "border-white/10"
                      }`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 text-left max-w-[80%]">
                        <div className="text-xs font-bold text-white truncate">{user.name}</div>
                        <div className="text-[0.65rem] text-slate-300 truncate">{user.company}</div>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        {user.isSpeaking && (
                          <div className="flex items-center gap-1 bg-amber-500/90 text-black px-2 py-0.5 rounded text-[0.65rem] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
                            Speaking
                          </div>
                        )}
                        {user.isHost && (
                          <div className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[0.65rem] font-bold">
                            Host
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                {/* Fill empty seats representation */}
                {Array.from({
                  length: Math.max(0, currentJoinedTable.capacity - currentJoinedTable.seatedUsers.length),
                }).map((_, i) => (
                  <div
                    key={`empty-grid-${i}`}
                    className="aspect-video bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 p-4 text-center"
                  >
                    <Users className="w-8 h-8 opacity-30 mb-2" />
                    <span className="text-xs font-semibold">Seat Open</span>
                    <span className="text-[0.65rem] opacity-60">Invite another delegate</span>
                  </div>
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
                  👥 Members ({currentJoinedTable.seatedUsers.length})
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
                  {currentJoinedTable.seatedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{user.name}</div>
                          <div className="text-[0.7rem] text-slate-400">{user.role}</div>
                          <div className="text-[0.65rem] text-[#00a86b]">{user.company}</div>
                        </div>
                      </div>

                      {user.id !== "me" && (
                        <button
                          onClick={() => alert(`Connecting with ${user.name}...`)}
                          className="text-[0.7rem] font-bold text-white bg-white/10 hover:bg-[#00a86b] px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Connect
                        </button>
                      )}
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
            <span>{currentJoinedTable.seatedUsers.length} Delegates</span>
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

      {/* 7. CAMERA & MIC PERMISSION / ONBOARDING MODAL */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121c24] border border-white/15 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl">
              📹
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Join the Table?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Connect with fellow health specialists face-to-face. You can mute your microphone or disable your camera at any moment.
            </p>

            <button
              onClick={() => {
                setShowPermissionModal(false);
                setHasPermission(true);
                if (joinedTableId) {
                  handleJoinTable(joinedTableId);
                }
              }}
              className="w-full py-3.5 bg-[#00a86b] hover:bg-[#008f5b] text-white font-bold text-base rounded-xl shadow-lg transition-colors cursor-pointer mb-3"
            >
              Allow Camera & Mic
            </button>

            <button
              onClick={() => setShowPermissionModal(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Browse Tables as Spectator
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
