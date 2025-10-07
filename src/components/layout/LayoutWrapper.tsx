'use client'
import { usePathname } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAdminLogin = pathname === '/adminlogin';

  if (isAdminRoute || isAdminLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}