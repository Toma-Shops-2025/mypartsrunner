export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          address: string
          city: string
          state: string
          zip: string
          phone: string
          email: string
          hours: Json
          user_id: string
          status: 'active' | 'inactive' | 'pending'
          location: { lat: number; lng: number }
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          address: string
          city: string
          state: string
          zip: string
          phone: string
          email: string
          hours: Json
          user_id: string
          status?: 'active' | 'inactive' | 'pending'
          location: { lat: number; lng: number }
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          address?: string
          city?: string
          state?: string
          zip?: string
          phone?: string
          email?: string
          hours?: Json
          user_id?: string
          status?: 'active' | 'inactive' | 'pending'
          location?: { lat: number; lng: number }
        }
      }
      products: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          images: string[] | null;
          video_url: string | null;
          thumbnail_url: string | null;
          status: string;
          category_id: string | null;
          seller_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price: number;
          images?: string[] | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          status?: string;
          category_id?: string | null;
          seller_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          images?: string[] | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          status?: string;
          category_id?: string | null;
          seller_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      }
      orders: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          store_id: string
          runner_id: string | null
          status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled'
          total: number
          delivery_fee: number
          platform_fee: number
          delivery_address: string
          delivery_instructions: string | null
          estimated_delivery_time: string | null
          actual_delivery_time: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          store_id: string
          runner_id?: string | null
          status?: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled'
          total: number
          delivery_fee: number
          platform_fee: number
          delivery_address: string
          delivery_instructions?: string | null
          estimated_delivery_time?: string | null
          actual_delivery_time?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          store_id?: string
          runner_id?: string | null
          status?: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled'
          total?: number
          delivery_fee?: number
          platform_fee?: number
          delivery_address?: string
          delivery_instructions?: string | null
          estimated_delivery_time?: string | null
          actual_delivery_time?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          created_at: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          notes?: string | null
        }
      }
      runners: {
        Row: {
          id: string
          created_at: string
          user_id: string
          status: 'available' | 'busy' | 'offline'
          current_location: { lat: number; lng: number } | null
          rating: number
          total_deliveries: number
          vehicle_type: 'car' | 'motorcycle' | 'bicycle'
          vehicle_info: string | null
          background_check_status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          status?: 'available' | 'busy' | 'offline'
          current_location?: { lat: number; lng: number } | null
          rating?: number
          total_deliveries?: number
          vehicle_type: 'car' | 'motorcycle' | 'bicycle'
          vehicle_info?: string | null
          background_check_status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          status?: 'available' | 'busy' | 'offline'
          current_location?: { lat: number; lng: number } | null
          rating?: number
          total_deliveries?: number
          vehicle_type?: 'car' | 'motorcycle' | 'bicycle'
          vehicle_info?: string | null
          background_check_status?: 'pending' | 'approved' | 'rejected'
        }
      }
    }
  }
} 