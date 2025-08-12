import React from "react";
import type { Order, OrderItem, Product, User } from "@prisma/client";

/**
 * Strict props for an orders table.
 * Assumes the page queried: include: { items: { include: { product: true } }, user: true }
 * Safe for Server Components (no hooks).
 */
type OrderWithRelations = Order & {
  items: (OrderItem & { product: Product })[];
  user: User | null;
};

type Props = {
  orders: OrderWithRelations[];
};

function formatCurrencyPHP(value: unknown) {
  try {
    const n =
      typeof value === "number"
        ? value
        : Number((value as any)?.toString?.() ?? Number.NaN);
    return Number.isFinite(n)
      ? n.toLocaleString("en-PH", { style: "currency", currency: "PHP" })
      : String(value ?? "");
  } catch {
    return String(value ?? "");
  }
}

function computeOrderTotal(o: OrderWithRelations) {
  return o.items.reduce((sum, it) => {
    const price = Number((it.product as any)?.price?.toString?.() ?? 0);
    return sum + price * it.quantity;
  }, 0);
}

export default function OrdersTableCard({ orders }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Order</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3 text-right">Items</th>
            <th className="p-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const total = computeOrderTotal(o);
            const created = new Date(o.createdAt).toLocaleString("en-PH", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <tr key={o.id} className="border-t">
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">{o.user?.name ?? "Guest"}</td>
                <td className="p-3">{created}</td>
                <td className="p-3 text-right">{o.items.length}</td>
                <td className="p-3 text-right">{formatCurrencyPHP(total)}</td>
              </tr>
            );
          })}

          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
