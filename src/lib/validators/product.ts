import { z } from "zod";

export const productBaseSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(), // if Prisma uses Decimal, accept number here and cast later
  brandName: z.string().min(1),
  stock: z.number().int().nonnegative(),
  isFeatured: z.boolean().optional().default(false),
});

export const productCreateSchema = productBaseSchema.extend({
  // Index of the primary image among the uploaded files (0-based)
  primaryIndex: z.coerce.number().int().min(0).optional(),
});

export const productUpdateSchema = productBaseSchema.partial().extend({
  primaryImageId: z.string().optional(),
  removedImageIds: z.array(z.string()).optional(),
});
