export interface DashboardStats {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  newBookings: {
    current: number;
    previous: number;
    change: number;
  };
  totalCustomers: number;
  pendingEnquiries: number;
  totalTrips: number;
}

// Keep AdminStats as alias for backward compatibility if needed
export interface AdminStats extends DashboardStats {}

export interface User {
  id: string;
  firstName?: string; // Made optional
  lastName?: string;  // Made optional
  email?: string;     // Made optional
  phone?: string;     // Made optional
  isBlocked: boolean;
  createdAt: string;
  lastLogin?: string;
  totalBookings: number;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  tripId: string;
  tripName: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  bookingDate: string;
  travelDate: string;
  guests: number;
  createdAt: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  createdBy: string;
  creatorName: string;
  status: 'active' | 'inactive' | 'draft';
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  images: string[];
  category: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  paymentDate: string;
  transactionId?: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: string;
}

// Export types for better organization
export type {
  DashboardStats as DashboardStatsType,
  User as UserType,
  Booking as BookingType,
  Trip as TripType,
  Payment as PaymentType,
  Enquiry as EnquiryType,
};