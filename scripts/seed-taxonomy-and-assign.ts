import { PrismaClient } from "@prisma/client";

/**
 * Seed Categories/Subcategories and assign each product a single subcategory via FK ONLY.
 * - Idempotent: upserts Categories/Subcategories
 * - Sets Product.subcategoryId (does NOT touch ProductSubcategory join table)
 *
 * Run (after `npx prisma generate`):
 *   npx tsx scripts/seed-taxonomy-and-assign.ts
 */

const prisma = new PrismaClient();

// --- 1) Define taxonomy -----------------------------------------------------
const TAXONOMY: Record<string, string[]> = {
  Engine: ["Pistons", "Exhaust"],
  Brakes: ["Calipers"],
  Body: ["Mirrors"],
};

// --- 2) Map products -> desired Subcategory --------------------------------
// Prefer matching by SKU; fall back to name.
const PRODUCT_MAP: { sku?: string; name?: string; category: string; subcategory: string }[] = [
  { sku: "HP-PST-001", name: "High-Performance Piston Kit", category: "Engine", subcategory: "Pistons" },
  { sku: "RB-CLP-002", name: "Racing Brake Caliper Set",   category: "Brakes", subcategory: "Calipers" },
  { sku: "TF-EXH-003", name: "Titanium Full Exhaust System", category: "Engine", subcategory: "Exhaust" },
  { sku: "CSM-MIR-004", name: "Custom CNC Side Mirrors",    category: "Body",   subcategory: "Mirrors" },
];

async function upsertTaxonomy() {
  const subIdByKey = new Map<string, string>(); // `${cat}:${sub}` -> subcategoryId

  for (const [catName, subs] of Object.entries(TAXONOMY)) {
    const cat = await prisma.category.upsert({
      where: { name: catName },
      create: { name: catName },
      update: {},
    });

    for (const subName of subs) {
      const sub = await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: cat.id, name: subName } },
        create: { categoryId: cat.id, name: subName },
        update: {},
      });
      subIdByKey.set(`${catName}:${subName}`, sub.id);
    }
  }

  return { subIdByKey };
}

async function findProduct(where: { sku?: string; name?: string }) {
  if (where.sku) {
    const bySku = await prisma.product.findFirst({ where: { sku: where.sku } });
    if (bySku) return bySku;
  }
  if (where.name) {
    return prisma.product.findFirst({ where: { name: where.name } });
  }
  return null;
}

async function assignProducts(subIdByKey: Map<string, string>) {
  for (const m of PRODUCT_MAP) {
    const prod = await findProduct({ sku: m.sku, name: m.name });
    if (!prod) {
      console.warn(`⚠️  Product not found for mapping: ${m.sku ?? m.name}`);
      continue;
    }

    const key = `${m.category}:${m.subcategory}`;
    const subId = subIdByKey.get(key);
    if (!subId) {
      console.warn(`⚠️  Subcategory not found for ${key}. Check TAXONOMY.`);
      continue;
    }

    await prisma.product.update({ where: { id: prod.id }, data: { subcategoryId: subId } });
    console.log(`✅ ${prod.name} → ${m.category} / ${m.subcategory}`);
  }
}

async function main() {
  const { subIdByKey } = await upsertTaxonomy();
  await assignProducts(subIdByKey);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
