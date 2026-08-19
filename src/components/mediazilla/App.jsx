'use client';

import React, { useState, useEffect } from 'react';
import './styles/index.css';
import './styles/menu.css';
import './styles/player.css';
import './styles/editor.css';
import { DEFAULT_PRESENTATIONS } from './data/defaultPresentations';
import { THEME_PRESETS } from './data/stylePresets';
import { MenuBackground } from './components/MenuBackground';
import { TopHeader } from './components/TopHeader';
import { InteractiveMenu } from './components/InteractiveMenu';
import { SceneSelectionGrid } from './components/SceneSelectionGrid';
import { VideoPlayer } from './components/VideoPlayer';
import { EditorDrawer } from './components/EditorDrawer';
import { ShareModal } from './components/ShareModal';

export function App() {
  const [presentations, setPresentations] = useState(DEFAULT_PRESENTATIONS);
  const [activePresId, setActivePresId] = useState(DEFAULT_PRESENTATIONS[0].id);

  // Navigation states
  const [viewState, setViewState] = useState('menu'); // 'menu' | 'submenu' | 'player'
  const [activeSubmenu, setActiveSubmenu] = useState({ id: 'scenes-menu', title: 'Scene Selection' });
  const [activeVideo, setActiveVideo] = useState(null);
  const [playerInitialTime, setPlayerInitialTime] = useState(0);
  const [isPlayAllMode, setIsPlayAllMode] = useState(false);

  // Modals and Drawers
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAmbientMuted, setIsAmbientMuted] = useState(false);

  const currentPresentation =
    presentations.find((p) => p.id === activePresId) || presentations[0];

  // Apply theme CSS variables dynamically
  useEffect(() => {
    const activeTheme =
      THEME_PRESETS.find((t) => t.id === currentPresentation.themePreset) || THEME_PRESETS[0];

    const root = document.documentElement;
    root.style.setProperty('--mz-accent', activeTheme.accentColor);
    root.style.setProperty('--mz-accent-hover', activeTheme.accentHover);
    root.style.setProperty('--mz-accent-glow', activeTheme.glowColor);
    root.style.setProperty('--mz-bg-overlay', activeTheme.bgOverlay);
    root.style.setProperty('--mz-card-bg', activeTheme.cardBg);
    root.style.setProperty('--mz-card-border', activeTheme.cardBorder);
    root.style.setProperty('--mz-badge-bg', activeTheme.badgeBg);
    root.style.setProperty('--mz-badge-text', activeTheme.badgeText);
    root.style.setProperty('--mz-font-title', activeTheme.titleFont);
    root.style.setProperty('--mz-font-body', activeTheme.sansFont);
  }, [currentPresentation.themePreset]);

  // Handlers
  const handleStartPlayAll = () => {
    if (currentPresentation.videos.length > 0) {
      setActiveVideo(currentPresentation.videos[0]);
      setPlayerInitialTime(0);
      setIsPlayAllMode(true);
      setViewState('player');
    }
  };

  const handleSelectVideo = (vid, time = 0) => {
    setActiveVideo(vid);
    setPlayerInitialTime(time);
    setIsPlayAllMode(false);
    setViewState('player');
  };

  const handleOpenSubmenu = (submenuId, title) => {
    setActiveSubmenu({ id: submenuId, title });
    setViewState('submenu');
  };

  const handleBackToMenu = () => {
    setViewState('menu');
    setActiveVideo(null);
    setIsPlayAllMode(false);
  };

  const handlePlayNextVideo = (nextVideo) => {
    setActiveVideo(nextVideo);
    setPlayerInitialTime(0);
  };

  const handleUpdateCurrentPresentation = (updated) => {
    setPresentations((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  return (
    <div className="mediazilla-app">
      {/* Dynamic Background Layer (Active when on Menu or Submenu) */}
      {viewState !== 'player' && (
        <MenuBackground
          presentation={currentPresentation}
          isMuted={isAmbientMuted}
          onToggleMute={() => setIsAmbientMuted(!isAmbientMuted)}
        />
      )}

      {/* Top Header & Filmmaker Branding (Active when not in full video playback) */}
      {viewState !== 'player' && (
        <TopHeader
          presentation={currentPresentation}
          isEditorOpen={isEditorOpen}
          onToggleEditor={() => setIsEditorOpen(!isEditorOpen)}
          onOpenShare={() => setIsShareOpen(true)}
          onSwitchPresentation={(newId) => {
            setActivePresId(newId);
            setViewState('menu');
          }}
          presentationsList={presentations}
          onStartPlayAll={handleStartPlayAll}
        />
      )}

      {/* 1. Main Interactive Menu View */}
      {viewState === 'menu' && (
        <InteractiveMenu
          presentation={currentPresentation}
          onSelectVideo={(vid) => handleSelectVideo(vid, 0)}
          onOpenSubmenu={handleOpenSubmenu}
          onStartPlayAll={handleStartPlayAll}
        />
      )}

      {/* 2. Submenu / Scene Selection Chapter Grid View */}
      {viewState === 'submenu' && (
        <SceneSelectionGrid
          presentation={currentPresentation}
          submenuTitle={activeSubmenu.title}
          onBack={handleBackToMenu}
          onSelectChapter={(vid, time) => handleSelectVideo(vid, time)}
        />
      )}

      {/* 3. 4K Cinema Video Player View */}
      {viewState === 'player' && activeVideo && (
        <VideoPlayer
          video={activeVideo}
          initialTime={playerInitialTime}
          isPlayAllMode={isPlayAllMode}
          allVideos={currentPresentation.videos}
          onBackToMenu={handleBackToMenu}
          onPlayNextVideo={handlePlayNextVideo}
        />
      )}

      {/* Authoring Studio Drawer */}
      {isEditorOpen && (
        <EditorDrawer
          presentation={currentPresentation}
          onUpdatePresentation={handleUpdateCurrentPresentation}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* Share / Delivery Modal */}
      {isShareOpen && (
        <ShareModal
          presentation={currentPresentation}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
