import { useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">
            {error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={resetErrorBoundary}
            className="btn-primary"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
} 