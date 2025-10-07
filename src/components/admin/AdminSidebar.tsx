// src/components/admin/AdminSidebar.tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const menuItems = [
  { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: '📦', label: 'Bookings', href: '/admin/bookings' },
  { icon: '🗺️', label: 'Tours', href: '/admin/tours' },
  { icon: '👥', label: 'Customers', href: '/admin/customers' },
  { icon: '✍️', label: 'Blog', href: '/admin/blog' },
  { icon: '📩', label: 'Enquiries', href: '/admin/enquiries' },
  { icon: '💰', label: 'Payments', href: '/admin/payments' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sidebarRef.current, 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sidebarRef} className="w-64 bg-white shadow-xl h-screen sticky top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">🏠 Sanchari Mate</h1>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <span>👤 Admin User</span>
          <span className="ml-auto">▼</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}