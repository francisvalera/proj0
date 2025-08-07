import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kuya Kardz - Motorcycle Parts & Accessories",
  description: "Premium motorcycle parts and accessories in the Philippines.",
};

// This is the root layout for the entire application.
// It sets up the basic HTML structure, fonts, and providers.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <div className="bg-red-600 text-white text-xs text-center py-1.5 font-semibold tracking-wider">
              We have an increased online presence, welcome to our brand new website!
            </div>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
