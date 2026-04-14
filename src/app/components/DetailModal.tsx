import { X, Play, Plus, Volume2, VolumeX, ThumbsUp, Check } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getVideoForItem, fallbackVideos } from '../utils/videoPool';
import { useToast } from './Toast';
import type { ContentItem } from '../types';

interface DetailModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onAddToList: (item: ContentItem) => void;
  onRemoveFromList: (itemId: string) => void;
  isInMyList: (itemId: string) => boolean;
  isLiked: (itemId: string) => boolean;
  onToggleLike: (item: ContentItem) => void;
  moreLikeThis: ContentItem[];
  onItemClick: (item: ContentItem) => void;
  onPlayClick: (item: ContentItem) => void;
  autoplayEnabled: boolean;
}

export function DetailModal({
  item, onClose, onAddToList, onRemoveFromList, isInMyList, isLiked, onToggleLike,
  moreLikeThis, onItemClick, onPlayClick, autoplayEnabled,
}: DetailModalProps) {
  const { showToast } = useToast();
  const [isMuted, setIsMuted] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [videoError, setVideoError] = useState(false);
  const [urlIndex, setUrlIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const videoUrls = useMemo(() => [
    getVideoForItem(item?.id ?? ''),
    ...fallbackVideos,
  ], [item?.id]);

  const currentVideoUrl = videoUrls[urlIndex];

  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      el.setAttribute('muted', '');
      el.muted = true;
    }
  }, []);

  useEffect(() => {
    setVideoError(false);
    setUrlIndex(0);
  }, [item?.id]);

  useEffect(() => {
    if (item) {
      document.body.classList.add('modal-open');
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => { document.body.classList.remove('modal-open'); };
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  const handleVideoError = () => {
    if (urlIndex < videoUrls.length - 1) {
      setUrlIndex(i => i + 1);
    } else {
      setVideoError(true);
    }
  };

  if (!item) return null;
  const inList = isInMyList(item.id);
  const isSeries = item.type === 'series';
  const currentSeasonData = item.seasons?.find(s => s.seasonNumber === selectedSeason);

  const getFullDescription = () => {
    if (item.description) return item.description;
    const map: Record<string, string> = {
      Action: 'An adrenaline-pumping adventure filled with explosive sequences and heart-stopping moments.',
      'Sci-Fi': 'A mind-bending journey into the future where technology and humanity collide.',
      Drama: 'A powerful story of human emotion, struggle, and triumph.',
      Thriller: 'A gripping tale of suspense that will keep you on the edge of your seat.',
      Comedy: 'A hilarious romp with razor-sharp wit and perfect comedic timing.',
    };
    return map[item.genre] || 'An unforgettable viewing experience combining stellar performances with masterful storytelling.';
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ background: 'var(--overlay)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="min-h-screen py-8 flex items-start justify-center px-4">
        <div
          ref={dialogRef}
          className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 theme-transition"
          style={{ background: 'var(--bg-modal)', boxShadow: 'var(--shadow)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Video / Hero */}
          <div className="relative aspect-video bg-black">
            {/* Thumbnail always shown as base — prevents black screen while video loads */}
            <ImageWithFallback
              src={item.thumbnail}
              alt={`Cover image for ${item.title}`}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Video overlaid on top — pointer-events:none so it never blocks button clicks */}
            {autoplayEnabled && !videoError && (
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
                aria-label={`Preview video for ${item.title}`}
              >
                <track kind="captions" label="English" srcLang="en" src="/captions/placeholder.vtt" default />
              </video>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" aria-hidden="true" />

            {/* Close */}
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: 'rgba(20,20,20,0.8)' }}
              aria-label="Close detail view"
            >
              <X size={22} className="text-white" aria-hidden="true" />
            </button>

            {/* Video unavailable message */}
            {autoplayEnabled && videoError && (
              <div
                className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded text-xs"
                style={{ background: 'rgba(0,0,0,0.75)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
                role="status"
                aria-live="polite"
              >
                Preview unavailable — showing cover image
              </div>
            )}

            {/* Volume */}
            {autoplayEnabled && !videoError && (
              <button
                onClick={() => setIsMuted(m => !m)}
                className="absolute bottom-4 right-4 z-20 p-2 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ background: 'rgba(20,20,20,0.8)', borderColor: 'rgba(255,255,255,0.3)' }}
                aria-label={isMuted ? 'Unmute preview' : 'Mute preview'}
                aria-pressed={!isMuted}
              >
                {isMuted
                  ? <VolumeX size={18} className="text-white" aria-hidden="true" />
                  : <Volume2 size={18} className="text-white" aria-hidden="true" />
                }
              </button>
            )}

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
              <h2 id="modal-title" className="text-3xl md:text-4xl font-black text-white mb-3">{item.title}</h2>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded border border-dashed text-sm"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.3)' }}
                aria-label={`Recommendation: ${item.reason}`}
              >
                <span aria-hidden="true">↗</span>
                {item.reason}
              </div>

              <div className="flex items-center gap-3" role="group" aria-label="Title actions">
                <button
                  onClick={e => { e.stopPropagation(); onPlayClick(item); }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ background: '#ffffff', color: '#000000' }}
                  aria-label={`Play ${item.title}`}
                >
                  <Play size={18} className="fill-current" aria-hidden="true" />
                  Play
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (inList) {
                      onRemoveFromList(item.id);
                      showToast(`Removed "${item.title}" from My List`, 'info', { label: 'Undo', onClick: () => onAddToList(item) });
                    } else {
                      onAddToList(item);
                      showToast(`Added "${item.title}" to My List`);
                    }
                  }}
                  className="p-2.5 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ background: 'rgba(42,42,42,0.8)', borderColor: 'rgba(100,100,100,0.6)', color: '#fff' }}
                  aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}
                  aria-pressed={inList}
                >
                  {inList ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onToggleLike(item);
                    showToast(isLiked(item.id) ? `Removed like from "${item.title}"` : `You liked "${item.title}"`, 'success');
                  }}
                  className="p-2.5 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{
                    background: isLiked(item.id) ? 'rgba(70,211,105,0.25)' : 'rgba(42,42,42,0.8)',
                    borderColor: isLiked(item.id) ? '#46d369' : 'rgba(100,100,100,0.6)',
                    color: isLiked(item.id) ? '#46d369' : '#fff',
                  }}
                  aria-label={isLiked(item.id) ? `Unlike ${item.title}` : `Like ${item.title}`}
                  aria-pressed={isLiked(item.id)}
                >
                  <ThumbsUp size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-sm mt-4 flex-wrap" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {item.rating && (
                  <span className="font-bold" style={{ color: '#46d369' }}>{Math.round(item.rating * 10)}% Match</span>
                )}
                <span>{item.year}</span>
                {isSeries && <span>{item.seasons?.length} Season{(item.seasons?.length || 0) > 1 ? 's' : ''}</span>}
                {item.maturityRating && (
                  <span className="px-1.5 py-0.5 border text-xs rounded" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
                    {item.maturityRating}
                  </span>
                )}
                <span className="px-1.5 py-0.5 border text-xs rounded" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>HD</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 theme-transition" style={{ background: 'var(--bg-modal)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left */}
              <div className="md:col-span-2 space-y-6">
                <p className="text-base leading-relaxed theme-transition" style={{ color: 'var(--text-secondary)' }}>
                  {getFullDescription()}
                </p>

                {/* Episodes */}
                {isSeries && item.seasons && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold theme-transition" style={{ color: 'var(--text-primary)' }}>Episodes</h3>
                    <div>
                      <label htmlFor="season-select" className="sr-only">Select season</label>
                      <select
                        id="season-select"
                        value={selectedSeason}
                        onChange={e => setSelectedSeason(Number(e.target.value))}
                        className="px-4 py-2 rounded border text-sm focus-visible:outline-none focus-visible:ring-2 theme-transition"
                        style={{
                          background: 'var(--input-bg)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--input-text)',
                        }}
                      >
                        {item.seasons.map(s => (
                          <option key={s.seasonNumber} value={s.seasonNumber}>Season {s.seasonNumber}</option>
                        ))}
                      </select>
                    </div>
                    <ul className="space-y-2 max-h-72 overflow-y-auto pr-1" role="list" aria-label={`Season ${selectedSeason} episodes`}>
                      {currentSeasonData?.episodes.map(ep => (
                        <li key={ep.episodeNumber}>
                          <button
                            className="w-full flex gap-3 p-3 rounded border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 theme-transition hover:brightness-110"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                            aria-label={`Play episode ${ep.episodeNumber}: ${ep.title}, ${ep.duration}`}
                          >
                            <div className="flex-shrink-0 w-24 h-14 rounded overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                              <ImageWithFallback src={ep.thumbnail} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-sm theme-transition" style={{ color: 'var(--text-primary)' }}>
                                  {ep.episodeNumber}. {ep.title}
                                </span>
                                <span className="text-xs ml-2 flex-shrink-0 theme-transition" style={{ color: 'var(--text-muted)' }}>
                                  {ep.duration}
                                </span>
                              </div>
                              <p className="text-xs line-clamp-2 theme-transition" style={{ color: 'var(--text-muted)' }}>
                                {ep.description}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* More Like This */}
                {moreLikeThis.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold theme-transition" style={{ color: 'var(--text-primary)' }}>More Like This</h3>
                    <ul className="grid grid-cols-3 gap-3" role="list" aria-label="More like this">
                      {moreLikeThis.slice(0, 6).map(sim => (
                        <li key={sim.id}>
                          <button
                            className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 rounded-md"
                            onClick={() => onItemClick(sim)}
                            aria-label={`View details for ${sim.title}`}
                          >
                            <div className="relative aspect-video rounded overflow-hidden mb-2 border theme-transition" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                              <ImageWithFallback src={sim.thumbnail} alt={`Thumbnail for ${sim.title}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={28} className="fill-white text-white" aria-hidden="true" />
                              </div>
                            </div>
                            <div className="font-medium text-xs line-clamp-1 theme-transition" style={{ color: 'var(--text-primary)' }}>{sim.title}</div>
                            <div className="text-xs theme-transition" style={{ color: 'var(--text-muted)' }}>{sim.year}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right */}
              <div className="space-y-4">
                {item.cast && item.cast.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 theme-transition" style={{ color: 'var(--text-muted)' }}>Cast:</h3>
                    <ul className="space-y-2" role="list">
                      {item.cast.map((m, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-hover)' }}>
                            <ImageWithFallback src={m.image} alt={m.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium text-xs theme-transition" style={{ color: 'var(--text-primary)' }}>{m.name}</div>
                            <div className="text-xs theme-transition" style={{ color: 'var(--text-muted)' }}>{m.role}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.director && (
                  <div>
                    <span className="text-xs theme-transition" style={{ color: 'var(--text-muted)' }}>Director: </span>
                    <span className="text-xs font-medium theme-transition" style={{ color: 'var(--text-primary)' }}>{item.director}</span>
                  </div>
                )}
                <div>
                  <span className="text-xs theme-transition" style={{ color: 'var(--text-muted)' }}>Genre: </span>
                  <span className="text-xs font-medium theme-transition" style={{ color: 'var(--text-primary)' }}>{item.genre}</span>
                </div>
                {item.maturityRating && (
                  <div>
                    <span className="text-xs theme-transition" style={{ color: 'var(--text-muted)' }}>Rating: </span>
                    <span className="px-1.5 py-0.5 border text-xs rounded theme-transition" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                      {item.maturityRating}
                    </span>
                  </div>
                )}

                {/* Recommendation Transparency */}
                <div className="mt-2 pt-4 border-t theme-transition" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="text-sm font-semibold mb-3 theme-transition" style={{ color: 'var(--text-muted)' }}>
                    Why We Recommend This
                  </h3>
                  <ul className="space-y-2.5" aria-label="Recommendation reasons">
                    <li className="flex items-start gap-2 text-xs theme-transition" style={{ color: 'var(--text-secondary)' }}>
                      <span className="mt-px" aria-hidden="true">🎬</span>
                      <span>Matches your <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.genre}</span> viewing history</span>
                    </li>
                    {item.rating && (
                      <li className="flex items-start gap-2 text-xs theme-transition" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-px" aria-hidden="true">⭐</span>
                        <span>Critically acclaimed — <span className="font-semibold" style={{ color: 'var(--success)' }}>{Math.round(item.rating * 10)}% match score</span></span>
                      </li>
                    )}
                    <li className="flex items-start gap-2 text-xs theme-transition" style={{ color: 'var(--text-secondary)' }}>
                      <span className="mt-px" aria-hidden="true">👥</span>
                      <span>Popular with viewers who enjoy similar {item.type === 'series' ? 'series' : 'films'}</span>
                    </li>
                    {item.director && (
                      <li className="flex items-start gap-2 text-xs theme-transition" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-px" aria-hidden="true">🎥</span>
                        <span>You may enjoy <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.director}</span>'s work</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2 text-xs pt-2 border-t italic theme-transition" style={{ borderColor: 'var(--border)', color: 'var(--reason-text)' }}>
                      <span className="mt-px" aria-hidden="true">↗</span>
                      <span>{item.reason}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
