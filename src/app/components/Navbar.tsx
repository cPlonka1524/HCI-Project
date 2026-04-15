import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Sun, Moon, User, ChevronDown, HelpCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const GENRES = ['Action', 'Sci-Fi', 'Drama', 'Thriller', 'Comedy'] as const;
type Genre = typeof GENRES[number] | 'All';

interface NavbarProps {
  activeTab: 'home' | 'movies' | 'series' | 'mylist';
  onTabChange: (tab: 'home' | 'movies' | 'series' | 'mylist') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  autoplayEnabled: boolean;
  onAutoplayToggle: () => void;
  myListCount: number;
  selectedGenre?: Genre;
  onGenreChange?: (g: Genre) => void;
  onHelpOpen?: () => void;
}

const TABS = [
  { id: 'home' as const, label: 'Home' },
  { id: 'movies' as const, label: 'Movies' },
  { id: 'series' as const, label: 'Series' },
  { id: 'mylist' as const, label: 'My List' },
];

export function Navbar({ activeTab, onTabChange, searchQuery, onSearchChange, autoplayEnabled, onAutoplayToggle, myListCount, selectedGenre, onGenreChange, onHelpOpen }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [genreMenuOpen, setGenreMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const genreMenuRef = useRef<HTMLLIElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    onSearchChange('');
  }, [onSearchChange]);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  // Close genre menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (genreMenuRef.current && !genreMenuRef.current.contains(e.target as Node)) {
        setGenreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 theme-transition"
      style={{ background: 'var(--bg-nav)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center justify-between px-4 md:px-8 h-14">
        {/* Logo */}
        <div className="flex items-center gap-6 md:gap-8">
          <button
            onClick={() => onTabChange('home')}
            aria-label="Netflix – Go to Home"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded select-none"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', 'Arial Black', Impact, sans-serif",
                fontSize: '1.85rem',
                letterSpacing: '0.04em',
                color: '#E50914',
                lineHeight: 1,
                display: 'block',
              }}
            >
              NETFLIX
            </span>
          </button>

          {/* Nav tabs */}
          <nav aria-label="Main navigation">
            <ul role="menubar" className="flex items-center gap-1" aria-label="Main menu">
              {TABS.map(tab => (
                <li key={tab.id} role="none">
                  <button
                    role="menuitem"
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                    onClick={() => onTabChange(tab.id)}
                    className="relative px-3 py-1.5 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 hidden sm:block"
                    style={{
                      color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                      background: activeTab === tab.id ? 'var(--bg-hover)' : 'transparent',
                      '--tw-ring-color': 'var(--border-focus)',
                    } as React.CSSProperties}
                  >
                    {tab.label}
                    {tab.id === 'mylist' && myListCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1"
                        style={{ background: 'var(--accent)' }}
                        aria-label={`${myListCount} items in My List`}
                      >
                        {myListCount > 99 ? '99+' : myListCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}

              {/* Genre quick-jump — Nielsen #7 Flexibility & Efficiency */}
              {onGenreChange && (
                <li role="none" className="relative hidden sm:block" ref={genreMenuRef}>
                  <button
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={genreMenuOpen}
                    onClick={() => setGenreMenuOpen(v => !v)}
                    title="Jump directly to a genre"
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      color: selectedGenre && selectedGenre !== 'All' ? 'var(--text-primary)' : 'var(--text-muted)',
                      background: selectedGenre && selectedGenre !== 'All' ? 'var(--bg-hover)' : 'transparent',
                      '--tw-ring-color': 'var(--border-focus)',
                    } as React.CSSProperties}
                  >
                    {selectedGenre && selectedGenre !== 'All' ? selectedGenre : 'Genres'}
                    <ChevronDown size={13} aria-hidden="true" style={{ transform: genreMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                  </button>
                  {genreMenuOpen && (
                    <ul
                      role="menu"
                      aria-label="Browse by genre"
                      className="absolute top-full left-0 mt-1 rounded-lg shadow-xl overflow-hidden z-50"
                      style={{ background: 'var(--bg-modal)', border: '1px solid var(--border)', minWidth: '130px' }}
                    >
                      {(['All', ...GENRES] as Genre[]).map(g => (
                        <li key={g} role="none">
                          <button
                            role="menuitem"
                            onClick={() => {
                              onGenreChange(g);
                              if (activeTab !== 'home') onTabChange('home');
                              setGenreMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2"
                            style={{
                              color: selectedGenre === g ? '#E50914' : 'var(--text-secondary)',
                              background: selectedGenre === g ? 'var(--bg-hover)' : 'transparent',
                              fontWeight: selectedGenre === g ? 600 : 400,
                            }}
                          >
                            {g === 'All' ? 'All Genres' : g}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    if (searchQuery) { onSearchChange(''); } // first Esc: clear text, keep open (#3)
                    else { closeSearch(); }                   // second Esc: close panel
                  }
                }}
                placeholder="Search titles, genres, directors..."
                aria-label="Search content"
                autoComplete="off"
                className="w-48 md:w-72 px-3 py-1.5 rounded text-sm focus-visible:outline-none focus-visible:ring-2 theme-transition"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)',
                  '--tw-ring-color': 'var(--border-focus)',
                } as React.CSSProperties}
              />
              <button
                onClick={closeSearch}
                aria-label="Close search"
                className="p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2"
                style={{ color: 'var(--text-muted)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              aria-expanded={searchOpen}
              className="p-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2"
              style={{ color: 'var(--text-muted)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
            >
              <Search size={18} aria-hidden="true" />
            </button>
          )}

          {/* Autoplay toggle */}
          <div className="flex items-center gap-1.5" title="Automatically play video previews when browsing">
            <span className="text-xs hidden md:block" style={{ color: 'var(--text-muted)' }}>Autoplay</span>
            <button
              role="switch"
              aria-checked={autoplayEnabled}
              aria-label={`Autoplay previews ${autoplayEnabled ? 'on' : 'off'}`}
              title={`Autoplay is ${autoplayEnabled ? 'on' : 'off'} — click to toggle`}
              onClick={onAutoplayToggle}
              className="relative w-9 h-5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: autoplayEnabled ? 'var(--accent)' : 'var(--bg-hover)',
                '--tw-ring-color': 'var(--border-focus)',
              } as React.CSSProperties}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform bg-white"
                style={{ transform: autoplayEnabled ? 'translateX(16px)' : 'translateX(0)' }}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={{ color: 'var(--text-muted)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
          >
            {theme === 'dark'
              ? <Sun size={18} aria-hidden="true" />
              : <Moon size={18} aria-hidden="true" />
            }
          </button>

          {/* Keyboard shortcuts help — persistent icon (H10 Help & Documentation) */}
          {onHelpOpen && (
            <button
              onClick={onHelpOpen}
              aria-label="Keyboard shortcuts help"
              title="Keyboard shortcuts (?)"
              className="p-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 hidden sm:flex items-center justify-center"
              style={{ color: 'var(--text-muted)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
            >
              <HelpCircle size={18} aria-hidden="true" />
            </button>
          )}

          {/* Profile */}
          <button
            aria-label="Open profile menu"
            title="Profile"
            className="p-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={{ background: 'var(--bg-hover)', '--tw-ring-color': 'var(--border-focus)' } as React.CSSProperties}
          >
            <User size={18} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
          </button>

          {/* Mobile tabs */}
          <select
            value={activeTab}
            onChange={e => onTabChange(e.target.value as typeof activeTab)}
            aria-label="Navigate to section"
            className="sm:hidden px-2 py-1 rounded text-sm focus-visible:outline-none focus-visible:ring-2 theme-transition"
            style={{
              background: 'var(--input-bg)',
              color: 'var(--input-text)',
              border: '1px solid var(--input-border)',
              '--tw-ring-color': 'var(--border-focus)',
            } as React.CSSProperties}
          >
            {TABS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
      </div>
    </header>
  );
}
