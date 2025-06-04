import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'tomaadkins@tomashops.com';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const getSession = async () => {
      try {
        console.log('Checking auth session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
          return;
        }

        if (mounted) {
          const currentUser = session?.user ?? null;
          console.log('Auth session state:', {
            hasUser: !!currentUser,
            email: currentUser?.email,
            isAdmin: currentUser?.email === ADMIN_EMAIL
          });
          
          setUser(currentUser);
          setIsAdmin(currentUser?.email === ADMIN_EMAIL);
        }
      } catch (err) {
        console.error('Auth session error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', { event, hasSession: !!session });
        
        if (mounted) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          setIsAdmin(currentUser?.email === ADMIN_EMAIL);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      console.log('Sign in successful:', {
        hasUser: !!data.user,
        isAdmin: data.user?.email === ADMIN_EMAIL
      });

      return { error: null };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      return { error: err as AuthError };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      console.log('Sign up successful:', {
        hasUser: !!data.user,
        needsEmailConfirmation: !data.session
      });

      return { error: null };
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      return { error: err as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        return;
      }

      setUser(null);
      setIsAdmin(false);
      console.log('Sign out successful');
    } catch (err) {
      console.error('Unexpected sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};