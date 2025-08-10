"use client";

import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export interface ConfirmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  summary: {
    items: Array<{ id: string; name: string; quantity: number; price: number; imageUrl?: string }>;
    total: number;
    count: number;
  };
}

export default function ConfirmOrderModal({ isOpen, onClose, onConfirm, summary }: ConfirmOrderModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !isLoading) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isLoading, onClose]);

  const handleConfirm = useCallback(async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  }, [onConfirm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" aria-modal role="dialog" aria-labelledby="confirm-order-title">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirm-order-title" className="mb-4 text-xl font-bold">Confirm Your Order</h2>

        {/* Order preview (compact) */}
        <div className="mb-4 overflow-hidden rounded-lg border">
          <div className="grid grid-cols-6 bg-gray-50 px-3 py-2 text-sm font-semibold">
            <div className="col-span-4">Product</div>
            <div className="col-span-1 text-right">Qty</div>
            <div className="col-span-1 text-right">Total</div>
          </div>
          <ul className="divide-y">
            {summary.items.map((it) => (
              <li key={it.id} className="grid grid-cols-6 px-3 py-2 text-sm">
                <div className="col-span-4 truncate">{it.name}</div>
                <div className="col-span-1 text-right">{it.quantity}</div>
                <div className="col-span-1 text-right">₱{(it.price * it.quantity).toLocaleString()}</div>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-6 bg-gray-50 px-3 py-2 text-sm">
            <div className="col-span-5 text-right font-bold">Total:</div>
            <div className="col-span-1 text-right font-bold">₱{Number(summary.total).toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} disabled={isLoading} className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} disabled={isLoading} className="min-w-[108px] rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-80">
            {isLoading ? <LoadingSpinner /> : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}