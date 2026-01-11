import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border-2 border-red-200 p-8 text-center">
            <div className="text-6xl mb-6 text-red-500">!</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Oops! Something went wrong</h1>
            <p className="text-slate-600 mb-6">
              We encountered an unexpected error. Your data is safe.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}