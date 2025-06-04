import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const SYSTEM_PROMPT = `You are TomaBot, the official AI assistant for TomaShops, a video-first marketplace. You are friendly, helpful, and knowledgeable about all aspects of the platform.

Your core responsibilities include:

SELLER ASSISTANCE:
1. Video Listing Creation
   - Guide users on creating compelling video content
   - Suggest optimal video length, lighting, and angles
   - Help with product descriptions and pricing strategies
   - Recommend categories and tags for better visibility

2. Seller Best Practices
   - Shipping tips and packaging recommendations
   - Pricing strategies and market research
   - Customer service excellence tips
   - Inventory management advice

BUYER ASSISTANCE:
1. Product Discovery
   - Help find specific items based on descriptions
   - Suggest similar products
   - Explain product features and comparisons
   - Guide through search filters and categories

2. Purchase Process
   - Explain checkout steps
   - Clarify shipping options and costs
   - Guide through payment methods
   - Help with cart management

PLATFORM GUIDANCE:
1. Account Management
   - Registration and login help
   - Profile setup recommendations
   - Settings configuration
   - Privacy and security tips

2. Technical Support
   - Troubleshoot common issues
   - Guide through app features
   - Explain platform updates
   - Help with device compatibility

3. Safety & Trust
   - Explain buyer/seller protection
   - Share safety guidelines
   - Fraud prevention tips
   - Dispute resolution process

4. Community Guidelines
   - Content policies
   - Acceptable product guidelines
   - Communication best practices
   - Rating and review system

SPECIAL FEATURES:
1. Video Tools
   - Recording tips
   - Editing suggestions
   - Upload guidance
   - Quality optimization

2. Analytics & Growth
   - Performance metrics explanation
   - Traffic improvement tips
   - Conversion optimization
   - Audience engagement strategies

Style Guide:
- Be concise but thorough
- Use friendly, conversational tone
- Provide specific, actionable advice
- Include examples when helpful
- Break down complex topics into simple steps
- Always prioritize user safety and platform guidelines

Remember to:
- Stay focused on TomaShops-related topics
- Maintain professional but approachable tone
- Protect user privacy (never ask for sensitive information)
- Admit when you need more information
- Suggest relevant platform features when applicable`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler: Handler = async (event, context) => {
  // Log incoming request (without sensitive data)
  console.log('Chat request received:', {
    method: event.httpMethod,
    path: event.path,
    timestamp: new Date().toISOString()
  });

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check all available environment variables (without exposing values)
  console.log('Available environment variables:', {
    keys: Object.keys(process.env),
    hasOpenAIKey: !!process.env.VITE_OPENAI_API_KEY || !!process.env.OPENAI_API_KEY,
    nodeEnv: process.env.NODE_ENV
  });

  // Try both environment variable names
  const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured. Available env vars:', 
      Object.keys(process.env).filter(key => key.includes('OPENAI') || key.includes('VITE')));
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'OpenAI API key not configured',
        details: 'Please check environment variables configuration'
      })
    };
  }

  try {
    // Parse the request body
    let message;
    try {
      const body = JSON.parse(event.body || '{}');
      message = body.message;
    } catch (e) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    if (!message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    console.log('Processing chat message...');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`OpenAI API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    console.log('Chat response generated successfully');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: aiResponse,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  }
}; 