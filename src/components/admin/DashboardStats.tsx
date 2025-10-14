'use client';
import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import StatsCard from './StatsCard';

// Ultra-safe default values
const ultraSafeStats = {
  revenue: {
    current: 0,
    previous: 0,
    change: 0
  },
  newBookings: {
    current: 0,
    previous: 0,
    change: 0
  },
  totalCustomers: 0,
  pendingEnquiries: 0,
  totalTrips: 0
};

export default function DashboardStats() {
  const { stats, loading, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Ultra-safe stats with deep fallbacks
  const safeStats = stats || ultraSafeStats;
  const safeRevenue = safeStats.revenue || ultraSafeStats.revenue;
  const safeNewBookings = safeStats.newBookings || ultraSafeStats.newBookings;

  if (loading.stats) {
    return (
      <div className="space-y-6">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        {/* Additional Info Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Revenue"
          value={`$${(safeRevenue.current || 0).toLocaleString()}`}
          change={safeRevenue.change || 0}
          icon="💰"
          description="From completed payments"
        />
        <StatsCard
          title="New Bookings"
          value={(safeNewBookings.current || 0).toString()}
          change={safeNewBookings.change || 0}
          icon="📅"
          description="Joined trips last month"
        />
        <StatsCard
          title="Total Customers"
          value={(safeStats.totalCustomers || 0).toString()}
          icon="👥"
          description="Registered users"
        />
        <StatsCard
          title="Pending Enquiries"
          value={(safeStats.pendingEnquiries || 0).toString()}
          icon="📧"
          description="Require attention"
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Trips"
          value={(safeStats.totalTrips || 0).toString()}
          icon="✈️"
          description="User created trips"
        />
      </div>
    </div>
  );
}