import { getIcon } from './icons.js';
import { BACKGROUND_PRESETS } from './data.js';

export function renderBackgroundModal(container, presentation, onUpdateBackground, onClose) {
  let currentCover = presentation.coverImage || '';
  let currentDarkness = presentation.backgroundDarkness !== undefined ? presentation.backgroundDarkness : 0.25;
  let currentBlur = presentation.backgroundBlur || 0;

  const render = () => {
    container.innerHTML = `
      <div class="modal-backdrop" id="bg-modal-backdrop">
        <div class="modal-dialog-box" style="max-width: 620px;">
          <!-- Modal Header -->
          <div class="modal-header-row">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              ${getIcon('camera', 20)}
              <h3 class="modal-title-text">Change Menu Background</h3>
            </div>
            <button id="btn-close-bg-modal" class="icon-btn-small" title="Close">
              ${getIcon('x', 20)}
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body-content" style="max-height: 75vh; overflow-y: auto;">
            <!-- 1. Drag & Drop Local File Upload -->
            <div class="editor-form-group">
              <label class="editor-label" style="font-weight: 700; color: #ffffff; display: flex; align-items: center; justify-content: space-between;">
                <span>Upload From Your Computer</span>
                <span style="font-size: 0.72rem; color: #94a3b8;">PNG, JPG, WEBP, MP4</span>
              </label>

              <div class="upload-dropzone-box" id="dropzone-area">
                <input type="file" id="file-bg-input" accept="image/*,video/mp4,video/webm" style="display: none;" />
                <div class="dropzone-icon-circle">
                  ${getIcon('camera', 24)}
                </div>
                <div style="font-size: 0.95rem; font-weight: 600; color: #ffffff; margin-bottom: 0.25rem;">
                  Click to Browse or Drag & Drop Image
                </div>
                <div style="font-size: 0.78rem; color: #94a3b8;">
                  Upload your own high-resolution estate, wedding, or event background
                </div>
                <button type="button" id="btn-browse-file" class="copy-pill-btn" style="margin-top: 0.85rem; padding: 0.5rem 1.2rem; font-size: 0.82rem;">
                  Choose Image File
                </button>
              </div>
            </div>

            <!-- 2. Current Background Preview & Adjustments -->
            <div class="editor-form-group" style="margin-top: 0.5rem;">
              <label class="editor-label" style="font-weight: 700; color: #ffffff;">Current Backdrop Preview & Tint Controls</label>
              
              <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.15); background: #000000; margin-bottom: 1rem;">
                <img id="modal-preview-img" src="${currentCover}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; filter: blur(${currentBlur}px);" />
                <div id="modal-preview-tint" style="position: absolute; inset: 0; background: rgba(0, 0, 0, ${currentDarkness}); pointer-events: none;"></div>
                
                <div style="position: absolute; bottom: 8px; right: 8px; display: flex; gap: 0.5rem;">
                  <button id="btn-reset-default-bg" style="padding: 0.3rem 0.6rem; border-radius: 4px; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.2); font-size: 0.72rem; color: #ffffff; font-weight: 600;">
                    Reset Default
                  </button>
                </div>
              </div>

              <!-- Sliders -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: rgba(255, 255, 255, 0.03); padding: 0.85rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08);">
                <div class="editor-form-group">
                  <label class="editor-label" style="display: flex; justify-content: space-between;">
                    <span>Overlay Darkness</span>
                    <span id="label-darkness-val" style="color: var(--mz-accent); font-weight: 700;">${Math.round(currentDarkness * 100)}%</span>
                  </label>
                  <input id="slider-modal-darkness" type="range" min="0" max="0.85" step="0.05" value="${currentDarkness}" style="accent-color: var(--mz-accent);" />
                </div>

                <div class="editor-form-group">
                  <label class="editor-label" style="display: flex; justify-content: space-between;">
                    <span>Backdrop Blur</span>
                    <span id="label-blur-val" style="color: var(--mz-accent); font-weight: 700;">${currentBlur}px</span>
                  </label>
                  <input id="slider-modal-blur" type="range" min="0" max="20" step="1" value="${currentBlur}" style="accent-color: var(--mz-accent);" />
                </div>
              </div>
            </div>

            <!-- 3. Curated Presets Grid -->
            <div class="editor-form-group" style="margin-top: 0.5rem;">
              <label class="editor-label" style="font-weight: 700; color: #ffffff;">Or Pick a Curated Preset</label>
              <div class="bg-preset-grid">
                ${BACKGROUND_PRESETS.map(preset => {
                  const isActive = currentCover === preset.url;
                  return `
                    <div class="bg-preset-tile ${isActive ? 'active' : ''}" data-bg-url="${preset.url}">
                      <img src="${preset.url}" alt="${preset.name}" class="bg-preset-img" />
                      <span class="bg-preset-label">${preset.name}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- 4. Web Image URL Input -->
            <div class="editor-form-group" style="margin-top: 0.5rem;">
              <label class="editor-label">Or Paste Image / Video URL</label>
              <div style="display: flex; gap: 0.5rem;">
                <input id="input-custom-bg-url" type="text" placeholder="https://..." value="${currentCover.startsWith('data:') ? '' : currentCover}" class="editor-input" />
                <button id="btn-apply-url" class="copy-pill-btn" style="white-space: nowrap;">Apply URL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Close
    container.querySelector('#btn-close-bg-modal')?.addEventListener('click', onClose);
    container.querySelector('#bg-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'bg-modal-backdrop') onClose();
    });

    // File Upload handling
    const fileInput = container.querySelector('#file-bg-input');
    const browseBtn = container.querySelector('#btn-browse-file');
    const dropzone = container.querySelector('#dropzone-area');

    browseBtn?.addEventListener('click', () => fileInput?.click());
    dropzone?.addEventListener('click', (e) => {
      if (e.target !== browseBtn) fileInput?.click();
    });

    const handleFile = (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target.result;
        currentCover = resultUrl;
        presentation.coverImage = resultUrl;

        // Save to localStorage for persistence
        try {
          localStorage.setItem('mediazilla_custom_bg', resultUrl);
        } catch {
          // Ignore if quota exceeded
        }

        onUpdateBackground({
          coverImage: currentCover,
          backgroundDarkness: currentDarkness,
          backgroundBlur: currentBlur
        });
        render();
      };
      reader.readAsDataURL(file);
    };

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      handleFile(file);
    });

    // Drag & Drop
    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      const file = e.dataTransfer.files?.[0];
      handleFile(file);
    });

    // Sliders
    const darknessSlider = container.querySelector('#slider-modal-darkness');
    const blurSlider = container.querySelector('#slider-modal-blur');
    const darknessLabel = container.querySelector('#label-darkness-val');
    const blurLabel = container.querySelector('#label-blur-val');
    const previewTint = container.querySelector('#modal-preview-tint');
    const previewImg = container.querySelector('#modal-preview-img');

    darknessSlider?.addEventListener('input', (e) => {
      currentDarkness = parseFloat(e.target.value);
      if (darknessLabel) darknessLabel.textContent = `${Math.round(currentDarkness * 100)}%`;
      if (previewTint) previewTint.style.background = `rgba(0, 0, 0, ${currentDarkness})`;
      presentation.backgroundDarkness = currentDarkness;
      onUpdateBackground({
        coverImage: currentCover,
        backgroundDarkness: currentDarkness,
        backgroundBlur: currentBlur
      });
    });

    blurSlider?.addEventListener('input', (e) => {
      currentBlur = parseInt(e.target.value, 10);
      if (blurLabel) blurLabel.textContent = `${currentBlur}px`;
      if (previewImg) previewImg.style.filter = `blur(${currentBlur}px)`;
      presentation.backgroundBlur = currentBlur;
      onUpdateBackground({
        coverImage: currentCover,
        backgroundDarkness: currentDarkness,
        backgroundBlur: currentBlur
      });
    });

    // Reset default
    container.querySelector('#btn-reset-default-bg')?.addEventListener('click', () => {
      const defaultUrl = BACKGROUND_PRESETS[0].url;
      currentCover = defaultUrl;
      presentation.coverImage = defaultUrl;
      localStorage.removeItem('mediazilla_custom_bg');
      onUpdateBackground({
        coverImage: currentCover,
        backgroundDarkness: currentDarkness,
        backgroundBlur: currentBlur
      });
      render();
    });

    // Presets
    container.querySelectorAll('[data-bg-url]').forEach(tile => {
      tile.addEventListener('click', () => {
        const url = tile.getAttribute('data-bg-url');
        currentCover = url;
        presentation.coverImage = url;
        localStorage.setItem('mediazilla_custom_bg', url);
        onUpdateBackground({
          coverImage: currentCover,
          backgroundDarkness: currentDarkness,
          backgroundBlur: currentBlur
        });
        render();
      });
    });

    // URL input
    container.querySelector('#btn-apply-url')?.addEventListener('click', () => {
      const url = container.querySelector('#input-custom-bg-url')?.value;
      if (url) {
        currentCover = url;
        presentation.coverImage = url;
        localStorage.setItem('mediazilla_custom_bg', url);
        onUpdateBackground({
          coverImage: currentCover,
          backgroundDarkness: currentDarkness,
          backgroundBlur: currentBlur
        });
        render();
      }
    });
  };

  render();
}
