"use client";

import React from "react";

type NumericLike = number | string | { toNumber: () => number };
function toNum(n: NumericLike) {
  return typeof n === "number" ? n : typeof n === "string" ? Number(n) : n.toNumber();
}

type OrderLike = {
  id: string;
  status?: string;
  total?: NumericLike;
  createdAt?: Date;
  user?: { name?: string | null } | null;
  itemsCount?: number;
};

export default function OrdersTableCard({ orders }: { orders: OrderLike[] }) {
  return (
    <div className="rounded-xl border border-[#ECEFF4] bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="text-sm text-gray-500">Orders: {orders.length}</div>
      {/* keep it minimal for now to satisfy lint; replace with full table later */}
      <ul className="mt-3 space-y-1 text-sm">
        {orders.slice(0, 5).map((o) => (
          <li key={o.id} className="flex justify-between">
            <span className="truncate">{o.user?.name ?? "Guest"}</span>
            <span className="text-gray-600">{o.total !== undefined ? toNum(o.total).toFixed(2) : "-"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
