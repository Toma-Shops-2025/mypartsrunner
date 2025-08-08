import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      storeId,
      externalOrderId,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryZipCode,
      deliveryLatitude,
      deliveryLongitude,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      notes
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'storeId',
      'externalOrderId',
      'customerName',
      'customerEmail',
      'customerPhone',
      'deliveryAddress',
      'deliveryCity',
      'deliveryState',
      'deliveryZipCode',
      'items',
      'subtotal',
      'total'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Validate store exists
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id, merchantId, name')
      .eq('id', storeId)
      .eq('isActive', true)
      .single();

    if (storeError || !store) {
      return res.status(404).json({ error: 'Store not found or inactive' });
    }

    // Create external order
    const { data: externalOrder, error: orderError } = await supabase
      .from('external_orders')
      .insert({
        merchantId: store.merchantId,
        storeId,
        externalOrderId,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryCity,
        deliveryState,
        deliveryZipCode,
        deliveryLatitude: deliveryLatitude || null,
        deliveryLongitude: deliveryLongitude || null,
        items,
        subtotal,
        tax: tax || 0,
        deliveryFee: deliveryFee || 0,
        total,
        notes: notes || null,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating external order:', orderError);
      return res.status(500).json({ error: 'Failed to create order' });
    }

    // Send notification to merchant
    await supabase
      .from('notifications')
      .insert({
        userId: store.merchantId,
        title: 'New External Order',
        message: `New delivery request from ${customerName} for ${store.name}`,
        type: 'info',
        relatedEntityType: 'external_order',
        relatedEntityId: externalOrder.id
      });

    // Return success response
    return res.status(201).json({
      success: true,
      orderId: externalOrder.id,
      externalOrderId: externalOrder.externalOrderId,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error processing external order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 