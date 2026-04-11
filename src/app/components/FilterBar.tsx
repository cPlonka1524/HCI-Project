import { LayoutGrid, List } from 'lucide-react';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Comedy', 'Animation', 'Fantasy'] as const;
type Genre = typeof GENRES[number];
type SortOption = 'recommended' | 'newest' | 'top-rated';

interface FilterBarProps {
  selectedGenre: Genre;
  onGenreChange: (genre: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  resultCount: number;
}

export function FilterBar({
  selectedGenre, onGenreChange,
  sortOption, onSortChange,
  viewMode, onViewModeChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Genre chips */}
        <div role="group" aria-label="Filter by genre" className="flex flex-wrap gap-2 flex-1">
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              aria-pressed={selectedGenre === genre}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2"
              style={selectedGenre === genre
                ? { background: 'var(--chip-active-bg)', color: 'var(--chip-active-text)', borderColor: 'var(--chip-active-bg)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties
                : { background: 'transparent', color: 'var(--chip-inactive-text)', borderColor: 'var(--chip-inactive-border)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties
              }
            >
              {genre}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div role="group" aria-label="View mode" className="flex gap-1">
          <button
            onClick={() => onViewModeChange('grid')}
            aria-pressed={viewMode === 'grid'}
            aria-label="Grid view"
            className="p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={viewMode === 'grid'
              ? { background: 'var(--chip-active-bg)', color: 'var(--chip-active-text)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties
              : { background: 'transparent', color: 'var(--text-muted)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties
            }
          >
            <LayoutGrid size={16} aria-hidden="true" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            aria-pressed={viewMode === 'list'}
            aria-label="List view"
            className="p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={viewMode === 'list'
              ? { background: 'var(--chip-active-bg)', color: 'var(--chip-active-text)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties
              : { background: 'transparent', color: 'var(--text-muted)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties
            }
          >
            <List size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort-select" className="sr-only">Sort by</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={e => onSortChange(e.target.value)}
            className="px-3 py-1.5 rounded border text-xs focus-visible:outline-none focus-visible:ring-2 theme-transition"
            style={{
              background: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--input-text)',
              '--tw-ring-color': 'var(--border-focus)',
            } as React.CSSProperties}
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest First</option>
            <option value="top-rated">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="text-xs theme-transition"
        style={{ color: 'var(--text-muted)' }}
      >
        {resultCount} {resultCount === 1 ? 'title' : 'titles'} found
      </p>
    </div>
  );
}
