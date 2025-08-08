import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Use environment variables with fallback to project configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vzynutgjvlwccpubbkwg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6eW51dGd2bHdjY3B1YmJrd2ciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0NzA3MTk3MywiZXhwIjoyMDYyNjQ3OTczfQ.4VmWiopTXxwdWwlu0U5Q29kMnIusIG-nrZZ8X4DWK7Y';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };