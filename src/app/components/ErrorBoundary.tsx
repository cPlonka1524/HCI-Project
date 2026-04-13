import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white text-center p-8">
          <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '2.5rem', color: '#E50914', letterSpacing: '0.04em' }}>
            NETFLIX
          </span>
          <h1 className="text-2xl font-bold mt-6 mb-2">Something went wrong</h1>
          <p className="text-white/60 text-sm mb-8 max-w-sm">
            An unexpected error occurred. Please reload the page to continue watching.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded font-bold text-black hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: '#fff' }}
          >
            Reload Page
          </button>
          {this.state.error && (
            <p className="mt-6 text-xs text-white/30 font-mono max-w-md break-all">
              {this.state.error.message}
            </p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
