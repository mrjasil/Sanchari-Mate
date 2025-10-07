// src/types/admin.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'blocked';
  joinedDate: string;
  bookings: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  totalBookings: number;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  tourName: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface DashboardStats {
  totalSales: number;
  newBookings: number;
  totalCustomers: number;
  pendingEnquiries: number;
}