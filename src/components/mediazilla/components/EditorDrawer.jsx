import React, { useState } from 'react';
import {
  X,
  Palette,
  Layout,
  Video,
  Music,
  Plus,
  Trash2,
  Settings,
  Sparkles,
  Check,
  Film
} from 'lucide-react';
import { THEME_PRESETS, LAYOUT_PRESETS } from '../data/stylePresets';

export function EditorDrawer({
  presentation,
  onUpdatePresentation,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('style'); // 'general', 'style', 'videos', 'background'
  const [selectedVideoForChapters, setSelectedVideoForChapters] = useState(
    presentation.videos[0]?.id || ''
  );

  // New chapter temporary state
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterTime, setNewChapterTime] = useState('');

  const currentVideo = presentation.videos.find((v) => v.id === selectedVideoForChapters) || presentation.videos[0];

  const handleTextChange = (field, val) => {
    onUpdatePresentation({
      ...presentation,
      [field]: val
    });
  };

  const handleThemeChange = (themeId) => {
    onUpdatePresentation({
      ...presentation,
      themePreset: themeId
    });
  };

  const handleLayoutChange = (layoutId) => {
    onUpdatePresentation({
      ...presentation,
      layoutPreset: layoutId
    });
  };

  const handleAddChapter = () => {
    if (!newChapterTitle || !currentVideo) return;
    const timeParts = (newChapterTime || '00:00').split(':').map(Number);
    const secs = timeParts.length === 2 ? timeParts[0] * 60 + timeParts[1] : 0;

    const newChapter = {
      id: `chap-${Date.now()}`,
      title: newChapterTitle,
      time: secs,
      timeFormatted: newChapterTime || '00:00',
      thumbnail: currentVideo.thumbnail
    };

    const updatedVideos = presentation.videos.map((v) => {
      if (v.id === currentVideo.id) {
        return {
          ...v,
          chapters: [...(v.chapters || []), newChapter].sort((a, b) => a.time - b.time)
        };
      }
      return v;
    });

    onUpdatePresentation({
      ...presentation,
      videos: updatedVideos
    });

    setNewChapterTitle('');
    setNewChapterTime('');
  };

  const handleDeleteChapter = (chapterId) => {
    const updatedVideos = presentation.videos.map((v) => {
      if (v.id === currentVideo.id) {
        return {
          ...v,
          chapters: (v.chapters || []).filter((c) => c.id !== chapterId)
        };
      }
      return v;
    });

    onUpdatePresentation({
      ...presentation,
      videos: updatedVideos
    });
  };

  return (
    <div className="editor-sidebar-container">
      {/* Editor Header */}
      <div className="editor-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="editor-badge-pill">MediaZilla Studio</span>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Presentation Editor</h3>
        </div>
        <button onClick={onClose} className="icon-btn-small" title="Close Editor">
          <X size={20} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="editor-tabs-strip">
        <button
          onClick={() => setActiveTab('style')}
          className={`editor-tab-btn ${activeTab === 'style' ? 'active' : ''}`}
        >
          <Palette size={16} />
          <span>Style & Layout</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`editor-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
        >
          <Settings size={16} />
          <span>Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`editor-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
        >
          <Video size={16} />
          <span>Chapters</span>
        </button>

        <button
          onClick={() => setActiveTab('background')}
          className={`editor-tab-btn ${activeTab === 'background' ? 'active' : ''}`}
        >
          <Music size={16} />
          <span>Backdrop & Audio</span>
        </button>
      </div>

      {/* Scrollable Tab Body */}
      <div className="editor-scroll-body">
        {/* TAB 1: STYLE & LAYOUT */}
        {activeTab === 'style' && (
          <>
            {/* Theme Presets */}
            <div className="editor-section-card">
              <span className="editor-section-title">
                <Palette size={15} color="var(--mz-accent)" />
                Theme & Color Grading
              </span>

              <div className="preset-grid">
                {THEME_PRESETS.map((preset) => {
                  const isActive = presentation.themePreset === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleThemeChange(preset.id)}
                      className={`preset-card-option ${isActive ? 'active' : ''}`}
                    >
                      <div
                        className="preset-swatch"
                        style={{
                          background: `linear-gradient(135deg, ${preset.accentColor} 0%, #111420 100%)`
                        }}
                      />
                      <span className="preset-name">{preset.name}</span>
                      <span className="preset-cat">{preset.category}</span>
                      {isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            color: preset.accentColor
                          }}
                        >
                          <Check size={14} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Menu Layout Presets */}
            <div className="editor-section-card">
              <span className="editor-section-title">
                <Layout size={15} color="var(--mz-accent)" />
                Menu Navigation Layout
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {LAYOUT_PRESETS.map((layout) => {
                  const isActive = presentation.layoutPreset === layout.id;
                  return (
                    <div
                      key={layout.id}
                      onClick={() => handleLayoutChange(layout.id)}
                      className={`manage-list-item ${isActive ? 'active' : ''}`}
                      style={{
                        cursor: 'pointer',
                        borderColor: isActive ? 'var(--mz-accent)' : undefined,
                        background: isActive ? 'rgba(212, 175, 55, 0.1)' : undefined
                      }}
                    >
                      <div className="manage-item-info">
                        <span style={{ color: isActive ? 'var(--mz-accent)' : '#94a3b8' }}>
                          <Layout size={18} />
                        </span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                            {layout.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {layout.description}
                          </div>
                        </div>
                      </div>
                      {isActive && <Check size={16} color="var(--mz-accent)" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: GENERAL & BRANDING */}
        {activeTab === 'general' && (
          <>
            <div className="editor-section-card">
              <span className="editor-section-title">Film Titles & Metadata</span>

              <div className="editor-form-group">
                <label className="editor-label">Presentation Title</label>
                <input
                  type="text"
                  value={presentation.title}
                  onChange={(e) => handleTextChange('title', e.target.value)}
                  className="editor-input"
                />
              </div>

              <div className="editor-form-group">
                <label className="editor-label">Subtitle / Description</label>
                <input
                  type="text"
                  value={presentation.subtitle}
                  onChange={(e) => handleTextChange('subtitle', e.target.value)}
                  className="editor-input"
                />
              </div>

              <div className="editor-form-group">
                <label className="editor-label">Date & Location</label>
                <input
                  type="text"
                  value={presentation.dateLocation}
                  onChange={(e) => handleTextChange('dateLocation', e.target.value)}
                  className="editor-input"
                />
              </div>
            </div>

            <div className="editor-section-card">
              <span className="editor-section-title">Filmmaker Studio Branding</span>

              <div className="editor-form-group">
                <label className="editor-label">Studio Name</label>
                <input
                  type="text"
                  value={presentation.filmmaker}
                  onChange={(e) => handleTextChange('filmmaker', e.target.value)}
                  className="editor-input"
                />
              </div>

              <div className="editor-form-group">
                <label className="editor-label">Client Passcode Protection</label>
                <input
                  type="text"
                  value={presentation.sharePasscode || ''}
                  onChange={(e) => handleTextChange('sharePasscode', e.target.value)}
                  placeholder="Optional PIN/Passcode"
                  className="editor-input"
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 3: VIDEOS & CHAPTERS */}
        {activeTab === 'videos' && (
          <>
            <div className="editor-section-card">
              <span className="editor-section-title">Select Video to Manage Chapters</span>

              <select
                value={selectedVideoForChapters}
                onChange={(e) => setSelectedVideoForChapters(e.target.value)}
                className="editor-select"
              >
                {presentation.videos.map((v) => (
                  <option key={v.id} value={v.id}>
                    🎬 {v.title} ({v.durationFormatted})
                  </option>
                ))}
              </select>
            </div>

            {currentVideo && (
              <div className="editor-section-card">
                <span className="editor-section-title">
                  Chapters for "{currentVideo.title}" ({currentVideo.chapters?.length || 0})
                </span>

                {/* Chapter List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentVideo.chapters?.map((chap, idx) => (
                    <div key={chap.id || idx} className="manage-list-item">
                      <div className="manage-item-info">
                        <span style={{ fontFamily: 'var(--mz-font-mono)', fontSize: '0.75rem', color: 'var(--mz-accent)' }}>
                          {chap.timeFormatted}
                        </span>
                        <span className="manage-item-title">{chap.title}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteChapter(chap.id)}
                        className="icon-btn-small delete"
                        title="Delete Chapter Marker"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}

                  {(!currentVideo.chapters || currentVideo.chapters.length === 0) && (
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      No chapter markers added for this video yet.
                    </p>
                  )}
                </div>

                {/* Add New Chapter */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Add Scene Marker</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="e.g. 02:45"
                      value={newChapterTime}
                      onChange={(e) => setNewChapterTime(e.target.value)}
                      className="editor-input"
                      style={{ width: '90px' }}
                    />
                    <input
                      type="text"
                      placeholder="Scene Title (e.g. Sunset Portraits)"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      className="editor-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      onClick={handleAddChapter}
                      className="copy-pill-btn"
                      style={{ padding: '0.45rem 0.75rem' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 4: BACKDROP & AUDIO */}
        {activeTab === 'background' && (
          <>
            <div className="editor-section-card">
              <span className="editor-section-title">Menu Background Media</span>

              <div className="editor-form-group">
                <label className="editor-label">Cover Artwork Image URL</label>
                <input
                  type="text"
                  value={presentation.coverImage}
                  onChange={(e) => handleTextChange('coverImage', e.target.value)}
                  className="editor-input"
                />
              </div>

              <div className="editor-form-group">
                <label className="editor-label">Looping Background Video URL (MP4 / WebM)</label>
                <input
                  type="text"
                  value={presentation.backgroundVideo || ''}
                  onChange={(e) => handleTextChange('backgroundVideo', e.target.value)}
                  className="editor-input"
                />
              </div>

              <div className="editor-form-group">
                <label className="editor-label">
                  Backdrop Darkness Overlay ({Math.round((presentation.backgroundDarkness || 0.4) * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.85"
                  step="0.05"
                  value={presentation.backgroundDarkness || 0.4}
                  onChange={(e) => handleTextChange('backgroundDarkness', parseFloat(e.target.value))}
                  style={{ accentColor: 'var(--mz-accent)' }}
                />
              </div>

              <div className="editor-form-group">
                <label className="editor-label">
                  Backdrop Blur Filter ({presentation.backgroundBlur || 0}px)
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={presentation.backgroundBlur || 0}
                  onChange={(e) => handleTextChange('backgroundBlur', parseInt(e.target.value, 10))}
                  style={{ accentColor: 'var(--mz-accent)' }}
                />
              </div>
            </div>

            <div className="editor-section-card">
              <span className="editor-section-title">Background Ambient Music</span>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={presentation.enableAmbientSound}
                  onChange={(e) => handleTextChange('enableAmbientSound', e.target.checked)}
                  style={{ accentColor: 'var(--mz-accent)', width: '16px', height: '16px' }}
                />
                <span>Enable Atmospheric Romantic Chords on Menu</span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
