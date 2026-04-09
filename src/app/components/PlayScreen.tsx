import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX, SkipForward, Maximize, Minimize } from 'lucide-react';
import { getVideoForItem } from '../utils/videoPool';
import type { ContentItem } from '../types';

interface PlayScreenProps {
  item: ContentItem;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlayScreen({ item, onClose }: PlayScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setVideo = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      el.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    resetControlsTimer();
    return () => { if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const skipForward = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${item.title}`}
    >
      {/* Video */}
      <video
        ref={setVideo}
        src={getVideoForItem(item.id)}
        className="w-full h-full object-contain"
        onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        aria-label={`Video player for ${item.title}`}
      />

      {/* Controls overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-between transition-opacity duration-300"
        style={{ opacity: showControls ? 1 : 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)' }}
        aria-hidden={!showControls}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <div>
            <h1 className="text-white font-bold text-lg">{item.title}</h1>
            <p className="text-white/70 text-sm">{item.year} · {item.genre}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            aria-label="Exit player"
          >
            <X size={22} className="text-white" aria-hidden="true" />
          </button>
        </div>

        {/* Bottom controls */}
        <div className="p-4 md:p-6 space-y-3">
          {/* Seek bar */}
          <div className="flex items-center gap-3">
            <span className="text-white text-xs tabular-nums">{formatTime(currentTime)}</span>
            <div className="flex-1 relative h-1 group">
              <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }}>
                <div className="h-full rounded-full" style={{ width: `${progressPercent}%`, background: 'var(--accent)' }} />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Video progress"
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              />
            </div>
            <span className="text-white text-xs tabular-nums">{formatTime(duration)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause size={20} className="text-white fill-white" aria-hidden="true" />
                : <Play size={20} className="text-white fill-white ml-0.5" aria-hidden="true" />
              }
            </button>

            <button
              onClick={skipForward}
              className="p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward size={20} className="text-white" aria-hidden="true" />
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              aria-pressed={isMuted}
            >
              {isMuted
                ? <VolumeX size={20} className="text-white" aria-hidden="true" />
                : <Volume2 size={20} className="text-white" aria-hidden="true" />
              }
            </button>

            <div className="flex-1" />

            {/* Keyboard hints */}
            <span className="text-white/50 text-xs hidden md:block">Space · M · Esc</span>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              aria-pressed={isFullscreen}
            >
              {isFullscreen
                ? <Minimize size={20} className="text-white" aria-hidden="true" />
                : <Maximize size={20} className="text-white" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Click to play/pause */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full focus-visible:outline-none"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        tabIndex={-1}
        style={{ background: 'transparent' }}
      />
    </div>
  );
}
