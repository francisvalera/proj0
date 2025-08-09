import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CartItem } from '@/context/CartContext';

// Ensure this API route runs in the Node.js runtime, which is required by Prisma.
export const runtime = "nodejs"; 

// --- Type Definitions for a Robust API ---
interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  userId?: string;
}

interface CheckoutRequest {
  customerInfo: CustomerInfo;
  cartItems: CartItem[];
  total: number;
}

// Helper function to generate a unique, formatted Order ID
const generateOrderId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "KKMT";
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 3; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
};

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();

    // --- Robust Input Validation ---
    // This addresses your observation about missing or malformed data.
    if (
      !body.customerInfo ||
      !body.cartItems?.length ||
      typeof body.total !== "number"
    ) {
      return NextResponse.json(
        { message: "Invalid checkout request. Missing required data." },
        { status: 400 }
      );
    }

    const { customerInfo, cartItems, total } = body;

    // Create the order in the database
    const newOrder = await prisma.order.create({
      data: {
        orderId: generateOrderId(),
        total,
        customerName: customerInfo.fullName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        // Prisma's JSON type accepts a standard object here.
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
    });

    // We only need to return the ID, which is guaranteed to be correct.
    // This avoids the type mismatch error during the Vercel build.
    return NextResponse.json(
      { orderId: newOrder.orderId },
      { status: 201 }
    );
  } catch (error) {
    console.error("--- FAILED TO CREATE ORDER ---", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while creating the order." },
      { status: 500 }
    );
  }
}
