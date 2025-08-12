import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import ProductsTable from "./_components/ProductsTable";

export default async function ProductsPage() {
  noStore();
  await requireAdmin("/admin/products");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true, primaryImage: true },
  });

  return <ProductsTable products={products} />;
}
