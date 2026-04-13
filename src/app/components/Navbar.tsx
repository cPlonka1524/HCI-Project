import { useState, useRef, useEffect } from 'react';
import { Search, X, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface NavbarProps {
  activeTab: 'home' | 'movies' | 'series' | 'mylist';
  onTabChange: (tab: 'home' | 'movies' | 'series' | 'mylist') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  autoplayEnabled: boolean;
  onAutoplayToggle: () => void;
}

const TABS = [
  { id: 'home' as const, label: 'Home' },
  { id: 'movies' as const, label: 'Movies' },
  { id: 'series' as const, label: 'Series' },
  { id: 'mylist' as const, label: 'My List' },
];

export function Navbar({ activeTab, onTabChange, searchQuery, onSearchChange, autoplayEnabled, onAutoplayToggle }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    onSearchChange('');
  };

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
                    className="px-3 py-1.5 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 hidden sm:block"
                    style={{
                      color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                      background: activeTab === tab.id ? 'var(--bg-hover)' : 'transparent',
                      '--tw-ring-color': 'var(--border-focus)',
                    } as React.CSSProperties}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
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
                onKeyDown={e => e.key === 'Escape' && closeSearch()}
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
