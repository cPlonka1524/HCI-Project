import { useEffect, useRef, useState } from 'react';
import { Play, Plus, Check, ChevronDown, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useToast } from './Toast';
import type { ContentItem } from '../types';

interface ContentSectionProps {
  title: string;
  items: ContentItem[];
  onItemClick: (item: ContentItem) => void;
  onAddToList: (item: ContentItem) => void;
  onRemoveFromList: (itemId: string) => void;
  isInMyList: (itemId: string) => boolean;
  onPlayClick: (item: ContentItem) => void;
  autoplayEnabled: boolean;
  viewMode?: 'grid' | 'list';
  onDismiss?: (itemId: string) => void;
}

export function ContentSection({
  title, items, onItemClick, onAddToList, onRemoveFromList, isInMyList, onPlayClick, autoplayEnabled, viewMode = 'grid', onDismiss,
}: ContentSectionProps) {
  const { showToast } = useToast();
  const gridRef = useRef<HTMLUListElement | null>(null);
  const [columns, setColumns] = useState(1);
  const [visibleRows, setVisibleRows] = useState(1);
  const [focusedCardMode, setFocusedCardMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (viewMode !== 'grid' || focusedCardMode) return;
    const el = gridRef.current;
    if (!el) return;

    const MIN_CARD_WIDTH = 150;
    const GAP = 12; // Tailwind gap-3 => 0.75rem
    const updateColumns = () => {
      const width = el.clientWidth;
      const next = Math.max(1, Math.floor((width + GAP) / (MIN_CARD_WIDTH + GAP)));
      setColumns(next);
    };

    updateColumns();
    const observer = new ResizeObserver(updateColumns);
    observer.observe(el);
    window.addEventListener('resize', updateColumns);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateColumns);
    };
  }, [viewMode, focusedCardMode]);

  useEffect(() => {
    setVisibleRows(1);
    setFocusedCardMode(false);
    setActiveIndex(0);
  }, [title, items, viewMode]);

  if (items.length === 0) return null;

  const sectionId = `section-${title.replace(/\s+/g, '-').toLowerCase() || 'content'}`;
  const visibleCount = columns * visibleRows;
  const displayedItems = viewMode === 'grid' ? items.slice(0, visibleCount) : items;
  const hasMoreRows = viewMode === 'grid' && displayedItems.length < items.length;
  const canCollapse = viewMode === 'grid' && items.length > columns && !focusedCardMode;
  const activeItem = items[activeIndex] || items[0];
  const prevItem = items[(activeIndex - 1 + items.length) % items.length];
  const nextItem = items[(activeIndex + 1) % items.length];

  const showFocusedToggle = viewMode === 'grid' && title;

  return (
    <section aria-labelledby={title ? sectionId : undefined}>
      {title && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id={sectionId}
            className="text-lg font-bold theme-transition"
            style={{ color: 'var(--text-primary)' }}
          >
            {title} ({items.length})
          </h2>
          {showFocusedToggle && (
            <div className="flex items-center gap-2" title="Switch between row view and focused card view">
              <span className="text-xs hidden md:block" style={{ color: 'var(--text-muted)' }}>Focused cards</span>
              <button
                role="switch"
                aria-checked={focusedCardMode}
                aria-label={`${title} focused cards ${focusedCardMode ? 'on' : 'off'}`}
                title={`${focusedCardMode ? 'Disable' : 'Enable'} focused card layout for ${title}`}
                onClick={() => {
                  setFocusedCardMode(v => {
                    const next = !v;
                    // When returning to row layout, always show exactly one full row.
                    if (!next) setVisibleRows(1);
                    return next;
                  });
                }}
                className="relative w-9 h-5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2"
                style={{
                  background: focusedCardMode ? 'var(--accent)' : 'var(--bg-hover)',
                  '--tw-ring-color': 'var(--border-focus)',
                } as React.CSSProperties}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform bg-white"
                  style={{ transform: focusedCardMode ? 'translateX(16px)' : 'translateX(0)' }}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </div>
      )}

      {viewMode === 'grid' && focusedCardMode ? (
        <div className="relative max-w-4xl mx-auto min-h-[24rem] md:min-h-[28rem]">
          {items.length > 1 && (
            <>
              <button
                onClick={() => setActiveIndex(i => (i - 1 + items.length) % items.length)}
                className="absolute left-1 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2"
                style={{ background: 'var(--bg-modal)', borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
                aria-label={`Show previous title in ${title}`}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                onClick={() => setActiveIndex(i => (i + 1) % items.length)}
                className="absolute right-1 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2"
                style={{ background: 'var(--bg-modal)', borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
                aria-label={`Show next title in ${title}`}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </>
          )}

          <div
            className="absolute inset-0 z-0 rounded-xl opacity-35 scale-[0.95] translate-y-2 overflow-hidden border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            aria-hidden="true"
          >
            <ImageWithFallback src={prevItem.thumbnail} alt="" className="w-full h-full object-cover blur-[1px]" />
          </div>
          <div
            className="absolute inset-0 z-10 rounded-xl opacity-50 scale-[0.98] translate-y-1 overflow-hidden border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            aria-hidden="true"
          >
            <ImageWithFallback src={nextItem.thumbnail} alt="" className="w-full h-full object-cover" />
          </div>

          <article
            className="relative z-20 rounded-xl overflow-hidden border shadow-2xl"
            style={{ background: 'var(--bg-modal)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
            aria-label={`Focused card for ${activeItem.title}`}
          >
            <button
              onClick={() => onItemClick(activeItem)}
              className="w-full text-left focus-visible:outline-none focus-visible:ring-2"
              style={{ '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
              aria-label={`Open details for ${activeItem.title}`}
            >
              <div className="relative aspect-video">
                <ImageWithFallback src={activeItem.thumbnail} alt={`Poster for ${activeItem.title}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
                {activeItem.badge && (
                  <span
                    className="absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    {activeItem.badge}
                  </span>
                )}
              </div>
            </button>

            <div className="p-4 md:p-5">
              <div className="flex items-center gap-2 text-xs mb-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
                {activeItem.rating && (
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    {activeItem.rating.toFixed(1)}
                  </span>
                )}
                <span>{activeItem.year}</span>
                <span>·</span>
                <span>{activeItem.genre}</span>
                {activeItem.maturityRating && <span>· {activeItem.maturityRating}</span>}
              </div>
              <h3 className="text-xl font-bold mb-1 theme-transition" style={{ color: 'var(--text-primary)' }}>{activeItem.title}</h3>
              <p className="text-sm line-clamp-3 theme-transition" style={{ color: 'var(--text-secondary)' }}>
                {activeItem.description || 'No description available.'}
              </p>
              {activeItem.reason && (
                <p className="text-xs mt-2 italic" style={{ color: 'var(--reason-text)' }}>↗ {activeItem.reason}</p>
              )}

              <div className="mt-4 flex items-center gap-2" role="group" aria-label={`Actions for ${activeItem.title}`}>
                <button
                  onClick={() => onPlayClick(activeItem)}
                  className="px-4 h-9 rounded-md flex items-center gap-1.5 font-semibold transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2"
                  style={{ background: '#fff', color: '#000', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
                  aria-label={`Play ${activeItem.title}`}
                >
                  <Play size={15} className="fill-black text-black" aria-hidden="true" />
                  Play
                </button>
                <button
                  onClick={() => {
                    if (isInMyList(activeItem.id)) {
                      onRemoveFromList(activeItem.id);
                      showToast(`Removed "${activeItem.title}" from My List`, 'info', { label: 'Undo', onClick: () => onAddToList(activeItem) });
                    } else {
                      onAddToList(activeItem);
                      showToast(`Added "${activeItem.title}" to My List`);
                    }
                  }}
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'transparent', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
                  aria-label={isInMyList(activeItem.id) ? `Remove ${activeItem.title} from My List` : `Add ${activeItem.title} to My List`}
                  aria-pressed={isInMyList(activeItem.id)}
                >
                  {isInMyList(activeItem.id) ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                </button>
                <button
                  onClick={() => onItemClick(activeItem)}
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'transparent', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
                  aria-label={`More info about ${activeItem.title}`}
                >
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        </div>
      ) : viewMode === 'grid' ? (
        <ul
          ref={gridRef}
          role="list"
          aria-label={title || 'Content'}
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}
        >
          {displayedItems.map(item => (
            <li key={item.id}>
              <ContentCard
                item={item}
                onItemClick={onItemClick}
                onAddToList={onAddToList}
                onRemoveFromList={onRemoveFromList}
                isInMyList={isInMyList}
                onPlayClick={onPlayClick}
                autoplayEnabled={autoplayEnabled}
                onDismiss={onDismiss}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul role="list" aria-label={title || 'Content'} className="space-y-2">
          {items.map(item => {
            const inList = isInMyList(item.id);
            return (
              <li key={item.id}>
                <div
                  className="flex items-center gap-3 p-3 rounded-lg border theme-transition hover:brightness-105 transition-all"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-14 rounded overflow-hidden">
                    <ImageWithFallback src={item.thumbnail} alt={`Thumbnail for ${item.title}`} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-1 theme-transition" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                    <div className="flex items-center gap-2 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
                      <span>{item.year}</span>
                      <span>·</span>
                      <span>{item.genre}</span>
                      {item.rating && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <Star size={10} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                            {item.rating.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                    {item.reason && (
                      <p className="text-xs mt-0.5 italic line-clamp-1" style={{ color: 'var(--reason-text)' }}>↗ {item.reason}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0" role="group" aria-label={`Actions for ${item.title}`}>
                    <button
                      onClick={() => onPlayClick(item)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2"
                      style={{ background: '#ffffff', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
                      aria-label={`Play ${item.title}`}
                    >
                      <Play size={14} className="fill-black text-black ml-0.5" aria-hidden="true" />
                    </button>

                    <button
                      onClick={() => {
                        if (inList) {
                          onRemoveFromList(item.id);
                          showToast(`Removed "${item.title}" from My List`, 'info', { label: 'Undo', onClick: () => onAddToList(item) });
                        } else {
                          onAddToList(item);
                          showToast(`Added "${item.title}" to My List`);
                        }
                      }}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'transparent', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
                      aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}
                      aria-pressed={inList}
                    >
                      {inList ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                    </button>

                    <button
                      onClick={() => onItemClick(item)}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'transparent', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
                      aria-label={`More info about ${item.title}`}
                    >
                      <ChevronDown size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {canCollapse && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              if (hasMoreRows) setVisibleRows(r => r + 1);
              else setVisibleRows(1);
            }}
            className="px-4 py-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
            aria-label={hasMoreRows ? `Show more titles in ${title || 'this section'}` : `Collapse ${title || 'this section'}`}
          >
            {hasMoreRows ? 'Click to see more' : 'Collapse'}
          </button>
        </div>
      )}
    </section>
  );
}
