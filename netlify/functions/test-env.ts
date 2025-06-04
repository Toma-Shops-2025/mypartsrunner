import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Get all environment variables (without exposing sensitive values)
  const envVars = Object.keys(process.env).reduce((acc, key) => {
    acc[key] = key.includes('KEY') || key.includes('SECRET') ? '[HIDDEN]' : process.env[key];
    return acc;
  }, {} as Record<string, string | undefined>);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      environment: process.env.NODE_ENV,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasViteOpenAIKey: !!process.env.VITE_OPENAI_API_KEY,
      availableVars: Object.keys(envVars),
      vars: envVars
    })
  };
}; 