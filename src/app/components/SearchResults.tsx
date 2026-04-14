import { Search } from 'lucide-react';
import { ContentCard } from './ContentCard';
import type { ContentItem } from '../types';

interface SearchResultsProps {
  results: ContentItem[];
  query: string;
  onSearchChange: (q: string) => void;
  onItemClick: (item: ContentItem) => void;
  onAddToList: (item: ContentItem) => void;
  onRemoveFromList: (itemId: string) => void;
  isInMyList: (itemId: string) => boolean;
  onPlayClick: (item: ContentItem) => void;
  autoplayEnabled: boolean;
}

export function SearchResults({
  results, query, onSearchChange, onItemClick, onAddToList, onRemoveFromList, isInMyList, onPlayClick, autoplayEnabled,
}: SearchResultsProps) {
  const suggestions = ['Action', 'Sci-Fi', 'Drama', 'Thriller', 'Comedy'];

  return (
    <div className="px-4 md:px-8 py-6" style={{ paddingTop: '5rem' }}>
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-xl font-bold theme-transition" style={{ color: 'var(--text-primary)' }}>
          Search results for
        </h2>
        <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>"{query}"</span>
      </div>

      <p
        aria-live="polite"
        aria-atomic="true"
        className="text-sm mb-4 theme-transition"
        style={{ color: 'var(--text-muted)' }}
      >
        {results.length === 0
          ? 'No results found'
          : `${results.length} ${results.length === 1 ? 'result' : 'results'} found`
        }
      </p>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: 'var(--text-muted)' }}>
          <Search size={56} strokeWidth={1} aria-hidden="true" />
          <p className="text-lg font-medium">No results for "{query}"</p>
          <p className="text-sm">Check your spelling, or try one of these quick searches:</p>
          <ul className="flex flex-wrap gap-2 justify-center mt-1" role="list" aria-label="Suggested genres">
            {suggestions.map(g => (
              <li key={g}>
                <button
                  onClick={() => onSearchChange(g)}
                  className="px-3 py-1 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  aria-label={`Search for ${g}`}
                >
                  {g}
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs mt-1">Or try a director, cast member, or title keyword. Press Esc to clear quickly.</p>
        </div>
      ) : (
        <ul
          role="list"
          aria-label={`Search results for ${query}`}
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}
        >
          {results.map(item => (
            <li key={item.id}>
              <ContentCard
                item={item}
                onItemClick={onItemClick}
                onAddToList={onAddToList}
                onRemoveFromList={onRemoveFromList}
                isInMyList={isInMyList}
                onPlayClick={onPlayClick}
                autoplayEnabled={autoplayEnabled}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
