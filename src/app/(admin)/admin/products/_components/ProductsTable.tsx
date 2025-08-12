"use client";

import React, { useMemo, useState, useTransition } from "react";
import type { Product, ProductImage } from "@prisma/client";
import { Trash2, Pencil, Search, ChevronDown, ChevronUp } from "lucide-react";
import { deleteProduct } from "../actions";
import NewProductForm from "./NewProductForm";

type ProductWithImages = Product & {
  images?: ProductImage[];
  primaryImage?: ProductImage | null;
};

type Props = { products: ProductWithImages[] };
type SortKey = "name" | "brandName" | "price" | "stock" | "createdAt";
type SortDir = "asc" | "desc";

function formatPHP(n: unknown) {
  const num =
    typeof n === "number" ? n : Number((n as any)?.toString?.() ?? Number.NaN);
  return Number.isFinite(num)
    ? num.toLocaleString("en-PH", { style: "currency", currency: "PHP" })
    : String(n ?? "");
}

export default function ProductsTable({ products }: Props) {
  const [pending, start] = useTransition();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brandName.toLowerCase().includes(term)
    );
  }, [products, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const A =
        sortKey === "createdAt"
          ? +new Date(a.createdAt)
          : sortKey === "price"
          ? Number((a as any).price?.toString?.() ?? 0)
          : (a as any)[sortKey] ?? "";
      const B =
        sortKey === "createdAt"
          ? +new Date(b.createdAt)
          : sortKey === "price"
          ? Number((b as any).price?.toString?.() ?? 0)
          : (b as any)[sortKey] ?? "";
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, pageCount);
  const startIdx = (pageSafe - 1) * pageSize;
  const pageItems = sorted.slice(startIdx, startIdx + pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="rounded-sm border border-transparent bg-white p-6 shadow-default dark:border-transparent dark:bg-boxdark">
      {/* softer separators & exact type scale */}
      <div className="rounded-xl border border-[#ECEFF4] bg-white p-5 text-[14px] leading-5 font-[300] dark:border-strokedark dark:bg-boxdark">
        {/* Controls */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span>Show</span>
            <SmallSelect
              value={String(pageSize)}
              onChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
              options={["10", "25", "50"]}
            />
            <span>entries</span>
          </label>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <SearchInput
              value={q}
              onChange={(v) => {
                setQ(v);
                setPage(1);
              }}
              placeholder="Search..."
            />
            {/* New Product button beside the search box */}
            <div className="shrink-0">
              <NewProductForm />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left text-sm dark:bg-meta-4">
                <Th onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir}>
                  Product
                </Th>
                <Th onClick={() => toggleSort("brandName")} active={sortKey === "brandName"} dir={sortDir}>
                  Brand
                </Th>
                <Th align="right" onClick={() => toggleSort("stock")} active={sortKey === "stock"} dir={sortDir}>
                  Stock
                </Th>
                <Th onClick={() => toggleSort("createdAt")} active={sortKey === "createdAt"} dir={sortDir}>
                  Created
                </Th>
                <Th align="right" onClick={() => toggleSort("price")} active={sortKey === "price"} dir={sortDir}>
                  Price
                </Th>
                <th className="px-5 py-4 text-right font-medium">Images</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#EEF2F8] last:border-b-0 hover:bg-gray-2/50 dark:border-strokedark"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.primaryImage?.url ?? p.images?.[0]?.url ?? "/images/kklogo.jfif"}
                        alt=""
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-black dark:text-white">{p.name}</div>
                        <div className="text-xs text-gray-400">#{p.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-gray-700 dark:text-gray-300">{p.brandName}</td>
                  <td className="px-5 py-5 text-right">{p.stock}</td>
                  <td className="px-5 py-5">
                    {new Date(p.createdAt).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-5 text-right">{formatPHP((p as any).price)}</td>
                  <td className="px-5 py-5 text-right">{p.images?.length ?? 0}</td>
                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#E5EAF1] text-gray-600 hover:bg-gray-2 dark:border-strokedark dark:text-gray-300"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        disabled={pending}
                        onClick={() =>
                          start(async () => {
                            await deleteProduct(p.id);
                          })
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#E5EAF1] text-gray-600 hover:bg-gray-2 dark:border-strokedark dark:text-gray-300 disabled:opacity-50"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pager */}
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {sorted.length === 0 ? (
              "Showing 0 entries"
            ) : (
              <>
                Showing <span className="font-medium">{startIdx + 1}</span> to{" "}
                <span className="font-medium">{Math.min(startIdx + pageSize, sorted.length)}</span>{" "}
                of <span className="font-medium">{sorted.length}</span> entries
              </>
            )}
          </div>

          <div className="inline-flex items-center gap-2">
            <button
              className="rounded-lg border border-[#E5EAF1] px-3 py-2 text-sm disabled:opacity-50 dark:border-strokedark"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe <= 1}
            >
              Previous
            </button>
            <span className="rounded-lg bg-primary px-3 py-2 text-sm text-white">{pageSafe}</span>
            <button
              className="rounded-lg border border-[#E5EAF1] px-3 py-2 text-sm disabled:opacity-50 dark:border-strokedark"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={pageSafe >= pageCount}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
  align = "left",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  dir?: "asc" | "desc";
  align?: "left" | "right";
}) {
  return (
    <th className={`px-5 py-4 ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 font-medium text-black hover:opacity-80 dark:text-white"
      >
        {children}
        <span className="ml-1 inline-flex flex-col leading-none">
          <ChevronUp className={`h-3 w-3 ${active && dir === "asc" ? "opacity-100" : "opacity-30"}`} />
          <ChevronDown className={`h-3 w-3 -mt-1 ${active && dir === "desc" ? "opacity-100" : "opacity-30"}`} />
        </span>
        <span className="sr-only">{active ? dir : "sort"}</span>
      </button>
    </th>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[#E5EAF1] bg-transparent pl-9 pr-4 text-sm outline-none focus:border-primary dark:border-strokedark"
      />
    </div>
  );
}

function SmallSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-lg border border-[#E5EAF1] bg-transparent px-3 pr-8 text-sm outline-none focus:border-primary dark:border-strokedark"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}
