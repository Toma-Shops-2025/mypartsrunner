import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Spinning circle */}
      <div
        className={cn(
          'border-t-2 border-primary rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
      
      {/* Logo in center */}
      <div className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        {
          'w-4 h-4': size === 'sm',
          'w-6 h-6': size === 'md',
          'w-8 h-8': size === 'lg',
        }
      )}>
        <img src="/logo.svg" alt="Loading..." className="w-full h-full" />
      </div>
    </div>
  );
} 