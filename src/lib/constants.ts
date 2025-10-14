import { DashboardStats, User, Booking } from '@/types/admin';

export const dashboardStats: DashboardStats = {
  revenue: {
    current: 480000,
    previous: 444444,
    change: 8
  },
  newBookings: {
    current: 156,
    previous: 139,
    change: 12
  },
  totalCustomers: 892,
  pendingEnquiries: 23,
  totalTrips: 67
};

export const users: User[] = [
  {
    id: '1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul@example.com',
    phone: '+91 9876543210',
    isBlocked: false, // Changed from status to isBlocked
    createdAt: '2024-01-15T10:30:00Z', // Changed from joinedDate to createdAt
    lastLogin: '2024-10-10T16:45:00Z',
    totalBookings: 5,
    role: 'user',
    avatar: undefined
  },
  {
    id: '2',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya@example.com',
    phone: '+91 9876543211',
    isBlocked: false,
    createdAt: '2024-01-20T14:20:00Z',
    lastLogin: '2024-10-09T11:30:00Z',
    totalBookings: 3,
    role: 'user',
    avatar: undefined
  },
  {
    id: '3',
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit@example.com',
    phone: '+91 9876543212',
    isBlocked: true, // Blocked user
    createdAt: '2024-01-10T09:15:00Z',
    lastLogin: '2024-10-08T14:20:00Z',
    totalBookings: 2,
    role: 'user',
    avatar: undefined
  },
  {
    id: '4',
    firstName: 'Sneha',
    lastName: 'Verma',
    email: 'sneha@example.com',
    phone: '+91 9876543213',
    isBlocked: false,
    createdAt: '2024-01-05T16:45:00Z',
    lastLogin: '2024-10-10T10:15:00Z',
    totalBookings: 7,
    role: 'user',
    avatar: undefined
  }
];

export const recentBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Rahul Sharma',
    tripId: '1',
    tripName: 'Goa Beach Adventure',
    amount: 25999,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingDate: '2024-10-25T14:30:00Z',
    travelDate: '2024-11-15T00:00:00Z',
    guests: 2,
    createdAt: '2024-10-25T14:30:00Z'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Priya Patel',
    tripId: '2',
    tripName: 'Kerala Backwaters',
    amount: 18500,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingDate: '2024-10-26T11:20:00Z',
    travelDate: '2024-11-20T00:00:00Z',
    guests: 1,
    createdAt: '2024-10-26T11:20:00Z'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Amit Kumar',
    tripId: '3',
    tripName: 'Manali Hill Station',
    amount: 32000,
    status: 'pending',
    paymentStatus: 'pending',
    bookingDate: '2024-10-27T09:45:00Z',
    travelDate: '2024-12-01T00:00:00Z',
    guests: 4,
    createdAt: '2024-10-27T09:45:00Z'
  },
  {
    id: '4',
    userId: '4',
    userName: 'Sneha Verma',
    tripId: '4',
    tripName: 'Rajasthan Cultural Tour',
    amount: 28999,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingDate: '2024-10-28T16:15:00Z',
    travelDate: '2024-11-25T00:00:00Z',
    guests: 3,
    createdAt: '2024-10-28T16:15:00Z'
  }
];

// Additional mock data for trips
export const trips = [
  {
    id: '1',
    title: 'Goa Beach Adventure',
    description: 'Enjoy the beautiful beaches and nightlife of Goa',
    destination: 'Goa, India',
    duration: '5 days',
    price: 25999,
    createdBy: '1',
    creatorName: 'Rahul Sharma',
    status: 'active',
    maxParticipants: 15,
    currentParticipants: 12,
    startDate: '2024-11-15T00:00:00Z',
    endDate: '2024-11-20T00:00:00Z',
    createdAt: '2024-09-10T10:00:00Z',
    images: [],
    category: 'beach'
  },
  {
    id: '2',
    title: 'Kerala Backwaters',
    description: 'Experience the serene backwaters and houseboats',
    destination: 'Kerala, India',
    duration: '4 days',
    price: 18500,
    createdBy: '2',
    creatorName: 'Priya Patel',
    status: 'active',
    maxParticipants: 10,
    currentParticipants: 8,
    startDate: '2024-11-20T00:00:00Z',
    endDate: '2024-11-24T00:00:00Z',
    createdAt: '2024-09-15T14:20:00Z',
    images: [],
    category: 'nature'
  },
  {
    id: '3',
    title: 'Manali Hill Station',
    description: 'Adventure in the Himalayas with snow activities',
    destination: 'Manali, India',
    duration: '6 days',
    price: 32000,
    createdBy: '3',
    creatorName: 'Amit Kumar',
    status: 'active',
    maxParticipants: 12,
    currentParticipants: 6,
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-07T00:00:00Z',
    createdAt: '2024-09-20T09:15:00Z',
    images: [],
    category: 'adventure'
  }
];

// Mock data for payments
export const payments = [
  {
    id: '1',
    bookingId: '1',
    userId: '1',
    userName: 'Rahul Sharma',
    amount: 25999,
    currency: 'INR',
    status: 'completed',
    paymentMethod: 'card',
    paymentDate: '2024-10-25T14:35:00Z',
    transactionId: 'txn_123456',
    createdAt: '2024-10-25T14:35:00Z'
  },
  {
    id: '2',
    bookingId: '2',
    userId: '2',
    userName: 'Priya Patel',
    amount: 18500,
    currency: 'INR',
    status: 'completed',
    paymentMethod: 'upi',
    paymentDate: '2024-10-26T11:25:00Z',
    transactionId: 'txn_123457',
    createdAt: '2024-10-26T11:25:00Z'
  },
  {
    id: '3',
    bookingId: '3',
    userId: '3',
    userName: 'Amit Kumar',
    amount: 32000,
    currency: 'INR',
    status: 'pending',
    paymentMethod: 'card',
    paymentDate: '2024-10-27T09:50:00Z',
    transactionId: 'txn_123458',
    createdAt: '2024-10-27T09:50:00Z'
  }
];

// Mock data for enquiries
export const enquiries = [
  {
    id: '1',
    name: 'Rajesh Mehta',
    email: 'rajesh@example.com',
    subject: 'Group Discount',
    message: 'Do you offer discounts for group bookings of 10+ people?',
    status: 'pending',
    createdAt: '2024-10-10T15:20:00Z'
  },
  {
    id: '2',
    name: 'Anita Desai',
    email: 'anita@example.com',
    subject: 'Custom Itinerary',
    message: 'Can you create a custom itinerary for our family trip?',
    status: 'pending',
    createdAt: '2024-10-09T11:30:00Z'
  }
];