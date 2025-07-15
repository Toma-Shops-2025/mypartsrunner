import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'Method Not Allowed',
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const { user_id, runner_id, store_id } = params;
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (user_id) {
      query = query.eq('user_id', user_id);
    } else if (runner_id) {
      query = query.eq('runner_id', runner_id);
    } else if (store_id) {
      query = query.eq('store_id', store_id);
    } else {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'user_id, runner_id, or store_id is required' }),
      };
    }

    const { data: orders, error } = await query;

    if (error) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ orders }),
    };
  } catch (err: any) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
}; 