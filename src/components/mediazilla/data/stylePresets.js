export const THEME_PRESETS = [
  {
    id: 'luxury-gold',
    name: 'Luxury Gold & Obsidian',
    category: 'Wedding & Editorial',
    primaryFont: "'Cormorant Garamond', serif",
    titleFont: "'Cinzel', serif",
    sansFont: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#d4af37',
    accentHover: '#f3e5ab',
    bgOverlay: 'radial-gradient(ellipse at center, rgba(15, 17, 23, 0.45) 0%, rgba(8, 9, 13, 0.88) 100%)',
    cardBg: 'rgba(18, 20, 29, 0.65)',
    cardBorder: 'rgba(212, 175, 55, 0.22)',
    textColor: '#f8fafc',
    textMuted: '#94a3b8',
    glowColor: 'rgba(212, 175, 55, 0.15)',
    badgeBg: 'rgba(212, 175, 55, 0.15)',
    badgeText: '#f3e5ab'
  },
  {
    id: 'nordic-minimalist',
    name: 'Nordic Clean & Steel',
    category: 'Corporate & Modern',
    primaryFont: "'Plus Jakarta Sans', sans-serif",
    titleFont: "'Montserrat', sans-serif",
    sansFont: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#38bdf8',
    accentHover: '#7dd3fc',
    bgOverlay: 'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.90) 100%)',
    cardBg: 'rgba(30, 41, 59, 0.60)',
    cardBorder: 'rgba(148, 163, 184, 0.20)',
    textColor: '#f1f5f9',
    textMuted: '#94a3b8',
    glowColor: 'rgba(56, 189, 248, 0.18)',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeText: '#7dd3fc'
  },
  {
    id: 'midnight-royal',
    name: 'Midnight Sapphire',
    category: 'Cinema & Gala',
    primaryFont: "'Plus Jakarta Sans', sans-serif",
    titleFont: "'Cinzel', serif",
    sansFont: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#818cf8',
    accentHover: '#a5b4fc',
    bgOverlay: 'radial-gradient(circle at top right, rgba(30, 27, 75, 0.40), rgba(10, 10, 20, 0.92) 80%)',
    cardBg: 'rgba(20, 22, 45, 0.65)',
    cardBorder: 'rgba(129, 140, 248, 0.25)',
    textColor: '#ffffff',
    textMuted: '#a5b4fc',
    glowColor: 'rgba(129, 140, 248, 0.20)',
    badgeBg: 'rgba(129, 140, 248, 0.18)',
    badgeText: '#c7d2fe'
  },
  {
    id: 'editorial-rose',
    name: 'Editorial Rose & Champagne',
    category: 'Romance & Boutique',
    primaryFont: "'Cormorant Garamond', serif",
    titleFont: "'Cormorant Garamond', serif",
    sansFont: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#fb7185',
    accentHover: '#fda4af',
    bgOverlay: 'linear-gradient(135deg, rgba(30, 15, 20, 0.35) 0%, rgba(15, 8, 12, 0.88) 100%)',
    cardBg: 'rgba(35, 18, 25, 0.65)',
    cardBorder: 'rgba(251, 113, 133, 0.25)',
    textColor: '#fff1f2',
    textMuted: '#fecdd3',
    glowColor: 'rgba(251, 113, 133, 0.15)',
    badgeBg: 'rgba(251, 113, 133, 0.18)',
    badgeText: '#ffe4e6'
  },
  {
    id: 'film-noir',
    name: 'Film Noir & Platinum',
    category: 'Documentary & Indie',
    primaryFont: "'Montserrat', sans-serif",
    titleFont: "'Montserrat', sans-serif",
    sansFont: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#f1f5f9',
    accentHover: '#ffffff',
    bgOverlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0.40) 0%, rgba(5, 5, 5, 0.95) 100%)',
    cardBg: 'rgba(24, 24, 27, 0.70)',
    cardBorder: 'rgba(255, 255, 255, 0.20)',
    textColor: '#fafafa',
    textMuted: '#a1a1aa',
    glowColor: 'rgba(255, 255, 255, 0.12)',
    badgeBg: 'rgba(255, 255, 255, 0.12)',
    badgeText: '#ffffff'
  }
];

export const LAYOUT_PRESETS = [
  {
    id: 'bottom-bar',
    name: 'Blu-ray Bottom Bar (Classic MediaZilla)',
    description: 'Sleek horizontal navigation docked along the lower screen with cinematic backdrop.',
    icon: 'PanelBottom'
  },
  {
    id: 'center-cards',
    name: 'Center Floating Showcase',
    description: 'Modern glassmorphic floating cards centered over high-motion video background.',
    icon: 'LayoutGrid'
  },
  {
    id: 'editorial-grid',
    name: 'Editorial Multi-Column Grid',
    description: 'Visual cards with large thumbnail poster frames and instant timecode badges.',
    icon: 'Grid3X3'
  },
  {
    id: 'left-pillar',
    name: 'Left Cinema Pillar',
    description: 'Vertical column aligned to the left with title hero display on the right.',
    icon: 'PanelLeft'
  },
  {
    id: 'minimal-floating',
    name: 'Minimal Floating Pill Bar',
    description: 'Unobtrusive, streamlined pill buttons floating gently at the bottom.',
    icon: 'Minus'
  }
];
