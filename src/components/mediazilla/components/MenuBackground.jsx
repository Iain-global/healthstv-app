import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { startAmbientMenuMusic, stopAmbientMenuMusic } from '../utils/ambientAudio';

export function MenuBackground({ presentation, isMuted, onToggleMute }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Handle ambient background audio
  useEffect(() => {
    if (presentation.enableAmbientSound && !isMuted) {
      startAmbientMenuMusic(0.18);
    } else {
      stopAmbientMenuMusic();
    }
    return () => {
      stopAmbientMenuMusic();
    };
  }, [presentation.enableAmbientSound, isMuted]);

  // Subtle ambient particle/light shimmer on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate gentle golden/ambient bokeh particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      speedY: -(Math.random() * 0.25 + 0.08),
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.4 + 0.1,
      maxOpacity: Math.random() * 0.4 + 0.15,
      fadeSpeed: Math.random() * 0.005 + 0.002
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;

        if (p.opacity > p.maxOpacity || p.opacity < 0.05) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 200, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const blurStyle = presentation.backgroundBlur ? `blur(${presentation.backgroundBlur}px)` : 'none';
  const darknessOverlay = presentation.backgroundDarkness || 0.4;

  return (
    <div className="menu-background-container">
      {/* Background Image / Poster */}
      <img
        src={presentation.coverImage}
        alt={presentation.title}
        className="menu-background-image"
        style={{
          filter: blurStyle,
          opacity: videoLoaded ? 0.3 : 1
        }}
      />

      {/* Looping Ambient Motion Video */}
      {presentation.backgroundVideo && (
        <video
          ref={videoRef}
          src={presentation.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="menu-background-video"
          style={{
            filter: blurStyle,
            opacity: videoLoaded ? 0.85 : 0
          }}
        />
      )}

      {/* Dark / Tint Overlay */}
      <div
        className="menu-background-overlay"
        style={{
          background: `rgba(8, 9, 13, ${darknessOverlay})`
        }}
      />

      {/* Vignette & Ambient Shimmer */}
      <div className="menu-vignette" />
      <canvas ref={canvasRef} className="ambient-canvas" />

      {/* Ambient Audio Floating Toggle */}
      {presentation.enableAmbientSound && (
        <button
          onClick={onToggleMute}
          className="ambient-audio-toggle-btn"
          title={isMuted ? 'Play Ambient Soundtrack' : 'Mute Background Audio'}
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '32px',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(15, 17, 23, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: isMuted ? '#94a3b8' : 'var(--mz-accent)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{isMuted ? 'Audio Off' : 'Ambient Music'}</span>
        </button>
      )}
    </div>
  );
}
