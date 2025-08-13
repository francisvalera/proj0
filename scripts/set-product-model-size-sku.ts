import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Row = { name?: string; sku?: string; model?: string; size?: string; nextSku?: string };

const DATA: Row[] = [
  { name: "High-Performance Piston Kit", model: "CBR150/CBR250", size: "Standard", nextSku: "HP-PST-001" },
  { name: "Racing Brake Caliper Set",  model: "Universal Sport", size: "Large",   nextSku: "RB-CLP-002" },
  { name: "Titanium Full Exhaust System", model: "YZF-R3",      size: "Long",    nextSku: "TF-EXH-003" },
  { name: "Custom CNC Side Mirrors",   model: "Naked/Street",   size: "Pair",    nextSku: "CSM-MIR-004" },
];

async function main() {
  for (const d of DATA) {
    const where = d.sku ? { sku: d.sku } : { name: d.name! };
    const p = await prisma.product.findFirst({ where });
    if (!p) {
      console.warn("Product not found for", d.name ?? d.sku);
      continue;
    }
    await prisma.product.update({
      where: { id: p.id },
      data: { model: d.model, size: d.size, sku: d.nextSku ?? p.sku },
    });
    console.log(`Updated ${p.name}`);
  }
}

main().finally(() => prisma.$disconnect());
