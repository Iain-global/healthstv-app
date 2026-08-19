import React from 'react';
import {
  Play,
  Film,
  ListOrdered,
  Camera,
  Mic2,
  Music,
  Sparkles,
  Users,
  Video,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

const ICON_MAP = {
  Play: Play,
  Film: Film,
  ListOrdered: ListOrdered,
  Camera: Camera,
  Mic2: Mic2,
  Music: Music,
  Sparkles: Sparkles,
  Users: Users,
  Video: Video,
  FolderOpen: FolderOpen
};

export function InteractiveMenu({
  presentation,
  onSelectVideo,
  onOpenSubmenu,
  onStartPlayAll
}) {
  const layout = presentation.layoutPreset || 'bottom-bar';
  const buttons = presentation.menuButtons || [];

  const handleButtonClick = (btn) => {
    if (btn.type === 'play-all') {
      onStartPlayAll();
    } else if (btn.type === 'submenu') {
      onOpenSubmenu(btn.submenuId || 'scenes-menu', btn.title);
    } else if (btn.type === 'video') {
      const targetVideo = presentation.videos.find((v) => v.id === btn.videoId);
      if (targetVideo) {
        onSelectVideo(targetVideo);
      }
    }
  };

  const renderIcon = (iconName) => {
    const IconComp = ICON_MAP[iconName] || Film;
    return <IconComp size={18} />;
  };

  // Layout 1: Classic MediaZilla Blu-ray Bottom Bar
  if (layout === 'bottom-bar') {
    return (
      <div className="presentation-viewport">
        <div className="presentation-center-content">
          <div className="hero-centerpiece">
            <h2 className="hero-main-title">{presentation.title}</h2>
            <p className="hero-subtitle">{presentation.subtitle}</p>
            <div className="hero-divider" />
          </div>
        </div>

        <nav className="menu-bottom-dock" aria-label="Media Menu">
          <div className="bottom-buttons-track">
            {buttons.map((btn) => {
              const isPlayAll = btn.type === 'play-all';
              return (
                <button
                  key={btn.id}
                  onClick={() => handleButtonClick(btn)}
                  className={`menu-action-card ${isPlayAll ? 'play-all-primary' : ''}`}
                >
                  <div className="card-icon-bubble">{renderIcon(btn.icon)}</div>
                  <div className="card-content-stack">
                    <span className="card-title">{btn.title}</span>
                    {btn.badge && <span className="card-badge">{btn.badge}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  // Layout 2: Center Floating Cards (Netflix / Apple TV style)
  if (layout === 'center-cards') {
    return (
      <div className="presentation-viewport">
        <div className="presentation-center-content">
          <div className="hero-centerpiece" style={{ marginBottom: '1.75rem' }}>
            <h2 className="hero-main-title">{presentation.title}</h2>
            <p className="hero-subtitle">{presentation.subtitle}</p>
          </div>

          <div className="layout-center-grid">
            {buttons.map((btn) => {
              const isPlayAll = btn.type === 'play-all';
              const targetVideo = btn.videoId ? presentation.videos.find((v) => v.id === btn.videoId) : null;

              return (
                <button
                  key={btn.id}
                  onClick={() => handleButtonClick(btn)}
                  className={`center-showcase-card ${isPlayAll ? 'play-all-primary' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div className="card-icon-bubble">{renderIcon(btn.icon)}</div>
                    {btn.badge && <span className="card-badge">{btn.badge}</span>}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>
                    {btn.title}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: 'var(--mz-text-muted)', marginBottom: '0.85rem' }}>
                    {targetVideo ? targetVideo.subtitle : isPlayAll ? 'Play full collection continuously' : 'Browse chapters & scenes'}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--mz-accent)', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>{isPlayAll ? 'Start Playback' : 'Select Scene'}</span>
                    <ChevronRight size={15} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ height: '40px' }} />
      </div>
    );
  }

  // Layout 3: Editorial Multi-Column Grid
  if (layout === 'editorial-grid') {
    return (
      <div className="presentation-viewport">
        <div className="presentation-center-content">
          <div className="hero-centerpiece" style={{ marginBottom: '1.5rem' }}>
            <h2 className="hero-main-title">{presentation.title}</h2>
            <p className="hero-subtitle">{presentation.subtitle}</p>
          </div>

          <div className="scenes-grid-container">
            {presentation.videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => onSelectVideo(vid)}
                className="chapter-tile-card"
              >
                <div className="chapter-poster-box">
                  <img src={vid.thumbnail} alt={vid.title} className="chapter-poster-img" />
                  <div className="chapter-play-hover-overlay">
                    <div className="chapter-hover-play-icon">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                  <span className="chapter-time-stamp">{vid.durationFormatted}</span>
                </div>
                <div className="chapter-details-box">
                  <span className="card-badge" style={{ alignSelf: 'flex-start' }}>{vid.badge || 'Film'}</span>
                  <h4 className="chapter-card-title">{vid.title}</h4>
                  <p className="chapter-card-subtitle">{vid.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: '40px' }} />
      </div>
    );
  }

  // Layout 4: Left Pillar Menu
  if (layout === 'left-pillar') {
    return (
      <div className="presentation-viewport" style={{ flexDirection: 'row', alignItems: 'center' }}>
        <div
          style={{
            width: '380px',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(8, 9, 13, 0.95) 0%, rgba(8, 9, 13, 0.75) 80%, rgba(8, 9, 13, 0) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '3rem',
            gap: '1rem',
            zIndex: 25
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--mz-font-title)', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.12em', color: '#ffffff' }}>
              {presentation.title}
            </h2>
            <p style={{ fontFamily: 'var(--mz-font-serif)', fontSize: '1.1rem', color: 'var(--mz-accent)', fontStyle: 'italic' }}>
              {presentation.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {buttons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleButtonClick(btn)}
                className="menu-action-card"
                style={{ width: '100%' }}
              >
                <div className="card-icon-bubble">{renderIcon(btn.icon)}</div>
                <div className="card-content-stack">
                  <span className="card-title">{btn.title}</span>
                  {btn.badge && <span className="card-badge">{btn.badge}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="presentation-center-content" style={{ alignItems: 'flex-start', paddingLeft: '4rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <span className="card-badge" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              {presentation.filmmaker}
            </span>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: '1rem' }}>
              A Masterpiece in 4K UHD
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--mz-text-muted)', lineHeight: 1.6 }}>
              Select any film or chapter from the menu to begin. Featuring pristine high bit-rate streaming, surround audio, and lifetime digital presentation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Layout 5: Minimal Floating Pill Bar
  return (
    <div className="presentation-viewport">
      <div className="presentation-center-content">
        <div className="hero-centerpiece">
          <h2 className="hero-main-title">{presentation.title}</h2>
          <p className="hero-subtitle">{presentation.subtitle}</p>
        </div>
      </div>

      <div style={{ padding: '0 2rem 3rem', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(15, 17, 23, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          {buttons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleButtonClick(btn)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                borderRadius: '9999px',
                background: btn.type === 'play-all' ? 'var(--mz-accent)' : 'rgba(255, 255, 255, 0.08)',
                color: btn.type === 'play-all' ? '#000000' : '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.2s ease'
              }}
            >
              {renderIcon(btn.icon)}
              <span>{btn.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
