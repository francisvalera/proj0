"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 2000 ? 0 : 150; // Example shipping fee logic
  const total = subtotal + shippingFee;

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Your Shopping Cart
        </h1>
        {cartCount === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">
              Your cart is empty.
            </h2>
            <p className="text-gray-500 mt-2 mb-6">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map((product) => (
                  <li key={product.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={product.imageUrl || "/images/kklogo.jfif"}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link href={`/products/${product.id}`}>
                              {product.name}
                            </Link>
                          </h3>
                          <p className="ml-4">
                            ₱{(product.price * product.quantity).toLocaleString()}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.brandName}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-l-md"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="text"
                            readOnly
                            value={product.quantity}
                            className="w-10 text-center border-l border-r border-gray-300 focus:outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-r-md"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            type="button"
                            className="font-medium text-red-600 hover:text-red-500 flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : `₱${shippingFee.toLocaleString()}`}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <span>Total</span>
                  <span>₱{total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center text-lg hover:bg-red-700 transition-colors"
                >
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
