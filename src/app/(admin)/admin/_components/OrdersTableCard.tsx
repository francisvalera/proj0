"use client";

import DataTable, { type Column, type Sort } from "./DataTable";
import type { Order, OrderStatus } from "@/types/admin";
import { idToCustomer } from "@/lib/admin/mock";
import { useMemo, useState } from "react";

type Row = {
  number: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
};

function currency(n: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
}

export default function OrdersTableCard({ orders }: { orders: Order[] }) {
  const rows: Row[] = useMemo(
    () =>
      orders.map((o) => ({
        number: o.number,
        customerName: idToCustomer.get(o.customerId)?.name ?? "—",
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
      })),
    [orders],
  );

  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [sortSel, setSortSel] = useState<
    "created-desc" | "created-asc" | "total-asc" | "total-desc"
  >("created-desc");

  const sortOverride: Sort<Row> = useMemo(() => {
    switch (sortSel) {
      case "created-asc":
        return { key: "createdAt", dir: "asc" };
      case "total-asc":
        return { key: "total", dir: "asc" };
      case "total-desc":
        return { key: "total", dir: "desc" };
      default:
        return { key: "createdAt", dir: "desc" };
    }
  }, [sortSel]);

  const rowMatches = (r: Row) => status === "all" || r.status === status;

  const columns: Column<Row>[] = [
    { key: "number", header: "Order #", sortable: true },
    { key: "customerName", header: "Customer", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => {
        const cls =
          r.status === "PENDING"
            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
            : r.status === "CANCELLED"
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
            : r.status === "REFUNDED"
            ? "bg-slate-50 text-slate-700 ring-1 ring-slate-200"
            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
        const label =
          r.status === "PAID" || r.status === "SHIPPED"
            ? "Complete"
            : r.status[0] + r.status.slice(1).toLowerCase();
        return (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls}`}>
            {label}
          </span>
        );
      },
    },
    { key: "total", header: "Total", sortable: true, render: (r) => <span className="tabular-nums">{currency(r.total)}</span> },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (r) =>
        new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date(r.createdAt)),
    },
  ];

  const controlsLeft = (
    <select
      aria-label="Filter by status"
      value={status}
      onChange={(e) => setStatus(e.target.value as OrderStatus | "all")}
      className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm shadow-sm"
    >
      <option value="all">All status</option>
      <option value="PENDING">PENDING</option>
      <option value="PAID">PAID</option>
      <option value="SHIPPED">SHIPPED</option>
      <option value="CANCELLED">CANCELLED</option>
      <option value="REFUNDED">REFUNDED</option>
    </select>
  );

  const controlsRight = (
    <select
      aria-label="Sort"
      value={sortSel}
      onChange={(e) =>
        setSortSel(e.target.value as "created-desc" | "created-asc" | "total-asc" | "total-desc")
      }
      className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm shadow-sm"
    >
      <option value="created-desc">Newest</option>
      <option value="created-asc">Oldest</option>
      <option value="total-asc">Total: Low → High</option>
      <option value="total-desc">Total: High → Low</option>
    </select>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-0">
      <DataTable<Row>
        data={rows}
        columns={columns}
        searchKeys={["number", "customerName", "status"]}
        sortOverride={sortOverride}
        filterFn={(r) => rowMatches(r)}
        controlsLeft={controlsLeft}
        controlsRight={controlsRight}
        initialPageSize={10}
        pageSizeOptions={[10, 25, 50]}
        stickyToolbar
      />
    </div>
  );
}