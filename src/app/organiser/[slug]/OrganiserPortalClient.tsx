"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { App as MediaZillaApp } from "@/components/mediazilla/App";

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
  events: Array<{
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
  }>;
  videos: Array<{
    id: number;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    category: string | null;
    isFree: boolean;
    price?: number;
  }>;
};

const ORGANISER_SCHEDULE: Array<{
  day: number;
  name: string;
  subtitle: string;
  sessions: Array<{
    id: string;
    number: number;
    title: string;
    duration: string;
    speaker: string;
    chapters: Array<{ time: string; title: string }>;
  }>;
}> = [
  {
    day: 1,
    name: "Day 1",
    subtitle: "Foundations of Longevity & Cellular Health",
    sessions: [
      {
        id: "d1-s1",
        number: 1,
        title: "Keynote: Mitochondrial Biology & Cellular Renewal",
        duration: "42:00",
        speaker: "Steve Pollard",
        chapters: [
          { time: "00:00", title: "Welcome & Summit Overview" },
          { time: "12:00", title: "Cellular Energy & ATP Pathways" },
          { time: "25:00", title: "Mitochondrial Repair Protocols" },
          { time: "35:00", title: "Audience Q&A & Takeaways" }
        ]
      },
      {
        id: "d1-s2",
        number: 2,
        title: "Clinical Protocols: NAD+, Peptides & Fasting Windows",
        duration: "48:00",
        speaker: "Prof. Liam Vance",
        chapters: [
          { time: "00:00", title: "NAD+ Infusions vs Precursors" },
          { time: "15:00", title: "Therapeutic Peptide Stacks" },
          { time: "30:00", title: "Fasting Mimicking & Autophagy" }
        ]
      },
      {
        id: "d1-s3",
        number: 3,
        title: "Masterclass: Autophagy Induction & Biomarker Testing",
        duration: "38:00",
        speaker: "Dr. Jonathan Hayes",
        chapters: [
          { time: "00:00", title: "Advanced Blood Chemistry Analysis" },
          { time: "14:00", title: "Continuous Glucose Tracking Nuances" },
          { time: "28:00", title: "Live Audience Q&A" }
        ]
      },
      {
        id: "d1-s4",
        number: 4,
        title: "Clinical Case Studies & Live Delegate Q&A",
        duration: "40:00",
        speaker: "Panel Discussion",
        chapters: [
          { time: "00:00", title: "Case Study: Chronic Fatigue Reversal" },
          { time: "18:00", title: "Delegate Round-Robin Questions" }
        ]
      }
    ]
  },
  {
    day: 2,
    name: "Day 2",
    subtitle: "Gut-Brain Axis, Microbiome Solutions & Digestion",
    sessions: [
      {
        id: "d2-s1",
        number: 1,
        title: "Keynote: The Microbiome as a Master Regulator",
        duration: "40:00",
        speaker: "Dr. Alistair Ross",
        chapters: [
          { time: "00:00", title: "The Intestinal Mucosal Barrier" },
          { time: "15:00", title: "Microbiome Diversity & SCFA Production" }
        ]
      },
      {
        id: "d2-s2",
        number: 2,
        title: "Clinical Protocols: SIBO, Leaky Gut & Psychobiotics",
        duration: "52:00",
        speaker: "Rachel Davies",
        chapters: [
          { time: "00:00", title: "SIBO Breath Testing & Antimicrobials" },
          { time: "20:00", title: "Targeted Strain-Specific Probiotics" }
        ]
      },
      {
        id: "d2-s3",
        number: 3,
        title: "Workshop: Vagus Nerve & Motility Activation",
        duration: "45:00",
        speaker: "Dr. Elena Rostova",
        chapters: [
          { time: "00:00", title: "Vagal Tone Measurement (HRV)" },
          { time: "18:00", title: "Somatic Exercises for Migrating Motor Complex" }
        ]
      },
      {
        id: "d2-s4",
        number: 4,
        title: "Case Studies: Reversing Chronic Gut Inflammation",
        duration: "45:00",
        speaker: "Clinical Panel",
        chapters: [
          { time: "00:00", title: "Autoimmune & Food Sensitivity Panel" }
        ]
      }
    ]
  },
  {
    day: 3,
    name: "Day 3",
    subtitle: "Hormone Optimization & Metabolic Precision",
    sessions: [
      {
        id: "d3-s1",
        number: 1,
        title: "Endocrine Reset & Thyroid Mastery",
        duration: "38:00",
        speaker: "Dr. Marcus Thorne",
        chapters: [
          { time: "00:00", title: "Complete Thyroid & Adrenal Assessment" }
        ]
      },
      {
        id: "d3-s2",
        number: 2,
        title: "Bio-Identical Hormones & Precision Dosing",
        duration: "49:00",
        speaker: "Dr. Rebecca Sterling",
        chapters: [
          { time: "00:00", title: "BHRT Protocols for Men & Women" }
        ]
      },
      {
        id: "d3-s3",
        number: 3,
        title: "Insulin Sensitivity & Metabolic Flexibility",
        duration: "42:00",
        speaker: "Sophia Martinez",
        chapters: [
          { time: "00:00", title: "Continuous Glucose Monitoring (CGM) Calibration" }
        ]
      },
      {
        id: "d3-s4",
        number: 4,
        title: "Personalized Hormone Therapy Roundtable",
        duration: "38:00",
        speaker: "Expert Roundtable",
        chapters: [
          { time: "00:00", title: "Case Studies & Live Audience Q&A" }
        ]
      }
    ]
  },
  {
    day: 4,
    name: "Day 4",
    subtitle: "Sleep Architecture & Neuroplasticity",
    sessions: [
      {
        id: "d4-s1",
        number: 1,
        title: "Sleep Stages, Glymphatic Clearance & REM",
        duration: "44:00",
        speaker: "David Chen",
        chapters: [
          { time: "00:00", title: "Understanding Deep Sleep & Recovery" }
        ]
      },
      {
        id: "d4-s2",
        number: 2,
        title: "Nootropics, BDNF & Cognitive Longevity",
        duration: "50:00",
        speaker: "Dr. Arthur Pendelton",
        chapters: [
          { time: "00:00", title: "Brain Aging & Synaptic Plasticity" }
        ]
      },
      {
        id: "d4-s3",
        number: 3,
        title: "HRV Tracking & Stress Resilience Masterclass",
        duration: "37:00",
        speaker: "Dr. Sarah Jenkins",
        chapters: [
          { time: "00:00", title: "Autonomic Nervous System Regulation" }
        ]
      },
      {
        id: "d4-s4",
        number: 4,
        title: "Sound Frequencies & Light Hygiene Protocols",
        duration: "50:00",
        speaker: "Wellness Team",
        chapters: [
          { time: "00:00", title: "Circadian Lighting & Sound Therapy" }
        ]
      }
    ]
  },
  {
    day: 5,
    name: "Day 5",
    subtitle: "Integration & Future of Integrative Care",
    sessions: [
      {
        id: "d5-s1",
        number: 1,
        title: "The Daily Health & Longevity Stack",
        duration: "46:30",
        speaker: "Steve Pollard & Guests",
        chapters: [
          { time: "00:00", title: "Opening Remarks & Assessment" },
          { time: "13:00", title: "Daily Habit Stacking Formulation" },
          { time: "28:00", title: "Interactive Calibration & Demos" }
        ]
      },
      {
        id: "d5-s2",
        number: 2,
        title: "Biohacking in Clinical Practice",
        duration: "36:15",
        speaker: "Prof. Liam Vance",
        chapters: [
          { time: "00:00", title: "Hyperbaric, Red Light & Cold Therapy" }
        ]
      },
      {
        id: "d5-s3",
        number: 3,
        title: "Action Plan: Integrating Summit Protocols",
        duration: "55:00",
        speaker: "Dr. Jonathan Hayes",
        chapters: [
          { time: "00:00", title: "Practical Patient Implementation" }
        ]
      },
      {
        id: "d5-s4",
        number: 4,
        title: "Grand Closing Summit Keynote & Awards",
        duration: "48:00",
        speaker: "All Founders & Speakers",
        chapters: [
          { time: "00:00", title: "Closing Remarks & Certificate Awards" }
        ]
      }
    ]
  }
];

export default function OrganiserPortalClient({ organiser }: { organiser: OrganiserType }) {
  const [showInteractivePlayer, setShowInteractivePlayer] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedScheduleDay, setSelectedScheduleDay] = useState(1);
  const playerRef = useRef<HTMLDivElement>(null);

  const currentScheduleDay = ORGANISER_SCHEDULE.find((d) => d.day === selectedScheduleDay) || ORGANISER_SCHEDULE[0];

  const handleLaunchHumanGarage = () => {
    setShowInteractivePlayer(true);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  return (
    <main className="w-full h-screen overflow-hidden bg-black relative">
      <iframe
        src={`/mediazilla/index.html?organiser=${organiser.slug || 'human-garage'}`}
        className="w-full h-full border-none"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </main>
  );
}
