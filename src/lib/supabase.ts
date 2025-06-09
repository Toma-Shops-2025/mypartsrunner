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
    detectSessionInUrl: true
  }
});

// Initialize ad system tables
export async function initializeAdSystem() {
  try {
    console.log('Initializing ad system...');

    // Create ad_locations table
    const { error: locationsError } = await supabase.rpc('create_ad_locations_table');
    if (locationsError) {
      console.error('Error creating ad_locations table:', locationsError);
      return;
    }

    // Create ad_location_bookings table
    const { error: bookingsError } = await supabase.rpc('create_ad_bookings_table');
    if (bookingsError) {
      console.error('Error creating ad_location_bookings table:', bookingsError);
      return;
    }

    // Insert initial ad locations
    const { error: insertError } = await supabase
      .from('ad_locations')
      .upsert([
        {
          name: 'video-feed-top',
          description: 'Premium ad space at the top of the video feed',
          type: 'video-feed',
          dimensions: '1200x300',
          price_per_day: 99.99,
          max_duration_days: 30
        },
        {
          name: 'video-feed-middle',
          description: 'High-visibility ad space in the middle of the video feed',
          type: 'video-feed',
          dimensions: '1200x300',
          price_per_day: 79.99,
          max_duration_days: 30
        },
        {
          name: 'video-feed-bottom',
          description: 'Effective ad space at the bottom of the video feed',
          type: 'video-feed',
          dimensions: '1200x300',
          price_per_day: 59.99,
          max_duration_days: 30
        }
      ], { onConflict: 'name' });

    if (insertError) {
      console.error('Error inserting initial ad locations:', insertError);
      return;
    }

    console.log('Ad system initialized successfully');
  } catch (error) {
    console.error('Error initializing ad system:', error);
  }
}

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

    // Initialize ad system
    await initializeAdSystem();

  } catch (error) {
    console.error('Supabase connection test failed:', error);
  }
})();