export const DEFAULT_PRESENTATIONS = [
  {
    id: 'wedding-sophia-alexander',
    title: 'Sophia & Alexander',
    subtitle: 'The Wedding Celebration',
    dateLocation: 'October 14, 2025 • Villa Cimbrone, Ravello, Italy',
    filmmaker: 'Lumière Cinema Studios',
    filmmakerLogo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=80',
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
        fallbackVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        badge: 'Featured Film',
        chapters: [
          { id: 'c1', title: 'Morning Preparations & Letter Exchange', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=80' },
          { id: 'c2', title: 'The First Look at the Cliffside Terrace', time: 58, timeFormatted: '00:58', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=80' },
          { id: 'c3', title: 'The Vows & Exchange of Rings', time: 142, timeFormatted: '02:22', thumbnail: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&auto=format&fit=crop&q=80' },
          { id: 'c4', title: 'Golden Hour Boat Cruise on the Amalfi Coast', time: 215, timeFormatted: '03:35', thumbnail: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&auto=format&fit=crop&q=80' },
          { id: 'c5', title: 'Sparkler Grand Exit & Midnight Dance', time: 270, timeFormatted: '04:30', thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&auto=format&fit=crop&q=80' }
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
        badge: 'Multicam Documentary',
        chapters: [
          { id: 'c-cer-1', title: 'Processional & Guest Seating', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80' },
          { id: 'c-cer-2', title: 'Bridal Entrance & Procession', time: 180, timeFormatted: '03:00', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=80' },
          { id: 'c-cer-3', title: 'Readings & Family Blessings', time: 540, timeFormatted: '09:00', thumbnail: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&auto=format&fit=crop&q=80' },
          { id: 'c-cer-4', title: 'Personal Vows to Each Other', time: 920, timeFormatted: '15:20', thumbnail: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&auto=format&fit=crop&q=80' },
          { id: 'c-cer-5', title: 'Pronouncement & Recessional', time: 1450, timeFormatted: '24:10', thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&auto=format&fit=crop&q=80' }
        ]
      },
      {
        id: 'vid-speeches',
        title: 'Speeches & Toasts',
        subtitle: 'Father of the Bride, Best Man & Maid of Honor (18:15)',
        duration: 1095,
        durationFormatted: '18:15',
        thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        badge: 'Reception Chapter',
        chapters: [
          { id: 'c-sp-1', title: 'Welcome Toast by Father of Bride', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&auto=format&fit=crop&q=80' },
          { id: 'c-sp-2', title: 'Maid of Honor Speech & Montage', time: 320, timeFormatted: '05:20', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=80' },
          { id: 'c-sp-3', title: 'Best Man Roast & Toast', time: 680, timeFormatted: '11:20', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=80' },
          { id: 'c-sp-4', title: 'Groom & Bride Thank You Address', time: 940, timeFormatted: '15:40', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80' }
        ]
      },
      {
        id: 'vid-firstdance',
        title: 'First Dance & Party Highlights',
        subtitle: 'Choreographed Waltz + Live Band Performance (08:45)',
        duration: 525,
        durationFormatted: '08:45',
        thumbnail: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        badge: 'Party & Dancing',
        chapters: [
          { id: 'c-fd-1', title: 'Bride & Groom First Dance', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&auto=format&fit=crop&q=80' },
          { id: 'c-fd-2', title: 'Parents Dance', time: 190, timeFormatted: '03:10', thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&auto=format&fit=crop&q=80' },
          { id: 'c-fd-3', title: 'Live Italian Band & Confetti Cannon', time: 360, timeFormatted: '06:00', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80' }
        ]
      },
      {
        id: 'vid-teaser',
        title: 'Instagram 60-Second Teaser',
        subtitle: 'Vertical & Cinema 4K Cut (01:00)',
        duration: 60,
        durationFormatted: '01:00',
        thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        badge: 'Social Cut',
        chapters: []
      }
    ],
    menuButtons: [
      { id: 'btn-playall', type: 'play-all', title: 'Play All', icon: 'Play', badge: 'Continuous' },
      { id: 'btn-highlight', type: 'video', videoId: 'vid-highlight', title: 'Highlight Film', icon: 'Film', badge: '5:12' },
      { id: 'btn-scenes', type: 'submenu', submenuId: 'scenes-menu', title: 'Scene Selection', icon: 'ListOrdered', badge: '5 Chapters' },
      { id: 'btn-ceremony', type: 'video', videoId: 'vid-ceremony', title: 'Full Ceremony', icon: 'Camera', badge: '28:40' },
      { id: 'btn-speeches', type: 'video', videoId: 'vid-speeches', title: 'Speeches & Toasts', icon: 'Mic2', badge: '18:15' },
      { id: 'btn-firstdance', type: 'video', videoId: 'vid-firstdance', title: 'First Dance', icon: 'Music', badge: '8:45' },
      { id: 'btn-teaser', type: 'video', videoId: 'vid-teaser', title: 'Teaser', icon: 'Sparkles', badge: '1:00' }
    ]
  },
  {
    id: 'corporate-apex-summit',
    title: 'Apex Global Summit 2026',
    subtitle: 'Keynote & Executive Product Presentation',
    dateLocation: 'September 22, 2026 • San Francisco Convention Center',
    filmmaker: 'Apex Media & Broadcast',
    filmmakerLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop&q=85',
    backgroundVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    themePreset: 'nordic-minimalist',
    layoutPreset: 'editorial-grid',
    backgroundBlur: 0,
    backgroundDarkness: 0.45,
    enableAmbientSound: false,
    sharePasscode: 'APEX2026',
    downloadSize: '22.8 GB (ProRes 422 HQ + Master Captions)',
    videos: [
      {
        id: 'vid-keynote',
        title: 'Main Keynote Address',
        subtitle: 'CEO Vision & Future Roadmap (45:20)',
        duration: 2720,
        durationFormatted: '45:20',
        thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        badge: 'Main Stage',
        chapters: [
          { id: 'k1', title: 'Opening & 2026 Industry State', time: 0, timeFormatted: '00:00', thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80' },
          { id: 'k2', title: 'Next-Gen Architecture Reveal', time: 600, timeFormatted: '10:00', thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&auto=format&fit=crop&q=80' },
          { id: 'k3', title: 'Live Demonstration & Benchmarks', time: 1500, timeFormatted: '25:00', thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&auto=format&fit=crop&q=80' },
          { id: 'k4', title: 'Ecosystem Partners & Closing', time: 2200, timeFormatted: '36:40', thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&auto=format&fit=crop&q=80' }
        ]
      },
      {
        id: 'vid-panel',
        title: 'Future of AI Panel Discussion',
        subtitle: 'Industry Leaders & Founders (32:10)',
        duration: 1930,
        durationFormatted: '32:10',
        thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        badge: 'Panel Debate',
        chapters: []
      }
    ],
    menuButtons: [
      { id: 'btn-apex-playall', type: 'play-all', title: 'Play All Sessions', icon: 'Play', badge: 'Continuous' },
      { id: 'btn-apex-keynote', type: 'video', videoId: 'vid-keynote', title: 'Main Keynote', icon: 'Film', badge: '45:20' },
      { id: 'btn-apex-scenes', type: 'submenu', submenuId: 'scenes-menu', title: 'Keynote Chapters', icon: 'ListOrdered', badge: '4 Topics' },
      { id: 'btn-apex-panel', type: 'video', videoId: 'vid-panel', title: 'AI Panel Discussion', icon: 'Users', badge: '32:10' }
    ]
  }
];
