import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <Logo className="mb-4" />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Link
            to="/stores"
            className="text-lg font-medium hover:text-primary"
            onClick={onClose}
          >
            Find Stores
          </Link>
          <Link
            to="/how-it-works"
            className="text-lg font-medium hover:text-primary"
            onClick={onClose}
          >
            How It Works
          </Link>
          <Link
            to="/become-runner"
            className="text-lg font-medium hover:text-primary"
            onClick={onClose}
          >
            Become a Runner
          </Link>
          <Link
            to="/merchant"
            className="text-lg font-medium hover:text-primary"
            onClick={onClose}
          >
            For Merchants
          </Link>

          <div className="border-t pt-4 mt-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block text-lg font-medium hover:text-primary mb-4"
                  onClick={onClose}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block text-lg font-medium hover:text-primary mb-4"
                  onClick={onClose}
                >
                  Orders
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link to="/signin" onClick={onClose}>
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 