"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

export type Column<T extends object> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
};

export type Sort<T extends object> = { key: keyof T; dir: "asc" | "desc" };

function getComparable(v: unknown): string | number {
  if (v == null) return "";
  if (typeof v === "number") return v;
  // ISO strings compare correctly lexicographically; Dates also ok:
  if (v instanceof Date) return v.getTime();
  return String(v);
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKeys,
  initialSort,
  sortOverride,
  filterFn,
  stickyToolbar = true,
  pageSizeOptions = [10, 25, 50],
  initialPageSize = 10,
  controlsLeft,
  controlsRight,
}: {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  initialSort?: Sort<T>;
  /** If provided, table uses this sort instead of internal state (for controlled sorting). */
  sortOverride?: Sort<T> | null;
  /** Extra predicate applied after search. */
  filterFn?: (row: T, q: string) => boolean;
  /** Keep the toolbar stuck to the card header. */
  stickyToolbar?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  /** Left side of the toolbar (e.g., Brand/Status selects). */
  controlsLeft?: ReactNode;
  /** Right side of the toolbar (e.g., Sort select). */
  controlsRight?: ReactNode;
}) {
  const [q, setQ] = useState("");
  const [sortInternal, setSortInternal] = useState<Sort<T> | undefined>(initialSort);
  const [perPage, setPerPage] = useState<number>(initialPageSize);
  const [page, setPage] = useState<number>(1);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setPage(1);
  }, [q, perPage, filterFn, sortOverride]);

  const keys: (keyof T)[] = (searchKeys ?? columns.map((c) => c.key)) as (keyof T)[];

  const searched = useMemo(() => {
    if (!q) return data;
    const needle = q.toLowerCase();
    return data.filter((row) =>
      keys.some((k) => String(row[k] ?? "").toLowerCase().includes(needle)),
    );
  }, [q, data, keys]);

  const filtered = useMemo(() => {
    if (!filterFn) return searched;
    return searched.filter((row) => filterFn(row, q));
  }, [searched, filterFn, q]);

  const sortActive = sortOverride ?? sortInternal;

  const sorted = useMemo(() => {
    if (!sortActive) return filtered;
    const { key, dir } = sortActive;
    return [...filtered].sort((a, b) => {
      const av = getComparable(a[key]);
      const bv = getComparable(b[key]);
      if (typeof av === "number" && typeof bv === "number") {
        return dir === "asc" ? av - bv : bv - av;
      }
      const as = String(av);
      const bs = String(bv);
      return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
  }, [filtered, sortActive]);

  const total = sorted.length;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const pageData = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div
        className={`flex flex-wrap items-center gap-2 justify-between ${
          stickyToolbar ? "sticky top-0 z-10 bg-white rounded-t-xl" : ""
        } p-3 border border-slate-200 rounded-xl`}
      >
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-200"
          />
          {controlsLeft}
        </div>
        <div className="flex items-center gap-2">
          {controlsRight}
          <select
            aria-label="Rows per page"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm shadow-sm"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              {columns.map((c) => {
                const active = sortActive?.key === c.key;
                const arrow = active ? (sortActive?.dir === "asc" ? " ▲" : " ▼") : "";
                return (
                  <th key={String(c.key)} className="px-4 py-3 text-left font-medium text-slate-600">
                    <button
                      className={`inline-flex items-center gap-1 ${
                        c.sortable ? "hover:underline" : "cursor-default"
                      }`}
                      onClick={() => {
                        if (!c.sortable) return;
                        if (sortOverride) return; // controlled: ignore clicks
                        setSortInternal((prev) => {
                          const dir: "asc" | "desc" =
                            prev?.key === c.key && prev?.dir === "asc" ? "desc" : "asc";
                          return { key: c.key, dir };
                        });
                      }}
                    >
                      {c.header}
                      {arrow}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={i} className="border-t border-slate-200">
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-3 whitespace-nowrap text-slate-700">
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {total === 0 && (
              <tr>
                <td className="px-4 py-8 text-slate-500" colSpan={columns.length}>
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div>
          {from}-{to} of {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 shadow-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="px-1">
            Page {page} / {pageCount}
          </span>
          <button
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 shadow-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page >= pageCount}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}