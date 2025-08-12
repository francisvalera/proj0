"use client";

import { useState } from "react";
import type { Product, ProductImage } from "@prisma/client";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

type ProductWithImages = Product & {
  primaryImage?: ProductImage | null;
  images?: ProductImage[];
};

interface ProductDisplayProps {
  product: ProductWithImages;
}

const PLACEHOLDER = "/images/kklogo.jfif";

export default function ProductDisplay({ product }: ProductDisplayProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Build gallery: primary first, then others (by sortOrder), with placeholder fallback.
  const otherImages =
    (product.images ?? [])
      .filter((img) => img.id !== product.primaryImageId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  const gallery: string[] = [
    product.primaryImage?.url ?? otherImages[0]?.url ?? PLACEHOLDER,
    ...otherImages.map((i) => i.url),
  ];

  const [mainImage, setMainImage] = useState<string>(gallery[0] ?? PLACEHOLDER);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    // Keep your original call signature but pass an object that has imageUrl resolved.
    // If your CartContext expects the full Product, this still works in JS,
    // and TS won’t complain here because we’re inside your app code.
    const cartPayload = {
      ...product,
      imageUrl: mainImage, // primary image (or current selection)
    } as unknown as Product; // maintain original addToCart(product, qty) signature

    addToCart(cartPayload, quantity);
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {gallery.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square w-full rounded-md overflow-hidden border-2 transition-all ${
                    mainImage === img ? "border-red-500 scale-110" : "border-transparent"
                  }`}
                  aria-label={`Select image ${index + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img || PLACEHOLDER}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {/* Ensure at least 3 thumbnails for consistent layout */}
              {gallery.length < 3 &&
                Array.from({ length: 3 - gallery.length }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="aspect-square w-full rounded-md overflow-hidden border-2 border-transparent bg-gray-100"
                  />
                ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-md text-gray-500 mt-2">by {product.brandName}</p>
            <p className="text-4xl font-bold text-red-600 my-4">
              ₱{Number(product.price).toLocaleString()}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              This is a sample product description.
            </p>

            <div className="flex items-center space-x-4 mb-6">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  className="w-12 text-center border-l border-r border-gray-300 focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center text-lg hover:bg-red-700 transition-colors"
            >
              <ShoppingCart className="mr-3" />
              Add to Cart
            </button>
            {/* ... Additional Info ... */}
          </div>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useState } from 'react';
// import type { Product } from '@prisma/client';
// import { ShoppingCart, Minus, Plus } from 'lucide-react';
// import { useCart } from '@/context/CartContext';

// interface ProductDisplayProps {
//   product: Product;
// }

// export default function ProductDisplay({ product }: ProductDisplayProps) {
//   const { addToCart } = useCart();
//   const [quantity, setQuantity] = useState(1);
//   const [mainImage, setMainImage] = useState(product.imageUrl || '/images/kklogo.jfif');

//   const imageGallery = [
//     product.imageUrl || '/images/kklogo.jfif',
//     '/images/kklogo.jfif',
//     '/images/kklogo.jfif',
//   ];

//   const handleQuantityChange = (amount: number) => {
//     setQuantity((prev) => Math.max(1, prev + amount));
//   };

//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//   };

//   return (
//     <div className="bg-gray-100 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-12">
//           {/* ... Image Gallery ... */}
//           <div>
//             <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
//               <img
//                 src={mainImage}
//                 alt={product.name}
//                 className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//               />
//             </div>
//             <div className="grid grid-cols-5 gap-2">
//               {imageGallery.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setMainImage(img)}
//                   className={`aspect-square w-full rounded-md overflow-hidden border-2 transition-all ${mainImage === img ? 'border-red-500 scale-110' : 'border-transparent'}`}
//                 >
//                   <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="flex flex-col justify-center">
//             <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
//             <p className="text-md text-gray-500 mt-2">by {product.brandName}</p>
//             <p className="text-4xl font-bold text-red-600 my-4">₱{product.price.toLocaleString()}</p>
//             <p className="text-gray-700 leading-relaxed mb-6">
//               This is a sample product description.
//             </p>
//             <div className="flex items-center space-x-4 mb-6">
//               <span className="font-semibold">Quantity:</span>
//               <div className="flex items-center border border-gray-300 rounded-md">
//                 <button onClick={() => handleQuantityChange(-1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md"><Minus size={16} /></button>
//                 <input
//                   type="text"
//                   readOnly
//                   value={quantity}
//                   className="w-12 text-center border-l border-r border-gray-300 focus:outline-none"
//                 />
//                 <button onClick={() => handleQuantityChange(1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md"><Plus size={16} /></button>
//               </div>
//             </div>
//             <button
//               onClick={handleAddToCart}
//               className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center text-lg hover:bg-red-700 transition-colors"
//             >
//               <ShoppingCart className="mr-3" />
//               Add to Cart
//             </button>
//             {/* ... Additional Info ... */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
