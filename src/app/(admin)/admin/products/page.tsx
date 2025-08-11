import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ProductsTableCard from "../_components/ProductsTableCard";
import { products } from "@/lib/admin/mock";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Products" />
      <ProductsTableCard products={products} />
    </div>
  );
}
