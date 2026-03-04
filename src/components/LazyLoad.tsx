/**
 * Lazy Loading Component
 * Provides lazy loading with loading states and error boundaries
 */

import { Suspense, lazy, ComponentType } from 'react';

interface LazyLoadProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
}

/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );
}

/**
 * Error fallback component
 */
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <div className="text-red-600 text-lg font-semibold mb-2">
        Failed to load component
      </div>
      <div className="text-gray-600 text-sm mb-4">
        {error.message}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
      >
        Reload Page
      </button>
    </div>
  );
}

/**
 * Lazy load a component with loading and error states
 */
export function lazyLoad<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(loader);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Lazy load with error boundary
 */
export function LazyLoadWithErrorBoundary({ loader, fallback }: LazyLoadProps) {
  const Component = lazyLoad(loader, fallback);
  
  return (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  );
}

/**
 * Simple error boundary
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Export pre-configured lazy loaders for common patterns
export const lazyLoadPage = (loader: () => Promise<{ default: ComponentType<any> }>) =>
  lazyLoad(loader, <LoadingSpinner />);

export const lazyLoadModal = (loader: () => Promise<{ default: ComponentType<any> }>) =>
  lazyLoad(loader, <div className="animate-pulse bg-gray-200 rounded-lg h-96" />);

export const lazyLoadComponent = (loader: () => Promise<{ default: ComponentType<any> }>) =>
  lazyLoad(loader, <div className="animate-pulse bg-gray-100 rounded h-20" />);
