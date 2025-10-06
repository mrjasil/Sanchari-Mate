'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !admin && window.location.pathname.startsWith('/admin')) {
      router.push('/admin/adminlogin'); // ← Updated path
    }
  }, [admin, loading, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple admin authentication
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@sanchariate.com';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      const adminData = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'super_admin'
      };
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
      router.push('/admin/dashboard'); // ← This stays the same
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    router.push('/admin/adminlogin'); // Optional: redirect to login on logout
  };

  return (
    <AdminContext.Provider value={{
      admin,
      isAdmin: !!admin,
      loading,
      login,
      logout
    }}>
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