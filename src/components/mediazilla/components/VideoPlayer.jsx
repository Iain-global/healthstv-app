import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft,
  ListOrdered,
  X,
  Gauge,
  Tv,
  Check
} from 'lucide-react';
import { formatTime } from '../utils/timeFormatters';

export function VideoPlayer({
  video,
  initialTime = 0,
  isPlayAllMode = false,
  allVideos = [],
  onBackToMenu,
  onPlayNextVideo
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const scrubberRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(video.duration || 100);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showChapterDrawer, setShowChapterDrawer] = useState(false);
  const [showHud, setShowHud] = useState(true);
  const [hoverScrub, setHoverScrub] = useState(null); // { time, percent, x }
  const [centerTapAnim, setCenterTapAnim] = useState(false);
  const [upNextCountdown, setUpNextCountdown] = useState(null);

  const chapters = video.chapters || [];
  const hudTimeoutRef = useRef(null);

  // Find active chapter
  const currentChapter = [...chapters]
    .reverse()
    .find((c) => currentTime >= c.time) || chapters[0] || { title: video.title, time: 0 };

  // Initialize playback time
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialTime;
      videoRef.current.play().catch(() => {
        // Autoplay policy might pause initially
        setIsPlaying(false);
      });
    }
  }, [video, initialTime]);

  // Activity timer to auto-hide HUD after 3.5s of no mouse movement
  const handleMouseMove = () => {
    setShowHud(true);
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showChapterDrawer && !showSpeedMenu) {
        setShowHud(false);
      }
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
    setCenterTapAnim(true);
    setTimeout(() => setCenterTapAnim(false), 500);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (!scrubberRef.current || !videoRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSecs = pos * duration;
    videoRef.current.currentTime = targetSecs;
    setCurrentTime(targetSecs);
  };

  const handleScrubberMouseMove = (e) => {
    if (!scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = percent * duration;

    // Find hover chapter
    const hoverChapter = [...chapters]
      .reverse()
      .find((c) => time >= c.time) || chapters[0];

    setHoverScrub({
      percent,
      time,
      x: e.clientX - rect.left,
      chapterTitle: hoverChapter ? hoverChapter.title : null,
      thumbnail: hoverChapter?.thumbnail || video.thumbnail
    });
  };

  const handleScrubberMouseLeave = () => {
    setHoverScrub(null);
  };

  const jumpToChapter = (timeInSecs) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSecs;
      setCurrentTime(timeInSecs);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
    setShowChapterDrawer(false);
  };

  const jumpNextChapter = () => {
    const next = chapters.find((c) => c.time > currentTime + 2);
    if (next) {
      jumpToChapter(next.time);
    } else {
      skipTime(30);
    }
  };

  const jumpPrevChapter = () => {
    const prevList = [...chapters].reverse();
    const prev = prevList.find((c) => c.time < currentTime - 2);
    if (prev) {
      jumpToChapter(prev.time);
    } else {
      jumpToChapter(0);
    }
  };

  const skipTime = (delta) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.85;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Video Ended Handler (Handle Play All sequence)
  const handleVideoEnded = () => {
    if (isPlayAllMode) {
      const currentIndex = allVideos.findIndex((v) => v.id === video.id);
      if (currentIndex !== -1 && currentIndex < allVideos.length - 1) {
        const nextVid = allVideos[currentIndex + 1];
        setUpNextCountdown({ video: nextVid, secondsLeft: 5 });
      } else {
        onBackToMenu();
      }
    }
  };

  // Handle countdown timer for Up Next
  useEffect(() => {
    if (!upNextCountdown) return;
    if (upNextCountdown.secondsLeft <= 0) {
      const nextVid = upNextCountdown.video;
      setUpNextCountdown(null);
      onPlayNextVideo(nextVid);
      return;
    }
    const timer = setTimeout(() => {
      setUpNextCountdown((prev) => ({ ...prev, secondsLeft: prev.secondsLeft - 1 }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [upNextCountdown, onPlayNextVideo]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="cinema-player-wrapper"
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        // Toggle play if clicking on the background canvas/video
        if (e.target.classList.contains('cinema-player-wrapper') || e.target.tagName === 'VIDEO') {
          togglePlay();
        }
      }}
    >
      {/* 4K HTML5 Video Tag */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="cinema-video-element"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onError={() => {
          // Attempt fallback video stream
          if (videoRef.current && video.fallbackVideoUrl && videoRef.current.src !== video.fallbackVideoUrl) {
            videoRef.current.src = video.fallbackVideoUrl;
            videoRef.current.play().catch(() => {});
          }
        }}
      />

      {/* Center Play/Pause Flash Animation */}
      <div className={`player-center-tap-indicator ${centerTapAnim ? 'animate' : ''}`}>
        {isPlaying ? <Play size={36} fill="#ffffff" /> : <Pause size={36} fill="#ffffff" />}
      </div>

      {/* Player HUD Overlays */}
      <div className={`player-hud-overlay ${!showHud ? 'hud-hidden' : ''}`}>
        {/* Top HUD Bar */}
        <div className="player-top-bar">
          <button onClick={onBackToMenu} className="back-to-menu-btn">
            <ArrowLeft size={16} />
            <span>Back to Menu</span>
          </button>

          <div className="player-title-info">
            <h3 className="player-main-title">{video.title}</h3>
            {currentChapter && (
              <div className="player-chapter-badge">
                <span>{currentChapter.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Up Next in Play All prompt */}
        {upNextCountdown && (
          <div className="up-next-prompt">
            <span className="up-next-header">Up Next in {upNextCountdown.secondsLeft}s</span>
            <span className="up-next-title">{upNextCountdown.video.title}</span>
            <div className="up-next-actions">
              <button
                onClick={() => {
                  const nextVid = upNextCountdown.video;
                  setUpNextCountdown(null);
                  onPlayNextVideo(nextVid);
                }}
                className="up-next-btn primary"
              >
                Play Now
              </button>
              <button onClick={onBackToMenu} className="up-next-btn secondary">
                Menu
              </button>
            </div>
          </div>
        )}

        {/* Bottom Control Dock */}
        <div className="player-bottom-dock">
          {/* Interactive Scrubber Timeline */}
          <div
            ref={scrubberRef}
            className="scrubber-container"
            onClick={handleSeek}
            onMouseMove={handleScrubberMouseMove}
            onMouseLeave={handleScrubberMouseLeave}
          >
            <div className="scrubber-track">
              <div className="scrubber-progress" style={{ width: `${progressPercent}%` }} />
              <div className="scrubber-thumb" style={{ left: `${progressPercent}%` }} />

              {/* Chapter ticks on timeline */}
              {chapters.map((chap) => {
                const tickPercent = duration > 0 ? (chap.time / duration) * 100 : 0;
                return (
                  <div
                    key={chap.id}
                    className="chapter-marker-tick"
                    style={{ left: `${tickPercent}%` }}
                    title={chap.title}
                  />
                );
              })}
            </div>

            {/* Hover Thumbnail & Timecode Preview Tooltip */}
            {hoverScrub && (
              <div
                className="scrubber-hover-preview"
                style={{
                  left: `${hoverScrub.x}px`
                }}
              >
                {hoverScrub.thumbnail && (
                  <img src={hoverScrub.thumbnail} alt="preview" className="preview-thumb-img" />
                )}
                <span className="preview-time-text">{formatTime(hoverScrub.time)}</span>
                {hoverScrub.chapterTitle && (
                  <span className="preview-chapter-text">{hoverScrub.chapterTitle}</span>
                )}
              </div>
            )}
          </div>

          {/* Controls Row */}
          <div className="player-controls-row">
            <div className="controls-left">
              {/* Play / Pause */}
              <button onClick={togglePlay} className="player-btn" title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
              </button>

              {/* Skip Prev Chapter */}
              <button onClick={jumpPrevChapter} className="player-btn" title="Previous Chapter">
                <SkipBack size={18} />
              </button>

              {/* 10s Rewind */}
              <button onClick={() => skipTime(-10)} className="player-btn" title="Rewind 10 seconds">
                <RotateCcw size={18} />
              </button>

              {/* 10s Forward */}
              <button onClick={() => skipTime(10)} className="player-btn" title="Forward 10 seconds">
                <RotateCw size={18} />
              </button>

              {/* Skip Next Chapter */}
              <button onClick={jumpNextChapter} className="player-btn" title="Next Chapter">
                <SkipForward size={18} />
              </button>

              {/* Volume Slider */}
              <div className="volume-control-group">
                <button onClick={toggleMute} className="player-btn" title={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted || volume === 0 ? <VolumeX size={19} /> : <Volume2 size={19} />}
                </button>
                <div className="volume-slider-box">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="volume-slider-input"
                  />
                </div>
              </div>

              {/* Elapsed / Total Time Display */}
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span className="separator">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="controls-right">
              {/* 4K Badge */}
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--mz-accent)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  letterSpacing: '0.04em'
                }}
              >
                4K UHD
              </span>

              {/* Chapters Drawer Button */}
              {chapters.length > 0 && (
                <button
                  onClick={() => setShowChapterDrawer(!showChapterDrawer)}
                  className={`player-btn ${showChapterDrawer ? 'active' : ''}`}
                  title="Browse Chapters"
                  style={{
                    color: showChapterDrawer ? 'var(--mz-accent)' : undefined
                  }}
                >
                  <ListOrdered size={20} />
                </button>
              )}

              {/* Playback Speed Popover */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="player-btn"
                  title="Playback Speed"
                  style={{ fontSize: '0.82rem', fontWeight: 600 }}
                >
                  {playbackRate}x
                </button>

                {showSpeedMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '48px',
                      right: 0,
                      background: 'rgba(15, 17, 23, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      zIndex: 60,
                      minWidth: '90px'
                    }}
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.35rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          color: playbackRate === s ? 'var(--mz-accent)' : '#ffffff',
                          background: playbackRate === s ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          fontWeight: playbackRate === s ? 700 : 400
                        }}
                      >
                        <span>{s}x</span>
                        {playbackRate === s && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button onClick={toggleFullscreen} className="player-btn" title="Toggle Fullscreen (F)">
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Chapter Drawer */}
      {showChapterDrawer && (
        <div className="chapter-drawer-pane">
          <div className="drawer-header">
            <h4 className="drawer-title">Chapters & Scenes</h4>
            <button onClick={() => setShowChapterDrawer(false)} className="player-btn">
              <X size={18} />
            </button>
          </div>

          <div className="drawer-list">
            {chapters.map((chap, idx) => {
              const isActive = currentChapter && currentChapter.id === chap.id;
              return (
                <button
                  key={chap.id || idx}
                  onClick={() => jumpToChapter(chap.time)}
                  className={`drawer-chapter-item ${isActive ? 'active' : ''}`}
                >
                  <img src={chap.thumbnail || video.thumbnail} alt={chap.title} className="drawer-thumb-img" />
                  <div className="drawer-item-meta">
                    <span className="drawer-item-title">{chap.title}</span>
                    <span className="drawer-item-time">{chap.timeFormatted}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
