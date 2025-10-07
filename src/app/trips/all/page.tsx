"use client";
import { useEffect, useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/ui/TripCard/TripCard';
import { useAuthStore } from '@/store/authStore';

export default function AllTripsPage() {
  const { trips, loading, error, fetchTrips, joinTrip } = useTrips(); // Make sure joinTrip is imported
  const { user } = useAuthStore();
  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    // Filter out private trips unless user is the creator
    const publicTrips = trips.reverse().filter(trip => 
      trip.isPublic || trip.createdBy === user?.id
    );
    setFilteredTrips(publicTrips);
  }, [trips, user]);

  // ADD THIS FUNCTION - Handle join trip
  const handleJoinTrip = async (tripToJoin: any) => {
    if (!user) return;
    
    try {
      await joinTrip(tripToJoin.id, 1); // Join with 1 passenger
      
      // Update local state immediately for real-time update
      setFilteredTrips(prevTrips => 
        prevTrips.map(trip => 
          trip.id === tripToJoin.id 
            ? {
                ...trip,
                availableSeats: Math.max(0, (trip.availableSeats || trip.maxParticipants) - 1),
                currentParticipants: (trip.currentParticipants || 0) + 1,
                joinedUsers: [...(trip.joinedUsers || []), user.id]
              }
            : trip
        )
      );
    } catch (error) {
      console.error('Failed to join trip:', error);
      alert('Failed to join trip. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading trips...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Trips</h1>
          <p className="text-gray-600">Discover amazing trips created by our community</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No trips found</h2>
            <p className="text-gray-600">Be the first to create a trip!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                showJoinButton={true}
                currentUserId={user?.id}
                userAlreadyJoined={trip.joinedUsers?.includes(user?.id)}
                onJoin={handleJoinTrip} // ← ADD THIS PROP
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}