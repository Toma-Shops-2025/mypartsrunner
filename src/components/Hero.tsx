import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

export function Hero() {
  return (
    <div className="relative isolate px-6 pt-6 lg:px-8">
      <div className="mx-auto max-w-7xl py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <div className="mb-12">
            <Logo 
              className="mx-auto" 
              imageClassName="w-[1200px] max-w-[90vw] h-auto" 
              showText={false}
            />
          </div>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Get parts and hardware delivered to your door or job site
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Fast, reliable delivery from local stores to keep your project moving.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/stores">Find Stores</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/how-it-works">
                  How it works
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 