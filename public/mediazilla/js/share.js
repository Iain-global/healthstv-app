import { getIcon } from './icons.js';

export function renderShareModal(container, presentation, onClose) {
  const shareUrl = `${window.location.origin}${window.location.pathname}?id=${presentation.id}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;

  container.innerHTML = `
    <div class="modal-backdrop" id="share-modal-backdrop">
      <div class="modal-dialog-box" id="share-modal-dialog">
        <!-- Header -->
        <div class="modal-header-row">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            ${getIcon('shieldCheck', 20)}
            <h3 class="modal-title-text">Client Delivery & Sharing</h3>
          </div>
          <button id="btn-close-share" class="icon-btn-small">
            ${getIcon('x', 20)}
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-content">
          <!-- Direct URL -->
          <div class="editor-form-group">
            <label class="editor-label">Direct Client Viewing URL</label>
            <div class="share-url-box">
              <input id="input-share-url" type="text" readonly value="${shareUrl}" class="share-url-input" />
              <button id="btn-copy-share-url" class="copy-pill-btn">
                ${getIcon('copy', 14)}
                <span>Copy</span>
              </button>
            </div>
          </div>

          <!-- Passcode Badge -->
          ${presentation.sharePasscode ? `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: 8px; background: rgba(212, 175, 55, 0.1); border: 1px solid var(--mz-card-border);">
              <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: #ffffff;">
                ${getIcon('lock', 15)}
                <span>Protected by Passcode PIN:</span>
              </div>
              <span style="font-family: var(--mz-font-mono); font-weight: 700; color: var(--mz-accent);">${presentation.sharePasscode}</span>
            </div>
          ` : ''}

          <!-- Embed -->
          <div class="editor-form-group">
            <label class="editor-label">Embed Interactive Menu in Website / Blog</label>
            <div class="share-url-box">
              <input id="input-embed-code" type="text" readonly value="${embedCode.replace(/"/g, '&quot;')}" class="share-url-input" style="color: #94a3b8;" />
              <button id="btn-copy-embed" class="copy-pill-btn">
                ${getIcon('code', 14)}
                <span>Embed</span>
              </button>
            </div>
          </div>

          <!-- Master Package Export -->
          <div style="padding: 1rem; border-radius: 10px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 0.85rem; font-weight: 600; color: #ffffff;">Offline Presentation Master Export</div>
              <div style="font-size: 0.72rem; color: #94a3b8;">${presentation.downloadSize || '14.2 GB 4K Master Archive'}</div>
            </div>
            <button id="btn-export-pkg" class="copy-pill-btn">
              ${getIcon('download', 15)}
              <span id="export-btn-text">Export Package</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Close handlers
  container.querySelector('#btn-close-share')?.addEventListener('click', onClose);
  container.querySelector('#share-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'share-modal-backdrop') onClose();
  });

  // Copy Link
  container.querySelector('#btn-copy-share-url')?.addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    const btn = container.querySelector('#btn-copy-share-url');
    btn.innerHTML = `${getIcon('check', 14)} <span>Copied!</span>`;
    setTimeout(() => {
      btn.innerHTML = `${getIcon('copy', 14)} <span>Copy</span>`;
    }, 2000);
  });

  // Copy Embed
  container.querySelector('#btn-copy-embed')?.addEventListener('click', () => {
    navigator.clipboard.writeText(embedCode).catch(() => {});
    const btn = container.querySelector('#btn-copy-embed');
    btn.innerHTML = `${getIcon('check', 14)} <span>Copied!</span>`;
    setTimeout(() => {
      btn.innerHTML = `${getIcon('code', 14)} <span>Embed</span>`;
    }, 2000);
  });

  // Simulate Export
  const exportBtn = container.querySelector('#btn-export-pkg');
  const exportText = container.querySelector('#export-btn-text');
  exportBtn?.addEventListener('click', () => {
    exportText.textContent = 'Preparing...';
    setTimeout(() => {
      exportBtn.style.background = '#22c55e';
      exportBtn.style.color = '#ffffff';
      exportBtn.innerHTML = `${getIcon('check', 15)} <span>Downloaded!</span>`;
      setTimeout(() => {
        exportBtn.style.background = '';
        exportBtn.style.color = '';
        exportBtn.innerHTML = `${getIcon('download', 15)} <span id="export-btn-text">Export Package</span>`;
      }, 3000);
    }, 1200);
  });
}
