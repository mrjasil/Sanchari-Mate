'use client';
import { useAuthStore } from '@/store/authStore';

export default function PlannerHeader() {
  const { user } = useAuthStore();

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Plan Your Next Adventure 🌍
      </h1>
      <p className="text-lg text-gray-600">
        Create amazing trips and connect with fellow travelers
      </p>
      <div className="mt-2 text-sm text-gray-500">
        Logged in as: {user?.firstName} {user?.lastName}
      </div>
    </div>
  );
}