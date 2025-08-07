"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@prisma/client";

// Define the props for the ProductCard component
interface ProductCardProps {
  product: Product;
}

// The Product Card component, now marked as a Client Component.
export default function ProductCard({ product }: ProductCardProps) {
  // Use the local logo as the placeholder image
  const placeholderImage = "/images/kklogo.kfif";

  return (
    <div className="group relative bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
      <style jsx>{`
        .product-image { transition: transform 0.4s ease; }
        .group:hover .product-image { transform: scale(1.05); }
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
      `}</style>
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.imageUrl || placeholderImage}
            alt={product.name}
            className="product-image w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {product.isFeatured && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white"><Star className="w-3 h-3 mr-1" />FEATURED</div>
            )}
            {product.stock === 0 && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">OUT OF STOCK</div>
            )}
          </div>
        </div>
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{product.brandName}</p>
          <h3 className="font-bold text-lg text-gray-900 mt-1 mb-3 h-14 line-clamp-2 leading-tight">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-red-500">₱{product.price.toLocaleString()}</span>
            <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800">
              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
