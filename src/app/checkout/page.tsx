"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AddressSelector from "@/components/AddressSelector";
import ConfirmOrderModal from "@/components/ConfirmOrderModal";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { cartItems, cartCount, subtotal, clearCart } = useCart();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Auto-populate form if user is logged in
  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const shippingFee = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shippingFee;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validator: Only allow numbers
    if (/^\d*$/.test(value)) {
      setPhone(value);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    if (!formRef.current) return;
    setIsPlacingOrder(true);

    const formData = new FormData(formRef.current);
    const customerInfo = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      sendReceipt: formData.get('sendReceipt') === 'on',
      province: formData.get('province') as string,
      city: formData.get('city') as string,
      barangay: formData.get('barangay') as string,
      street: formData.get('street') as string,
      userId: session?.user?.id,
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerInfo, cartItems, total }),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        router.push('/error');
      }
    } catch (error) {
      router.push('/error');
    } finally {
      setIsPlacingOrder(false);
      setIsModalOpen(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <Link href="/" className="text-red-500 mt-4 inline-block">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Checkout</h1>
          <form ref={formRef} onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
              
              {/* Customer Information Group */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6 border-b pb-4">Customer Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
                    <input id="fullName" name="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
                    <input id="phone" name="phone" type="tel" value={phone} onChange={handlePhoneChange} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                    <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                     <div className="flex items-center mt-2">
                        <input id="sendReceipt" name="sendReceipt" type="checkbox" className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                        <label htmlFor="sendReceipt" className="ml-2 block text-sm text-gray-900">Send me a receipt by email</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information Group */}
              <div>
                <h2 className="text-xl font-semibold mb-6 border-b pb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <AddressSelector />
                  <div className="sm:col-span-2">
                     <label htmlFor="street" className="block text-sm font-medium">Street Address, Building, etc.</label>
                     <input id="street" name="street" type="text" required className="w-full px-3 py-2 mt-1 border rounded-md" />
                  </div>
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
