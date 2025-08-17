import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  userRole: UserRole | null;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
  isAuthenticated: false,
  userRole: null,
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process for:', email);
      
      // Add timeout to the auth request
      const authPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout - please check your internet connection and try again')), 8000);
      });
      
      const { data, error } = await Promise.race([authPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Authentication error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Authentication successful, fetching profile...');
        
        // Try to fetch user profile with timeout
        try {
          const profilePromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          const profileTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Profile fetch timed out')), 5000);
          });
          
          const { data: profile, error: profileError } = await Promise.race([
            profilePromise, 
            profileTimeoutPromise
          ]) as any;

          if (profileError) {
            console.warn('Profile fetch error:', profileError);
            // Create a basic user object from auth data if profile fetch fails
            const basicUser = {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
              role: 'customer',
              createdAt: new Date().toISOString()
            };
            setUser(basicUser as any);
            console.log('Using basic user data due to profile fetch error');
          } else {
            console.log('Profile loaded successfully');
            setUser(profile);
          }
        } catch (profileError) {
          console.warn('Profile operation failed:', profileError);
          // Still proceed with basic user data
          const basicUser = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            role: 'customer',
            createdAt: new Date().toISOString()
          };
          setUser(basicUser as any);
        }

        toast({
          title: "Login successful!",
          description: "Welcome back to MyPartsRunner™."
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Temporary bypass for demo/testing purposes
      if (email === 'demo@mypartsrunner.com' && password === 'demo123') {
        console.log('Using demo account bypass');
        const demoUser = {
          id: 'demo-user-123',
          email: 'demo@mypartsrunner.com',
          name: 'Demo User',
          role: 'customer',
          createdAt: new Date().toISOString()
        };
        setUser(demoUser as any);
        toast({
          title: "Demo login successful!",
          description: "Welcome to MyPartsRunner™ Demo"
        });
        return;
      }
      
      const errorMessage = error.message || 'An error occurred during login. Please try again.';
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in database
        const profile = {
          id: data.user.id,
          email: data.user.email!,
          name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          businessName: userData.businessName || '',
          role: userData.role || 'customer',
          // createdAt will be handled by database default or trigger
        };

        // Use the service role key for profile creation during signup
        // This bypasses RLS since the user isn't fully authenticated yet
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profile]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }

        // Don't set user yet since they need to verify email
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account before signing in."
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Signed out successfully",
        description: "Come back soon!"
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };



  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile error during session check:', profileError);
            // Don't throw here, just continue without profile
            setUser(null);
          } else {
            console.log('Profile loaded successfully:', profile.email);
            setUser(profile);
          }
        } else {
          console.log('No existing session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
      } finally {
        console.log('Setting loading to false after session check');
        setLoading(false);
      }
    };

    // Check if we're in a PWA context
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true;
    
    if (isPWA) {
      console.log('Running in PWA mode - enhanced authentication persistence');
    }

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        try {
          // Enhanced handling for PWA and mobile devices
          if (session?.user && event !== 'SIGNED_OUT') {
            console.log('Processing auth state change for user:', session.user.id);
            
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!error && profile) {
              console.log('Profile found in auth state change:', profile.email);
              setUser(profile);
              
              // PWA-specific: Store auth state for offline access
              if (isPWA) {
                localStorage.setItem('pwa_auth_state', JSON.stringify({
                  userId: profile.id,
                  email: profile.email,
                  role: profile.role,
                  timestamp: Date.now()
                }));
              }
            } else {
              console.error('Profile fetch error:', error);
              // If profile doesn't exist, create a basic one for existing users
              if (event === 'SIGNED_IN') {
                console.log('Creating basic profile for new user');
                const basicProfile = {
                  id: session.user.id,
                  email: session.user.email!,
                  name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                  role: 'customer'
                };
                
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert([basicProfile]);
                  
                if (!insertError) {
                  console.log('Basic profile created successfully');
                  setUser(basicProfile as User);
                  
                  // PWA-specific: Store new profile for offline access
                  if (isPWA) {
                    localStorage.setItem('pwa_auth_state', JSON.stringify({
                      userId: basicProfile.id,
                      email: basicProfile.email,
                      role: basicProfile.role,
                      timestamp: Date.now()
                    }));
                  }
                } else {
                  console.error('Failed to create basic profile:', insertError);
                  setUser(null);
                }
              } else {
                console.log('No profile found and not a sign-in event');
                setUser(null);
              }
            }
          } else {
            console.log('No session or signed out, clearing user');
            setUser(null);
            
            // PWA-specific: Clear offline auth state
            if (isPWA) {
              localStorage.removeItem('pwa_auth_state');
            }
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          setUser(null);
        } finally {
          console.log('Setting loading to false after auth state change');
          setLoading(false);
        }
      }
    );

    // Mobile-specific: Handle app visibility changes for auth state sync
    const handleVisibilityChange = () => {
      if (!document.hidden && isPWA) {
        console.log('App became visible, re-syncing auth state');
        // Re-sync auth state when PWA becomes visible
        getSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Fallback timeout to ensure loading never stays true indefinitely
    const fallbackTimeout = setTimeout(() => {
      console.log('Fallback timeout triggered - forcing loading to false');
      setLoading(false);
    }, 10000); // 10 second maximum loading time

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserProfile,
        isAuthenticated: !!user,
        userRole: user?.role || null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
