import React from "react";
import type { Product, ProductImage } from "@prisma/client";

/**
 * Strict props for a product table that supports multi-images and a primary image.
 * Safe for Server Components (no hooks, no client-only APIs).
 */
type ProductWithImages = Product & {
  images: ProductImage[];
  primaryImage?: ProductImage | null;
};

type Props = {
  products: ProductWithImages[];
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

export default function ProductsTableCard({ products }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Primary</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Brand</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-right">Stock</th>
            <th className="p-3 text-right">Images</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">
                {p.primaryImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.primaryImage.url}
                    alt=""
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.brandName}</td>
              <td className="p-3 text-right">{formatCurrencyPHP(p.price)}</td>
              <td className="p-3 text-right">{p.stock}</td>
              <td className="p-3 text-right">{p.images.length}</td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
