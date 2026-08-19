import React from 'react';
import { Share2, Download, Sliders, PlayCircle, Eye } from 'lucide-react';

export function TopHeader({
  presentation,
  isEditorOpen,
  onToggleEditor,
  onOpenShare,
  onSwitchPresentation,
  presentationsList,
  onStartPlayAll
}) {
  return (
    <header className="presentation-header">
      {/* Filmmaker Studio Branding & Title */}
      <div className="header-branding">
        <h1 className="header-title">{presentation.title}</h1>
        <div className="header-meta">
          <span>{presentation.subtitle}</span>
          <span className="header-dot">•</span>
          <span>{presentation.dateLocation}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="header-actions">
        {/* Presentation Preset Switcher */}
        <select
          value={presentation.id}
          onChange={(e) => onSwitchPresentation(e.target.value)}
          className="header-btn"
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            paddingRight: '1.25rem',
            cursor: 'pointer'
          }}
          title="Switch Demo Presentation"
        >
          {presentationsList.map((p) => (
            <option key={p.id} value={p.id} style={{ background: '#12141d', color: '#ffffff' }}>
              📁 {p.title}
            </option>
          ))}
        </select>

        {/* Play All Quick Action */}
        <button
          onClick={onStartPlayAll}
          className="header-btn primary"
          title="Play entire film collection in continuous sequence"
        >
          <PlayCircle size={16} />
          <span>Play All</span>
        </button>

        {/* Share / Delivery Dialog */}
        <button
          onClick={onOpenShare}
          className="header-btn"
          title="Share presentation with client"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>

        {/* Editor Mode Switcher */}
        <button
          onClick={onToggleEditor}
          className={`header-btn ${isEditorOpen ? 'primary' : ''}`}
          style={{
            borderColor: isEditorOpen ? 'var(--mz-accent)' : undefined
          }}
          title="Open MediaZilla Presentation Authoring Studio"
        >
          {isEditorOpen ? <Eye size={16} /> : <Sliders size={16} />}
          <span>{isEditorOpen ? 'Client View' : 'Studio Editor'}</span>
        </button>
      </div>
    </header>
  );
}
