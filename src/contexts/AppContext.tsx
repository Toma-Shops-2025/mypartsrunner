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
  clearAuthCache: () => Promise<void>;
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
  clearAuthCache: async () => {},
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
      setLoading(true);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout - please check your connection')), 30000)
      );
      
      // Sign in with Supabase with timeout
      const authPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const { data, error } = await Promise.race([authPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Authentication error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Authentication successful, fetching profile...');
        
        // Try to fetch user profile
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.warn('Profile fetch error:', profileError);
            // Create a basic user object from auth data if profile fetch fails
            const basicUser = {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
              firstname: data.user.user_metadata?.firstname || data.user.email?.split('@')[0] || 'User',
              lastname: data.user.user_metadata?.lastname || '',
              role: data.user.user_metadata?.role || 'customer',
              createdat: new Date().toISOString()
            };
            setUser(basicUser as any);
            console.log('Using basic user data due to profile fetch error');
          } else {
            console.log('Profile loaded successfully');
            setUser(profile);
          }
        } catch (profileError) {
          console.warn('Profile operation failed:', profileError);
          // Still proceed with basic user data from user_metadata
          const basicUser = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            firstname: data.user.user_metadata?.firstname || data.user.email?.split('@')[0] || 'User',
            lastname: data.user.user_metadata?.lastname || '',
            role: data.user.user_metadata?.role || 'customer',
            createdat: new Date().toISOString()
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
      
      let errorMessage = error.message || 'Invalid email or password. Please try again.';
      
      // Handle specific error cases
      if (error.status === 429) {
        errorMessage = 'Too many login attempts. Please wait a few minutes and try again.';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a few minutes before trying again.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Login request timed out. Please check your connection and try again.';
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = 'Unable to connect to authentication server. Please check your internet connection.';
      } else if (error.message?.includes('environment variables')) {
        errorMessage = 'Authentication service is not properly configured. Please contact support.';
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Clear potentially corrupted auth cache on login failure
      await clearAuthCache();
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Try to create user profile in database, but don't fail if table doesn't exist
        try {
          const profile = {
            id: data.user.id,
            email: data.user.email!,
            name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            businessName: userData.businessName || '',
            role: userData.role || 'customer',
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .insert([profile]);

          if (profileError) {
            console.warn('Profile creation error (table may not exist):', profileError);
            // Don't throw - user data is stored in user_metadata
          }
        } catch (profileError) {
          console.warn('Profile creation failed (database not set up):', profileError);
          // Continue anyway - user data is in user_metadata
        }

        toast({
          title: "Registration successful!",
          description: "You can now sign in with your credentials."
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = error.message;
      
      // Provide helpful error messages
      if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Try logging in instead.';
      } else if (error.message?.includes('weak password')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message?.includes('invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.status === 429) {
        errorMessage = 'Too many signup attempts. Please wait a few minutes and try again.';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a few minutes before trying again.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      // Ensure loading state is always reset, even if there's an error
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Regular Supabase signout
      await supabase.auth.signOut();
      setUser(null);
      
      // Clear all cached auth data
      await clearAuthCache();
      
      toast({
        title: "Signed out successfully",
        description: "Come back soon!"
      });
    } catch (error: any) {
      console.warn('Signout error, forcing local logout:', error);
      // Force local logout even if Supabase fails
      setUser(null);
      await clearAuthCache();
      toast({
        title: "Signed out",
        description: "You have been logged out."
      });
    }
  };

  const clearAuthCache = async () => {
    try {
      console.log('Clearing authentication cache...');
      
      // Clear localStorage auth data
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-' + (import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'unknown') + '-auth-token');
      localStorage.removeItem('pwa_auth_state');
      
      // Clear sessionStorage auth data
      sessionStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('sb-' + (import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'unknown') + '-auth-token');
      
      // Clear any IndexedDB auth data (common in PWAs)
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases();
          for (const db of databases) {
            if (db.name?.includes('supabase') || db.name?.includes('auth')) {
              indexedDB.deleteDatabase(db.name);
            }
          }
        } catch (e) {
          console.warn('Could not clear IndexedDB:', e);
        }
      }
      
      console.log('Authentication cache cleared');
    } catch (error) {
      console.warn('Error clearing auth cache:', error);
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
          // Clear corrupted session data
          await clearAuthCache();
          setUser(null);
          setLoading(false);
          return;
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
        clearAuthCache,
        isAuthenticated: !!user,
        userRole: user?.role || null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
