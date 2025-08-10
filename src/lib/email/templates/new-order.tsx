import { Html, Body, Container, Text, Hr } from "@react-email/components";

function getStoreName2() {
  const from = process.env.EMAIL_FROM || "Kuya Kards Motorcycle Trading <no-reply@example.com>";
  const display = from.includes("<") ? from.split("<")[0].trim() : from;
  return process.env.NEXT_PUBLIC_STORE_NAME || display || "Kuya Kards Motorcycle Trading";
}

export default function NewOrder({ order }: any) {
  const currency = (n: number) => `₱${Number(n).toLocaleString()}`;
  const shipping = order.shippingAddress || {};
  const storeName = getStoreName2();

  return (
    <Html>
      <Body style={{ backgroundColor: "#ffffff" }}>
        <Container style={{ border: "1px solid #e5e7eb", padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>New Order Received!</Text>
          <Text style={{ marginTop: 0, marginBottom: 12 }}>Order ID: <strong>#{order.orderId}</strong></Text>

          <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th align="left" style={{ borderBottom: "1px solid #e5e7eb" }}>Product</th>
                <th align="right" style={{ borderBottom: "1px solid #e5e7eb" }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((i: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ borderBottom: "1px solid #f3f4f6" }}>{i.productName || i.productId} (×{i.quantity})</td>
                  <td align="right" style={{ borderBottom: "1px solid #f3f4f6" }}>{currency(i.price)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ paddingTop: 16, fontWeight: 700 }} align="right">Total:</td>
                <td style={{ paddingTop: 16, fontWeight: 700 }} align="right">{currency(order.total)}</td>
              </tr>
            </tbody>
          </table>

          <Hr />

          <Text style={{ fontSize: 16, fontWeight: 700, marginTop: 16 }}>Shipping Information</Text>
          <Text style={{ marginTop: 0 }}>
            {order.customerName}<br />
            {shipping.street}<br />
            {shipping.barangay}<br />
            {shipping.city}, {shipping.province}<br />
            {order.customerPhone}<br />
            {order.customerEmail}
          </Text>

          <Text style={{ color: "#6b7280", fontSize: 12, textAlign: "center", marginTop: 24 }}>
            This is an automated notification from {storeName}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// IMPORTANT: update sendEmail calls to stop passing `settings`.
// src/app/api/checkout/route.ts (both emails):
// props: { order: newOrder }  // NOT { order: newOrder, settings }