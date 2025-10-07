// src/lib/constants.ts
import { User, Booking, DashboardStats } from '@/types/admin';

export const dashboardStats: DashboardStats = {
  totalSales: 480000,
  newBookings: 156,
  totalCustomers: 892,
  pendingEnquiries: 23
};

export const users: User[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 9876543210',
    status: 'active',
    joinedDate: '2024-01-15',
    bookings: 5
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 9876543211',
    status: 'active',
    joinedDate: '2024-01-20',
    bookings: 3
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 9876543212',
    status: 'blocked',
    joinedDate: '2024-01-10',
    bookings: 2
  }
];

export const recentBookings: Booking[] = [
  {
    id: '1',
    tourName: 'Goa Trip',
    customerName: 'Rahul Sharma',
    amount: 25999,
    date: '2024-01-25',
    status: 'confirmed'
  },
  {
    id: '2',
    tourName: 'Kerala',
    customerName: 'Priya Patel',
    amount: 18500,
    date: '2024-01-26',
    status: 'confirmed'
  },
  {
    id: '3',
    tourName: 'Manali',
    customerName: 'Amit Kumar',
    amount: 32000,
    date: '2024-01-27',
    status: 'pending'
  }
];