import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Mapping = { name?: string; sku?: string; category: string; subcategory: string };

const MAPPINGS: Mapping[] = [
  { name: "High-Performance Piston Kit", category: "Engine", subcategory: "Pistons" },
  { name: "Racing Brake Caliper Set", category: "Brakes", subcategory: "Calipers" },
  { name: "Titanium Full Exhaust System", category: "Engine", subcategory: "Exhaust" },
  { name: "Custom CNC Side Mirrors", category: "Body", subcategory: "Mirrors" },
];

async function upsertCategory(name: string) {
  return prisma.category.upsert({ where: { name }, create: { name }, update: {} });
}
async function upsertSubcategory(categoryId: string, name: string) {
  return prisma.subcategory.upsert({
    where: { categoryId_name: { categoryId, name } },
    create: { categoryId, name },
    update: {},
  });
}

async function main() {
  for (const m of MAPPINGS) {
    const where = m.sku ? { sku: m.sku } : { name: m.name! };
    const product = await prisma.product.findFirst({ where });
    if (!product) {
      console.warn(`Product not found for mapping: ${m.name ?? m.sku}`);
      continue;
    }

    const cat = await upsertCategory(m.category);
    const sub = await upsertSubcategory(cat.id, m.subcategory);

    await prisma.product.update({
      where: { id: product.id },
      data: { subcategoryId: sub.id },
    });

    console.log(`Set ${product.name} -> ${cat.name} / ${sub.name}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
