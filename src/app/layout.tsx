import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kuya Kards - Motorcycle Trading",
  description: "Premium motorcycle parts and accessories in the Philippines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <div className="bg-red-600 text-white text-xs text-center py-1.5 font-semibold tracking-wider">
                FREE SHIPPING ON ORDERS OVER ₱2,000!
              </div>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
