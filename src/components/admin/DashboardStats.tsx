// src/components/admin/DashboardStats.tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { formatCurrency } from '@/lib/format';
import { DashboardStats as DashboardStatsType } from '@/types/admin';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current[index] = el;
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: 'back.out(1.7)'
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        ref={(el) => addToRefs(el, 0)}
        className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-800 text-sm font-medium">Total Sales</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {formatCurrency(stats.totalSales)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </div>

      <div 
        ref={(el) => addToRefs(el, 1)}
        className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-800 text-sm font-medium">New Bookings</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {stats.newBookings}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
        </div>
      </div>

      <div 
        ref={(el) => addToRefs(el, 2)}
        className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-800 text-sm font-medium">Total Customers</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {stats.totalCustomers}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
        </div>
      </div>

      <div 
        ref={(el) => addToRefs(el, 3)}
        className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-800 text-sm font-medium">Pending Enquiries</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">
              {stats.pendingEnquiries}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📩</span>
          </div>
        </div>
      </div>
    </div>
  );
}