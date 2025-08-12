"use client";

import type { Product, ProductImage } from "@prisma/client";
import React from "react";

type ProductRow = Product & {
  images?: ProductImage[];
  primaryImage?: ProductImage | null;
};

export default function ProductsTableCard({ products }: { products: ProductRow[] }) {
  return (
    <div className="rounded-xl border border-[#ECEFF4] bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="text-sm text-gray-500">Products: {products.length}</div>
    </div>
  );
}
