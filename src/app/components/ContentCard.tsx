import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Play, Plus, Check, ChevronDown, Volume2, VolumeX, ThumbsUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getVideoForItem, fallbackVideos } from '../utils/videoPool';
import { useToast } from './Toast';
import type { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  onItemClick: (item: ContentItem) => void;
  onAddToList: (item: ContentItem) => void;
  onRemoveFromList: (itemId: string) => void;
  isInMyList: (itemId: string) => boolean;
  onPlayClick: (item: ContentItem) => void;
  autoplayEnabled: boolean;
  onDismiss?: (itemId: string) => void;
}

export function ContentCard({
  item, onItemClick, onAddToList, onRemoveFromList, isInMyList, onPlayClick, autoplayEnabled, onDismiss,
}: ContentCardProps) {
  const { showToast } = useToast();
  const [hovered, setHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [urlIndex, setUrlIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [optimisticInList, setOptimisticInList] = useState<boolean | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inListFromParent = isInMyList(item.id);
  // Use optimistic state if set, otherwise use parent state
  const inList = optimisticInList !== null ? optimisticInList : inListFromParent;

  const videoUrls = useMemo(() => [getVideoForItem(item.id), ...fallbackVideos], [item.id]);
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

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setHovered(true), 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHovered(false);
    setUrlIndex(0);
    setVideoError(false);
  };

  // Clear optimistic state when parent state updates
  useEffect(() => {
    setOptimisticInList(null);
  }, [inListFromParent]);

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base card */}
      <button
        className="w-full text-left rounded overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={() => onItemClick(item)}
        aria-label={`${item.title}, ${item.year}, ${item.genre}${item.rating ? `, ${Math.round(item.rating * 10)}% match` : ''}`}
      >
        <div className="relative aspect-video rounded overflow-hidden" style={{ background: 'var(--bg-card)' }}>
          <ImageWithFallback src={item.thumbnail} alt="" className="w-full h-full object-cover" />
          {item.badge && (
            <div
              className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: 'var(--accent)', color: '#fff' }}
              aria-label={item.badge}
            >
              {item.badge}
            </div>
          )}
        </div>
        <div className="mt-1.5 px-0.5">
          <p className="text-xs font-medium line-clamp-1 theme-transition" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
          <p className="text-xs theme-transition" style={{ color: 'var(--text-muted)' }}>{item.year} · {item.genre}</p>
          {item.reason && (
            <p className="text-xs mt-0.5 line-clamp-1 italic" style={{ color: 'var(--reason-text, #46d369)' }}>↗ {item.reason}</p>
          )}
        </div>
      </button>

      {/* Hover preview popup */}
      {hovered && (
        <div
          role="tooltip"
          className="absolute z-40 left-1/2 -translate-x-1/2 w-72 rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
          style={{ top: 'calc(100% + 8px)', background: 'var(--bg-modal)', boxShadow: 'var(--shadow)' }}
        >
          {/* Video or thumbnail */}
          <div className="relative aspect-video bg-black">
            {autoplayEnabled && !videoError ? (
              <video
                key={currentVideoUrl}
                ref={setVideoRef}
                src={currentVideoUrl}
                autoPlay
                loop
                playsInline
                preload="auto"
                poster={item.thumbnail}
                className="w-full h-full object-cover"
                onCanPlay={e => {
                  e.currentTarget.muted = true;
                  e.currentTarget.play().catch(() => {});
                }}
                onError={handleVideoError}
                aria-label={`Preview video for ${item.title}`}
              >
                <track kind="captions" label="English" srcLang="en" src="/captions/placeholder.vtt" default />
              </video>
            ) : (
              <ImageWithFallback src={item.thumbnail} alt={`Thumbnail for ${item.title}`} className="w-full h-full object-cover" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" aria-hidden="true" />

            {/* Volume toggle */}
            {autoplayEnabled && !videoError && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  setIsMuted(m => {
                    if (videoRef.current) videoRef.current.muted = !m;
                    return !m;
                  });
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ background: 'rgba(20,20,20,0.8)', borderColor: 'rgba(255,255,255,0.3)' }}
                aria-label={isMuted ? 'Unmute preview' : 'Mute preview'}
                aria-pressed={!isMuted}
              >
                {isMuted
                  ? <VolumeX size={14} className="text-white" aria-hidden="true" />
                  : <Volume2 size={14} className="text-white" aria-hidden="true" />
                }
              </button>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="font-bold text-sm mb-1 theme-transition" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
            <div className="flex items-center gap-2 text-xs mb-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
              {item.rating && (
                <span className="font-bold" style={{ color: '#46d369' }}>{Math.round(item.rating * 10)}% Match</span>
              )}
              <span>{item.year}</span>
              <span>{item.genre}</span>
              {item.maturityRating && (
                <span className="px-1 py-0.5 border rounded text-xs" style={{ borderColor: 'var(--border)' }}>{item.maturityRating}</span>
              )}
            </div>

            <div className="flex items-center gap-2" role="group" aria-label="Card actions">
              <button
                onClick={e => { e.stopPropagation(); onPlayClick(item); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ background: '#ffffff' }}
                aria-label={`Play ${item.title}`}
              >
                <Play size={14} className="fill-black text-black ml-0.5" aria-hidden="true" />
              </button>

              <button
                onClick={e => {
                  e.stopPropagation();
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
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff', background: 'rgba(42,42,42,0.8)' }}
                aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}
                aria-pressed={inList}
              >
                {inList ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
              </button>

              <button
                onClick={e => {
                  e.stopPropagation();
                  const next = !liked;
                  setLiked(next);
                  showToast(next ? `Liked "${item.title}"` : `Removed like for "${item.title}"`, 'info');
                }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  borderColor: liked ? '#46d369' : 'rgba(255,255,255,0.5)',
                  color: liked ? '#46d369' : '#fff',
                  background: 'rgba(42,42,42,0.8)',
                }}
                aria-label={liked ? `Unlike ${item.title}` : `Like ${item.title}`}
                aria-pressed={liked}
                title={liked ? 'Unlike' : 'Like'}
              >
                <ThumbsUp size={14} aria-hidden="true" />
              </button>

              <button
                onClick={e => { e.stopPropagation(); onItemClick(item); }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ml-auto"
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff', background: 'rgba(42,42,42,0.8)' }}
                aria-label={`More info about ${item.title}`}
              >
                <ChevronDown size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
