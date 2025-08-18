import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables - running in demo mode:');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Missing');
  console.warn('Please create a .env file with proper Supabase credentials for full functionality');
}

// Create Supabase client (with fallback values for demo mode)
const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co', 
  supabaseKey || 'demo-key', 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Test connection on startup
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully');
  }
});

export { supabase };