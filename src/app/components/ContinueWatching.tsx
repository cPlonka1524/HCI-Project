import { Play, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { ContentItem, WatchProgress } from '../types';

interface ContinueWatchingProps {
  items: WatchProgress[];
  allContent: ContentItem[];
  onItemClick: (item: ContentItem) => void;
  onPlayClick: (item: ContentItem) => void;
}

export function ContinueWatching({ items, allContent, onItemClick, onPlayClick }: ContinueWatchingProps) {
  const resolved = items
    .map(p => ({ progress: p, item: allContent.find(c => c.id === p.itemId) }))
    .filter((r): r is { progress: WatchProgress; item: ContentItem } => !!r.item);

  if (resolved.length === 0) return null;

  return (
    <section aria-labelledby="continue-watching-heading">
      <h2
        id="continue-watching-heading"
        className="text-lg font-bold mb-3 theme-transition"
        style={{ color: 'var(--text-primary)' }}
      >
        Continue Watching
      </h2>

      <ul
        role="list"
        aria-label="Continue watching"
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
      >
        {resolved.map(({ progress, item }) => (
          <li key={item.id} style={{ flexShrink: 0, width: '220px' }}>
            <div
              className="rounded overflow-hidden border theme-transition"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', width: '220px' }}
            >
              {/* Thumbnail — fixed 16:9 size */}
              <div className="relative" style={{ width: '220px', height: '124px', flexShrink: 0 }}>
                <ImageWithFallback
                  src={item.thumbnail}
                  alt={`Thumbnail for ${item.title}`}
                  className="w-full h-full object-cover"
                />
                {/* Play overlay */}
                <button
                  onClick={() => onPlayClick(item)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 focus-visible:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={`Resume playing ${item.title}`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <Play size={18} className="fill-black text-black ml-0.5" aria-hidden="true" />
                  </div>
                </button>
              </div>

              {/* Progress bar */}
              <div
                role="progressbar"
                aria-label={`${item.title} — ${progress.progress}% watched`}
                aria-valuenow={progress.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`${progress.progress}% watched`}
                className="h-1 w-full"
                style={{ background: 'var(--bg-hover)' }}
              >
                <div
                  className="h-full"
                  style={{ width: `${progress.progress}%`, background: 'var(--accent)' }}
                />
              </div>

              {/* Info — fixed height so all cards are the same size */}
              <div className="p-2.5" style={{ height: '52px' }}>
                <div className="flex items-center justify-between gap-2 h-full">
                  <div className="min-w-0">
                    <p className="font-medium text-xs line-clamp-1 theme-transition" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </p>
                    <p className="text-xs theme-transition" style={{ color: 'var(--text-muted)', minHeight: '16px' }}>
                      {progress.episode ?? ''}
                    </p>
                  </div>
                  <button
                    onClick={() => onItemClick(item)}
                    aria-label={`View details for ${item.title}`}
                    className="flex-shrink-0 p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{ color: 'var(--text-muted)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
