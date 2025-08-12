import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  brandName: z.string().min(1),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean().optional().default(false),
});
export const productUpdateSchema = productCreateSchema.partial();

export const orderUpdateSchema = z.object({
  // example: allow updating total or status later when you add it
  total: z.number().nonnegative().optional(),
});
