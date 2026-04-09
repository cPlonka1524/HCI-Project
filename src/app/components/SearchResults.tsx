import { Search } from 'lucide-react';
import { ContentCard } from './ContentCard';
import type { ContentItem } from '../types';

interface SearchResultsProps {
  results: ContentItem[];
  query: string;
  onItemClick: (item: ContentItem) => void;
  onAddToList: (item: ContentItem) => void;
  onRemoveFromList: (itemId: string) => void;
  isInMyList: (itemId: string) => boolean;
  onPlayClick: (item: ContentItem) => void;
  autoplayEnabled: boolean;
}

export function SearchResults({
  results, query, onItemClick, onAddToList, onRemoveFromList, isInMyList, onPlayClick, autoplayEnabled,
}: SearchResultsProps) {
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
          <p className="text-lg font-medium">No titles match your search</p>
          <p className="text-sm">Try searching for a movie, series, genre, or director</p>
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
