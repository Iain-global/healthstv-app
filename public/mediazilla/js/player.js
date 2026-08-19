import { getIcon } from './icons.js';
import { formatTime } from './timeFormatters.js';
import { getSvpEmbedUrl } from './svpIntegration.js';

export function renderVideoPlayer(container, options) {
  const {
    video,
    initialTime = 0,
    isPlayAllMode = false,
    allVideos = [],
    onBackToMenu,
    onPlayNextVideo
  } = options;

  // Check if video uses StreamingVideoProvider embed or clip ID
  const isSvp = Boolean(video.svpClipId || video.svpEmbedUrl || (video.videoUrl && (video.videoUrl.includes('streamingvideoprovider') || video.videoUrl.includes('svp'))));

  if (isSvp) {
    const svpSrc = getSvpEmbedUrl(video.svpClipId || video.svpEmbedUrl || video.videoUrl, { autoplay: true });
    container.innerHTML = `
      <div class="cinema-player-wrapper" id="player-wrapper" style="position: absolute; inset: 0; background: #000000; z-index: 100;">
        <div style="position: absolute; top: 0; left: 0; right: 0; z-index: 120; padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); pointer-events: none;">
          <button id="btn-back-menu" class="back-to-menu-btn" style="pointer-events: auto;">
            ${getIcon('arrowLeft', 16)}
            <span>Back to Menu</span>
          </button>
          <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); padding: 0.35rem 0.85rem; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.18); font-size: 0.75rem; color: #fbbf24; font-weight: 700;">
            <span>StreamingVideoProvider • ${video.title}</span>
          </div>
        </div>
        <iframe
          src="${svpSrc}"
          width="100%"
          height="100%"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          style="width: 100%; height: 100%; border: none; background: #000000;"
        ></iframe>
      </div>
    `;

    container.querySelector('#btn-back-menu')?.addEventListener('click', onBackToMenu);
    return;
  }

  let isPlaying = true;
  let currentTime = initialTime;
  let duration = video.duration || 100;
  let volume = 0.85;
  let isMuted = false;
  let playbackRate = 1;
  let showChapterDrawer = false;
  let showSpeedMenu = false;
  let showHud = true;
  let hudTimeout = null;
  let upNextTimer = null;

  const chapters = video.chapters || [];

  const getActiveChapter = (time) => {
    return [...chapters].reverse().find(c => time >= c.time) || chapters[0] || { title: video.title, time: 0 };
  };

  container.innerHTML = `
    <div class="cinema-player-wrapper" id="player-wrapper">
      <video
        id="cinema-video"
        class="cinema-video-element"
        src="${video.videoUrl}"
        playsinline
      ></video>

      <div class="player-hud-overlay" id="player-hud">
        <!-- Top HUD Bar -->
        <div class="player-top-bar">
          <button id="btn-back-menu" class="back-to-menu-btn">
            ${getIcon('arrowLeft', 16)}
            <span>Back to Menu</span>
          </button>

          <div class="player-title-info">
            <h3 class="player-main-title">${video.title}</h3>
            <div class="player-chapter-badge" id="hud-chapter-badge">
              <span>${getActiveChapter(initialTime).title}</span>
            </div>
          </div>
        </div>

        <!-- Up Next Notification (Play All Mode) -->
        <div class="up-next-prompt" id="up-next-banner" style="display: none;">
          <span class="up-next-header" id="up-next-countdown-text">Up Next in 5s</span>
          <span class="up-next-title" id="up-next-title-text"></span>
          <div class="up-next-actions">
            <button id="btn-upnext-play" class="up-next-btn primary">Play Now</button>
            <button id="btn-upnext-menu" class="up-next-btn secondary">Menu</button>
          </div>
        </div>

        <!-- Bottom Controls Dock -->
        <div class="player-bottom-dock">
          <!-- Timeline Scrubber -->
          <div class="scrubber-container" id="scrubber-box">
            <div class="scrubber-track">
              <div class="scrubber-progress" id="scrubber-bar" style="width: 0%;"></div>
              <div class="scrubber-thumb" id="scrubber-thumb-dot" style="left: 0%;"></div>

              <!-- Chapter Ticks -->
              ${chapters.map(chap => {
                const tickPercent = duration > 0 ? (chap.time / duration) * 100 : 0;
                return `<div class="chapter-marker-tick" style="left: ${tickPercent}%;" title="${chap.title}"></div>`;
              }).join('')}
            </div>

            <!-- Hover Preview Tooltip -->
            <div class="scrubber-hover-preview" id="scrubber-preview" style="display: none;">
              <img id="preview-img" class="preview-thumb-img" src="${video.thumbnail}" alt="preview" />
              <span class="preview-time-text" id="preview-time">00:00</span>
              <span class="preview-chapter-text" id="preview-chap"></span>
            </div>
          </div>

          <!-- Controls Row -->
          <div class="player-controls-row">
            <div class="controls-left">
              <button id="btn-play-toggle" class="player-btn" title="Play/Pause (Space)">
                ${getIcon('pause', 20)}
              </button>

              <button id="btn-prev-chap" class="player-btn" title="Previous Chapter">
                ${getIcon('skipBack', 18)}
              </button>

              <button id="btn-rewind-10" class="player-btn" title="Rewind 10s">
                ${getIcon('rotateCcw', 18)}
              </button>

              <button id="btn-forward-10" class="player-btn" title="Forward 10s">
                ${getIcon('rotateCw', 18)}
              </button>

              <button id="btn-next-chap" class="player-btn" title="Next Chapter">
                ${getIcon('skipForward', 18)}
              </button>

              <div class="volume-control-group">
                <button id="btn-mute-toggle" class="player-btn" title="Mute/Unmute">
                  ${getIcon('volume2', 19)}
                </button>
                <div class="volume-slider-box">
                  <input id="volume-range" type="range" min="0" max="1" step="0.05" value="0.85" class="volume-slider-input" />
                </div>
              </div>

              <div class="time-display">
                <span id="display-cur-time">00:00</span>
                <span class="separator">/</span>
                <span id="display-total-time">${formatTime(duration)}</span>
              </div>
            </div>

            <div class="controls-right">
              <span style="font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.45rem; border-radius: 4px; background: rgba(255, 255, 255, 0.1); color: var(--mz-accent); border: 1px solid rgba(255, 255, 255, 0.15); letter-spacing: 0.04em;">
                4K UHD
              </span>

              ${chapters.length > 0 ? `
                <button id="btn-drawer-toggle" class="player-btn" title="Chapters & Scenes">
                  ${getIcon('list', 20)}
                </button>
              ` : ''}

              <div style="position: relative;">
                <button id="btn-speed-toggle" class="player-btn" style="font-size: 0.82rem; font-weight: 600;">
                  1x
                </button>
                <div id="speed-menu" style="display: none; position: absolute; bottom: 48px; right: 0; background: rgba(15, 17, 23, 0.95); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 0.4rem; flex-direction: column; gap: 0.2rem; z-index: 60; min-width: 85px;">
                  ${[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => `
                    <button class="speed-opt-btn" data-speed="${s}" style="padding: 0.35rem 0.6rem; border-radius: 4px; font-size: 0.8rem; color: ${s === 1 ? 'var(--mz-accent)' : '#ffffff'}; text-align: left;">
                      ${s}x
                    </button>
                  `).join('')}
                </div>
              </div>

              <button id="btn-fullscreen-toggle" class="player-btn" title="Toggle Fullscreen">
                ${getIcon('maximize', 20)}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chapter Drawer -->
      <div id="chapter-drawer" class="chapter-drawer-pane" style="display: none;">
        <div class="drawer-header">
          <h4 class="drawer-title">Chapters & Scenes</h4>
          <button id="btn-close-drawer" class="player-btn">
            ${getIcon('x', 18)}
          </button>
        </div>
        <div class="drawer-list">
          ${chapters.map((chap, idx) => `
            <button class="drawer-chapter-item" data-drawer-time="${chap.time}">
              <img src="${chap.thumbnail || video.thumbnail}" alt="${chap.title}" class="drawer-thumb-img" />
              <div class="drawer-item-meta">
                <span class="drawer-item-title">${chap.title}</span>
                <span class="drawer-item-time">${chap.timeFormatted}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const videoEl = container.querySelector('#cinema-video');
  const hudEl = container.querySelector('#player-hud');
  const scrubberBox = container.querySelector('#scrubber-box');
  const scrubberBar = container.querySelector('#scrubber-bar');
  const scrubberThumb = container.querySelector('#scrubber-thumb-dot');
  const scrubberPreview = container.querySelector('#scrubber-preview');
  const previewImg = container.querySelector('#preview-img');
  const previewTime = container.querySelector('#preview-time');
  const previewChap = container.querySelector('#preview-chap');
  const curTimeDisplay = container.querySelector('#display-cur-time');
  const totalTimeDisplay = container.querySelector('#display-total-time');
  const playToggleBtn = container.querySelector('#btn-play-toggle');
  const chapterBadge = container.querySelector('#hud-chapter-badge span');
  const drawer = container.querySelector('#chapter-drawer');
  const speedMenu = container.querySelector('#speed-menu');
  const speedBtn = container.querySelector('#btn-speed-toggle');
  const upNextBanner = container.querySelector('#up-next-banner');

  // Auto-play and set time
  videoEl.currentTime = initialTime;
  videoEl.play().then(() => {
    isPlaying = true;
    playToggleBtn.innerHTML = getIcon('pause', 20);
  }).catch(() => {
    isPlaying = false;
    playToggleBtn.innerHTML = getIcon('play', 20);
  });

  // HUD Inactivity Timeout
  const resetHudTimeout = () => {
    hudEl.classList.remove('hud-hidden');
    if (hudTimeout) clearTimeout(hudTimeout);
    hudTimeout = setTimeout(() => {
      if (isPlaying && drawer.style.display === 'none' && speedMenu.style.display === 'none') {
        hudEl.classList.add('hud-hidden');
      }
    }, 3500);
  };

  container.addEventListener('mousemove', resetHudTimeout);
  resetHudTimeout();

  // Play / Pause Toggle
  const togglePlay = () => {
    if (videoEl.paused) {
      videoEl.play();
      isPlaying = true;
      playToggleBtn.innerHTML = getIcon('pause', 20);
    } else {
      videoEl.pause();
      isPlaying = false;
      playToggleBtn.innerHTML = getIcon('play', 20);
    }
  };

  playToggleBtn.addEventListener('click', togglePlay);
  videoEl.addEventListener('click', togglePlay);

  // Time Updates
  videoEl.addEventListener('timeupdate', () => {
    currentTime = videoEl.currentTime;
    if (videoEl.duration && !isNaN(videoEl.duration)) {
      duration = videoEl.duration;
      totalTimeDisplay.textContent = formatTime(duration);
    }

    const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
    scrubberBar.style.width = `${pct}%`;
    scrubberThumb.style.left = `${pct}%`;
    curTimeDisplay.textContent = formatTime(currentTime);

    const activeChap = getActiveChapter(currentTime);
    if (activeChap && chapterBadge) {
      chapterBadge.textContent = activeChap.title;
    }
  });

  // Scrubber Seeking
  scrubberBox.addEventListener('click', (e) => {
    const rect = scrubberBox.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoEl.currentTime = pos * duration;
  });

  scrubberBox.addEventListener('mousemove', (e) => {
    const rect = scrubberBox.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const hoverSecs = percent * duration;
    const hoverChap = getActiveChapter(hoverSecs);

    scrubberPreview.style.display = 'flex';
    scrubberPreview.style.left = `${e.clientX - rect.left}px`;
    previewTime.textContent = formatTime(hoverSecs);
    previewChap.textContent = hoverChap ? hoverChap.title : '';
    if (hoverChap?.thumbnail) {
      previewImg.src = hoverChap.thumbnail;
    }
  });

  scrubberBox.addEventListener('mouseleave', () => {
    scrubberPreview.style.display = 'none';
  });

  // Skip buttons
  container.querySelector('#btn-rewind-10')?.addEventListener('click', () => {
    videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
  });

  container.querySelector('#btn-forward-10')?.addEventListener('click', () => {
    videoEl.currentTime = Math.min(duration, videoEl.currentTime + 10);
  });

  container.querySelector('#btn-prev-chap')?.addEventListener('click', () => {
    const prevList = [...chapters].reverse();
    const prev = prevList.find(c => c.time < currentTime - 2);
    videoEl.currentTime = prev ? prev.time : 0;
  });

  container.querySelector('#btn-next-chap')?.addEventListener('click', () => {
    const next = chapters.find(c => c.time > currentTime + 2);
    if (next) {
      videoEl.currentTime = next.time;
    } else {
      videoEl.currentTime = Math.min(duration, videoEl.currentTime + 30);
    }
  });

  // Volume
  const volInput = container.querySelector('#volume-range');
  const muteBtn = container.querySelector('#btn-mute-toggle');

  volInput?.addEventListener('input', (e) => {
    volume = parseFloat(e.target.value);
    videoEl.volume = volume;
    videoEl.muted = volume === 0;
    muteBtn.innerHTML = volume === 0 ? getIcon('volumeX', 19) : getIcon('volume2', 19);
  });

  muteBtn?.addEventListener('click', () => {
    isMuted = !isMuted;
    videoEl.muted = isMuted;
    muteBtn.innerHTML = isMuted ? getIcon('volumeX', 19) : getIcon('volume2', 19);
  });

  // Drawer Toggle
  container.querySelector('#btn-drawer-toggle')?.addEventListener('click', () => {
    drawer.style.display = drawer.style.display === 'none' ? 'flex' : 'none';
  });

  container.querySelector('#btn-close-drawer')?.addEventListener('click', () => {
    drawer.style.display = 'none';
  });

  drawer?.querySelectorAll('[data-drawer-time]').forEach(el => {
    el.addEventListener('click', () => {
      const targetSecs = parseFloat(el.getAttribute('data-drawer-time')) || 0;
      videoEl.currentTime = targetSecs;
      drawer.style.display = 'none';
      if (videoEl.paused) videoEl.play();
    });
  });

  // Speed
  speedBtn?.addEventListener('click', () => {
    speedMenu.style.display = speedMenu.style.display === 'none' ? 'flex' : 'none';
  });

  speedMenu?.querySelectorAll('.speed-opt-btn').forEach(el => {
    el.addEventListener('click', () => {
      const s = parseFloat(el.getAttribute('data-speed'));
      videoEl.playbackRate = s;
      speedBtn.textContent = `${s}x`;
      speedMenu.style.display = 'none';
    });
  });

  // Fullscreen
  container.querySelector('#btn-fullscreen-toggle')?.addEventListener('click', () => {
    const wrapper = container.querySelector('#player-wrapper');
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Back to Menu
  container.querySelector('#btn-back-menu')?.addEventListener('click', () => {
    if (upNextTimer) clearTimeout(upNextTimer);
    if (hudTimeout) clearTimeout(hudTimeout);
    videoEl.pause();
    onBackToMenu();
  });

  // Video Ended (Continuous Play All)
  videoEl.addEventListener('ended', () => {
    if (isPlayAllMode) {
      const currentIndex = allVideos.findIndex(v => v.id === video.id);
      if (currentIndex !== -1 && currentIndex < allVideos.length - 1) {
        const nextVid = allVideos[currentIndex + 1];
        let countdown = 5;

        upNextBanner.style.display = 'flex';
        container.querySelector('#up-next-title-text').textContent = nextVid.title;

        upNextTimer = setInterval(() => {
          countdown--;
          container.querySelector('#up-next-countdown-text').textContent = `Up Next in ${countdown}s`;
          if (countdown <= 0) {
            clearInterval(upNextTimer);
            onPlayNextVideo(nextVid);
          }
        }, 1000);

        container.querySelector('#btn-upnext-play').onclick = () => {
          clearInterval(upNextTimer);
          onPlayNextVideo(nextVid);
        };
        container.querySelector('#btn-upnext-menu').onclick = () => {
          clearInterval(upNextTimer);
          onBackToMenu();
        };
      } else {
        onBackToMenu();
      }
    }
  });
}
