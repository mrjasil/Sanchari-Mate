// src/app/admin/dashboard/page.tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentCustomers from '@/components/admin/RecentCustomers';
import { dashboardStats, recentBookings } from '@/lib/constants';

export default function DashboardPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(mainRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      <DashboardStats stats={dashboardStats} />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        {/* Charts Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
            [Charts & Graphs Area]
          </div>
        </div>
        
        {/* Recent Bookings */}
        <RecentCustomers bookings={recentBookings} />
      </div>
    </div>
  );
}