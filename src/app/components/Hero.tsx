import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getVideoForItem, fallbackVideos } from '../utils/videoPool';
import { useToast } from './Toast';
import type { ContentItem } from '../types';

interface HeroProps {
  item: ContentItem;
  onPlay: () => void;
  onMoreInfo: () => void;
  autoplayEnabled: boolean;
  onAddToList: (item: ContentItem) => void;
  onRemoveFromList: (itemId: string) => void;
  isInMyList: (itemId: string) => boolean;
}

export function Hero({ item, onPlay, onMoreInfo, autoplayEnabled, onAddToList, onRemoveFromList, isInMyList }: HeroProps) {
  const inListFromParent = isInMyList(item.id);
  const { showToast } = useToast();
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [urlIndex, setUrlIndex] = useState(0);
  const [optimisticInList, setOptimisticInList] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Use optimistic state if set, otherwise use parent state
  const inList = optimisticInList !== null ? optimisticInList : inListFromParent;

  // Clear optimistic state when parent state updates
  useEffect(() => {
    setOptimisticInList(null);
  }, [inListFromParent]);

  const videoUrls = [getVideoForItem(item.id), ...fallbackVideos];
  const currentVideoUrl = videoUrls[urlIndex];

  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      el.setAttribute('muted', '');
      el.muted = true;
    }
  }, []);

  const handleVideoError = () => {
    if (urlIndex < videoUrls.length - 1) {
      setUrlIndex(i => i + 1);
    } else {
      setVideoError(true);
    }
  };

  const showVideo = autoplayEnabled && !videoError;

  return (
    <div className="relative w-full" style={{ height: 'min(70vh, 480px)', marginTop: '56px' }}>
      {/* Background: thumbnail always shown, video overlaid on top */}
      <ImageWithFallback
        src={item.thumbnail}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {showVideo && (
        <video
          key={currentVideoUrl}
          ref={setVideoRef}
          src={currentVideoUrl}
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: 'none' }}
          onCanPlay={e => {
            e.currentTarget.muted = true;
            e.currentTarget.play().catch(() => {});
          }}
          onError={handleVideoError}
          aria-label={`Trailer for ${item.title}`}
        >
          <track kind="captions" label="English" srcLang="en" src="/captions/placeholder.vtt" default />
        </video>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%), linear-gradient(to top, rgba(20,20,20,1) 0%, transparent 40%)' }}
        aria-hidden="true"
      />

      {/* Mute toggle — only when video is playing */}
      {/* Video unavailable badge */}
      {autoplayEnabled && videoError && (
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded text-xs"
          style={{ background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
          role="status"
          aria-live="polite"
        >
          Preview unavailable
        </div>
      )}

      {showVideo && (
        <button
          onClick={() => setIsMuted(m => {
            if (videoRef.current) videoRef.current.muted = !m;
            return !m;
          })}
          className="absolute top-4 right-4 p-2 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ background: 'rgba(20,20,20,0.7)', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', zIndex: 10 }}
          aria-label={isMuted ? 'Unmute trailer' : 'Mute trailer'}
          aria-pressed={!isMuted}
        >
          {isMuted
            ? <VolumeX size={18} aria-hidden="true" />
            : <Volume2 size={18} aria-hidden="true" />
          }
        </button>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 md:pb-16">
        <div className="max-w-xl flex flex-col gap-4">
          {/* Recommendation badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border border-dashed self-start"
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.3)' }}
          >
            <span aria-hidden="true">↗</span>
            {item.reason}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            {item.title}
          </h1>

          <div className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {item.rating && (
              <span className="font-bold" style={{ color: '#46d369' }}>{Math.round(item.rating * 10)}% Match</span>
            )}
            <span>{item.year}</span>
            {item.maturityRating && (
              <span className="px-1.5 py-0.5 border text-xs rounded" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
                {item.maturityRating}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-sm md:text-base line-clamp-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-3" role="group" aria-label="Hero actions">
            <button
              onClick={onPlay}
              className="flex items-center gap-2 px-6 py-2.5 rounded font-bold text-sm md:text-base transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: '#ffffff', color: '#000000' }}
              aria-label={`Play ${item.title}`}
            >
              <Play size={20} className="fill-current" aria-hidden="true" />
              Play
            </button>

            <button
              onClick={onMoreInfo}
              className="flex items-center gap-2 px-6 py-2.5 rounded font-bold text-sm md:text-base transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(109,109,110,0.7)', color: '#ffffff' }}
              aria-label={`More info about ${item.title}`}
            >
              <Info size={20} aria-hidden="true" />
              <span className="hidden sm:inline">More Info</span>
            </button>

            <button
              onClick={() => {
                if (inList) {
                  setOptimisticInList(false);
                  onRemoveFromList(item.id);
                  showToast(`Removed "${item.title}" from My List`, 'info', { label: 'Undo', onClick: () => { setOptimisticInList(true); onAddToList(item); } });
                } else {
                  setOptimisticInList(true);
                  onAddToList(item);
                  showToast(`Added "${item.title}" to My List`);
                }
              }}
              className="p-2.5 rounded-full border-2 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(42,42,42,0.8)', borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
              aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}
              aria-pressed={inList}
            >
              {inList ? <Check size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
