import { PrismaClient } from "@prisma/client";

/**
 * One-off script to attach Categories/Subcategories to the 4 demo products.
 * - Idempotent (safe to run multiple times)
 * - Creates missing Categories/Subcategories as needed
 * - Uses SKU first (if available), then falls back to name
 *
 * Run:
 *   npx tsx scripts/assign-product-categories.ts
 */

const prisma = new PrismaClient();

// --- Types -----------------------------------------------------------------
interface Match {
  sku?: string;
  name?: string;
}
interface Pair {
  category: string;
  subcategory: string;
}
interface Mapping {
  match: Match;
  pairs: Pair[];
}

// --- Mapping for your 4 products ------------------------------------------
const MAPPINGS: Mapping[] = [
  {
    match: { sku: "HP-PST-001", name: "High-Performance Piston Kit" },
    pairs: [{ category: "Engine", subcategory: "Pistons" }],
  },
  {
    match: { sku: "RB-CLP-002", name: "Racing Brake Caliper Set" },
    pairs: [{ category: "Brakes", subcategory: "Calipers" }],
  },
  {
    match: { sku: "TF-EXH-003", name: "Titanium Full Exhaust System" },
    pairs: [{ category: "Engine", subcategory: "Exhaust" }],
  },
  {
    match: { sku: "CSM-MIR-004", name: "Custom CNC Side Mirrors" },
    pairs: [{ category: "Body", subcategory: "Mirrors" }],
  },
];

// --- Helpers ----------------------------------------------------------------
async function upsertCategory(name: string): Promise<string> {
  const cat = await prisma.category.upsert({
    where: { name },
    create: { name },
    update: {},
  });
  return cat.id;
}

async function upsertSubcategory(categoryId: string, name: string): Promise<string> {
  // Requires a unique constraint on (categoryId, name):
  //   @@unique([categoryId, name], name: "categoryId_name")
  const sub = await prisma.subcategory.upsert({
    where: { categoryId_name: { categoryId, name } },
    create: { categoryId, name },
    update: {},
  });
  return sub.id;
}

async function findProduct(match: Match) {
  if (match.sku) {
    const p = await prisma.product.findFirst({ where: { sku: match.sku } });
    if (p) return p;
  }
  if (match.name) {
    const p = await prisma.product.findFirst({ where: { name: match.name } });
    if (p) return p;
  }
  return null;
}

async function attach(productId: string, pairs: Pair[]): Promise<void> {
  for (const pair of pairs) {
    const categoryId = await upsertCategory(pair.category);
    const subcategoryId = await upsertSubcategory(categoryId, pair.subcategory);

    // Make the join row (idempotent)
    await prisma.productSubcategory.upsert({
      where: { productId_subcategoryId: { productId, subcategoryId } },
      create: { productId, subcategoryId },
      update: {},
    });
  }
}

// --- Main -------------------------------------------------------------------
async function main(): Promise<void> {
  for (const m of MAPPINGS) {
    const product = await findProduct(m.match);
    if (!product) {
      console.warn(
        `⚠️  Product not found for mapping (sku: ${m.match.sku ?? "-"}, name: ${m.match.name ?? "-"}). Skipping.`
      );
      continue;
    }

    await attach(product.id, m.pairs);
    console.log(`✅ Attached categories for: ${product.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
