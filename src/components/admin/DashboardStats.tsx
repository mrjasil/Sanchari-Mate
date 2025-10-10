'use client';
import { useState, useEffect } from 'react';

interface StatsData {
  totalBookings: number;
  totalRevenue: number;
  activeTours: number;
  totalCustomers: number;
  pendingEnquiries: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalBookings: 0,
    totalRevenue: 0,
    activeTours: 0,
    totalCustomers: 0,
    pendingEnquiries: 0,
  });

  useEffect(() => {
    // Simulate data loading
    setStats({
      totalBookings: 1247,
      totalRevenue: 89234,
      activeTours: 28,
      totalCustomers: 845,
      pendingEnquiries: 12,
    });
  }, []);

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: '📅',
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'green',
      change: '+8%',
    },
    {
      title: 'Active Tours',
      value: stats.activeTours,
      icon: '✈️',
      color: 'purple',
      change: '+5%',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: '👥',
      color: 'orange',
      change: '+15%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-sm text-green-600 mt-1">{card.change} from last month</p>
              </div>
              <div className="text-3xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {[
              { name: 'John Doe', tour: 'Bali Adventure', date: '2 hours ago', status: 'Confirmed' },
              { name: 'Sarah Smith', tour: 'Paris Getaway', date: '4 hours ago', status: 'Pending' },
              { name: 'Mike Johnson', tour: 'Tokyo Explorer', date: '1 day ago', status: 'Confirmed' },
            ].map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{booking.name}</p>
                  <p className="text-sm text-gray-600">{booking.tour}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{booking.date}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    booking.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
              <div className="text-2xl mb-2">➕</div>
              <p className="text-sm font-medium text-blue-700">Add Tour</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
              <div className="text-2xl mb-2">📝</div>
              <p className="text-sm font-medium text-green-700">Write Blog</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-sm font-medium text-purple-700">View Customers</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center">
              <div className="text-2xl mb-2">📧</div>
              <p className="text-sm font-medium text-orange-700">Check Enquiries</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}