'use client';

import { AuthProvider } from '@/lib/auth';

export default function MemoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}