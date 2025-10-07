// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdminProvider } from '@/store/AdminContext';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

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
        {/* Navbar/Footer visibility is handled inside LayoutWrapper */}
        <AdminProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AdminProvider>
      </body>
    </html>
  );
}