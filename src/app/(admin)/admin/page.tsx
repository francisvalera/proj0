import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import StatCard from "./_components/StatCard";
import { orders, products } from "@/lib/admin/mock";

function currency(n: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
}

export default function AdminDashboard() {
  const totalSales = orders.filter(o => o.status === "PAID" || o.status === "SHIPPED").reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "PENDING").length;
  const lowStock = products.filter(p => p.stock <= 10).length;
  const activeProducts = products.filter(p => p.status === "ACTIVE").length;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <PageBreadcrumb pageTitle="Dashboard" />
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total sales" value={currency(totalSales)} hint="Paid + Shipped" />
        <StatCard label="Pending orders" value={String(pendingOrders)} />
        <StatCard label="Active products" value={String(activeProducts)} />
        <StatCard label="Low stock" value={String(lowStock)} />
      </section>
    </div>
  );
}
