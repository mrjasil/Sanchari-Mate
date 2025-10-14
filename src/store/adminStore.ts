import { create } from 'zustand';
import { AdminStats, User, Booking, Trip, Payment } from '@/types/admin';

interface AdminState {
  // Data
  stats: AdminStats | null;
  users: User[];
  bookings: Booking[];
  trips: Trip[];
  payments: Payment[];
  
  // Loading states
  loading: {
    stats: boolean;
    users: boolean;
    bookings: boolean;
    trips: boolean;
    payments: boolean;
  };
  
  // Actions
  setStats: (stats: AdminStats) => void;
  setUsers: (users: User[]) => void;
  setBookings: (bookings: Booking[]) => void;
  setTrips: (trips: Trip[]) => void;
  setPayments: (payments: Payment[]) => void;
  
  setLoading: (key: keyof AdminState['loading'], value: boolean) => void;
  
  // User management actions
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  
  // Trip management actions
  deleteTrip: (tripId: string) => void;
  updateTripStatus: (tripId: string, status: Trip['status']) => void;
  
  // Data fetching
  fetchStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  fetchTrips: () => Promise<void>;
  fetchPayments: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  stats: null,
  users: [],
  bookings: [],
  trips: [],
  payments: [],
  
  loading: {
    stats: false,
    users: false,
    bookings: false,
    trips: false,
    payments: false,
  },

  // Setters
  setStats: (stats) => set({ stats }),
  setUsers: (users) => set({ users }),
  setBookings: (bookings) => set({ bookings }),
  setTrips: (trips) => set({ trips }),
  setPayments: (payments) => set({ payments }),
  
  setLoading: (key, value) => set((state) => ({
    loading: { ...state.loading, [key]: value }
  })),

  // User management
  blockUser: (userId) => set((state) => ({
    users: state.users.map(user =>
      user.id === userId ? { ...user, isBlocked: true } : user
    )
  })),

  unblockUser: (userId) => set((state) => ({
    users: state.users.map(user =>
      user.id === userId ? { ...user, isBlocked: false } : user
    )
  })),

  deleteUser: (userId) => set((state) => ({
    users: state.users.filter(user => user.id !== userId)
  })),

  // Trip management
  deleteTrip: (tripId) => set((state) => ({
    trips: state.trips.filter(trip => trip.id !== tripId)
  })),

  updateTripStatus: (tripId, status) => set((state) => ({
    trips: state.trips.map(trip =>
      trip.id === tripId ? { ...trip, status } : trip
    )
  })),

  // Data fetching with API calls
  fetchStats: async () => {
    const { setLoading, setStats } = get();
    setLoading('stats', true);
    
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading('stats', false);
    }
  },

  fetchUsers: async () => {
    const { setLoading, setUsers } = get();
    setLoading('users', true);
    
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading('users', false);
    }
  },

  fetchBookings: async () => {
    const { setLoading, setBookings } = get();
    setLoading('bookings', true);
    
    try {
      const response = await fetch('/api/admin/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading('bookings', false);
    }
  },

  fetchTrips: async () => {
    const { setLoading, setTrips } = get();
    setLoading('trips', true);
    
    try {
      const response = await fetch('/api/admin/trips');
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading('trips', false);
    }
  },

  fetchPayments: async () => {
    const { setLoading, setPayments } = get();
    setLoading('payments', true);
    
    try {
      const response = await fetch('/api/admin/payments');
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading('payments', false);
    }
  },
}));