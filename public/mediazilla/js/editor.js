import { getIcon } from './icons.js';
import { THEME_PRESETS, LAYOUT_PRESETS } from './data.js';
import { getSvpEmbedUrl } from './svpIntegration.js';

export function renderEditorDrawer(container, presentation, onUpdate, onClose, onTestPlay = null) {
  let activeTab = 'svp'; // 'svp', 'backdrop', 'style', 'general'
  let activeEditorDayId = (presentation.days && presentation.days.length > 0) ? presentation.days[presentation.days.length - 1].id : 'day-5';

  const render = () => {
    // Find current day sessions
    const currentDay = (presentation.days || []).find(d => d.id === activeEditorDayId) || presentation.days?.[0] || {
      name: 'Day Five',
      sessions: presentation.videos || []
    };

    container.innerHTML = `
      <div class="modal-backdrop" id="editor-backdrop" style="justify-content: flex-end; padding: 0; align-items: stretch;">
        <div class="editor-sidebar-container" id="editor-drawer-box" onclick="event.stopPropagation()">
          <!-- Header -->
          <div class="editor-header-bar">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="editor-badge-pill">MediaZilla Studio</span>
              <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff;">Presentation Settings</h3>
            </div>
            <button id="btn-close-editor" class="icon-btn-small" title="Close">
              ${getIcon('x', 20)}
            </button>
          </div>

          <!-- Tab Strip -->
          <div class="editor-tabs-strip">
            <button class="editor-tab-btn ${activeTab === 'svp' ? 'active' : ''}" data-tab="svp">
              ${getIcon('video', 16)}
              <span>SVP Videos</span>
            </button>
            <button class="editor-tab-btn ${activeTab === 'backdrop' ? 'active' : ''}" data-tab="backdrop">
              ${getIcon('camera', 16)}
              <span>Backdrop</span>
            </button>
            <button class="editor-tab-btn ${activeTab === 'style' ? 'active' : ''}" data-tab="style">
              ${getIcon('palette', 16)}
              <span>Style</span>
            </button>
            <button class="editor-tab-btn ${activeTab === 'general' ? 'active' : ''}" data-tab="general">
              ${getIcon('settings', 16)}
              <span>Branding</span>
            </button>
          </div>

          <!-- Body -->
          <div class="editor-scroll-body">
            <!-- TAB 1: STREAMING VIDEO PROVIDER (SVP) API INTEGRATION -->
            ${activeTab === 'svp' ? `
              <div class="editor-section-card" style="border-color: rgba(251, 191, 36, 0.4); background: rgba(251, 191, 36, 0.08);">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                  <span class="editor-section-title" style="color: #fcd34d;">
                    ${getIcon('video', 16)}
                    Connect Video from StreamingVideoProvider
                  </span>
                </div>
                <p style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.45;">
                  Paste the <strong>Embed Code</strong> or <strong>Player URL</strong> from your <strong>streamingvideoprovider.co.uk</strong> dashboard for each session button.
                </p>
              </div>

              <!-- Day Selector Dropdown -->
              <div class="editor-section-card">
                <span class="editor-section-title">Select Day / Track</span>
                <select id="select-editor-day" class="editor-select" style="font-weight: 600;">
                  ${(presentation.days || []).map(day => `
                    <option value="${day.id}" ${day.id === activeEditorDayId ? 'selected' : ''}>
                      ${day.name} (${day.sessions.length} Sessions)
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Session Cards SVP Mapping -->
              <div class="editor-section-card">
                <span class="editor-section-title">${currentDay.name} Video Links</span>
                <p style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.5rem;">
                  Paste your video's <strong>Embed Code</strong> or <strong>Share URL</strong> below:
                </p>

                <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                  ${currentDay.sessions.map((session) => {
                    const currentVal = session.svpClipId || (session.videoUrl && session.videoUrl.includes('streamingvideoprovider') ? session.videoUrl : '');
                    const isApiCodeWarning = currentVal.toLowerCase().startsWith('apc-');
                    const hasValidSvp = Boolean(currentVal && !isApiCodeWarning);

                    return `
                      <div style="background: rgba(0,0,0,0.5); padding: 0.85rem; border-radius: 8px; border: 1px solid ${isApiCodeWarning ? '#ef4444' : hasValidSvp ? 'rgba(251, 191, 36, 0.4)' : 'rgba(255,255,255,0.1)'};">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                          <span style="font-size: 0.85rem; font-weight: 700; color: #ffffff;">
                            ${session.title}
                          </span>
                          <span style="font-size: 0.72rem; color: var(--mz-accent); font-family: var(--mz-font-mono); font-weight: 600;">
                            ${session.durationFormatted}
                          </span>
                        </div>

                        <div class="editor-form-group">
                          <input
                            type="text"
                            placeholder="Paste SVP Embed Code (<iframe...>) or Player Link"
                            value="${currentVal}"
                            data-session-id="${session.id}"
                            class="editor-input svp-session-input"
                            style="font-family: var(--mz-font-mono); font-size: 0.8rem;"
                          />
                        </div>

                        ${isApiCodeWarning ? `
                          <div style="margin-top: 0.4rem; padding: 0.4rem 0.6rem; border-radius: 4px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; font-size: 0.72rem; line-height: 1.35;">
                            ⚠️ <strong>Note:</strong> <code>apc-...</code> is your Account API Code, not a video clip. Please copy the <strong>Embed Code</strong> or <strong>Share Link</strong> from your video in the SVP Media Panel.
                          </div>
                        ` : ''}

                        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem;">
                          <span style="font-size: 0.7rem; color: ${hasValidSvp ? '#4ade80' : '#94a3b8'};">
                            ${hasValidSvp ? '● SVP Video Ready' : isApiCodeWarning ? '⚠️ Needs Video Embed Link' : '○ Using Demo Video'}
                          </span>
                          ${currentVal && !isApiCodeWarning ? `
                            <button type="button" class="btn-test-session-svp" data-session-id="${session.id}" style="padding: 0.25rem 0.6rem; border-radius: 4px; background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; color: #fde68a; font-size: 0.72rem; font-weight: 600;">
                              ▶ Test Play
                            </button>
                          ` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Quick Guide Box -->
              <div class="editor-section-card" style="background: rgba(0,0,0,0.35); font-size: 0.75rem; color: #cbd5e1; border: 1px solid rgba(255,255,255,0.12);">
                <div style="font-weight: 700; color: #fbbf24; margin-bottom: 0.4rem; font-size: 0.8rem;">
                  📌 How to get your video's Embed Link:
                </div>
                <ol style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem; color: #94a3b8;">
                  <li>Log in to your <strong>StreamingVideoProvider</strong> account.</li>
                  <li>Go to <strong>Media Panel</strong> (or your Video List).</li>
                  <li>Click on your video and click <strong>"Embed"</strong> or <strong>"Publish"</strong>.</li>
                  <li>Copy the <strong>Embed Code</strong> (the <code>&lt;iframe...&gt;</code> code) or the <strong>Player URL</strong>.</li>
                  <li>Paste it into the box above!</li>
                </ol>
              </div>
            ` : ''}

            <!-- TAB 2: BACKDROP & UPLOADS -->
            ${activeTab === 'backdrop' ? `
              <div class="editor-section-card">
                <span class="editor-section-title">
                  ${getIcon('camera', 15)}
                  Upload Custom Background
                </span>

                <div class="upload-dropzone-box" id="editor-dropzone" style="padding: 1.25rem 1rem;">
                  <input type="file" id="editor-file-input" accept="image/*,video/mp4,video/webm" style="display: none;" />
                  <div class="dropzone-icon-circle" style="width: 42px; height: 42px; margin-bottom: 0.5rem;">
                    ${getIcon('camera', 20)}
                  </div>
                  <div style="font-size: 0.85rem; font-weight: 600; color: #ffffff;">
                    Click to Upload Image from Computer
                  </div>
                  <button type="button" id="btn-editor-browse" class="copy-pill-btn" style="margin-top: 0.6rem; padding: 0.4rem 0.9rem; font-size: 0.75rem;">
                    Choose File
                  </button>
                </div>
              </div>

              <div class="editor-section-card">
                <span class="editor-section-title">Backdrop Tint & Atmosphere</span>
                <div class="editor-form-group">
                  <label class="editor-label">Cover Artwork URL / Data</label>
                  <input id="input-cover" type="text" value="${presentation.coverImage.startsWith('data:') ? 'Uploaded Image (Active)' : presentation.coverImage}" class="editor-input" />
                </div>
                <div class="editor-form-group">
                  <label class="editor-label">Overlay Darkness (${Math.round((presentation.backgroundDarkness !== undefined ? presentation.backgroundDarkness : 0.25) * 100)}%)</label>
                  <input id="input-darkness" type="range" min="0" max="0.85" step="0.05" value="${presentation.backgroundDarkness !== undefined ? presentation.backgroundDarkness : 0.25}" style="accent-color: var(--mz-accent);" />
                </div>
                <div class="editor-form-group">
                  <label class="editor-label">Backdrop Blur (${presentation.backgroundBlur || 0}px)</label>
                  <input id="input-blur" type="range" min="0" max="20" step="1" value="${presentation.backgroundBlur || 0}" style="accent-color: var(--mz-accent);" />
                </div>
              </div>
            ` : ''}

            <!-- TAB 3: STYLE & LAYOUT -->
            ${activeTab === 'style' ? `
              <div class="editor-section-card">
                <span class="editor-section-title">
                  ${getIcon('palette', 15)}
                  Theme Presets & Color Tone
                </span>
                <div class="preset-grid">
                  ${THEME_PRESETS.map(preset => {
                    const isActive = presentation.themePreset === preset.id;
                    return `
                      <div class="preset-card-option ${isActive ? 'active' : ''}" data-theme-id="${preset.id}">
                        <div class="preset-swatch" style="background: linear-gradient(135deg, ${preset.accentColor} 0%, #111420 100%);"></div>
                        <span class="preset-name">${preset.name}</span>
                        <span class="preset-cat">${preset.category}</span>
                        ${isActive ? `<span style="position: absolute; top: 8px; right: 8px; color: ${preset.accentColor};">${getIcon('check', 14)}</span>` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <div class="editor-section-card">
                <span class="editor-section-title">
                  ${getIcon('layout', 15)}
                  Menu Layout Style
                </span>
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                  ${LAYOUT_PRESETS.map(layout => {
                    const isActive = presentation.layoutPreset === layout.id;
                    return `
                      <div class="manage-list-item ${isActive ? 'active' : ''}" data-layout-id="${layout.id}" style="cursor: pointer; ${isActive ? 'border-color: var(--mz-accent); background: rgba(212, 175, 55, 0.1);' : ''}">
                        <div class="manage-item-info">
                          <span style="color: ${isActive ? 'var(--mz-accent)' : '#94a3b8'};">${getIcon('layout', 18)}</span>
                          <div>
                            <div style="font-size: 0.85rem; font-weight: 600; color: #ffffff;">${layout.name}</div>
                            <div style="font-size: 0.72rem; color: #94a3b8;">${layout.description}</div>
                          </div>
                        </div>
                        ${isActive ? `<span style="color: var(--mz-accent);">${getIcon('check', 16)}</span>` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            <!-- TAB 4: GENERAL BRANDING -->
            ${activeTab === 'general' ? `
              <div class="editor-section-card">
                <span class="editor-section-title">Presentation Info</span>
                <div class="editor-form-group">
                  <label class="editor-label">Main Title</label>
                  <input id="input-title" type="text" value="${presentation.title}" class="editor-input" />
                </div>
                <div class="editor-form-group">
                  <label class="editor-label">Pill Badge Text</label>
                  <input id="input-badge" type="text" value="${presentation.badgeText || '5-DAY SUMMIT'}" class="editor-input" />
                </div>
                <div class="editor-form-group">
                  <label class="editor-label">Filmmaker / Studio Name</label>
                  <input id="input-filmmaker" type="text" value="${presentation.filmmaker}" class="editor-input" />
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Bind Close & Backdrop
    container.querySelector('#btn-close-editor')?.addEventListener('click', onClose);
    container.querySelector('#editor-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'editor-backdrop') onClose();
    });

    // Bind Tab switching
    container.querySelectorAll('.editor-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render();
      });
    });

    // Bind Day Selector in SVP Tab
    const daySelect = container.querySelector('#select-editor-day');
    daySelect?.addEventListener('change', (e) => {
      activeEditorDayId = e.target.value;
      render();
    });

    // SVP inputs for sessions
    container.querySelectorAll('.svp-session-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const sessionId = input.getAttribute('data-session-id');
        const rawVal = e.target.value.trim();

        // Update in currentDay.sessions
        const targetSession = currentDay.sessions.find(s => s.id === sessionId);
        if (targetSession) {
          targetSession.svpClipId = rawVal;
          if (rawVal) {
            targetSession.svpEmbedUrl = getSvpEmbedUrl(rawVal, { autoplay: true });
          } else {
            targetSession.svpEmbedUrl = '';
          }

          // Save custom sessions to localStorage
          try {
            localStorage.setItem('mediazilla_summit_data', JSON.stringify(presentation.days));
          } catch {}

          onUpdate(presentation);
        }
      });

      input.addEventListener('change', () => {
        render();
      });
    });

    // Test Play button
    container.querySelectorAll('.btn-test-session-svp').forEach(btn => {
      btn.addEventListener('click', () => {
        const sessionId = btn.getAttribute('data-session-id');
        const session = currentDay.sessions.find(s => s.id === sessionId);
        if (session && onTestPlay) {
          onClose();
          onTestPlay(session);
        }
      });
    });

    // File Upload in Editor
    const editorFileInput = container.querySelector('#editor-file-input');
    const editorBrowseBtn = container.querySelector('#btn-editor-browse');
    const editorDropzone = container.querySelector('#editor-dropzone');

    editorBrowseBtn?.addEventListener('click', () => editorFileInput?.click());
    editorDropzone?.addEventListener('click', (e) => {
      if (e.target !== editorBrowseBtn) editorFileInput?.click();
    });

    const handleEditorFile = (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        presentation.coverImage = url;
        try {
          localStorage.setItem('mediazilla_custom_bg', url);
        } catch {}
        onUpdate(presentation);
        render();
      };
      reader.readAsDataURL(file);
    };

    editorFileInput?.addEventListener('change', (e) => {
      handleEditorFile(e.target.files?.[0]);
    });

    // Sliders
    const darknessInput = container.querySelector('#input-darkness');
    const blurInput = container.querySelector('#input-blur');
    darknessInput?.addEventListener('input', (e) => {
      presentation.backgroundDarkness = parseFloat(e.target.value);
      onUpdate(presentation);
    });
    blurInput?.addEventListener('input', (e) => {
      presentation.backgroundBlur = parseInt(e.target.value, 10);
      onUpdate(presentation);
    });

    // Theme & Layout
    container.querySelectorAll('[data-theme-id]').forEach(el => {
      el.addEventListener('click', () => {
        presentation.themePreset = el.getAttribute('data-theme-id');
        onUpdate(presentation);
        render();
      });
    });

    container.querySelectorAll('[data-layout-id]').forEach(el => {
      el.addEventListener('click', () => {
        presentation.layoutPreset = el.getAttribute('data-layout-id');
        onUpdate(presentation);
        render();
      });
    });

    // Text inputs
    const titleInput = container.querySelector('#input-title');
    const badgeInput = container.querySelector('#input-badge');
    const filmmakerInput = container.querySelector('#input-filmmaker');

    titleInput?.addEventListener('input', (e) => {
      presentation.title = e.target.value;
      onUpdate(presentation);
    });
    badgeInput?.addEventListener('input', (e) => {
      presentation.badgeText = e.target.value;
      onUpdate(presentation);
    });
    filmmakerInput?.addEventListener('input', (e) => {
      presentation.filmmaker = e.target.value;
      onUpdate(presentation);
    });
  };

  render();
}
