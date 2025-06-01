import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://duzghrnrsgxcjodvqoiu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1emdocm5yc2d4Y2pvZHZxb2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzU1NDUsImV4cCI6MjA2MjkxMTU0NX0.WTlYbe4wiY0Hv3MaoRlF5vheDT8vU_EZCzUwPqkRWzg';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export { supabase };