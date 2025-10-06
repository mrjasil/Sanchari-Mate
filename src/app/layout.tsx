'use client'
import "./globals.css";
import Script from "next/script";
import { AdminProvider } from "@/store/AdminContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Sanchari Mate</title>
        <meta name="description" content="Your beautiful travel companion" />
      </head>
      <body className="antialiased bg-white text-gray-900">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <AdminProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AdminProvider>
      </body>
    </html>
  );
}