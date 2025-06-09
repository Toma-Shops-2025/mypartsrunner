import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://duzghrnrsgxcjodvqoiu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1emdocm5yc2d4Y2pvZHZxb2l1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMzNTU0NSwiZXhwIjoyMDYyOTExNTQ1fQ.dBxtrB0ZN4Wj7qlvr9B_191d9NV4Y4-rfe2_prhfGi0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Read the SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlContent = fs.readFileSync(path.join(__dirname, '../supabase/setup.sql'), 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error setting up database:', error);
      return;
    }

    console.log('Database setup completed successfully!');
    
    // Verify the setup
    const { data: locations, error: locationsError } = await supabase
      .from('ad_locations')
      .select('*');

    if (locationsError) {
      console.error('Error verifying setup:', locationsError);
      return;
    }

    console.log('Created ad locations:', locations);

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase(); 