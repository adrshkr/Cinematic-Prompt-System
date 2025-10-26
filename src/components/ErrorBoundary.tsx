// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  declare props: Props;
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200">
            <h2 className="font-bold text-lg mb-2">Something went wrong.</h2>
            <p>An unexpected error occurred. Please try refreshing the page.</p>
            <details className="mt-4 text-sm">
                <summary>Error Details</summary>
                <pre className="mt-2 p-2 bg-red-200/50 dark:bg-red-800/50 rounded overflow-auto">
                    {this.state.error?.toString()}
                </pre>
            </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;