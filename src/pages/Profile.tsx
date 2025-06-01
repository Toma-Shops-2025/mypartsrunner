import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Package, Heart, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import EditProfileModal from '@/components/EditProfileModal';
import MessagesModal from '@/components/MessagesModal';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleEditProfile = () => {
    if (user) {
      setShowEditModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleCreateListing = () => {
    if (user) {
      window.location.href = '/sell';
    } else {
      setShowAuthModal(true);
    }
  };

  const handleViewMessages = () => {
    if (user) {
      setShowMessagesModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {!user && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome to TomaShops™!</h3>
                <p className="text-blue-700 mb-4">Sign in or create an account to access your profile and start selling.</p>
                <Button onClick={() => setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-700">
                  Sign In / Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">
                    {user ? user.user_metadata?.full_name || 'Not provided' : 'Please sign in'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user ? user.email : 'Please sign in'}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={handleEditProfile}>
                    <Settings className="w-4 h-4 mr-2" />
                    {user ? 'Edit Profile' : 'Sign In to Edit'}
                  </Button>
                  {user && (
                    <Button variant="outline" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Messages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">{user ? 'No new messages' : 'Sign in to view messages'}</p>
                <Button onClick={handleViewMessages}>
                  {user ? 'View Messages' : 'Sign In to View'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>My Listings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">{user ? 'No active listings' : 'Sign in to view listings'}</p>
                <Button onClick={handleCreateListing}>
                  {user ? 'Create Listing' : 'Sign In to Sell'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Favorites</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{user ? 'No favorites yet' : 'Sign in to view favorites'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <MessagesModal
        isOpen={showMessagesModal}
        onClose={() => setShowMessagesModal(false)}
      />
    </AppLayout>
  );
};

export default Profile;