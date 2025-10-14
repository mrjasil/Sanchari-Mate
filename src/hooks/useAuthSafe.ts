'use client';

import { useAuth } from '@/lib/auth';

// Safe version of useAuth that provides fallback values
export function useAuthSafe() {
  try {
    return useAuth();
  } catch (error) {
    // Return fallback values if AuthProvider is not available
    console.warn('AuthProvider not found, using fallback values');
    return {
      user: null,
      isAuthenticated: false,
      login: async () => false,
      logout: () => {},
      register: async () => false,
      isLoading: false,
    };
  }
}