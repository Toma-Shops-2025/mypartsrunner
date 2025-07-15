import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'Method Not Allowed',
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { order_id, runner_id } = data;
    if (!order_id || !runner_id) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'order_id and runner_id are required' }),
      };
    }

    // Update the order with the runner_id and set status to 'confirmed'
    const { data: order, error } = await supabase
      .from('orders')
      .update({ runner_id, status: 'confirmed', updated_at: new Date().toISOString() })
      .eq('id', order_id)
      .select()
      .single();

    if (error || !order) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: error?.message || 'Failed to assign runner' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ order }),
    };
  } catch (err: any) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
}; 