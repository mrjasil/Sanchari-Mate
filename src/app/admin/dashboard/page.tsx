'use client';
import DashboardStats from '@/components/admin/DashboardStats';
import UserManagement from '@/components/admin/UserManagment';
import TripManagement from '@/components/admin/TripManagement';
import AdminChatPanel from '@/components/admin/adminChatPanel';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            System Status: Operational
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Last login: {new Date().toLocaleString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
        <DashboardStats />
      </div>

      {/* Chat Requests Management */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Chat Requests Management</h2>
        <AdminChatPanel />
      </div>

      {/* User Management */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
        <UserManagement />
      </div>

      {/* Trip Management */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Management</h2>
        <TripManagement />
      </div>
    </div>
  );
}