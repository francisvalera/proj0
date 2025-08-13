import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Backfill Product.subcategoryId from existing ProductSubcategory join table.
 * If multiple, pick the first by subcategory name (deterministic).
 */
async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      subcategoryId: true,
      productSubcategories: {
        include: { subcategory: { select: { id: true, name: true, categoryId: true } } },
      },
    },
  });

  for (const p of products) {
    if (p.subcategoryId) continue; // already set

    const subs = p.productSubcategories;
    if (!subs || subs.length === 0) continue;

    const chosen = subs.slice().sort((a, b) => a.subcategory.name.localeCompare(b.subcategory.name))[0];

    await prisma.product.update({
      where: { id: p.id },
      data: { subcategoryId: chosen.subcategory.id },
    });

    console.log(`Set subcategory for "${p.name}" -> ${chosen.subcategory.name}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
