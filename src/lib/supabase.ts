import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://emhtuxvyetcfzyreegrb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtaHR1eHZ5ZXRjZnp5cmVlZ3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNzE5NzMsImV4cCI6MjA2MjY0Nzk3M30.4VmWiopTXxwdWwlu0U5Q29kMnIusIG-nrZZ8X4DWK7Y';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };