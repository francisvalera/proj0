"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState, useEffect, useRef, FormEvent } from "react";
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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sendReceipt, setSendReceipt] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const total = subtotal; // UI shows grand total only

  const isFormValid = () => {
    if (!cartCount || cartCount === 0) return false;
    if (!fullName.trim()) return false;
    if (!email.trim()) return false;
    return true;
  };

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) { setError("Please complete the required fields."); return; }
    setError(null);
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    if (!formRef.current) return;
    setIsPlacingOrder(true);
    setIsRedirecting(true);

    const formData = new FormData(formRef.current);
    const customerInfo = {
      fullName,
      email,
      phone,
      province: String(formData.get("province") || ""),
      city: String(formData.get("city") || ""),
      barangay: String(formData.get("barangay") || ""),
      street: String(formData.get("street") || ""),
      userId: (session as any)?.user?.id,
      sendReceipt: !!sendReceipt,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerInfo, cartItems, total }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || `Checkout failed with ${res.status}`);
      }

      const data = (await res.json()) as { orderId: string };
      router.push(`/order-confirmation/${encodeURIComponent(data.orderId)}`);
      setTimeout(() => clearCart?.(), 500);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Checkout error", err);
      setError(err?.message || "Something went wrong while placing your order.");
      setIsRedirecting(false);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isRedirecting && cartCount === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <Link href="/" className="mt-4 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-center text-3xl font-extrabold text-gray-900">Checkout</h1>

          {error && (
            <div className="mb-6 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <form ref={formRef} onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: Customer + Address */}
            <div className="rounded-lg bg-white p-8 shadow-md lg:col-span-2">
              <div className="mb-8">
                <h2 className="mb-6 border-b pb-4 text-xl font-semibold">Customer Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
                    <input id="fullName" name="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1 w-full rounded-md border p-2" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
                    <input id="phone" name="phone" type="tel" value={phone} onChange={(e) => /^[0-9]*$/.test(e.target.value) && setPhone(e.target.value)} required className="mt-1 w-full rounded-md border p-2" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                    <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-md border p-2" />
                    <label className="mt-2 flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={sendReceipt} onChange={(e) => setSendReceipt(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                      <span>Send me a receipt by email</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="mb-6 border-b pb-4 text-xl font-semibold">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Your AddressSelector component renders province/city/barangay inputs */}
                  <AddressSelector />
                  <div className="sm:col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium">Street Address, Building, etc.</label>
                    <input id="street" name="street" type="text" required className="mt-1 w-full rounded-md border p-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary (sticky desktop, collapsible mobile, default expanded) */}
            <div className="h-fit rounded-lg bg-white p-8 shadow-md lg:sticky lg:top-4">
              <details open className="group block lg:open">
                <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-semibold lg:cursor-default">
                  <span>Your Order</span>
                  <span className="text-sm font-normal text-gray-500 lg:hidden">{cartCount} item{cartCount === 1 ? "" : "s"}</span>
                </summary>
                <div className="mt-6">
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex justify-between py-3 text-sm">
                        <span className="truncate">{item.name} × {item.quantity}</span>
                        <span className="font-medium">₱{(item.price * item.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-base font-bold text-gray-900">
                      <span>Total</span>
                      <span>₱{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </details>

              <button type="submit" disabled={isPlacingOrder || !isFormValid()} className="mt-6 flex w-full items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70">
                {isPlacingOrder ? <LoadingSpinner /> : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
        summary={{ items: cartItems as any, total, count: cartCount || 0 }}
      />
    </>
  );
}