'use client';

import { AuthProvider } from '@/lib/auth';
import MemoryGrid from '@/components/memories/MemoryGrid';

export default function MemoriesPage() {
  return (
    <AuthProvider>
      <MemoryGrid />
    </AuthProvider>
  );
}