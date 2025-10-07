// src/components/admin/RecentCustomers.tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Booking } from '@/types/admin';
import { formatCurrency, formatDate } from '@/lib/format';

interface RecentCustomersProps {
  bookings: Booking[];
}

export default function RecentCustomers({ bookings }: RecentCustomersProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.booking-row', 
        { x: -50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={containerRef} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Bookings</h2>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div 
            key={booking.id}
            className="booking-row flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{booking.tourName}</h3>
              <p className="text-sm text-gray-600">{booking.customerName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-bold text-gray-800">
                {formatCurrency(booking.amount)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(booking.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}