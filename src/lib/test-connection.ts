import { supabase } from './supabase';

async function testConnection() {
  try {
    // Try to get users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (userError) {
      console.error('❌ Error connecting to users table:', userError.message);
      return;
    }

    console.log('✅ Successfully connected to users table!');
    console.log('Found users:', users);

    // Try to get products
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (productError) {
      console.error('❌ Error connecting to products table:', productError.message);
      return;
    }

    console.log('✅ Successfully connected to products table!');
    console.log('Found products:', products);

    console.log('🎉 All database connections working!');
  } catch (error) {
    console.error('❌ Something went wrong:', error);
  }
}

// Run the test
testConnection(); 