"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product, ProductImage } from "@prisma/client";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

type ProductWithImages = Product & {
  primaryImage?: ProductImage | null;
  images?: ProductImage[];
};

const placeholderImage = "/images/kklogo.jfif";

type Props = { product: ProductWithImages };

export default function ProductCard({ product }: Props) {
  const img =
    product.primaryImage?.url ??
    product.images?.[0]?.url ??
    placeholderImage;



  const { addToCart } = useCart();
  

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product page
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
      <style jsx>{`
        /* styles remain the same */
      `}</style>
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
          {/* ... badges ... */}
        </div>
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{product.brandName}</p>
          <h3 className="font-bold text-lg text-gray-900 mt-1 mb-3 h-14 line-clamp-2 leading-tight">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-red-500">₱{product.price.toLocaleString()}</span>
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
