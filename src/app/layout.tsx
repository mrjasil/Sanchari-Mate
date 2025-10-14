import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdminProvider } from '@/store/AdminContext';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import ChatButton from '@/components/chat/ChatButton';
import AuthInitializer from '@/components/auth/AuthInitializer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sanchari Mate',
  description: 'Your travel companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        
        <AdminProvider>
          <AuthInitializer />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <ChatButton />
        </AdminProvider>
      </body>
    </html>
  );
}