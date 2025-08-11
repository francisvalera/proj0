"use client";

import DataTable, { type Column, type Sort } from "./DataTable";
import type { Product, ProductStatus } from "@/types/admin";
import { brands as brandList, idToBrand } from "@/lib/admin/mock";
import { useMemo, useState } from "react";

type Row = {
  name: string;
  sku: string;
  brandId: string;
  brandName: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: string; // ISO
};

function currency(n: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
}

export default function ProductsTableCard({ products }: { products: Product[] }) {
  const rows: Row[] = useMemo(
    () =>
      products.map((p) => ({
        name: p.name,
        sku: p.sku,
        brandId: p.brandId ?? "",
        brandName: idToBrand.get(p.brandId || "")?.name ?? "—",
        price: p.price,
        stock: p.stock,
        status: p.status,
        createdAt: p.createdAt,
      })),
    [products],
  );

  // Filters + sort
  const [brand, setBrand] = useState<string>("all");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [sortSel, setSortSel] = useState<
    "created-desc" | "created-asc" | "price-asc" | "price-desc"
  >("created-desc");

  const sortOverride: Sort<Row> = useMemo(() => {
    switch (sortSel) {
      case "created-asc":
        return { key: "createdAt", dir: "asc" };
      case "price-asc":
        return { key: "price", dir: "asc" };
      case "price-desc":
        return { key: "price", dir: "desc" };
      default:
        return { key: "createdAt", dir: "desc" }; // newest
    }
  }, [sortSel]);

  const rowMatches = (r: Row) =>
    (brand === "all" || r.brandId === brand) &&
    (status === "all" || r.status === status);

  const columns: Column<Row>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "sku", header: "SKU", sortable: true },
    { key: "brandName", header: "Brand", sortable: true },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (r) => <span className="tabular-nums">{currency(r.price)}</span>,
    },
    { key: "stock", header: "Stock", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => {
        const cls =
          r.status === "ACTIVE"
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : r.status === "DRAFT"
            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
            : "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
        const label = r.status.charAt(0) + r.status.slice(1).toLowerCase();
        return (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (r) =>
        new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date(r.createdAt)),
    },
  ];

  const controlsLeft = (
    <>
      <select
        aria-label="Filter by brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm shadow-sm"
      >
        <option value="all">All brands</option>
        {brandList.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => setStatus(e.target.value as ProductStatus | "all")}
        className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm shadow-sm"
      >
        <option value="all">All status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="DRAFT">DRAFT</option>
        <option value="ARCHIVED">ARCHIVED</option>
      </select>
    </>
  );

  const controlsRight = (
    <select
      aria-label="Sort"
      value={sortSel}
      onChange={(e) =>
        setSortSel(e.target.value as "created-desc" | "created-asc" | "price-asc" | "price-desc")
      }
      className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm shadow-sm"
    >
      <option value="created-desc">Newest</option>
      <option value="created-asc">Oldest</option>
      <option value="price-asc">Price: Low → High</option>
      <option value="price-desc">Price: High → Low</option>
    </select>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-0">
      <DataTable<Row>
        data={rows}
        columns={columns}
        searchKeys={["name", "sku", "brandName", "status"]}
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
// import type { Product, ProductStatus } from "@/types/admin";
// import { idToBrand } from "@/lib/admin/mock";

// type Row = {
//   name: string;
//   sku: string;
//   brandName: string;
//   price: number;
//   stock: number;
//   status: ProductStatus;
//   createdAt: string; // ISO
// };

// function currency(n: number) {
//   return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
// }

// function statusPill(status: ProductStatus) {
//   const map: Record<ProductStatus, string> = {
//     ACTIVE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
//     DRAFT: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
//     ARCHIVED: "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
//   };
//   return (
//     <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[status]}`}>
//       {status.charAt(0) + status.slice(1).toLowerCase()}
//     </span>
//   );
// }

// export default function ProductsTableCard({ products }: { products: Product[] }) {
//   const rows: Row[] = products.map((p) => ({
//     name: p.name,
//     sku: p.sku,
//     brandName: idToBrand.get(p.brandId || "")?.name ?? "—",
//     price: p.price,
//     stock: p.stock,
//     status: p.status,
//     createdAt: p.createdAt,
//   }));

//   const columns: Column<Row>[] = [
//     { key: "name", header: "Name", sortable: true },
//     { key: "sku", header: "SKU", sortable: true },
//     { key: "brandName", header: "Brand", sortable: true },
//     {
//       key: "price",
//       header: "Price",
//       sortable: true,
//       render: (r) => <span className="tabular-nums">{currency(r.price)}</span>,
//     },
//     { key: "stock", header: "Stock", sortable: true },
//     {
//       key: "status",
//       header: "Status",
//       sortable: true,
//       render: (r) => statusPill(r.status),
//     },
//     {
//       key: "createdAt",
//       header: "Created",
//       sortable: true,
//       render: (r) =>
//         new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date(r.createdAt)),
//     },
//   ];

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
//       <DataTable<Row>
//         data={rows}
//         columns={columns}
//         searchKeys={["name", "sku", "brandName"]}
//         initialSort={{ key: "name", dir: "asc" }}
//       />
//     </div>
//   );
// }


// "use client";

// import DataTable, { Column } from "./DataTable";
// import { Product } from "@/types/admin";
// import { idToBrand } from "@/lib/admin/mock";

// type ProductRow = {
//   name: string;
//   sku: string;
//   brandName: string;
//   priceFormatted: string;
//   stock: number;
//   status: string;
//   createdFormatted: string;
// };

// function currency(n: number) {
//   return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
// }

// export default function ProductsTableCard({ products }: { products: Product[] }) {
//   const rows: ProductRow[] = products.map((p) => ({
//     name: p.name,
//     sku: p.sku,
//     brandName: idToBrand.get(p.brandId || "")?.name ?? "—",
//     priceFormatted: currency(p.price),
//     stock: p.stock,
//     status: p.status,
//     createdFormatted: new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(
//       new Date(p.createdAt),
//     ),
//   }));

//   const columns: Column<ProductRow>[] = [
//     { key: "name", header: "Name", sortable: true },
//     { key: "sku", header: "SKU", sortable: true },
//     { key: "brandName", header: "Brand", sortable: true },
//     { key: "priceFormatted", header: "Price", sortable: true },
//     { key: "stock", header: "Stock", sortable: true },
//     { key: "status", header: "Status", sortable: true },
//     { key: "createdFormatted", header: "Created", sortable: true },
//   ];

//   return (
//     <div className="rounded-2xl border bg-white shadow-sm p-4">
//       <DataTable<ProductRow>
//         data={rows}
//         columns={columns}
//         searchKeys={["name", "sku", "brandName", "status"]}
//         initialSort={{ key: "name", dir: "asc" }}
//       />
//     </div>
//   );
// }


// "use client";
// import { useMemo, useState } from "react";
// import { Product, ProductStatus } from "@/types/admin";
// import { brands as brandList, idToBrand } from "@/lib/admin/mock";

// function currency(n: number) {
//   return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
// }

// export default function ProductsTableCard({ products }: { products: Product[] }) {
//   const baseRows = useMemo(() => products.map((p) => ({
//     ...p,
//     brandName: idToBrand.get(p.brandId || "")?.name ?? "—",
//     createdDate: new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date(p.createdAt)),
//   })), [products]);

//   const [q, setQ] = useState("");
//   const [status, setStatus] = useState<"ALL" | ProductStatus>("ALL");
//   const [brand, setBrand] = useState("ALL");
//   const [sortKey, setSortKey] = useState("CREATED_DESC");
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   const filtered = useMemo(() => baseRows.filter((r) => {
//     const hitQ = q ? (r.name + r.sku + r.brandName).toLowerCase().includes(q.toLowerCase()) : true;
//     const hitStatus = status === "ALL" ? true : r.status === status;
//     const hitBrand = brand === "ALL" ? true : r.brandName === brand;
//     return hitQ && hitStatus && hitBrand;
//   }), [baseRows, q, status, brand]);

//   const sorted = useMemo(() => {
//     const arr = [...filtered];
//     switch (sortKey) {
//       case "NAME_ASC": arr.sort((a,b)=>a.name.localeCompare(b.name)); break;
//       case "NAME_DESC": arr.sort((a,b)=>b.name.localeCompare(a.name)); break;
//       case "PRICE_ASC": arr.sort((a,b)=>a.price-b.price); break;
//       case "PRICE_DESC": arr.sort((a,b)=>b.price-a.price); break;
//       case "CREATED_ASC": arr.sort((a,b)=>+new Date(a.createdAt)-+new Date(b.createdAt)); break;
//       case "CREATED_DESC": arr.sort((a,b)=>+new Date(b.createdAt)-+new Date(a.createdAt)); break;
//       case "STOCK_ASC": arr.sort((a,b)=>a.stock-b.stock); break;
//       case "STOCK_DESC": arr.sort((a,b)=>b.stock-a.stock); break;
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
//           <input value={q} onChange={(e)=>{setQ(e.target.value); setPage(1);}} placeholder="Search products..." className="w-64 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200" />
//           <select value={brand} onChange={(e)=>{setBrand(e.target.value); setPage(1);}} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
//             <option value="ALL">All brands</option>
//             {brandList.map((b)=> <option key={b.id} value={b.name}>{b.name}</option>)}
//           </select>
//           <select value={status} onChange={(e)=>{setStatus(e.target.value as any); setPage(1);}} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
//             <option value="ALL">All status</option>
//             <option value="ACTIVE">Active</option>
//             <option value="DRAFT">Draft</option>
//             <option value="ARCHIVED">Archived</option>
//           </select>
//           <select value={sortKey} onChange={(e)=>setSortKey(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
//             <option value="CREATED_DESC">Newest</option>
//             <option value="CREATED_ASC">Oldest</option>
//             <option value="NAME_ASC">Name: A → Z</option>
//             <option value="NAME_DESC">Name: Z → A</option>
//             <option value="PRICE_DESC">Price: High → Low</option>
//             <option value="PRICE_ASC">Price: Low → High</option>
//             <option value="STOCK_DESC">Stock: High → Low</option>
//             <option value="STOCK_ASC">Stock: Low → High</option>
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
//               <th className="px-6 py-3 text-left font-medium">Name</th>
//               <th className="px-6 py-3 text-left font-medium">SKU</th>
//               <th className="px-6 py-3 text-left font-medium">Brand</th>
//               <th className="px-6 py-3 text-right font-medium">Price</th>
//               <th className="px-6 py-3 text-right font-medium">Stock</th>
//               <th className="px-6 py-3 text-left font-medium">Status</th>
//               <th className="px-6 py-3 text-left font-medium">Created</th>
//               <th className="px-6 py-3 text-left font-medium">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((p) => (
//               <tr key={p.id} className="border-b border-slate-100 last:border-b-0">
//                 <td className="px-6 py-5 align-middle"><input type="checkbox" className="accent-slate-700" aria-label={`Select ${p.name}`} /></td>
//                 <td className="px-6 py-5 align-middle whitespace-nowrap overflow-hidden text-ellipsis max-w-[40ch] font-medium text-slate-800">{p.name}</td>
//                 <td className="px-6 py-5 align-middle whitespace-nowrap text-slate-700">{p.sku}</td>
//                 <td className="px-6 py-5 align-middle whitespace-nowrap text-slate-700">{p.brandName}</td>
//                 <td className="px-6 py-5 align-middle text-right tabular-nums">{currency(p.price)}</td>
//                 <td className="px-6 py-5 align-middle text-right tabular-nums"><span className={p.stock===0?"text-rose-600":p.stock<=10?"text-amber-600":"text-slate-800"}>{p.stock}</span></td>
//                 <td className="px-6 py-5 align-middle"><span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${p.status==='ACTIVE'?'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200':p.status==='DRAFT'?'bg-amber-50 text-amber-700 ring-1 ring-amber-200':'bg-slate-50 text-slate-700 ring-1 ring-slate-200'}`}>{p.status[0]}{p.status.slice(1).toLowerCase()}</span></td>
//                 <td className="px-6 py-5 align-middle whitespace-nowrap">{p.createdDate}</td>
//                 <td className="px-6 py-5 align-middle"><button className="rounded-xl border border-slate-200 p-2 shadow-sm hover:bg-slate-50" aria-label="Delete"><svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="currentColor" d="M9 3h6v2h5v2H4V5h5V3zm1 6h2v9h-2V9zm4 0h2v9h-2V9z"/></svg></button></td>
//               </tr>
//             ))}
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