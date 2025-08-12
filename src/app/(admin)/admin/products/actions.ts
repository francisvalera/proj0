// src/app/(admin)/admin/products/actions.ts
"use server";

import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/uploads";
import { productCreateSchema, productUpdateSchema } from "@/lib/validators/product";

function isAdmin(session: Session | null): session is Session & { user: { role: "ADMIN" } } {
  return Boolean(session?.user && session.user.role === "ADMIN");
}

export async function createProduct(formData: FormData) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!isAdmin(session)) throw new Error("Forbidden");

  const base = {
    name: String(formData.get("name") ?? ""),
    price: Number(formData.get("price") ?? 0),
    brandName: String(formData.get("brandName") ?? ""),
    stock: Number(formData.get("stock") ?? 0),
    isFeatured: String(formData.get("isFeatured") ?? "") === "on",
    primaryIndex: Number(formData.get("primaryIndex") ?? 0),
  };

  const parsed = productCreateSchema.safeParse(base);
  if (!parsed.success) throw new Error(parsed.error.message);

  const files: File[] = [];
  for (const v of formData.getAll("images")) {
    if (v instanceof File && v.size > 0) files.push(v);
  }

  const uploads = await Promise.all(files.map(uploadImage));

  const created = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name: parsed.data.name,
        price: parsed.data.price,
        brandName: parsed.data.brandName,
        stock: parsed.data.stock,
        isFeatured: parsed.data.isFeatured ?? false,
      },
    });

    if (uploads.length === 0) return product;

    const images = await Promise.all(
      uploads.map((u, i) =>
        tx.productImage.create({
          data: { productId: product.id, url: u.url, sortOrder: i },
        })
      )
    );

    const primaryIdx = parsed.data.primaryIndex ?? 0;
    const primary = images[primaryIdx] ?? images[0];

    await tx.product.update({
      where: { id: product.id },
      data: { primaryImageId: primary.id },
    });

    return product;
  });

  revalidatePath("/admin/products");
  return { ok: true, id: created.id };
}

export async function updateProduct(id: string, formData: FormData) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!isAdmin(session)) throw new Error("Forbidden");

  const base = {
    name: formData.get("name")?.toString(),
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    brandName: formData.get("brandName")?.toString(),
    stock: formData.get("stock") ? Number(formData.get("stock")) : undefined,
    isFeatured: formData.get("isFeatured") ? String(formData.get("isFeatured")) === "on" : undefined,
    primaryImageId: formData.get("primaryImageId")?.toString(),
    removedImageIds: (formData.getAll("removedImageIds") ?? []).map(String),
  };

  const parsed = productUpdateSchema.safeParse(base);
  if (!parsed.success) throw new Error(parsed.error.message);

  const newFiles: File[] = [];
  for (const v of formData.getAll("images")) {
    if (v instanceof File && v.size > 0) newFiles.push(v);
  }
  const newUploads = await Promise.all(newFiles.map(uploadImage));

  await prisma.$transaction(async (tx) => {
    const { removedImageIds = [], ...productData } = parsed.data;

    if (Object.keys(productData).length > 0) {
      await tx.product.update({ where: { id }, data: productData });
    }

    if (removedImageIds.length) {
      await tx.productImage.deleteMany({
        where: { id: { in: removedImageIds }, productId: id },
      });
      const product = await tx.product.findUnique({ where: { id } });
      if (product?.primaryImageId && removedImageIds.includes(product.primaryImageId)) {
        await tx.product.update({ where: { id }, data: { primaryImageId: null } });
      }
    }

    if (newUploads.length) {
      const existingCount = await tx.productImage.count({ where: { productId: id } });
      const created = await Promise.all(
        newUploads.map((u, i) =>
          tx.productImage.create({
            data: { productId: id, url: u.url, sortOrder: existingCount + i },
          })
        )
      );
      const product = await tx.product.findUnique({ where: { id } });
      if (!product?.primaryImageId && created.length) {
        await tx.product.update({ where: { id }, data: { primaryImageId: created[0].id } });
      }
    }
  });

  revalidatePath("/admin/products");
  return { ok: true };
}

export async function deleteProduct(id: string) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!isAdmin(session)) throw new Error("Forbidden");

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function setPrimaryImage(productId: string, imageId: string) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!isAdmin(session)) throw new Error("Forbidden");

  await prisma.product.update({ where: { id: productId }, data: { primaryImageId: imageId } });
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function removeImage(productId: string, imageId: string) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!isAdmin(session)) throw new Error("Forbidden");

  await prisma.$transaction(async (tx) => {
    await tx.productImage.delete({ where: { id: imageId } });
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (product?.primaryImageId === imageId) {
      const next = await tx.productImage.findFirst({
        where: { productId },
        orderBy: { sortOrder: "asc" },
      });
      await tx.product.update({
        where: { id: productId },
        data: { primaryImageId: next?.id ?? null },
      });
    }
  });

  revalidatePath("/admin/products");
  return { ok: true };
}
