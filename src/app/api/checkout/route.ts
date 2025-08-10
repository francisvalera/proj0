import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CartItem } from "@/context/CartContext";
export const runtime = "nodejs";

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  userId?: string;
  sendReceipt?: boolean;
}

interface CheckoutRequest {
  customerInfo: CustomerInfo;
  cartItems: CartItem[];
  total: number;
}

const generateOrderId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "KKMT";
  for (let i = 0; i < 3; i++) result += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 3; i++) result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return result;
};

import { sendEmail } from "@/lib/email";
import OrderConfirmation from "@/lib/email/templates/order-confirmation";
import NewOrder from "@/lib/email/templates/new-order";

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();
    if (!body.customerInfo || !body.cartItems?.length || typeof body.total !== "number") {
      return NextResponse.json({ message: "Invalid checkout request. Missing required data." }, { status: 400 });
    }

    const { customerInfo, cartItems, total } = body;

    const newOrder = await prisma.order.create({
      data: {
        orderId: generateOrderId(),
        total,
        customerName: customerInfo.fullName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingAddress: {
          province: customerInfo.province,
          city: customerInfo.city,
          barangay: customerInfo.barangay,
          street: customerInfo.street,
        },
        items: {
          create: cartItems.map((item) => ({ productId: item.id, quantity: item.quantity, price: item.price })),
        },
        userId: customerInfo.userId || undefined,
      },
      include: { items: true },
    });

    // Build email order with product names without using `any`
    const nameById = new Map<string, string>(
  (cartItems || []).map((c) => [
    c.id,
    (c as { name?: string; title?: string; productName?: string }).name ??
      (c as { title?: string }).title ??
      (c as { productName?: string }).productName ??
      String(c.id),
  ])
);

type ItemWithName = { productId: string; quantity: number; price: number; productName?: string };

// Build a typed shipping object (Prisma JSON -> structured shape for email)
const rawAddr = newOrder.shippingAddress as unknown as {
  province?: string | null;
  city?: string | null;
  barangay?: string | null;
  street?: string | null;
} | null;

const shipping: {
  province?: string | null;
  city?: string | null;
  barangay?: string | null;
  street?: string | null;
} | null = rawAddr && typeof rawAddr === "object" ? {
  province: rawAddr?.province ?? null,
  city: rawAddr?.city ?? null,
  barangay: rawAddr?.barangay ?? null,
  street: rawAddr?.street ?? null,
} : null;

const emailOrder = {
  ...newOrder,
  shippingAddress: shipping,
  items: newOrder.items.map((i) => ({ ...i, productName: nameById.get(i.productId) ?? i.productId })) as ItemWithName[],
};

    try {
      const storeEmail = process.env.STORE_EMAIL;
      if (!storeEmail) console.error("STORE_EMAIL is not set in environment variables");

      if (storeEmail) {
        await sendEmail({ to: storeEmail, subject: `New Order Received: ${newOrder.orderId}`, component: NewOrder, props: { order: emailOrder } });
      }

      if (customerInfo.sendReceipt && newOrder.customerEmail) {
        await sendEmail({ to: newOrder.customerEmail, subject: `Your Order Receipt: ${newOrder.orderId}`, component: OrderConfirmation, props: { order: emailOrder } });
      }
    } catch (emailErr) {
      console.error("Email dispatch error", emailErr);
    }

    return NextResponse.json({ orderId: newOrder.orderId }, { status: 201 });
  } catch (error) {
    console.error("--- FAILED TO CREATE ORDER ---", error);
    return NextResponse.json({ message: "An unexpected error occurred while creating the order." }, { status: 500 });
  }
}