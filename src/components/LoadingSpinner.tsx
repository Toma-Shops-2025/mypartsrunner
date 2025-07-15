import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-muted-foreground', className)}
      size={size}
    />
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size={32} />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function LoadingButton({ loading, children, className, ...props }: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        loading && 'cursor-not-allowed opacity-70',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size={16} className="mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
} 