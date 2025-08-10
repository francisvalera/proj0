export interface OrderEmailItem {
  productId: string;
  productName?: string | null;
  price: number;
  quantity: number;
}

export interface OrderEmail {
  orderId: string;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress?: {
    province?: string | null;
    city?: string | null;
    barangay?: string | null;
    street?: string | null;
  } | null;
  items: OrderEmailItem[];
}