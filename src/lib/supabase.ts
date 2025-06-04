import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced debugging
console.log('Supabase Configuration Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey,
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
  mode: import.meta.env.MODE,
  envVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration:', {
    url: !!supabaseUrl,
    key: !!supabaseKey,
    env: Object.keys(import.meta.env)
  });
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  console.error('Invalid Supabase URL format:', e);
  throw new Error('Invalid Supabase URL format');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'tomashops-auth-token',
    storage: window.localStorage
  }
});

// Test database connection
(async () => {
  try {
    console.log('Testing Supabase connection...');

    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('Auth Check:', {
      hasSession: !!authData.session,
      error: authError?.message
    });

    // Test database access
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });

    if (dbError) {
      console.error('Database connection error:', {
        error: dbError.message,
        details: dbError.details,
        hint: dbError.hint
      });
      return;
    }

    console.log('Database connection successful:', {
      productsCount: products,
      timestamp: new Date().toISOString()
    });

    // Test RLS policies
    const { data: testProduct, error: rlsError } = await supabase
      .from('products')
      .select('id, title')
      .limit(1)
      .single();

    console.log('RLS Policy Check:', {
      hasData: !!testProduct,
      error: rlsError?.message,
      hint: rlsError?.hint
    });

  } catch (error) {
    console.error('Supabase connection test failed:', error);
  }
})();