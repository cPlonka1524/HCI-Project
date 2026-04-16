import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface KeyboardHelpProps {
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Space', 'K'], description: 'Play / Pause (in player)' },
  { keys: ['M'], description: 'Mute / Unmute (in player)' },
  { keys: ['Ctrl+K'], description: 'Open search' },
  { keys: ['Ctrl+Backspace', 'Cmd+Backspace'], description: 'Clear active search results' },
  { keys: ['Esc'], description: 'Close modal or exit player' },
  { keys: ['?'], description: 'Show / hide this help panel' },
  { keys: ['Tab'], description: 'Navigate between elements' },
  { keys: ['Enter'], description: 'Activate focused element' },
];

export function KeyboardHelp({ onClose }: KeyboardHelpProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into modal on open (WCAG 2.4.3)
  useEffect(() => {
    setTimeout(() => closeRef.current?.focus(), 50);
  }, []);

  // Close on Escape — prevents keyboard trap (WCAG 2.1.2)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="w-full max-w-sm rounded-xl shadow-2xl p-6"
        style={{ background: 'var(--bg-modal)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Keyboard Shortcuts
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close keyboard shortcuts"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Shortcuts list */}
        <ul className="space-y-3" role="list">
          {SHORTCUTS.map(({ keys, description }) => (
            <li key={description} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</span>
              <div className="flex items-center gap-1.5">
                {keys.map((k, i) => (
                  <span key={k} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>}
                    <kbd
                      className="px-2 py-0.5 rounded text-xs font-mono font-semibold"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {k}
                    </kbd>
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Press <kbd className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>?</kbd> anywhere to toggle this panel
        </p>
      </div>
    </div>
  );
}
