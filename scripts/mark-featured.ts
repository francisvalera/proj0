import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const picks = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    select: { id: true, name: true },
  });

  if (picks.length === 0) {
    console.log("No active products found.");
    return;
  }

  // Optional: clear previous featured flags
  await prisma.product.updateMany({ data: { isFeatured: false } });

  for (const p of picks) {
    await prisma.product.update({ where: { id: p.id }, data: { isFeatured: true } });
  }

  console.log("Featured products:", picks.map((p) => `${p.name} (${p.id})`).join(", "));
}

main().finally(() => prisma.$disconnect());
