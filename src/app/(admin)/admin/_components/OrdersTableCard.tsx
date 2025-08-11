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


// "use client";

// import DataTable, { Column } from "./DataTable";
// import { Order } from "@/types/admin";
// import { idToCustomer } from "@/lib/admin/mock";

// type OrderRow = {
//   number: string;
//   customerName: string;
//   status: string;
//   totalFormatted: string;
//   createdFormatted: string;
// };

// function currency(n: number) {
//   return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
// }

// export default function OrdersTableCard({ orders }: { orders: Order[] }) {
//   const rows: OrderRow[] = orders.map((o) => ({
//     number: o.number,
//     customerName: idToCustomer.get(o.customerId)?.name ?? "—",
//     status: o.status,
//     totalFormatted: currency(o.total),
//     createdFormatted: new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(
//       new Date(o.createdAt),
//     ),
//   }));

//   const columns: Column<OrderRow>[] = [
//     { key: "number", header: "Order #", sortable: true },
//     { key: "customerName", header: "Customer", sortable: true },
//     { key: "status", header: "Status", sortable: true },
//     { key: "totalFormatted", header: "Total", sortable: true },
//     { key: "createdFormatted", header: "Created", sortable: true },
//   ];

//   return (
//     <div className="rounded-2xl border bg-white shadow-sm p-4">
//       <DataTable<OrderRow>
//         data={rows}
//         columns={columns}
//         searchKeys={["number", "customerName", "status"]}
//         initialSort={{ key: "createdFormatted", dir: "desc" }}
//       />
//     </div>
//   );
//}


// "use client";
// import { useMemo, useState } from "react";
// import { Order, OrderStatus } from "@/types/admin";
// import { idToCustomer, idToProduct } from "@/lib/admin/mock";

// function currency(n: number) {
//   return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
// }
// function statusBadge(status: OrderStatus) {
//   const map: Record<OrderStatus, { label: string; cls: string }> = {
//     PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
//     PAID: { label: "Complete", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
//     SHIPPED: { label: "Complete", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
//     CANCELLED: { label: "Cancel", cls: "bg-rose-50 text-rose-700 ring-1 ring-rose-200" },
//     REFUNDED: { label: "Refunded", cls: "bg-slate-50 text-slate-700 ring-1 ring-slate-200" },
//   };
//   return map[status];
// }

// export default function OrdersTableCard({ orders }: { orders: Order[] }) {
//   const baseRows = useMemo(() => orders.map((o) => ({
//     ...o,
//     customer: idToCustomer.get(o.customerId),
//     productNames: o.items.map((it) => idToProduct.get(it.productId)?.name || "Item").join(", "),
//     createdDate: new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date(o.createdAt)),
//   })), [orders]);

//   const [q, setQ] = useState("");
//   const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL");
//   const [sortKey, setSortKey] = useState("CREATED_DESC");
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   const filtered = useMemo(() => baseRows.filter((r) => {
//     const hitQ = q ? (r.number + r.customer?.name + r.productNames).toLowerCase().includes(q.toLowerCase()) : true;
//     const hitStatus = status === "ALL" ? true : r.status === status;
//     return hitQ && hitStatus;
//   }), [baseRows, q, status]);

//   const sorted = useMemo(() => {
//     const arr = [...filtered];
//     switch (sortKey) {
//       case "TOTAL_ASC": arr.sort((a,b)=>a.total-b.total); break;
//       case "TOTAL_DESC": arr.sort((a,b)=>b.total-a.total); break;
//       case "CREATED_ASC": arr.sort((a,b)=>+new Date(a.createdAt)-+new Date(b.createdAt)); break;
//       case "CREATED_DESC": arr.sort((a,b)=>+new Date(b.createdAt)-+new Date(a.createdAt)); break;
//       case "NUMBER_ASC": arr.sort((a,b)=>a.number.localeCompare(b.number)); break;
//       case "NUMBER_DESC": arr.sort((a,b)=>b.number.localeCompare(a.number)); break;
//     }
//     return arr;
//   }, [filtered, sortKey]);

//   const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
//   const pageClamped = Math.min(page, totalPages);
//   const start = (pageClamped - 1) * perPage;
//   const rows = sorted.slice(start, start + perPage);

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//       <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//         <div className="flex items-center gap-2">
//           <input value={q} onChange={(e)=>{setQ(e.target.value); setPage(1);}} placeholder="Search orders..." className="w-64 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200" />
//           <select value={status} onChange={(e)=>{setStatus(e.target.value as any); setPage(1);}} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
//             <option value="ALL">All status</option>
//             <option value="PENDING">Pending</option>
//             <option value="PAID">Paid</option>
//             <option value="SHIPPED">Shipped</option>
//             <option value="CANCELLED">Cancelled</option>
//             <option value="REFUNDED">Refunded</option>
//           </select>
//           <select value={sortKey} onChange={(e)=>setSortKey(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
//             <option value="CREATED_DESC">Newest</option>
//             <option value="CREATED_ASC">Oldest</option>
//             <option value="TOTAL_DESC">Amount: High → Low</option>
//             <option value="TOTAL_ASC">Amount: Low → High</option>
//             <option value="NUMBER_ASC">Order #: A → Z</option>
//             <option value="NUMBER_DESC">Order #: Z → A</option>
//           </select>
//         </div>
//         <div className="flex items-center gap-2">
//           <select value={perPage} onChange={(e)=>{setPerPage(Number(e.target.value)); setPage(1);}} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"><option>10</option><option>25</option><option>50</option></select>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full table-auto text-sm">
//           <thead className="text-slate-600">
//             <tr className="border-b border-slate-200 bg-slate-50">
//               <th className="px-6 py-3 text-left"><input type="checkbox" className="accent-slate-700" aria-label="Select all" /></th>
//               <th className="px-6 py-3 text-left font-medium">Deal ID</th>
//               <th className="px-6 py-3 text-left font-medium">Customer</th>
//               <th className="px-6 py-3 text-left font-medium">Product/Service</th>
//               <th className="px-6 py-3 text-right font-medium">Deal Value</th>
//               <th className="px-6 py-3 text-left font-medium">Close Date</th>
//               <th className="px-6 py-3 text-left font-medium">Status</th>
//               <th className="px-6 py-3 text-left font-medium">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((o) => {
//               const badge = statusBadge(o.status);
//               const customer = o.customer?.name || "Customer";
//               const email = o.customer?.email || "";
//               return (
//                 <tr key={o.id} className="border-b border-slate-100 last:border-b-0">
//                   <td className="px-6 py-5 align-middle"><input type="checkbox" className="accent-slate-700" aria-label={`Select ${o.number}`} /></td>
//                   <td className="px-6 py-5 align-middle text-slate-700">{o.number}</td>
//                   <td className="px-6 py-5 align-middle">
//                     <div className="leading-tight">
//                       <div className="font-medium">{customer}</div>
//                       {email ? <div className="text-slate-500">{email}</div> : null}
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 align-middle text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[42ch]">{o.productNames}</td>
//                   <td className="px-6 py-5 align-middle text-right tabular-nums">{currency(o.total)}</td>
//                   <td className="px-6 py-5 align-middle">{o.createdDate}</td>
//                   <td className="px-6 py-5 align-middle"><span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badge.cls}`}>{badge.label}</span></td>
//                   <td className="px-6 py-5 align-middle"><button className="rounded-xl border border-slate-200 p-2 shadow-sm hover:bg-slate-50" aria-label="Delete"><svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="currentColor" d="M9 3h6v2h5v2H4V5h5V3zm1 6h2v9h-2V9zm4 0h2v9h-2V9z"/></svg></button></td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200">
//         <div className="text-sm text-slate-500">Page {pageClamped} of {totalPages} • {sorted.length} results</div>
//         <div className="flex items-center gap-2">
//           <button disabled={pageClamped===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40">Prev</button>
//           <button disabled={pageClamped===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40">Next</button>
//         </div>
//       </div>
//     </div>
//   );
// }