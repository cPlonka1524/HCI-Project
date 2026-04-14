import { Play, Plus, Check, ChevronDown, Star } from 'lucide-react';
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
  if (items.length === 0) return null;

  const sectionId = `section-${title.replace(/\s+/g, '-').toLowerCase() || 'content'}`;

  return (
    <section aria-labelledby={title ? sectionId : undefined}>
      {title && (
        <h2
          id={sectionId}
          className="text-lg font-bold mb-4 theme-transition"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
      )}

      {viewMode === 'grid' ? (
        <ul
          role="list"
          aria-label={title || 'Content'}
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}
        >
          {items.map(item => (
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
    </section>
  );
}
