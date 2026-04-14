import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { X, Play, Pause, Volume2, VolumeX, SkipForward, Maximize, Minimize, Loader } from 'lucide-react';
import { getVideoForItem, fallbackVideos } from '../utils/videoPool';
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
  const [isLoading, setIsLoading] = useState(true);
  const [urlIndex, setUrlIndex] = useState(0);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const videoUrls = useMemo(() => [
    getVideoForItem(item.id),
    ...fallbackVideos,
  ], [item.id]);

  const currentVideoUrl = videoUrls[urlIndex];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      el.muted = false;
      el.play().then(() => setIsPlaying(true)).catch(() => {
        // If unmuted autoplay is blocked, try muted
        el.muted = true;
        setIsMuted(true);
        el.play().then(() => setIsPlaying(true)).catch(() => {});
      });
    }
  }, []);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => { if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  }, [resetControlsTimer]);

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

  const handleVideoError = () => {
    if (urlIndex < videoUrls.length - 1) {
      setUrlIndex(i => i + 1);
      setIsLoading(true);
      setVideoFailed(false);
    } else {
      setIsLoading(false);
      setVideoFailed(true);
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
      {/* Video — key forces remount on URL change for reliable fallback cycling */}
      <video
        key={currentVideoUrl}
        ref={setVideoRef}
        src={currentVideoUrl}
        poster={item.thumbnail}
        className="w-full h-full object-contain"
        onWaiting={() => setIsLoading(true)}
        onCanPlay={e => {
          setIsLoading(false);
          e.currentTarget.play().catch(() => {});
        }}
        onPlaying={() => { setIsLoading(false); setIsPlaying(true); }}
        onTimeUpdate={e => {
          const t = e.currentTarget.currentTime;
          setCurrentTime(t);
          setShowSkipIntro(t >= 3 && t < 30);
        }}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleVideoError}
        aria-label={`Video player for ${item.title}`}
      >
        <track kind="captions" label="English" srcLang="en" src="/captions/placeholder.vtt" default />
      </video>

      {/* Loading spinner — shown while video buffers */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader size={48} className="text-white animate-spin opacity-80" aria-label="Loading video" />
        </div>
      )}

      {/* Hard failure state after all fallback URLs fail */}
      {videoFailed && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          role="alert"
          aria-live="assertive"
        >
          <div
            className="max-w-md w-full rounded-lg border p-5 text-center"
            style={{ background: 'rgba(20,20,20,0.95)', borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
          >
            <p className="text-lg font-semibold mb-2">Video failed to load</p>
            <p className="text-sm text-white/70 mb-4">
              We could not play this title right now. Try again or return to browsing.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setVideoFailed(false);
                  setIsLoading(true);
                  setUrlIndex(0);
                }}
                className="px-4 py-2 rounded font-semibold text-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ background: '#fff', color: '#000' }}
              >
                Retry
              </button>
              <button
                onClick={e => { e.stopPropagation(); onClose(); }}
                className="px-4 py-2 rounded font-semibold text-sm border transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
              >
                Back to Browse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skip Intro — appears 3s in, disappears at 30s */}
      {showSkipIntro && (
        <button
          onClick={e => {
            e.stopPropagation();
            if (videoRef.current) videoRef.current.currentTime = 30;
            setShowSkipIntro(false);
          }}
          className="absolute bottom-24 right-6 px-5 py-2.5 rounded border-2 font-semibold text-sm text-white transition-all hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ background: 'rgba(0,0,0,0.7)', borderColor: 'rgba(255,255,255,0.8)', zIndex: 10 }}
          aria-label="Skip intro"
        >
          Skip Intro
        </button>
      )}

      {/* Click-to-pause — rendered BEFORE controls overlay so controls stay on top */}
      <button
        onClick={e => { e.stopPropagation(); togglePlay(); }}
        className="absolute inset-0 w-full h-full focus-visible:outline-none"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        tabIndex={-1}
        style={{ background: 'transparent' }}
      />

      {/* Controls overlay — pointer-events-none on wrapper, re-enabled on children */}
      <div
        className="absolute inset-0 flex flex-col justify-between transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: showControls ? 1 : 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
        aria-hidden={!showControls}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 md:p-6 pointer-events-auto">
          <div>
            <h1 className="text-white font-bold text-lg">{item.title}</h1>
            <p className="text-white/70 text-sm">{item.year} · {item.genre}</p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onClose(); }}
            className="p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            aria-label="Exit player"
          >
            <X size={22} className="text-white" aria-hidden="true" />
          </button>
        </div>

        {/* Bottom controls */}
        <div className="p-4 md:p-6 space-y-3 pointer-events-auto">
          {/* Seek bar */}
          <div className="flex items-center gap-3">
            <span className="text-white text-xs tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 relative h-1 group">
              <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progressPercent}%`, background: 'var(--accent)' }} />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={handleSeek}
                onClick={e => e.stopPropagation()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Video progress"
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              />
            </div>
            <span className="text-white text-xs tabular-nums w-10">{formatTime(duration)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={e => { e.stopPropagation(); togglePlay(); }}
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
              onClick={e => { e.stopPropagation(); skipForward(); }}
              className="p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward size={20} className="text-white" aria-hidden="true" />
            </button>

            <button
              onClick={e => { e.stopPropagation(); toggleMute(); }}
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

            <span className="text-white/50 text-xs hidden md:block">Space · M · Esc</span>

            <button
              onClick={e => { e.stopPropagation(); toggleFullscreen(); }}
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
    </div>
  );
}
