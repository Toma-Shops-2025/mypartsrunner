import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <SEO 
        title="Page Not Found - TomaShops"
        description="The page you're looking for doesn't exist."
      />
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-muted-foreground">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/search">
                <Search className="mr-2 h-4 w-4" />
                Search Listings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 