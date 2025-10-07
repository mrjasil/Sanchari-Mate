// store/AdminContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  profilePic?: string;
}

interface AdminContextType {
  isAdmin: boolean;
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isInitialized: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on client side only to prevent hydration mismatch
  useEffect(() => {
    // Check for existing admin session in localStorage or sessionStorage
    const checkExistingSession = () => {
      try {
        const storedAdmin = localStorage.getItem('admin_session');
        if (storedAdmin) {
          const adminData = JSON.parse(storedAdmin);
          setIsAdmin(true);
          setAdmin(adminData);
        }
      } catch (error) {
        console.log('No existing admin session found');
      } finally {
        setIsInitialized(true);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Making login API call...');
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok && data.success) {
        setIsAdmin(true);
        
        // Set admin user data if available from API response
        let adminData: AdminUser;
        if (data.user) {
          adminData = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || `${data.user.firstName} ${data.user.lastName}`,
            profilePic: data.user.profilePic
          };
        } else {
          // Fallback admin data
          adminData = {
            id: 'admin_001',
            email: email,
            name: 'Admin User',
            profilePic: '/images/admin-avatar.jpg'
          };
        }
        
        setAdmin(adminData);
        
        // Store session in localStorage for persistence
        try {
          localStorage.setItem('admin_session', JSON.stringify(adminData));
        } catch (storageError) {
          console.warn('Could not store admin session in localStorage:', storageError);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login API error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setAdmin(null);
    
    // Clear session from storage
    try {
      localStorage.removeItem('admin_session');
      sessionStorage.removeItem('admin_session');
    } catch (storageError) {
      console.warn('Could not clear admin session from storage:', storageError);
    }
  };

  // Don't render children until context is initialized to prevent hydration mismatch
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ isAdmin, admin, login, logout, isInitialized }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}