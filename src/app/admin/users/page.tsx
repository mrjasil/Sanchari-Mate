import UserManagement from "@/components/admin/UserManagment";
import { users } from "@/lib/constants";
import { useRef, useEffect } from "react";
import { gsap } from "gsap"; // Don't forget to import gsap

// In your page component (src/app/admin/users/page.tsx)
export default function UsersPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(mainRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="p-6">
      {/* Pass users (array) prop to UserManagement */}
      <UserManagement users={users} />
    </div>
  );
}