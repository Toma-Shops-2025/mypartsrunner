import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://duzghrnrsgxcjodvqoiu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1emdocm5yc2d4Y2pvZHZxb2l1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMzNTU0NSwiZXhwIjoyMDYyOTExNTQ1fQ.dBxtrB0ZN4Wj7qlvr9B_191d9NV4Y4-rfe2_prhfGi0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Insert ad locations
    console.log('Creating ad locations...');
    const { data, error } = await supabase
      .from('ad_locations')
      .insert([
        {
          name: 'video-feed-top',
          description: 'Premium ad space at the top of the video feed',
          type: 'video-feed',
          dimensions: '1200x300',
          price_per_day: 99.99,
          max_duration_days: 30,
          is_available: true
        },
        {
          name: 'video-feed-middle',
          description: 'High-visibility ad space in the middle of the video feed',
          type: 'video-feed',
          dimensions: '1200x300',
          price_per_day: 79.99,
          max_duration_days: 30,
          is_available: true
        },
        {
          name: 'video-feed-bottom',
          description: 'Effective ad space at the bottom of the video feed',
          type: 'video-feed',
          dimensions: '1200x300',
          price_per_day: 59.99,
          max_duration_days: 30,
          is_available: true
        }
      ])
      .select();

    if (error) {
      console.error('Failed to create ad locations:', error);
      return;
    }

    console.log('Created ad locations:', data);
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase(); 