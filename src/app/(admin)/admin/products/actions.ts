"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type Role = "USER" | "ADMIN";

type ActionResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "UNAUTHORIZED"
        | "NOT_FOUND"
        | "HAS_ORDERS"
        | "INVALID_INPUT"
        | "INTERNAL_ERROR";
    };

async function requireAdminSession(): Promise<true | ActionResult> {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as Role | undefined;
  if (!session || role !== "ADMIN") return { ok: false, reason: "UNAUTHORIZED" };
  return true;
}

/** ---- helpers ---- */
function toPriceNumber(input: string): number {
  // allow "1,234.56" or "1234.56"
  const n = Number.parseFloat(input.replace(/,/g, ""));
  if (!Number.isFinite(n)) return 0;
  // round to 2dp to match @db.Decimal(10,2)
  return Math.round(n * 100) / 100;
}

/** ---------- CREATE PRODUCT (used by NewProductForm) ---------- **/
export async function createProduct(formData: FormData): Promise<ActionResult> {
  try {
    const auth = await requireAdminSession();
    if (auth !== true) return auth;

    const name = (formData.get("name") ?? "").toString().trim();
    const brandName = (formData.get("brandName") ?? "").toString().trim();
    const priceStr = (formData.get("price") ?? "").toString().trim();
    const stockStr = (formData.get("stock") ?? "").toString().trim();
    const isFeaturedRaw = formData.get("isFeatured");
    const imagesRaw = formData.get("images");

    if (!name || !priceStr) return { ok: false, reason: "INVALID_INPUT" };

    const price = toPriceNumber(priceStr);
    const stock = Number.isFinite(Number(stockStr)) ? Number(stockStr) : 0;
    const isFeatured =
      typeof isFeaturedRaw === "string"
        ? isFeaturedRaw === "true" || isFeaturedRaw === "on" || isFeaturedRaw === "1"
        : Boolean(isFeaturedRaw);

    type IncomingImage = { url: string; isPrimary?: boolean; alt?: string | null };
    const incomingImages: IncomingImage[] = (() => {
      if (!imagesRaw) return [];
      try {
        const parsed = JSON.parse(imagesRaw.toString()) as unknown;
        if (Array.isArray(parsed)) {
          return parsed
            .map((v) => {
              if (v && typeof v === "object" && "url" in v && typeof (v as { url?: unknown }).url === "string") {
                return {
                  url: (v as { url: string }).url,
                  isPrimary: Boolean((v as { isPrimary?: boolean }).isPrimary),
                  alt: (v as { alt?: string | null }).alt ?? null,
                } as IncomingImage;
              }
              return null;
            })
            .filter((x): x is IncomingImage => Boolean(x));
        }
        return [];
      } catch {
        return [];
      }
    })();

    await prisma.$transaction(async (tx) => {
      // 1) Create product
      const created = await tx.product.create({
        data: {
          name,
          brandName,
          price, // number, per Prisma Client type (decimalNumber)
          stock,
          isFeatured,
          isActive: true,
        },
        select: { id: true },
      });

      // 2) Optionally attach images, set primary
      if (incomingImages.length > 0) {
        let primaryId: string | null = null;

        for (let i = 0; i < incomingImages.length; i++) {
          const img = incomingImages[i];
          const createdImg = await tx.productImage.create({
            data: {
              productId: created.id,
              url: img.url,
              alt: img.alt ?? null,
              sortOrder: i,
            },
            select: { id: true },
          });

          if ((img.isPrimary ?? false) && !primaryId) {
            primaryId = createdImg.id;
          }
          if (i === 0 && !primaryId) {
            primaryId = createdImg.id;
          }
        }

        if (primaryId) {
          await tx.product.update({
            where: { id: created.id },
            data: { primaryImageId: primaryId },
          });
        }
      }
    });

    revalidatePath("/admin/products");
    return { ok: true };
  } catch {
    return { ok: false, reason: "INTERNAL_ERROR" };
  }
}

/** ---------- SAFE DELETE (block if used in orders) ---------- **/
export async function deleteProduct(productId: string): Promise<ActionResult> {
  if (!productId) return { ok: false, reason: "INVALID_INPUT" };
  const auth = await requireAdminSession();
  if (auth !== true) return auth;

  const usedCount = await prisma.orderItem.count({ where: { productId } });
  if (usedCount > 0) return { ok: false, reason: "HAS_ORDERS" };

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  return { ok: true };
}

/** ---------- TOGGLES ---------- **/
export async function toggleProductActive(productId: string, value: boolean): Promise<ActionResult> {
  if (!productId) return { ok: false, reason: "INVALID_INPUT" };
  const auth = await requireAdminSession();
  if (auth !== true) return auth;

  await prisma.product.update({ where: { id: productId }, data: { isActive: value } });
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function toggleProductFeatured(productId: string, value: boolean): Promise<ActionResult> {
  if (!productId) return { ok: false, reason: "INVALID_INPUT" };
  const auth = await requireAdminSession();
  if (auth !== true) return auth;

  await prisma.product.update({
    where: { id: productId }, // <- string, not { equals: string }
    data: { isFeatured: value },
  });

  revalidatePath("/admin/products");
  return { ok: true };
}

/** ---------- SET PRIMARY IMAGE ---------- **/
export async function setPrimaryProductImage(productId: string, imageId: string): Promise<ActionResult> {
  if (!productId || !imageId) return { ok: false, reason: "INVALID_INPUT" };
  const auth = await requireAdminSession();
  if (auth !== true) return auth;

  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId },
    select: { id: true },
  });
  if (!image) return { ok: false, reason: "NOT_FOUND" };

  await prisma.product.update({
    where: { id: productId },
    data: { primaryImageId: image.id },
  });

  revalidatePath("/admin/products");
  return { ok: true };
}
