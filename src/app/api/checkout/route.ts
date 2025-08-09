import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CartItem } from '@/context/CartContext';
import { transporter, mailOptions } from '@/lib/nodemailer';
import { Prisma } from '@prisma/client';

// Type for the order with included relations (matches your Prisma query)
type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}> & {
  // Narrow type so shippingAddress is never null in our code
  shippingAddress: {
    street: string;
    barangay: string;
    city: string;
    province: string;
  };
};

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

// Helper function to generate the email HTML content
const generateEmailHtml = (order: OrderWithDetails, forAdmin: boolean) => {
  const itemsHtml = order.items
    .map((item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product.name} (x${item.quantity})</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₱${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `)
    .join('');

  const shipping = order.total > 2000 ? 0 : 150;

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #333;">${forAdmin ? 'New Order Received!' : 'Your Order Confirmation'}</h2>
      <p>Order ID: <strong>#${order.orderId}</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Product</th>
            <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding: 8px; text-align: right;">Subtotal:</td>
            <td style="padding: 8px; text-align: right;">₱${(order.total - shipping).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: right;">Shipping:</td>
            <td style="padding: 8px; text-align: right;">${shipping === 0 ? 'Free' : `₱${shipping.toLocaleString()}`}</td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">₱${order.total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
      <h3 style="color: #333;">Shipping Information</h3>
      <p>
        ${order.customerName}<br>
        ${order.shippingAddress.street}, ${order.shippingAddress.barangay}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.province}<br>
        ${order.customerPhone}<br>
        ${order.customerEmail}
      </p>
      <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
        This is an automated notification from Kuya Kardz Motorcycle Trading.
      </p>
    </div>
  `;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customerInfo: {
        fullName: string;
        email: string;
        phone: string;
        province: string;
        city: string;
        barangay: string;
        street: string;
        userId?: string;
        sendReceipt?: boolean;
      };
      cartItems: CartItem[];
      total: number;
    };

    const { customerInfo, cartItems, total } = body;

    // Create the order in the database
    const createdOrder = await prisma.order.create({
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
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Assert that shippingAddress is not null
    if (!createdOrder.shippingAddress) {
      throw new Error('Order shippingAddress is missing.');
    }

    // Build fully non-nullable order object
    const newOrder: OrderWithDetails = {
      ...createdOrder,
      shippingAddress: createdOrder.shippingAddress,
    };

    // Send email notifications
    try {
      const settings = await prisma.settings.findFirst();
      if (settings?.storeEmail) {
        await transporter.sendMail({
          ...mailOptions,
          to: settings.storeEmail,
          subject: `New Order Received: #${newOrder.orderId}`,
          html: generateEmailHtml(newOrder, true),
        });
      }

      if (customerInfo.sendReceipt) {
        await transporter.sendMail({
          ...mailOptions,
          to: customerInfo.email,
          subject: `Your Order Confirmation: #${newOrder.orderId}`,
          html: generateEmailHtml(newOrder, false),
        });
      }
    } catch (emailError) {
      console.error('--- FAILED TO SEND EMAIL ---', emailError);
    }

    return NextResponse.json({ orderId: newOrder.orderId }, { status: 201 });

  } catch (error) {
    console.error('--- FAILED TO CREATE ORDER ---', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred while creating the order.' },
      { status: 500 }
    );
  }
}

// =====================================

// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
// import { CartItem } from '@/context/CartContext';
// import { transporter, mailOptions } from '@/lib/nodemailer';
// import { Prisma } from '@prisma/client';

// // Type for the order with included relations (matches your Prisma query)
// type OrderWithDetails = Prisma.OrderGetPayload<{
//   include: {
//     items: {
//       include: {
//         product: true;
//       };
//     };
//   };
// }>;

// // Helper function to generate the custom Order ID
// const generateOrderId = () => {
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const numbers = '0123456789';
//   let result = 'KKMT';
//   for (let i = 0; i < 3; i++) {
//     result += letters.charAt(Math.floor(Math.random() * letters.length));
//   }
//   for (let i = 0; i < 3; i++) {
//     result += numbers.charAt(Math.floor(Math.random() * numbers.length));
//   }
//   return result;
// };

// // Helper function to generate the email HTML content
// const generateEmailHtml = (order: OrderWithDetails, forAdmin: boolean) => {
//   const itemsHtml = order.items
//     .map((item) => `
//     <tr>
//       <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product.name} (x${item.quantity})</td>
//       <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₱${(item.price * item.quantity).toLocaleString()}</td>
//     </tr>
//   `)
//     .join('');

//   const shipping = order.total > 2000 ? 0 : 150;

//   return `
//     <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
//       <h2 style="color: #333;">${forAdmin ? 'New Order Received!' : 'Your Order Confirmation'}</h2>
//       <p>Order ID: <strong>#${order.orderId}</strong></p>
//       <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//         <thead>
//           <tr>
//             <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Product</th>
//             <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${itemsHtml}
//         </tbody>
//         <tfoot>
//           <tr>
//             <td style="padding: 8px; text-align: right;">Subtotal:</td>
//             <td style="padding: 8px; text-align: right;">₱${(order.total - shipping).toLocaleString()}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; text-align: right;">Shipping:</td>
//             <td style="padding: 8px; text-align: right;">${shipping === 0 ? 'Free' : `₱${shipping.toLocaleString()}`}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
//             <td style="padding: 8px; text-align: right; font-weight: bold;">₱${order.total.toLocaleString()}</td>
//           </tr>
//         </tfoot>
//       </table>
//       <h3 style="color: #333;">Shipping Information</h3>
//       <p>
//         ${order.customerName}<br>
//         ${order.shippingAddress.street}, ${order.shippingAddress.barangay}<br>
//         ${order.shippingAddress.city}, ${order.shippingAddress.province}<br>
//         ${order.customerPhone}<br>
//         ${order.customerEmail}
//       </p>
//       <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
//         This is an automated notification from Kuya Kardz Motorcycle Trading.
//       </p>
//     </div>
//   `;
// };

// export async function POST(request: Request) {
//   try {
//     const body = await request.json() as {
//       customerInfo: {
//         fullName: string;
//         email: string;
//         phone: string;
//         province: string;
//         city: string;
//         barangay: string;
//         street: string;
//         userId?: string;
//         sendReceipt?: boolean;
//       };
//       cartItems: CartItem[];
//       total: number;
//     };

//     const { customerInfo, cartItems, total } = body;

//     // Create the order in the database
//     const newOrder: OrderWithDetails = await prisma.order.create({
//       data: {
//         orderId: generateOrderId(),
//         total,
//         customerName: customerInfo.fullName,
//         customerEmail: customerInfo.email,
//         customerPhone: customerInfo.phone,
//         shippingAddress: {
//           province: customerInfo.province,
//           city: customerInfo.city,
//           barangay: customerInfo.barangay,
//           street: customerInfo.street,
//         },
//         items: {
//           create: cartItems.map((item: CartItem) => ({
//             productId: item.id,
//             quantity: item.quantity,
//             price: item.price,
//           })),
//         },
//         userId: customerInfo.userId || undefined,
//       },
//       include: {
//         items: {
//           include: {
//             product: true,
//           },
//         },
//       },
//     });

//     // Send email notifications
//     try {
//       const settings = await prisma.settings.findFirst();
//       if (settings?.storeEmail) {
//         await transporter.sendMail({
//           ...mailOptions,
//           to: settings.storeEmail,
//           subject: `New Order Received: #${newOrder.orderId}`,
//           html: generateEmailHtml(newOrder, true),
//         });
//       }

//       if (customerInfo.sendReceipt) {
//         await transporter.sendMail({
//           ...mailOptions,
//           to: customerInfo.email,
//           subject: `Your Order Confirmation: #${newOrder.orderId}`,
//           html: generateEmailHtml(newOrder, false),
//         });
//       }
//     } catch (emailError) {
//       console.error('--- FAILED TO SEND EMAIL ---', emailError);
//     }

//     return NextResponse.json({ orderId: newOrder.orderId }, { status: 201 });

//   } catch (error) {
//     console.error('--- FAILED TO CREATE ORDER ---', error);
//     return NextResponse.json({ message: 'An unexpected error occurred while creating the order.' }, { status: 500 });
//   }
// }

// ===============================================

// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
// import { CartItem } from '@/context/CartContext';
// import { transporter, mailOptions } from '@/lib/nodemailer';

// // Helper function to generate the custom Order ID
// const generateOrderId = () => {
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const numbers = '0123456789';
//   let result = 'KKMT';
//   for (let i = 0; i < 3; i++) {
//     result += letters.charAt(Math.floor(Math.random() * letters.length));
//   }
//   for (let i = 0; i < 3; i++) {
//     result += numbers.charAt(Math.floor(Math.random() * numbers.length));
//   }
//   return result;
// };

// // Helper function to generate the email HTML content
// const generateEmailHtml = (order: any, forAdmin: boolean) => {
//   const itemsHtml = order.items.map((item: any) => `
//     <tr>
//       <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product.name} (x${item.quantity})</td>
//       <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₱${(item.price * item.quantity).toLocaleString()}</td>
//     </tr>
//   `).join('');

//   const shipping = order.total > 2000 ? 0 : 150;

//   return `
//     <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
//       <h2 style="color: #333;">${forAdmin ? 'New Order Received!' : 'Your Order Confirmation'}</h2>
//       <p>Order ID: <strong>#${order.orderId}</strong></p>
//       <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//         <thead>
//           <tr>
//             <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Product</th>
//             <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${itemsHtml}
//         </tbody>
//         <tfoot>
//           <tr>
//             <td style="padding: 8px; text-align: right;">Subtotal:</td>
//             <td style="padding: 8px; text-align: right;">₱${(order.total - shipping).toLocaleString()}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; text-align: right;">Shipping:</td>
//             <td style="padding: 8px; text-align: right;">${shipping === 0 ? 'Free' : `₱${shipping.toLocaleString()}`}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
//             <td style="padding: 8px; text-align: right; font-weight: bold;">₱${order.total.toLocaleString()}</td>
//           </tr>
//         </tfoot>
//       </table>
//       <h3 style="color: #333;">Shipping Information</h3>
//       <p>
//         ${order.customerName}<br>
//         ${order.shippingAddress.street}, ${order.shippingAddress.barangay}<br>
//         ${order.shippingAddress.city}, ${order.shippingAddress.province}<br>
//         ${order.customerPhone}<br>
//         ${order.customerEmail}
//       </p>
//       <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
//         This is an automated notification from Kuya Kardz Motorcycle Trading.
//       </p>
//     </div>
//   `;
// };

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { customerInfo, cartItems, total } = body;

//     // Create the order in the database
//     const newOrder = await prisma.order.create({
//       data: {
//         orderId: generateOrderId(),
//         total,
//         customerName: customerInfo.fullName,
//         customerEmail: customerInfo.email,
//         customerPhone: customerInfo.phone,
//         shippingAddress: {
//           province: customerInfo.province,
//           city: customerInfo.city,
//           barangay: customerInfo.barangay,
//           street: customerInfo.street,
//         },
//         items: {
//           create: cartItems.map((item: CartItem) => ({
//             productId: item.id,
//             quantity: item.quantity,
//             price: item.price,
//           })),
//         },
//         userId: customerInfo.userId || undefined,
//       },
//       include: {
//         items: {
//           include: {
//             product: true,
//           },
//         },
//       },
//     });

//     // Send email notifications
//     try {
//         const settings = await prisma.settings.findFirst();
//         if (settings?.storeEmail) {
//           await transporter.sendMail({
//             ...mailOptions,
//             to: settings.storeEmail,
//             subject: `New Order Received: #${newOrder.orderId}`,
//             html: generateEmailHtml(newOrder, true),
//           });
//         }

//         if (customerInfo.sendReceipt) {
//           await transporter.sendMail({
//             ...mailOptions,
//             to: customerInfo.email,
//             subject: `Your Order Confirmation: #${newOrder.orderId}`,
//             html: generateEmailHtml(newOrder, false),
//           });
//         }
//     } catch (emailError) {
//         console.error("--- FAILED TO SEND EMAIL ---");
//         console.error(emailError);
//     }

//     return NextResponse.json({ orderId: newOrder.orderId }, { status: 201 });

//   } catch (error) {
//     console.error("--- FAILED TO CREATE ORDER ---");
//     console.error(error);
//     return NextResponse.json({ message: 'An unexpected error occurred while creating the order.' }, { status: 500 });
//   }
// }

// ===================================================

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { CartItem } from "@/context/CartContext";

// export const runtime = "nodejs"; // Ensure Prisma runs in Node, not Edge

// interface CustomerInfo {
//   fullName: string;
//   email: string;
//   phone: string;
//   province: string;
//   city: string;
//   barangay: string;
//   street: string;
//   userId?: string;
// }

// interface CheckoutRequest {
//   customerInfo: CustomerInfo;
//   cartItems: CartItem[];
//   total: number;
// }

// // Helper function to generate the custom Order ID
// const generateOrderId = () => {
//   const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   const numbers = "0123456789";
//   let result = "KKMT";
//   for (let i = 0; i < 3; i++) {
//     result += letters.charAt(Math.floor(Math.random() * letters.length));
//   }
//   for (let i = 0; i < 3; i++) {
//     result += numbers.charAt(Math.floor(Math.random() * numbers.length));
//   }
//   return result;
// };

// export async function POST(request: Request) {
//   try {
//     const body: CheckoutRequest = await request.json();

//     if (
//       !body.customerInfo ||
//       !body.cartItems?.length ||
//       typeof body.total !== "number"
//     ) {
//       return NextResponse.json(
//         { message: "Invalid checkout request." },
//         { status: 400 }
//       );
//     }

//     const { customerInfo, cartItems, total } = body;

//     const newOrder = await prisma.order.create({
//       data: {
//         orderId: generateOrderId(),
//         total,
//         customerName: customerInfo.fullName,
//         customerEmail: customerInfo.email,
//         customerPhone: customerInfo.phone,
//         shippingAddress: {
//           province: customerInfo.province,
//           city: customerInfo.city,
//           barangay: customerInfo.barangay,
//           street: customerInfo.street,
//         },
//         items: {
//           create: cartItems.map((item) => ({
//             productId: item.id,
//             quantity: item.quantity,
//             price: item.price,
//           })),
//         },
//         userId: customerInfo.userId || undefined,
//       },
//     });

//     return NextResponse.json(
//       { orderId: newOrder.orderId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("--- FAILED TO CREATE ORDER ---", error);
//     return NextResponse.json(
//       { message: "An unexpected error occurred while creating the order." },
//       { status: 500 }
//     );
//   }
// }


// // import { NextResponse } from 'next/server';
// // import prisma from '@/lib/prisma';
// // import { CartItem } from '@/context/CartContext';
// // import { Order, Product } from '@prisma/client';

// // // Define a more specific type for the order object with its relations
// // type OrderWithDetails = Order & {
// //   items: ({ product: Product })[];
// //   shippingAddress: {
// //     street: string;
// //     barangay: string;
// //     city: string;
// //     province: string;
// //   }
// // }

// // // Helper function to generate the custom Order ID
// // const generateOrderId = () => {
// //   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// //   const numbers = '0123456789';
// //   let result = 'KKMT';
// //   for (let i = 0; i < 3; i++) {
// //     result += letters.charAt(Math.floor(Math.random() * letters.length));
// //   }
// //   for (let i = 0; i < 3; i++) {
// //     result += numbers.charAt(Math.floor(Math.random() * numbers.length));
// //   }
// //   return result;
// // };

// // export async function POST(request: Request) {
// //   try {
// //     const body = await request.json();
// //     const { customerInfo, cartItems, total } = body;

// //     // Create the order in the database
// //     const newOrder = await prisma.order.create({
// //       data: {
// //         orderId: generateOrderId(),
// //         total,
// //         customerName: customerInfo.fullName,
// //         customerEmail: customerInfo.email,
// //         customerPhone: customerInfo.phone,
// //         shippingAddress: {
// //           province: customerInfo.province,
// //           city: customerInfo.city,
// //           barangay: customerInfo.barangay,
// //           street: customerInfo.street,
// //         },
// //         items: {
// //           create: cartItems.map((item: CartItem) => ({
// //             productId: item.id,
// //             quantity: item.quantity,
// //             price: item.price,
// //           })),
// //         },
// //         userId: customerInfo.userId || undefined,
// //       },
// //     });

// //     return NextResponse.json({ orderId: newOrder.orderId }, { status: 201 });

// //   } catch (error) {
// //     console.error("--- FAILED TO CREATE ORDER ---");
// //     console.error(error);
// //     return NextResponse.json({ message: 'An unexpected error occurred while creating the order.' }, { status: 500 });
// //   }
// // }
