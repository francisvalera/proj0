import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function OrdersPage() {
  noStore();
  await requireAdmin("/admin/orders");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: true },
  });

  // Render your orders table/list here; no H1
  return (
    <div className="rounded-xl border border-[#ECEFF4] bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* TODO: orders table component */}
      <div className="text-sm text-gray-500">Orders: {orders.length}</div>
    </div>
  );
}
