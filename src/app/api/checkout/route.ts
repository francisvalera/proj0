import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CartItem } from "@/context/CartContext";

// Must be Node (Prisma + Nodemailer)
export const runtime = "nodejs";

// --- Types ---
interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  userId?: string;
  sendReceipt?: boolean; // checkbox in Checkout page
}

interface CheckoutRequest {
  customerInfo: CustomerInfo;
  cartItems: CartItem[]; // must include id, name, price, quantity
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

// Email imports
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
          create: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        userId: customerInfo.userId || undefined,
      },
      include: { items: true },
    });

    // === Build email payload WITH product names (no DB reads) ===
    const nameById = new Map(
      (cartItems || []).map((c: any) => [
        c.id,
        c.name ?? c.title ?? c.productName ?? String(c.id),
      ])
    );

    const emailOrder = {
      ...newOrder,
      items: newOrder.items.map((i: any) => ({
        ...i,
        productName: nameById.get(i.productId) ?? i.productId,
      })),
    } as any;

    // === Send Emails (won't break checkout if they fail) ===
    try {
      const storeEmail = process.env.STORE_EMAIL;
      if (!storeEmail) {
        console.error("STORE_EMAIL is not set in environment variables");
      }

      // Store notification — always
      if (storeEmail) {
        await sendEmail({
          to: storeEmail,
          subject: `New Order Received: ${newOrder.orderId}`,
          component: NewOrder,
          props: { order: emailOrder },
        });
      }

      // Customer confirmation — only if checkbox was ticked
      if (customerInfo.sendReceipt && newOrder.customerEmail) {
        await sendEmail({
          to: newOrder.customerEmail,
          subject: `Your Order Receipt: ${newOrder.orderId}`,
          component: OrderConfirmation,
          props: { order: emailOrder },
        });
      }
    } catch (emailErr) {
      console.error("Email dispatch error", emailErr);
      // Do NOT throw — checkout must still succeed
    }

    return NextResponse.json({ orderId: newOrder.orderId }, { status: 201 });
  } catch (error) {
    console.error("--- FAILED TO CREATE ORDER ---", error);
    return NextResponse.json({ message: "An unexpected error occurred while creating the order." }, { status: 500 });
  }
}
