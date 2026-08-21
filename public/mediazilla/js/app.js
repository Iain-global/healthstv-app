import { DEFAULT_PRESENTATIONS, THEME_PRESETS } from './data.js';
import { getIcon } from './icons.js';
import { renderInteractiveMenu, renderSceneSelection } from './menu.js';
import { renderVideoPlayer } from './player.js';
import { renderEditorDrawer } from './editor.js';
import { renderShareModal } from './share.js';
import { renderBackgroundModal } from './bgModal.js';
import { startAmbientMenuMusic, stopAmbientMenuMusic } from './ambientAudio.js';

// Application State
let presentations = JSON.parse(JSON.stringify(DEFAULT_PRESENTATIONS));
let currentPresId = presentations[0].id;
let activeDayId = 'day-5'; // Default to Day Five matching user screenshot
let viewState = 'menu'; // 'menu' | 'submenu' | 'player'
let activeSubmenuTitle = 'Scene Selection';
let activeVideo = null;
let initialPlayerTime = 0;
let isPlayAll = false;
let isEditorOpen = false;
let isShareOpen = false;
let isBgModalOpen = false;
let isAmbientMuted = false;

// Clear any stale legacy localStorage override that was saved during previous edits
try {
  localStorage.removeItem('mediazilla_summit_data');
} catch {}

// Check URL parameters first for organiser / presentation
try {
  const urlParams = new URLSearchParams(window.location.search);
  const orgParam = urlParams.get('organiser') || urlParams.get('pres') || urlParams.get('slug');
  if (orgParam) {
    const matchedPres = presentations.find(p => 
      p.id === orgParam || 
      p.id.includes(orgParam) || 
      p.title.toLowerCase().includes(orgParam.toLowerCase().replace(/-/g, ' '))
    );
    if (matchedPres) {
      currentPresId = matchedPres.id;
      if (matchedPres.days && matchedPres.days.length > 0) {
        activeDayId = matchedPres.days[0].id;
      }
    }
  }
} catch {
  // Ignore
}

// DOM Containers
const appRoot = document.getElementById('app-root');
let bgContainer = null;
let mainContainer = null;
let modalContainer = null;

function getCurrentPresentation() {
  return presentations.find(p => p.id === currentPresId) || presentations[0];
}

function applyTheme(presetId) {
  const theme = THEME_PRESETS.find(t => t.id === presetId) || THEME_PRESETS[0];
  const root = document.documentElement;

  root.style.setProperty('--mz-accent', theme.accentColor);
  root.style.setProperty('--mz-accent-hover', theme.accentHover);
  root.style.setProperty('--mz-accent-glow', theme.glowColor);
  root.style.setProperty('--mz-bg-overlay', theme.bgOverlay);
  root.style.setProperty('--mz-card-bg', theme.cardBg);
  root.style.setProperty('--mz-card-border', theme.cardBorder);
  root.style.setProperty('--mz-card-hover-border', theme.cardHoverBorder);
  root.style.setProperty('--mz-badge-bg', theme.badgeBg);
  root.style.setProperty('--mz-badge-text', theme.badgeText);
  root.style.setProperty('--mz-font-title', theme.titleFont);
  root.style.setProperty('--mz-font-serif', theme.serifFont);
}

function renderBackground() {
  const p = getCurrentPresentation();

  const isPlayer = viewState === 'player';
  const blurVal = isPlayer ? (p.backgroundBlur || 14) : (p.backgroundBlur || 0);
  const blurStyle = blurVal ? `blur(${blurVal}px)` : 'none';
  const darkness = isPlayer ? 0.75 : (p.backgroundDarkness !== undefined ? p.backgroundDarkness : 0.25);

  bgContainer.innerHTML = `
    <div class="menu-background-container">
      <img src="${p.coverImage}" alt="${p.title}" class="menu-background-image" style="filter: ${blurStyle}; opacity: 1;" />
      ${p.backgroundVideo && !isPlayer ? `
        <video id="bg-video-loop" src="${p.backgroundVideo}" autoplay loop muted playsinline class="menu-background-video" style="filter: ${blurStyle}; opacity: 0.85;"></video>
      ` : ''}
      <div class="menu-background-overlay" style="background: rgba(0, 0, 0, ${darkness});"></div>
      <div class="menu-vignette"></div>
      ${!isPlayer ? '<canvas id="ambient-canvas" class="ambient-canvas"></canvas>' : ''}
    </div>
  `;

  if (p.enableAmbientSound && !isAmbientMuted && !isPlayer) {
    startAmbientMenuMusic(0.18);
  } else {
    stopAmbientMenuMusic();
  }

  // Particle shimmer
  const canvas = bgContainer.querySelector('#ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 2 + 0.8,
      speedY: -(Math.random() * 0.15 + 0.05),
      speedX: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.3 + 0.1,
      maxOpacity: Math.random() * 0.3 + 0.1,
      fadeSpeed: Math.random() * 0.003 + 0.002
    }));

    function anim() {
      if (!ctx || viewState === 'player') return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;
        if (p.opacity > p.maxOpacity || p.opacity < 0.05) p.fadeSpeed = -p.fadeSpeed;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(anim);
    }
    anim();
  }
}

function selectVideo(vid, startTime = 0) {
  activeVideo = vid;
  initialPlayerTime = startTime;
  isPlayAll = false;
  viewState = 'player';
  renderApp();
}

function backToMenu() {
  viewState = 'menu';
  activeVideo = null;
  isPlayAll = false;
  renderApp();
}

function renderMainContent() {
  const p = getCurrentPresentation();

  if (viewState === 'menu') {
    renderInteractiveMenu(mainContainer, p, (action) => {
      if (action.type === 'switch-day') {
        activeDayId = action.dayId;
        renderMainContent();
      } else if (action.type === 'video') {
        selectVideo(action.video || p.videos[0], 0);
      } else if (action.type === 'change-bg') {
        isBgModalOpen = true;
        renderModals();
      } else if (action.type === 'open-settings') {
        isEditorOpen = true;
        renderModals();
      } else if (action.type === 'back-showcase') {
        // Toggle between Human Garage and Wedding demo
        const nextPres = presentations.find(item => item.id !== currentPresId) || presentations[0];
        currentPresId = nextPres.id;
        activeDayId = nextPres.days ? nextPres.days[nextPres.days.length - 1].id : 'day-5';
        renderApp();
      } else if (action.type === 'play-all') {
        if (p.videos.length > 0) {
          activeVideo = p.videos[0];
          initialPlayerTime = 0;
          isPlayAll = true;
          viewState = 'player';
          renderApp();
        }
      }
    }, { activeDayId });
  } else if (viewState === 'player' && activeVideo) {
    renderVideoPlayer(mainContainer, {
      video: activeVideo,
      initialTime: initialPlayerTime,
      isPlayAllMode: isPlayAll,
      allVideos: p.videos || [],
      onBackToMenu: backToMenu,
      onPlayNextVideo: (nextVid) => {
        activeVideo = nextVid;
        initialPlayerTime = 0;
        renderApp();
      }
    });
  }
}

function renderModals() {
  modalContainer.innerHTML = '';
  const p = getCurrentPresentation();

  if (isBgModalOpen) {
    const bgWrapper = document.createElement('div');
    modalContainer.appendChild(bgWrapper);
    renderBackgroundModal(bgWrapper, p, (updates) => {
      if (updates.coverImage) p.coverImage = updates.coverImage;
      if (updates.backgroundDarkness !== undefined) p.backgroundDarkness = updates.backgroundDarkness;
      if (updates.backgroundBlur !== undefined) p.backgroundBlur = updates.backgroundBlur;
      renderBackground();
    }, () => {
      isBgModalOpen = false;
      renderModals();
    });
  }

  if (isEditorOpen && viewState !== 'player') {
    const editorWrapper = document.createElement('div');
    modalContainer.appendChild(editorWrapper);
    renderEditorDrawer(editorWrapper, p, (updated) => {
      applyTheme(updated.themePreset);
      renderBackground();
      renderMainContent();
    }, () => {
      isEditorOpen = false;
      renderModals();
    }, (sessionToTest) => {
      isEditorOpen = false;
      selectVideo(sessionToTest, 0);
    });
  }

  if (isShareOpen) {
    const shareWrapper = document.createElement('div');
    modalContainer.appendChild(shareWrapper);
    renderShareModal(shareWrapper, p, () => {
      isShareOpen = false;
      renderModals();
    });
  }
}

export function renderApp() {
  const p = getCurrentPresentation();
  applyTheme(p.themePreset);

  renderBackground();
  renderMainContent();
  renderModals();
}

export function initApp() {
  appRoot.innerHTML = `
    <div id="bg-layer"></div>
    <div id="main-layer" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;"></div>
    <div id="modal-layer"></div>
  `;

  bgContainer = document.getElementById('bg-layer');
  mainContainer = document.getElementById('main-layer');
  modalContainer = document.getElementById('modal-layer');

  renderApp();
}

window.addEventListener('DOMContentLoaded', initApp);
