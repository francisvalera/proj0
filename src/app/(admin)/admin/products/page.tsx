import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import ProductsTable from "./_components/ProductsTable";
import NewProductForm from "./_components/NewProductForm";

export default async function ProductsPage() {
  noStore();
  await requireAdmin("/admin/products");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      primaryImage: true,
      images: true,
      subcategory: { include: { category: true } }, // <-- new shape
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black dark:text-white">Products</h1>
        <NewProductForm />
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
