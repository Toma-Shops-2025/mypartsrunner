// Simple test for Stripe Connect function
// Run this in your browser console to test the function

async function testStripeConnect() {
  try {
    console.log('Testing Stripe Connect function...');
    
    const response = await fetch('/.netlify/functions/stripe-connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'check_account', 
        userId: '123e4567-e89b-12d3-a456-426614174000' 
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Run the test
testStripeConnect(); 