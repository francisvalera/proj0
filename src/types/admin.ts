export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
};

export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  brandId?: string;
  categoryId?: string;
  createdAt: string; // ISO
  status: ProductStatus;
};

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "CANCELLED" | "REFUNDED";

export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  number: string;
  customerId: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
};