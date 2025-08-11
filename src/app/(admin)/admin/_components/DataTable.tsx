"use client";

import { useMemo, useState } from "react";

export type Column<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKeys,
  initialSort,
}: {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  initialSort?: { key: keyof T; dir: "asc" | "desc" };
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(initialSort);

  const filtered = useMemo(() => {
    if (!q) return data;
    const needle = q.toLowerCase();
    return data.filter((row) =>
      (searchKeys ?? columns.map((c) => c.key)).some((k) => {
        const v = String(row[k] ?? "").toLowerCase();
        return v.includes(needle);
      })
    );
  }, [q, data, columns, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const { key, dir } = sort;
    return [...filtered].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av == null && bv == null) return 0;
      if (av == null) return dir === "asc" ? -1 : 1;
      if (bv == null) return dir === "asc" ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number")
        return dir === "asc" ? av - bv : bv - av;
      const as = String(av);
      const bs = String(bv);
      return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
  }, [filtered, sort]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="w-full md:w-64 rounded-lg border px-3 py-2 bg-white dark:bg-neutral-900"
        />
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900/40">
            <tr>
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  className="text-left px-3 py-2 font-medium text-neutral-600 dark:text-neutral-300"
                >
                  <button
                    className={`inline-flex items-center gap-1 ${c.sortable ? "hover:underline" : "cursor-default"}`}
                    onClick={() =>
                      c.sortable &&
                      setSort((prev) => {
                        const dir: "asc" | "desc" =
                          prev?.key === c.key && prev?.dir === "asc" ? "desc" : "asc";
                        return { key: c.key, dir };
                      })
                    }
                  >
                    {c.header}
                    {sort?.key === c.key ? (sort.dir === "asc" ? " ▲" : " ▼") : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i} className="border-t">
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-3 py-2 whitespace-nowrap">
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}