import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';

export default function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <SEO 
        title="Server Error - TomaShops"
        description="Something went wrong on our end."
      />
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-9xl font-bold text-destructive">500</h1>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Server Error</h2>
          <p className="mt-2 text-muted-foreground">
            Sorry, something went wrong on our end. We're working on fixing it.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 