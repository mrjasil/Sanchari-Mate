export interface Trip {
  creatorId: string | undefined;
  imageUrl: string | null; // Change from 'any' to 'string | null'
  ownerId: string;
  user: any;
  userId: string;
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  budget: number;
  interests: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  image: string; // Keep this for backward compatibility
  description: string;
  category: string;
  accommodation: string;
  transportation: string;
  isPublic: boolean;
  tags: string[];
  meetupLocation: string;
  contactInfo: string;
  requirements: string;
  highlights: string[];
  itinerary: string[];
  createdBy: string;
  createdAt: string;
  participants: string[];
  
  // UPDATED FIELDS FOR JOINING FUNCTIONALITY
  availableSeats: number;
  pricePerPerson: number;
  advancePaymentPercentage: number;
  currentParticipants: number;
  joinedUsers: string[];
  updatedAt: string;
  
  // NEW OPTIONAL FIELDS
  departureTime?: string;
  returnTime?: string;
  included?: string[];
  excluded?: string[];
  cancellationPolicy?: string;
  rating?: number;
  reviewCount?: number;
}

export interface TripFormData {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string;
  interests: string;
  description: string;
  category: string;
  difficulty: string;
  accommodation: string;
  transportation: string;
  isPublic: boolean;
  tags: string;
  meetupLocation: string;
  contactInfo: string;
  requirements: string;
  highlights: string;
  image: string;
  
  // NEW FIELDS FOR JOINING FUNCTIONALITY
  pricePerPerson: number;
  advancePaymentPercentage: number;
  
  // NEW OPTIONAL FIELDS
  departureTime?: string;
  returnTime?: string;
  included?: string;
  excluded?: string;
  cancellationPolicy?: string;
}

export interface TripParticipant {
  id: string;
  tripId: string;
  userId: string;
  passengers: number;
  totalAmount: number;
  advancePayment: number;
  finalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'confirmed' | 'waiting' | 'cancelled';
  joinedAt: string;
  updatedAt: string;
  userDetails?: {
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
  };
  
  // NEW FIELDS FOR PAYMENT TRACKING
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentDate?: string;
  refundAmount?: number;
  refundDate?: string;
}

export interface JoinTripRequest {
  tripId: string;
  passengers: number;
  advancePayment: number;
  totalAmount: number;
  userId: string;
  
  // NEW FIELDS FOR RAZORPAY INTEGRATION
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export interface PaymentDetails {
  id: string;
  tripId: string;
  userId: string;
  amount: number;
  paymentMethod: 'razorpay' | 'stripe' | 'paypal' | 'bank_transfer';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: string;
  paymentType: 'advance' | 'full' | 'refund';
  
  // NEW FIELDS FOR RAZORPAY
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  
  // NEW FIELDS
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// UPDATED CreateTripData interface
export interface CreateTripData extends Omit<Trip, 
  "id" | 
  "createdAt" | 
  "updatedAt" | 
  "participants" | 
  "joinedUsers" | 
  "currentParticipants" |
  "availableSeats" |
  "rating" |
  "reviewCount"
> {}

// NEW: UpdateTripData interface
export interface UpdateTripData extends Partial<Omit<Trip, 
  "id" | 
  "createdBy" | 
  "createdAt" | 
  "joinedUsers" |
  "currentParticipants"
>> {}

// Utility types
export type TripStatus = Trip['status'];
export type PaymentStatus = TripParticipant['paymentStatus'];
export type ParticipantStatus = TripParticipant['status'];
export type PaymentMethod = PaymentDetails['paymentMethod'];

// Filter types
export interface TripFilters {
  status?: TripStatus;
  category?: string;
  destination?: string;
  maxPrice?: number;
  minPrice?: number;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Search types
export interface TripSearchParams {
  query?: string;
  filters?: TripFilters;
  sortBy?: 'price' | 'date' | 'participants' | 'createdAt' | 'rating' | 'destination';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Response types
export interface TripResponse {
  trips: Trip[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JoinTripResponse {
  success: boolean;
  participant: TripParticipant;
  trip: Trip;
  message?: string;
  payment?: {
    orderId: string;
    amount: number;
    currency: string;
  };
}

// NEW: Payment response interface
export interface PaymentResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  message?: string;
}

// Statistics types
export interface TripStats {
  totalTrips: number;
  joinedTrips: number;
  createdTrips: number;
  upcomingTrips: number;
  totalSpent: number;
  completedTrips: number;
  cancelledTrips: number;
  averageRating: number;
}

// NEW: User interface for participant details
export interface User {
  [x: string]: string;
  bookings: ReactNode;
  status: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  joinedAt?: string;
}

// NEW: Trip with participants details
export interface TripWithParticipants extends Trip {
  participantDetails: TripParticipant[];
  createdByUser?: User;
}

// NEW: Review interface
export interface Review {
  id: string;
  tripId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// NEW: Cancellation policy interface
export interface CancellationPolicy {
  id: string;
  tripId: string;
  daysBeforeDeparture: number;
  refundPercentage: number;
  description: string;
}

// NEW: Notification interface
export interface TripNotification {
  id: string;
  tripId: string;
  userId: string;
  type: 'booking_confirmation' | 'payment_success' | 'trip_update' | 'cancellation';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}