import { getIcon } from './icons.js';

export function renderInteractiveMenu(container, presentation, onAction, state = {}) {
  const layout = presentation.layoutPreset || 'multi-day-tabs';
  const activeDayId = state.activeDayId || (presentation.days ? presentation.days[presentation.days.length - 1]?.id : 'day-5') || 'day-5';

  // Find active day
  const currentDay = (presentation.days || []).find(d => d.id === activeDayId) || presentation.days?.[presentation.days.length - 1] || {
    name: 'Day Five',
    subtitle: 'Day Five: Integration & Daily Mastery',
    sessions: presentation.videos || []
  };

  if (layout === 'multi-day-tabs' && presentation.days) {
    container.innerHTML = `
      <div class="presentation-viewport">
        <!-- Top Action Bar (Back to Showcase, Change Background, Settings) -->
        <div class="presentation-top-bar">
          <button id="btn-back-showcase" class="top-pill-btn">
            ${getIcon('arrowLeft', 16)}
            <span>Back to Showcase</span>
          </button>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button id="btn-change-bg" class="top-pill-btn">
              ${getIcon('camera', 16)}
              <span>Change Background</span>
            </button>

            <button id="btn-open-settings" class="top-circle-btn" title="Presentation Settings">
              ${getIcon('settings', 18)}
            </button>
          </div>
        </div>

        <!-- Center Stage -->
        <div class="summit-stage-container">
          <!-- Main Title & Badge Row -->
          <div class="summit-hero-block">
            <h1 class="summit-brand-title">${presentation.title}</h1>
            <div class="summit-subtitle-row">
              <span class="summit-gold-pill">${presentation.badgeText || '5-DAY SUMMIT'}</span>
              <span class="summit-theme-text">${currentDay.subtitle}</span>
            </div>
          </div>

          <!-- Day Tabs Navigation Capsule -->
          <div class="summit-day-capsule-bar">
            ${presentation.days.map(day => {
              const isActive = day.id === activeDayId;
              return `
                <button class="day-tab-pill ${isActive ? 'active' : ''}" data-day-id="${day.id}">
                  <span>${day.name}</span>
                  <span class="day-tab-badge">${day.badgeCount || day.sessions.length}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Wide Session Cards Stack -->
          <div class="summit-sessions-stack">
            ${currentDay.sessions.map(session => `
              <div class="summit-session-card" data-session-id="${session.id}">
                <div class="session-card-left">
                  <div class="session-play-btn" title="Play ${session.title}">
                    ${getIcon('play', 13)}
                  </div>
                  <h3 class="session-card-title">${session.title}</h3>
                </div>
                <span class="session-time-pill">${session.durationFormatted}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind Day Switchers
    container.querySelectorAll('.day-tab-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const dayId = pill.getAttribute('data-day-id');
        onAction({ type: 'switch-day', dayId });
      });
    });

    // Bind Session Clicks -> Play Video
    container.querySelectorAll('.summit-session-card').forEach(card => {
      card.addEventListener('click', () => {
        const sessionId = card.getAttribute('data-session-id');
        const session = currentDay.sessions.find(s => s.id === sessionId);
        if (session) {
          onAction({ type: 'video', video: session });
        }
      });
    });

    // Top action buttons
    container.querySelector('#btn-back-showcase')?.addEventListener('click', () => {
      onAction({ type: 'back-showcase' });
    });

    container.querySelector('#btn-change-bg')?.addEventListener('click', () => {
      onAction({ type: 'change-bg' });
    });

    container.querySelector('#btn-open-settings')?.addEventListener('click', () => {
      onAction({ type: 'open-settings' });
    });

    return;
  }

  // Classic bottom-bar layout for wedding demo
  const buttons = presentation.menuButtons || [];
  container.innerHTML = `
    <div class="presentation-viewport">
      <div class="presentation-center-content">
        <div class="hero-centerpiece">
          <h2 class="hero-main-title">${presentation.title}</h2>
          <p class="hero-subtitle">${presentation.subtitle}</p>
          <div class="hero-divider"></div>
        </div>
      </div>

      <nav class="menu-bottom-dock" aria-label="Media Menu">
        <div class="bottom-buttons-track">
          ${buttons.map(btn => {
            const isPlayAll = btn.type === 'play-all';
            return `
              <button class="menu-action-card ${isPlayAll ? 'play-all-primary' : ''}" data-btn-id="${btn.id}">
                <div class="card-icon-bubble">${getIcon(btn.icon, 18)}</div>
                <div class="card-content-stack">
                  <span class="card-title">${btn.title}</span>
                  ${btn.badge ? `<span class="card-badge">${btn.badge}</span>` : ''}
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </nav>
    </div>
  `;

  container.querySelectorAll('[data-btn-id]').forEach(el => {
    el.addEventListener('click', () => {
      const btnId = el.getAttribute('data-btn-id');
      const btn = buttons.find(b => b.id === btnId);
      if (btn) onAction(btn);
    });
  });
}

export function renderSceneSelection(container, presentation, submenuTitle, onBack, onSelectChapter) {
  const highlightVideo = presentation.videos[0] || {};
  const chapters = highlightVideo.chapters || [];

  container.innerHTML = `
    <div class="presentation-viewport">
      <div class="presentation-center-content" style="justify-content: flex-start; padding-top: 2rem;">
        <div class="submenu-nav-header">
          <button id="btn-submenu-back" class="back-to-main-btn">
            ${getIcon('arrowLeft', 16)}
            <span>Main Menu</span>
          </button>
          <div style="font-family: var(--mz-font-title); font-size: 1.25rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mz-text); display: flex; align-items: center; gap: 0.5rem;">
            ${getIcon('sparkles', 18)}
            <span>${submenuTitle}</span>
          </div>
          <div style="width: 100px;"></div>
        </div>

        <div class="scenes-grid-container">
          ${chapters.map((chap, idx) => `
            <div class="chapter-tile-card" data-chapter-time="${chap.time}">
              <div class="chapter-poster-box">
                <img src="${chap.thumbnail || highlightVideo.thumbnail}" alt="${chap.title}" class="chapter-poster-img" />
                <div class="chapter-play-hover-overlay">
                  <div class="chapter-hover-play-icon">${getIcon('play', 20)}</div>
                </div>
                <span class="chapter-time-stamp">${chap.timeFormatted}</span>
              </div>
              <div class="chapter-details-box">
                <span class="card-badge" style="align-self: flex-start;">Scene ${idx + 1}</span>
                <h4 class="chapter-card-title">${chap.title}</h4>
                <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: var(--mz-text-muted); margin-top: 0.2rem;">
                  <span>Starts at ${chap.timeFormatted}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-submenu-back')?.addEventListener('click', onBack);

  container.querySelectorAll('[data-chapter-time]').forEach(el => {
    el.addEventListener('click', () => {
      const timeSecs = parseFloat(el.getAttribute('data-chapter-time')) || 0;
      onSelectChapter(highlightVideo, timeSecs);
    });
  });
}
