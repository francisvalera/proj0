import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import OrdersTableCard from "../_components/OrdersTableCard";
import { orders } from "@/lib/admin/mock";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Orders" />
      <OrdersTableCard orders={orders} />
    </div>
  );
}
