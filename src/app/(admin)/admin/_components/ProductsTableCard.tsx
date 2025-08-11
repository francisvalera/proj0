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