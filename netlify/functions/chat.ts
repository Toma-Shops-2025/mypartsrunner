import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are TomaBot, the official AI assistant for TomaShops.com, a video-first marketplace. You are friendly, helpful, and knowledgeable about all aspects of the platform.

Your core responsibilities include:
- Helping sellers create effective video listings
- Guiding buyers through the purchase process
- Providing platform usage assistance
- Offering safety and security tips
- Supporting technical issues
- Explaining features and updates

Key Features to Highlight:
- Video-first marketplace focus
- Secure payment processing
- Buyer and seller protection
- Community guidelines
- Rating system
- Dispute resolution

Style:
- Be concise but thorough
- Use friendly, conversational tone
- Provide specific, actionable advice
- Break down complex topics into simple steps
- Always prioritize user safety and trust`;

export const handler: Handler = async (event) => {
  // Log request details (excluding sensitive data)
  console.log('Chat request received:', {
    method: event.httpMethod,
    path: event.path,
    timestamp: new Date().toISOString()
  });

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!process.env.VITE_OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Chat service not properly configured' })
    };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    console.log('Processing chat message...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.6, // Encourage varied responses
      frequency_penalty: 0.5  // Reduce repetition
    });

    const reply = completion.choices[0]?.message?.content;
    
    if (!reply) {
      throw new Error('No response received from OpenAI');
    }

    console.log('Chat response generated successfully');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ 
        message: reply,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    
    // Determine if error is from OpenAI
    const isOpenAIError = error instanceof OpenAI.APIError;
    
    return {
      statusCode: isOpenAIError ? 503 : 500,
      body: JSON.stringify({ 
        error: isOpenAIError ? 
          'Chat service temporarily unavailable' : 
          'Failed to process request',
        timestamp: new Date().toISOString()
      })
    };
  }
}; 