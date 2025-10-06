'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/ui/TripCard';
import Link from 'next/link';

export default function MyTripsPage() {
  const { user } = useAuthStore();
  const { trips, loading, error, fetchUserTrips } = useTrips();
  const [userTrips, setUserTrips] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserTrips();
    }
  }, [user]);

  useEffect(() => {
    if (user && trips.length > 0) {
      const userTripIds = user.trips || [];
      const filteredTrips = trips.filter(trip => userTripIds.includes(trip.id));
      setUserTrips(filteredTrips);
    }
  }, [trips, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading your trips...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <Link
            href="/planner"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Trip
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {userTrips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No trips yet</h2>
            <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
            <Link
              href="/planner"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                currentUserId={user?.id}
                showEditButton={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}