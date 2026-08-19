import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Code2, Download, Lock, ShieldCheck } from 'lucide-react';

export function ShareModal({ presentation, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const shareUrl = `${window.location.origin}/?presentation=${presentation.id}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode).catch(() => {});
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleSimulateDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 3000);
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="var(--mz-accent)" />
            <h3 className="modal-title-text">Client Delivery & Sharing</h3>
          </div>
          <button onClick={onClose} className="icon-btn-small">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body-content">
          {/* Direct Presentation Link */}
          <div className="editor-form-group">
            <label className="editor-label">Direct Client Viewing URL</label>
            <div className="share-url-box">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="share-url-input"
              />
              <button onClick={handleCopyLink} className="copy-pill-btn">
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Security PIN Badge */}
          {presentation.sharePasscode && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid var(--mz-card-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#ffffff' }}>
                <Lock size={15} color="var(--mz-accent)" />
                <span>Protected by Passcode:</span>
              </div>
              <span style={{ fontFamily: 'var(--mz-font-mono)', fontWeight: 700, color: 'var(--mz-accent)' }}>
                {presentation.sharePasscode}
              </span>
            </div>
          )}

          {/* Embed Code */}
          <div className="editor-form-group">
            <label className="editor-label">Embed Interactive Menu in Website</label>
            <div className="share-url-box">
              <input
                type="text"
                readOnly
                value={embedCode}
                className="share-url-input"
                style={{ color: '#94a3b8' }}
              />
              <button onClick={handleCopyEmbed} className="copy-pill-btn">
                {copiedEmbed ? <Check size={14} /> : <Code2 size={14} />}
                <span>{copiedEmbed ? 'Copied' : 'Embed'}</span>
              </button>
            </div>
          </div>

          {/* Offline Master Download */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                Offline Presentation Export
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {presentation.downloadSize || '14.2 GB 4K Master Archive'}
              </div>
            </div>

            <button
              onClick={handleSimulateDownload}
              disabled={downloading}
              className="copy-pill-btn"
              style={{
                background: downloadComplete ? '#22c55e' : undefined,
                color: downloadComplete ? '#ffffff' : undefined
              }}
            >
              {downloadComplete ? <Check size={15} /> : <Download size={15} />}
              <span>{downloading ? 'Preparing...' : downloadComplete ? 'Downloaded' : 'Export Package'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
