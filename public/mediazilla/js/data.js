export const THEME_PRESETS = [
  {
    id: 'summit-estate',
    name: 'Human Garage Summit',
    category: 'Multi-Day Event',
    accentColor: '#fbbf24',
    accentHover: '#fde68a',
    glowColor: 'rgba(251, 191, 36, 0.25)',
    bgOverlay: 'radial-gradient(ellipse at center, rgba(15, 17, 23, 0.25) 0%, rgba(8, 9, 13, 0.65) 100%)',
    cardBg: 'rgba(20, 22, 28, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    cardHoverBorder: 'rgba(255, 255, 255, 0.35)',
    textColor: '#ffffff',
    textMuted: '#cbd5e1',
    badgeBg: 'rgba(251, 191, 36, 0.15)',
    badgeText: '#fde68a',
    titleFont: "'Plus Jakarta Sans', sans-serif",
    serifFont: "'Plus Jakarta Sans', sans-serif"
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold & Obsidian',
    category: 'Wedding & Romance',
    accentColor: '#d4af37',
    accentHover: '#f3e5ab',
    glowColor: 'rgba(212, 175, 55, 0.25)',
    bgOverlay: 'radial-gradient(ellipse at center, rgba(15, 17, 23, 0.45) 0%, rgba(8, 9, 13, 0.88) 100%)',
    cardBg: 'rgba(18, 20, 29, 0.65)',
    cardBorder: 'rgba(212, 175, 55, 0.22)',
    cardHoverBorder: 'rgba(212, 175, 55, 0.75)',
    textColor: '#f8fafc',
    textMuted: '#94a3b8',
    badgeBg: 'rgba(212, 175, 55, 0.15)',
    badgeText: '#f3e5ab',
    titleFont: "'Cinzel', serif",
    serifFont: "'Cormorant Garamond', serif"
  },
  {
    id: 'nordic-minimalist',
    name: 'Nordic Clean & Steel',
    category: 'Corporate & Modern',
    accentColor: '#38bdf8',
    accentHover: '#7dd3fc',
    glowColor: 'rgba(56, 189, 248, 0.22)',
    bgOverlay: 'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.90) 100%)',
    cardBg: 'rgba(30, 41, 59, 0.60)',
    cardBorder: 'rgba(148, 163, 184, 0.20)',
    cardHoverBorder: 'rgba(56, 189, 248, 0.75)',
    textColor: '#f1f5f9',
    textMuted: '#94a3b8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeText: '#7dd3fc',
    titleFont: "'Montserrat', sans-serif",
    serifFont: "'Plus Jakarta Sans', sans-serif"
  }
];

export const LAYOUT_PRESETS = [
  {
    id: 'multi-day-tabs',
    name: 'Multi-Day Summit Tabs (Human Garage Style)',
    description: 'Top tabs bar for days/tracks with wide frosted glass session rows.'
  },
  {
    id: 'bottom-bar',
    name: 'Blu-ray Bottom Bar (Classic MediaZilla)',
    description: 'Sleek horizontal navigation docked along the lower screen with cinematic backdrop.'
  },
  {
    id: 'center-cards',
    name: 'Center Floating Showcase',
    description: 'Modern glassmorphic floating cards centered over high-motion video background.'
  },
  {
    id: 'editorial-grid',
    name: 'Editorial Multi-Column Grid',
    description: 'Visual cards with large thumbnail poster frames and instant timecode badges.'
  }
];

export const BACKGROUND_PRESETS = [
  {
    id: 'manor-estate',
    name: 'English Country Manor (Original)',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&auto=format&fit=crop&q=85'
  },
  {
    id: 'luxury-chateau',
    name: 'Historic Stone Chateau',
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&auto=format&fit=crop&q=85'
  },
  {
    id: 'nature-retreat',
    name: 'Lush Botanical Estate',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&auto=format&fit=crop&q=85'
  },
  {
    id: 'amalfi-cliff',
    name: 'Mediterranean Villa',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&auto=format&fit=crop&q=85'
  }
];

export const DEFAULT_PRESENTATIONS = [
  {
    id: 'human-garage-summit',
    title: 'Human Garage',
    subtitle: '5-DAY SUMMIT',
    badgeText: '5-DAY SUMMIT',
    dateLocation: 'Fascia & Alignment Mastery',
    filmmaker: 'Human Garage Media',
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&auto=format&fit=crop&q=85',
    backgroundVideo: '',
    themePreset: 'summit-estate',
    layoutPreset: 'multi-day-tabs',
    backgroundBlur: 0,
    backgroundDarkness: 0.35,
    enableAmbientSound: false,
    sharePasscode: 'GARAGE2026',
    downloadSize: '38.4 GB (4K Complete Summit Archive)',
    days: [
      {
        id: 'day-1',
        name: 'Day One',
        badgeCount: 3,
        subtitle: 'Day One: Foundations of Fascial Maneuvers & Breath',
        sessions: [
          {
            id: 'd1-s1',
            title: 'Day One - Session 1',
            subtitle: 'Introduction to Fascia & Lower Body Release',
            duration: 2520,
            durationFormatted: '42:00',
            thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            chapters: [
              { id: 'c1-1', title: 'Welcome & Breath Alignment', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80' },
              { id: 'c1-2', title: 'Pelvic & Diaphragm Unwinding', time: 720, timeFormatted: '12:00', thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80' },
              { id: 'c1-3', title: 'Group Integration & Q&A', time: 1800, timeFormatted: '30:00', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: 'd1-s2',
            title: 'Day One - Session 2',
            subtitle: 'Upper Body & Thoracic Spine Mobility',
            duration: 2880,
            durationFormatted: '48:00',
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            chapters: [
              { id: 'c1-4', title: 'Ribcage & Shoulder Mechanics', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80' },
              { id: 'c1-5', title: 'Deep Fascial Torque & Twist', time: 900, timeFormatted: '15:00', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: 'd1-s3',
            title: 'Day One - Session 3',
            subtitle: 'Evening Calming Sequence & Vagus Nerve Stimulation',
            duration: 2100,
            durationFormatted: '35:00',
            thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            chapters: []
          }
        ]
      },
      {
        id: 'day-2',
        name: 'Day Two',
        badgeCount: 3,
        subtitle: 'Day Two: Deep Cellular Hydration & Organ Motility',
        sessions: [
          {
            id: 'd2-s1',
            title: 'Day Two - Session 1',
            subtitle: 'Morning Activation & Mineral Water Protocol',
            duration: 2400,
            durationFormatted: '40:00',
            thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            chapters: []
          },
          {
            id: 'd2-s2',
            title: 'Day Two - Session 2',
            subtitle: 'Visceral Manipulation & Psoas Decompression',
            duration: 3120,
            durationFormatted: '52:00',
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            chapters: []
          },
          {
            id: 'd2-s3',
            title: 'Day Two - Session 3',
            subtitle: 'Somatic Emotional Release Workshop',
            duration: 2700,
            durationFormatted: '45:00',
            thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            chapters: []
          }
        ]
      },
      {
        id: 'day-3',
        name: 'Day Three',
        badgeCount: 3,
        subtitle: 'Day Three: Cranial Unwinding & Nervous System Reset',
        sessions: [
          {
            id: 'd3-s1',
            title: 'Day Three - Session 1',
            subtitle: 'Jaw (TMJ) & Neck Tension Release',
            duration: 2280,
            durationFormatted: '38:00',
            thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            chapters: []
          },
          {
            id: 'd3-s2',
            title: 'Day Three - Session 2',
            subtitle: 'Cranial Decompression & Eye Track Exercises',
            duration: 2940,
            durationFormatted: '49:00',
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            chapters: []
          },
          {
            id: 'd3-s3',
            title: 'Day Three - Session 3',
            subtitle: 'Partner Maneuvers & Assisted Unwinding',
            duration: 2520,
            durationFormatted: '42:00',
            thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            chapters: []
          }
        ]
      },
      {
        id: 'day-4',
        name: 'Day Four',
        badgeCount: 3,
        subtitle: 'Day Four: Dynamic Biomechanics & Ground Force',
        sessions: [
          {
            id: 'd4-s1',
            title: 'Day Four - Session 1',
            subtitle: 'Foot, Ankle & Knee Spirals',
            duration: 2640,
            durationFormatted: '44:00',
            thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            chapters: []
          },
          {
            id: 'd4-s2',
            title: 'Day Four - Session 2',
            subtitle: 'Functional Rotational Power',
            duration: 3000,
            durationFormatted: '50:00',
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            chapters: []
          },
          {
            id: 'd4-s3',
            title: 'Day Four - Session 3',
            subtitle: 'Flow State Movement & Rhythm',
            duration: 2220,
            durationFormatted: '37:00',
            thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            chapters: []
          }
        ]
      },
      {
        id: 'day-5',
        name: 'Day Five',
        badgeCount: 3,
        subtitle: 'Day Five: Integration & Daily Mastery',
        sessions: [
          {
            id: 'd5-s1',
            title: 'Day Five - Session 1',
            subtitle: 'The 15-Minute Daily Reset Routine',
            duration: 2790,
            durationFormatted: '46:30',
            thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            chapters: [
              { id: 'c5-1', title: 'Opening Remarks & Full Body Assessment', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80' },
              { id: 'c5-2', title: 'The Core 4 Fascial Maneuvers', time: 780, timeFormatted: '13:00', thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80' },
              { id: 'c5-3', title: 'Standing Torque & Micro-Adjustments', time: 1680, timeFormatted: '28:00', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80' },
              { id: 'c5-4', title: 'Final Posture Calibration', time: 2400, timeFormatted: '40:00', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: 'd5-s2',
            title: 'Day Five - Session 2',
            subtitle: 'Troubleshooting Chronic Pain & Specific Inquiries',
            duration: 2175,
            durationFormatted: '36:15',
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            chapters: [
              { id: 'c5-5', title: 'Lower Back & Sciatica Relief', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80' },
              { id: 'c5-6', title: 'Frozen Shoulder & Neck Impingement', time: 840, timeFormatted: '14:00', thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80' },
              { id: 'c5-7', title: 'Live Audience Demonstrations', time: 1560, timeFormatted: '26:00', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: 'd5-s3',
            title: 'Day Five - Session 3',
            subtitle: 'Closing Circle, Lifelong Practice & Community',
            duration: 3300,
            durationFormatted: '55:00',
            thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            chapters: [
              { id: 'c5-8', title: 'Building Your Habit Stack', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80' },
              { id: 'c5-9', title: 'Closing Breathwork & Gratitude Circle', time: 1800, timeFormatted: '30:00', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80' }
            ]
          }
        ]
      }
    ],
    // Flat video array for player compatibility
    videos: [
      {
        id: 'd5-s1',
        title: 'Day Five - Session 1',
        subtitle: 'The 15-Minute Daily Reset Routine (46:30)',
        duration: 2790,
        durationFormatted: '46:30',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        badge: 'Session 1',
        chapters: [
          { id: 'c5-1', title: 'Opening Remarks & Assessment', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80' },
          { id: 'c5-2', title: 'The Core 4 Fascial Maneuvers', time: 780, timeFormatted: '13:00', thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80' },
          { id: 'c5-3', title: 'Standing Torque & Micro-Adjustments', time: 1680, timeFormatted: '28:00', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80' },
          { id: 'c5-4', title: 'Final Posture Calibration', time: 2400, timeFormatted: '40:00', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80' }
        ]
      },
      {
        id: 'd5-s2',
        title: 'Day Five - Session 2',
        subtitle: 'Troubleshooting Chronic Pain (36:15)',
        duration: 2175,
        durationFormatted: '36:15',
        thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        badge: 'Session 2',
        chapters: []
      },
      {
        id: 'd5-s3',
        title: 'Day Five - Session 3',
        subtitle: 'Closing Circle & Daily Mastery (55:00)',
        duration: 3300,
        durationFormatted: '55:00',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        badge: 'Session 3',
        chapters: []
      }
    ],
    menuButtons: [
      { id: 'btn-hg-playall', type: 'play-all', title: 'Play All Day 5', icon: 'play', badge: 'Continuous' }
    ]
  },
  {
    id: 'wedding-sophia-alexander',
    title: 'Sophia & Alexander',
    subtitle: 'The Wedding Celebration',
    badgeText: 'WEDDING FILM',
    dateLocation: 'October 14, 2025 • Villa Cimbrone, Ravello, Italy',
    filmmaker: 'Lumière Cinema Studios',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&auto=format&fit=crop&q=85',
    backgroundVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    themePreset: 'luxury-gold',
    layoutPreset: 'bottom-bar',
    backgroundBlur: 0,
    backgroundDarkness: 0.35,
    enableAmbientSound: true,
    sharePasscode: 'SOPHIA2025',
    downloadSize: '14.2 GB (4K UHD Master + 1080p Web)',
    videos: [
      {
        id: 'vid-highlight',
        title: 'Cinematic Highlight Film',
        subtitle: 'The 4K Official Wedding Film (5:12)',
        duration: 312,
        durationFormatted: '05:12',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        badge: 'Featured Film',
        chapters: [
          { id: 'c1', title: 'Morning Preparations', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=80' },
          { id: 'c2', title: 'The First Look', time: 58, timeFormatted: '00:58', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=80' },
          { id: 'c3', title: 'The Vows & Rings', time: 142, timeFormatted: '02:22', thumbnail: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&auto=format&fit=crop&q=80' },
          { id: 'c4', title: 'Amalfi Coast Sunset', time: 215, timeFormatted: '03:35', thumbnail: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&auto=format&fit=crop&q=80' }
        ]
      },
      {
        id: 'vid-ceremony',
        title: 'Full Ceremony (Uncut)',
        subtitle: 'Complete Audio & Multicam Edit (28:40)',
        duration: 1720,
        durationFormatted: '28:40',
        thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        badge: 'Full Edit',
        chapters: []
      }
    ],
    menuButtons: [
      { id: 'btn-playall', type: 'play-all', title: 'Play All', icon: 'play', badge: 'Continuous' },
      { id: 'btn-highlight', type: 'video', videoId: 'vid-highlight', title: 'Highlight Film', icon: 'film', badge: '5:12' },
      { id: 'btn-scenes', type: 'submenu', submenuId: 'scenes-menu', title: 'Scene Selection', icon: 'list', badge: '4 Chapters' },
      { id: 'btn-ceremony', type: 'video', videoId: 'vid-ceremony', title: 'Full Ceremony', icon: 'camera', badge: '28:40' }
    ]
  }
];
