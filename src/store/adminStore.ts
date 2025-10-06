import { create } from 'zustand';

// Define AdminState interface
interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'blocked';
  // Add other customer properties as needed
}

interface AdminState {
  customers: Customer[];
  loading: boolean;
  blockUser: (userId: string, reason: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  fetchCustomers: (filters?: { status?: string; search?: string }) => Promise<void>;
}

// API functions
const adminApi = {
  async getCustomers(filters?: { status?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await fetch(`/api/admin/customers?${params}`);
    const data = await response.json();
    
    if (!data.success) throw new Error(data.error);
    return data.customers;
  },

  async blockUser(userId: string, reason: string, cancelPendingBookings = true) {
    const response = await fetch('/api/admin/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason, cancelPendingBookings }),
    });
    const data = await response.json();
    
    if (!data.success) throw new Error(data.error);
    return data.user;
  },

  async unblockUser(userId: string) {
    const response = await fetch('/api/admin/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    
    if (!data.success) throw new Error(data.error);
    return data.user;
  },
};

// Create the store with proper initial state
export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  customers: [],
  loading: false,

  // Customer Actions with API integration
  blockUser: async (userId: string, reason: string) => {
    try {
      set({ loading: true });
      const updatedUser = await adminApi.blockUser(userId, reason);
      
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === userId 
            ? { ...customer, ...updatedUser }
            : customer
        ),
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
      console.error('Failed to block user:', error);
      throw error;
    }
  },

  unblockUser: async (userId: string) => {
    try {
      set({ loading: true });
      const updatedUser = await adminApi.unblockUser(userId);
      
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === userId 
            ? { ...customer, ...updatedUser }
            : customer
        ),
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
      console.error('Failed to unblock user:', error);
      throw error;
    }
  },

  // Add method to fetch customers from API
  fetchCustomers: async (filters?: { status?: string; search?: string }) => {
    try {
      set({ loading: true });
      const customers = await adminApi.getCustomers(filters);
      set({ customers, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  },
}));