"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

type CartItemShape = {
  productId: string;
  name: string;
  price: number | string;
  quantity: number;
  imageUrl?: string;
};

function getCartItemImageUrl(item: unknown) {
  const anyItem = item as Partial<CartItemShape> | undefined;
  const url = typeof anyItem?.imageUrl === "string" && anyItem.imageUrl.length > 0
    ? anyItem.imageUrl
    : "/images/kklogo.jfif";
  return url;
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // show total only (no shipping/subtotal lines)

  return (
    <div className="bg-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-extrabold text-gray-900">Your Shopping Cart</h1>

        {cartCount === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Your cart is empty.</h2>
            <p className="mt-2 mb-6 text-gray-500">Looks like you haven&apos;t added anything to your cart yet.</p>
            <Link href="/products" className="inline-block rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map((product) => (
                  <li key={product.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {/* <img src={product.imageUrl || "/images/kklogo.jfif"} alt={product.name} className="h-full w-full object-cover object-center" /> */}
                      <img
                        src={getCartItemImageUrl(product)}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link href={`/products/${product.id}`}>{product.name}</Link>
                          </h3>
                          <p className="ml-4">₱{(product.price * product.quantity).toLocaleString()}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{product.brandName}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center rounded-md border border-gray-300">
                          <button onClick={() => updateQuantity(product.id, product.quantity - 1)} className="rounded-l-md p-1.5 text-gray-600 hover:bg-gray-100">
                            <Minus size={14} />
                          </button>
                          <input type="text" readOnly value={product.quantity} className="w-10 border-l border-r border-gray-300 text-center focus:outline-none" />
                          <button onClick={() => updateQuantity(product.id, product.quantity + 1)} className="rounded-r-md p-1.5 text-gray-600 hover:bg-gray-100">
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex">
                          <button onClick={() => removeFromCart(product.id)} type="button" className="flex items-center font-medium text-red-600 hover:text-red-500">
                            <Trash2 size={16} className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary – emphasize Total and CTA; make sticky on desktop */}
            <div className="h-fit rounded-lg bg-white p-6 shadow-md lg:sticky lg:top-4">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-2 border-t border-gray-200 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-gray-900">₱{total.toLocaleString()}</span>
                </div>
                {/* <p className="mt-1 text-xs text-gray-500">Taxes calculated at checkout (if applicable).</p> */}
              </div>
              <div className="mt-6">
                <Link href="/checkout" className="flex w-full items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-red-700">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
