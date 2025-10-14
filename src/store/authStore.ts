import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  name: any;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  createdAt?: string;
  trips?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, profilePic?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateUserTrips: (trips: string[]) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      isInitialized: false,

      initialize: () => {
        set({ isInitialized: true });
      },

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch('http://localhost:3001/users', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const users = await response.json();

          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }

          const user = users.find((u: any) => u.email === email);
          
          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Simple password check (in real app, use bcrypt)
          if (user.password !== password) {
            throw new Error('Invalid email or password');
          }

          const userData: User = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            trips: user.trips || [],
          };

          set({ 
            user: userData, 
            isAuthenticated: true, 
            loading: false, 
            error: null 
          });
        } catch (error: any) {
          set({ 
            loading: false, 
            error: error.message || 'Login failed', 
            isAuthenticated: false, 
            user: null 
          });
          throw error;
        }
      },

      register: async (email: string, password: string, firstName: string, lastName: string, profilePic?: string) => {
        set({ loading: true, error: null });
        
        try {
          const checkResponse = await fetch('http://localhost:3001/users');
          const existingUsers = await checkResponse.json();
          const userExists = existingUsers.find((u: any) => u.email === email);
          
          if (userExists) {
            throw new Error('User already exists with this email');
          }

          const newUser = {
            email,
            password: password, // In real app, hash this
            firstName,
            lastName,
            profilePic: profilePic || '/images/default-avatar.jpg',
            trips: [],
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };

          const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const createdUser = await response.json();

          const userData: User = {
            id: createdUser.id,
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            profilePic: createdUser.profilePic,
            createdAt: createdUser.createdAt,
            trips: createdUser.trips || [],
          };

          set({ 
            user: userData, 
            isAuthenticated: true, 
            loading: false, 
            error: null 
          });
        } catch (error: any) {
          set({ 
            loading: false, 
            error: error.message || 'Registration failed', 
            isAuthenticated: false, 
            user: null 
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      updateUserTrips: (trips: string[]) => {
        set((state) => {
          if (state.user) {
            return {
              user: {
                ...state.user,
                trips: trips
              }
            };
          }
          return state;
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.initialize();
      },
    }
  )
);