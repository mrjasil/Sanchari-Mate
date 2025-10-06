'use client';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentCustomers from '@/components/admin/RecentCustomers';
import QuickActions from '@/components/admin/QuickActions';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentCustomers />
        </div>
        
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}