"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressSelector from "@/components/AddressSelector";
import ConfirmOrderModal from "@/components/ConfirmOrderModal";

export default function CheckoutPage() {
  const { cartItems, cartCount, subtotal } = useCart(); // Assuming subtotal is available from context
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shippingFee = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    // In a real app, this is where you would save the order to the database
    // and process the payment.
    console.log("Order confirmed!");
    setIsModalOpen(false);
    // For this example, we'll just redirect to a confirmation page with a dummy ID.
    const dummyOrderId = "KKMT-12345";
    router.push(`/order-confirmation/${dummyOrderId}`);
  };

  if (cartCount === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <Link href="/" className="text-red-500 mt-4 inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Checkout
          </h1>
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Shipping Information */}
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input type="text" required className="w-full px-3 py-2 mt-1 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone Number</label>
                  <input type="tel" required className="w-full px-3 py-2 mt-1 border rounded-md" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">Email Address</label>
                  <input type="email" required className="w-full px-3 py-2 mt-1 border rounded-md" />
                </div>
                
                {/* Dynamic Address Selector Component */}
                <AddressSelector />

                <div className="sm:col-span-2">
                   <label className="block text-sm font-medium">Street Address, Building, etc.</label>
                   <input type="text" required className="w-full px-3 py-2 mt-1 border rounded-md" />
                </div>
                <div className="sm:col-span-2 flex items-center">
                    <input id="receipt-checkbox" type="checkbox" className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                    <label htmlFor="receipt-checkbox" className="ml-2 block text-sm text-gray-900">Send me a receipt by email</label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-8 rounded-lg shadow-md h-fit">
              <h2 className="text-xl font-semibold mb-6">Your Order</h2>
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between py-3 text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-medium">₱{(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                 <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toLocaleString()}</span>
                </div>
                 <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : `₱${shippingFee.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>₱{total.toLocaleString()}</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center text-lg hover:bg-red-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />
    </>
  );
}
