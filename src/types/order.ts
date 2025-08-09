import { Order } from '@prisma/client';

// Define the structure of the shipping address
export interface ShippingAddress extends Record<string, unknown> {
  street: string;
  barangay: string;
  city: string;
  province: string;
}

// Extend Prisma's Order type but replace shippingAddress with a typed object
export interface OrderWithDetails extends Omit<Order, 'shippingAddress'> {
  shippingAddress: ShippingAddress;
}
