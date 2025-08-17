import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SupabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      console.log('Testing Supabase connection...');
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      // Test 1: Basic connection
      const { data: healthData, error: healthError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (healthError) {
        setTestResult(`❌ Connection Failed: ${healthError.message}`);
        console.error('Health check failed:', healthError);
        return;
      }
      
      // Test 2: Auth system
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        setTestResult(`❌ Auth Failed: ${authError.message}`);
        console.error('Auth check failed:', authError);
        return;
      }
      
      setTestResult(`✅ Supabase Working! Session: ${authData.session ? 'Active' : 'None'}`);
      console.log('Supabase test successful:', { healthData, authData });
      
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
      console.error('Supabase test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    setTestResult('Testing registration...');
    
    try {
      const testEmail = `test${Date.now()}@test.com`;
      const testPassword = 'test123456';
      
      console.log('Attempting to register test user:', testEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: 'Test User',
            role: 'customer'
          }
        }
      });
      
      if (error) {
        setTestResult(`❌ Registration Failed: ${error.message}`);
        console.error('Registration failed:', error);
        return;
      }
      
      setTestResult(`✅ Registration Successful! User ID: ${data.user?.id}`);
      console.log('Registration successful:', data);
      
    } catch (error: any) {
      setTestResult(`❌ Registration Error: ${error.message}`);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🔧 Supabase Debug Test</CardTitle>
        <CardDescription>
          Let's test if Supabase is working properly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </Button>
          
          <Button 
            onClick={testRegistration} 
            disabled={loading}
            variant="secondary"
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Registration'}
          </Button>
        </div>
        
        {testResult && (
          <div className="p-3 bg-gray-100 rounded text-sm">
            <pre>{testResult}</pre>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
          <p><strong>Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseTest; 