import { useState } from 'react';
import { Check } from 'lucide-react';

const GENRES = ['Action', 'Sci-Fi', 'Drama', 'Thriller', 'Comedy'] as const;
export type Genre = typeof GENRES[number];

interface OnboardingProps {
  onComplete: (preferred: Genre[]) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [selected, setSelected] = useState<Genre[]>([]);

  const toggle = (g: Genre) =>
    setSelected(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const handleDone = () => {
    localStorage.setItem('netflix-onboarded', 'true');
    localStorage.setItem('netflix-preferred-genres', JSON.stringify(selected));
    onComplete(selected);
  };

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome — set your preferences"
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ background: 'var(--bg-modal)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <span
            style={{
              fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
              fontSize: '2rem',
              color: '#E50914',
              letterSpacing: '0.04em',
            }}
          >
            NETFLIX
          </span>
          <h2 className="text-xl font-bold mt-3 mb-1" style={{ color: 'var(--text-primary)' }}>
            What do you like to watch?
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Pick your favourite genres and we'll personalise your recommendations.
          </p>
        </div>

        {/* Genre tiles */}
        <div className="grid grid-cols-3 gap-3 mb-8" role="group" aria-label="Select genres">
          {GENRES.map(g => {
            const active = selected.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggle(g)}
                aria-pressed={active}
                className="relative py-4 rounded-lg font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  background: active ? 'rgba(229,9,20,0.2)' : 'var(--bg-card)',
                  border: `2px solid ${active ? '#E50914' : 'var(--border)'}`,
                  color: active ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {active && (
                  <span className="absolute top-1.5 right-1.5">
                    <Check size={12} color="#E50914" aria-hidden="true" />
                  </span>
                )}
                {g}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDone}
            disabled={selected.length === 0}
            className="w-full py-3 rounded-lg font-bold text-sm transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-40"
            style={{ background: '#E50914', color: '#fff' }}
            aria-label={selected.length === 0 ? 'Select at least one genre to continue' : 'Save preferences and continue'}
          >
            {selected.length === 0 ? 'Pick at least one genre' : `Continue with ${selected.length} genre${selected.length > 1 ? 's' : ''}`}
          </button>
          <button
            onClick={() => { localStorage.setItem('netflix-onboarded', 'true'); onComplete([]); }}
            className="w-full py-2 rounded-lg text-sm transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ color: 'var(--text-muted)' }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
