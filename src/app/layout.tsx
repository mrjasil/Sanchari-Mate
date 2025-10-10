import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdminProvider } from '@/store/AdminContext';
import { AuthProvider } from '@/lib/auth';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import ChatButton from '@/components/chat/ChatButton'; // ✅ ADD THIS IMPORT

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
        <AdminProvider>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <ChatButton />
          </AuthProvider>
        </AdminProvider>
      </body>
    </html>
  );
}