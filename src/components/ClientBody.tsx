// components/ClientBody.tsx
'use client';
import { useEffect, useState } from 'react';

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <body className="antialiased bg-white text-gray-900">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </body>
    );
  }

  return (
    <body className="antialiased bg-white text-gray-900" suppressHydrationWarning>
      {children}
    </body>
  );
}