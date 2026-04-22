// ============================================================
// Nihong Finds — Centralized Type Definitions
// Mirror dari database schema di src/utils/baseAI/schema.ts
// ============================================================

// --- Enums ---

export type OrderStatus =
  | 'WAITING_DP'
  | 'PURCHASED'
  | 'SHIPPED_TO_INDO'
  | 'SHIPPED_LOCAL'
  | 'COMPLETED';

export type ProductCondition = 'NEW' | 'USED';

// --- Database Row Types ---

export interface Profile {
  id: string; // FK → auth.users
  full_name: string | null;
  whatsapp_number: string | null;
  address: string | null;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price_jpy: number;
  estimated_weight_gram: number;
  stock_quantity: number;
  is_active: boolean;
  condition: ProductCondition;
  image_urls: string[];
  category_id: string | null;
  updated_at: string;
}

/** Product dengan relasi categories yang di-join */
export interface ProductWithCategory extends Product {
  categories: Pick<Category, 'name' | 'slug'> | null;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  dp_amount: number;
  shipping_fee: number;
  total_weight_gram: number;
  exchange_rate: number;
  midtrans_order_id_dp: string | null;
  midtrans_order_id_pelunasan: string | null;
  tracking_number_intl: string | null;
  tracking_number_local: string | null;
  courier_name: string | null;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  item_name: string;
  price_jpy: number;
  quantity: number;
  image_url: string | null;
  source_url: string | null;
}

export interface MidtransWebhookLog {
  id: string;
  midtrans_order_id: string;
  transaction_status: string;
  fraud_status: string | null;
  gross_amount: number;
  raw_payload: Record<string, unknown>; // JSONB
  processed_at: string;
}

// --- UI / Component Props Types ---

export interface ProductCardProps {
  id: string;
  name: string;
  price_jpy: number;
  image_url: string | null;
  category_name?: string;
  condition: ProductCondition;
}

// --- Checkout / Server Action Types ---

export interface CheckoutItem {
  product_id: string;
  quantity: number;
}

export interface CheckoutResult {
  order_id: string;
  total_amount: number;
}

export interface CheckoutPayload {
  items: CheckoutItem[];
  exchange_rate: number;
  shipping_fee: number;
  dp_amount: number;
}

// --- Midtrans Webhook Payload ---

export interface MidtransWebhookPayload {
  order_id: string;
  transaction_status: 'settlement' | 'pending' | 'deny' | 'cancel' | 'expire';
  fraud_status?: 'accept' | 'challenge' | 'deny';
  gross_amount: string;
  payment_type: string;
  [key: string]: unknown;
}

// --- Order Status Label Helper ---

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  WAITING_DP: 'Menunggu DP',
  PURCHASED: 'Sudah Dibeli',
  SHIPPED_TO_INDO: 'Dalam Pengiriman ke Indonesia',
  SHIPPED_LOCAL: 'Dalam Pengiriman Lokal',
  COMPLETED: 'Selesai',
};
