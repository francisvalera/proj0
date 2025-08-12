"use client";

import { useState } from "react";
import { createProduct } from "../actions";

export default function NewProductForm() {
  const [open, setOpen] = useState(false);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  return (
    <>
      <button
        className="px-3 py-2 rounded-md bg-black text-white"
        onClick={() => setOpen(true)}
      >
        New Product
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            // IMPORTANT: do NOT set method or encType when using a function action
            action={async (fd) => {
              setPending(true);
              fd.set("primaryIndex", String(primaryIndex));
              const res = await createProduct(fd);
              setPending(false);
              if (res?.ok) setOpen(false);
            }}
            className="bg-white w-full max-w-xl rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Product</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-sm text-gray-600">Name</span>
                <input
                  name="name"
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm text-gray-600">Brand</span>
                <input
                  name="brandName"
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm text-gray-600">Price</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm text-gray-600">Stock</span>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              </label>

              <label className="flex items-center gap-2 col-span-2">
                <input name="isFeatured" type="checkbox" />
                <span className="text-sm">Featured</span>
              </label>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-gray-600 block">Images</span>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="w-full border rounded-md px-3 py-2"
                onChange={(e) => {
                  const files = e.target.files;
                  setPrimaryIndex(0);
                  if (!files || files.length === 0) {
                    setPreviews([]);
                    return;
                  }
                  // Build object URL previews (cleaned up automatically on page reload)
                  const urls = Array.from(files).map((f) =>
                    URL.createObjectURL(f)
                  );
                  setPreviews(urls);
                }}
              />

              {/* Thumbnail selector for primary image */}
              {previews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {previews.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setPrimaryIndex(i)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        primaryIndex === i
                          ? "border-black"
                          : "border-transparent"
                      }`}
                      aria-label={`Select image ${i + 1} as primary`}
                      title={`Set #${i + 1} as primary`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`preview ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                  {/* keep grid shape to avoid layout jump */}
                  {previews.length < 5 &&
                    Array.from({ length: 5 - previews.length }).map((_, k) => (
                      <div
                        key={`blank-${k}`}
                        className="aspect-square rounded-md bg-gray-100 border-2 border-dashed"
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Hidden field so server action receives the selected primary index */}
            <input type="hidden" name="primaryIndex" value={primaryIndex} />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md border"
                disabled={pending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 rounded-md bg-black text-white disabled:opacity-50"
                disabled={pending}
              >
                {pending ? "Saving…" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
