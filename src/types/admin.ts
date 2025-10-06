export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'manager' | 'support';
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  blockedAt?: Date;
  blockReason?: string;
  totalBookings: number;
  createdAt: Date;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  images: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  tourId: string;
  tourName: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  totalAmount: number;
  travelDate: Date;
  numberOfTravelers: number;
  createdAt: Date;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  activeTours: number;
  pendingBookings: number;
}