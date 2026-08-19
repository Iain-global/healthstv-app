import React from 'react';
import { ArrowLeft, Play, Clock, Sparkles } from 'lucide-react';

export function SceneSelectionGrid({
  presentation,
  submenuTitle = 'Scene Selection',
  onBack,
  onSelectChapter
}) {
  // Aggregate chapters from the main feature/highlight film or all videos
  const highlightVideo = presentation.videos[0] || {};
  const chapters = highlightVideo.chapters || [];

  return (
    <div className="presentation-viewport">
      <div className="presentation-center-content" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
        {/* Breadcrumb Navigation */}
        <div className="submenu-nav-header">
          <button onClick={onBack} className="back-to-main-btn">
            <ArrowLeft size={16} />
            <span>Main Menu</span>
          </button>

          <div className="submenu-title-badge">
            <Sparkles size={18} color="var(--mz-accent)" />
            <span>{submenuTitle}</span>
          </div>

          <div style={{ width: '100px' }} />
        </div>

        {/* Scene Cards Grid */}
        <div className="scenes-grid-container">
          {chapters.map((chap, idx) => (
            <div
              key={chap.id || idx}
              onClick={() => onSelectChapter(highlightVideo, chap.time)}
              className="chapter-tile-card"
            >
              <div className="chapter-poster-box">
                <img
                  src={chap.thumbnail || highlightVideo.thumbnail}
                  alt={chap.title}
                  className="chapter-poster-img"
                />
                <div className="chapter-play-hover-overlay">
                  <div className="chapter-hover-play-icon">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                <span className="chapter-time-stamp">{chap.timeFormatted}</span>
              </div>

              <div className="chapter-details-box">
                <span className="card-badge" style={{ alignSelf: 'flex-start' }}>
                  Scene {idx + 1}
                </span>
                <h4 className="chapter-card-title">{chap.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--mz-text-muted)', marginTop: '0.2rem' }}>
                  <Clock size={12} />
                  <span>Starts at {chap.timeFormatted}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
