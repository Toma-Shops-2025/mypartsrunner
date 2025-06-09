import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
  try {
    console.log('Creating database functions...');
    
    // Read and execute the SQL functions
    const functionsSQL = await Bun.file('./supabase/functions/create_ad_tables.sql').text();
    const { error: functionsError } = await supabase.rpc('exec_sql', { sql: functionsSQL });
    
    if (functionsError) {
      throw functionsError;
    }

    console.log('Creating ad system tables...');
    
    // Create tables using our functions
    const { error: locationsError } = await supabase.rpc('create_ad_locations_table');
    if (locationsError) throw locationsError;

    const { error: bookingsError } = await supabase.rpc('create_ad_bookings_table');
    if (bookingsError) throw bookingsError;

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 