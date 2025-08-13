"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, ProductImage, Subcategory, Category } from "@prisma/client";

type ProductRow = Product & {
  primaryImage?: ProductImage | null;
  images?: ProductImage[];
  subcategory?: (Subcategory & { category: Category }) | null;
  usedCount?: number; // if you attach usage elsewhere
};

export default function ProductsTable({ products }: { products: ProductRow[] }) {
  const [confirming, setConfirming] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      products.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brandName,
        model: p.model ?? null,
        size: p.size ?? null,
        sku: p.sku ?? null,
        price: p.price,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        subcategory: p.subcategory?.name ?? null,
        category: p.subcategory?.category?.name ?? null,
        img: p.primaryImage?.url ?? p.images?.[0]?.url ?? "/images/kklogo.jfif",
      })),
    [products]
  );

  return (
    <div className="rounded-xl border border-[#E5EAF1] bg-white p-4 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F7]">
            {rows.map((r) => (
              <tr key={r.id} className="align-middle">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.img} alt="" className="h-10 w-10 rounded object-cover" />
                    <div>
                      <Link href={`/admin/products/${r.id}`} className="font-medium text-gray-900 hover:underline">
                        {r.name}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        {r.isFeatured && (
                          <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[#4F46E5]">Featured</span>
                        )}
                        {!r.isActive && (
                          <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-gray-600">Inactive</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  {r.subcategory ? (
                    <div className="leading-tight">
                      <div className="font-medium text-gray-900">{r.subcategory}</div>
                      {r.category && <div className="text-xs text-gray-500">{r.category}</div>}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>

                <td className="px-4 py-4 text-gray-900">{r.brand}</td>
                <td className="px-4 py-4 text-gray-900">{r.model ?? <span className="text-gray-400">—</span>}</td>
                <td className="px-4 py-4 text-gray-900">{r.size ?? <span className="text-gray-400">—</span>}</td>
                <td className="px-4 py-4 text-gray-900">{r.sku ?? <span className="text-gray-400">—</span>}</td>
                <td className="px-4 py-4 text-gray-900">{r.stock}</td>
                <td className="px-4 py-4 font-semibold text-gray-900">
                  {Number(r.price).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${r.id}/edit`}
                      className="inline-flex rounded-md border border-[#E5EAF1] p-2 text-gray-600 hover:bg-gray-50"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <button
                      type="button"
                      className="inline-flex rounded-md border border-[#E5EAF1] p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      disabled={!r.isActive}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
