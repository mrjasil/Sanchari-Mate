'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

interface AdminContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  admin: AdminUser | null; // Add this for compatibility
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isInitialized: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@sanchari.com',
  password: 'admin123'
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if admin is logged in on component mount
    const checkAdminStatus = () => {
      try {
        const adminData = localStorage.getItem('adminData');
        if (adminData) {
          const { user, timestamp } = JSON.parse(adminData);
          // Check if login is still valid (24 hours)
          const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
          if (!isExpired) {
            setAdminUser(user);
            setIsAdmin(true);
          } else {
            localStorage.removeItem('adminData');
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        localStorage.removeItem('adminData');
      } finally {
        setIsInitialized(true);
      }
    };

    checkAdminStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Making login API call...');
      
      // Try the API first
      let apiSuccess = false;
      let apiUser: AdminUser | null = null;
      
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        console.log('Login response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Login API response:', data);
          
          if (data.success && data.user) {
            apiSuccess = true;
            apiUser = data.user;
          }
        } else {
          console.warn('API login failed with status:', response.status);
        }
      } catch (apiError) {
        console.warn('API call failed, using fallback authentication:', apiError);
      }

      // If API worked, use API response
      if (apiSuccess && apiUser) {
        const adminData = {
          user: apiUser,
          timestamp: Date.now()
        };
        localStorage.setItem('adminData', JSON.stringify(adminData));
        setAdminUser(apiUser);
        setIsAdmin(true);
        return true;
      }

      // Fallback: Check against hardcoded credentials
      console.log('Using fallback authentication...');
      
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const fallbackUser: AdminUser = {
          id: '1',
          name: 'Admin User',
          email: ADMIN_CREDENTIALS.email,
          role: 'admin',
          lastLogin: new Date().toISOString(),
        };
        
        const adminData = {
          user: fallbackUser,
          timestamp: Date.now()
        };
        localStorage.setItem('adminData', JSON.stringify(adminData));
        
        setAdminUser(fallbackUser);
        setIsAdmin(true);
        return true;
      }
      
      console.error('Login failed: Invalid credentials');
      return false;
      
    } catch (error) {
      console.error('Login process error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminData');
    setAdminUser(null);
    setIsAdmin(false);
    // Redirect to admin login page
    window.location.href = '/adminlogin';
  };

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      adminUser, 
      admin: adminUser, // Add this for compatibility
      login, 
      logout, 
      isInitialized 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};