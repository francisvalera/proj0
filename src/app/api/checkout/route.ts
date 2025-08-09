import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CartItem } from '@/context/CartContext';

// Helper function to generate the custom Order ID
const generateOrderId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = 'KKMT';
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
    const body = await request.json();
    const { customerInfo, cartItems, total } = body;

    // Create the order in the database
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
          create: cartItems.map((item: CartItem) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        userId: customerInfo.userId || undefined,
      },
    });

    return NextResponse.json({ orderId: newOrder.orderId }, { status: 201 });

  } catch (error) {
    console.error("--- FAILED TO CREATE ORDER ---");
    console.error(error);
    return NextResponse.json({ message: 'An unexpected error occurred while creating the order.' }, { status: 500 });
  }
}
