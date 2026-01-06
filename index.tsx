import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ensure props interface allows children
interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-red-500 flex flex-col items-center justify-center p-8 font-mono z-50 relative">
          <h1 className="text-4xl font-bold mb-4 border-b border-red-900 pb-2">SYSTEM FAILURE</h1>
          <p className="text-gray-400 mb-8">Critical error detected in the neural interface.</p>
          <div className="bg-[#111] p-4 rounded border border-red-900/30 w-full max-w-2xl overflow-auto mb-8">
            <pre className="text-xs">{this.state.error?.toString()}</pre>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900 rounded transition-all uppercase tracking-widest"
          >
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  // Use console error instead of throw to ensure we can see it in dev tools
  console.error("CRITICAL: Could not find root element to mount to");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}