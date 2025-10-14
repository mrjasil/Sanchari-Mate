"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tripService } from "@/services/tripService";
import { Trip } from "@/types/Trip";
import { useAuthStore } from "@/store/authStore";
import TripCard from "@/components/ui/TripCard/TripCard";
import { useAlert } from "@/hooks/useAlert";
import { formatDate, isUpcomingTrip, isOngoingTrip, isCompletedTrip } from "@/lib/utils";

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const alert = useAlert();

  const fetchUserTrips = async () => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userTrips = await tripService.getUserTrips(user.id);
      setTrips(userTrips || []);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      setError('Failed to load your trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth to be initialized before checking authentication
    if (!isInitialized) return;
    
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    fetchUserTrips();
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUserTrips();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, user, router, isInitialized]);

  // Show loading while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (tripId: string) => {
    console.log('Editing trip:', tripId);
    router.push(`/trips/edit/${tripId}`);
  };

  const confirmDelete = async (tripId: string) => {
    const tripToDelete = trips.find(trip => trip.id === tripId);
    if (!tripToDelete) return;

    const tripStartDate = new Date(tripToDelete.startDate);
    const today = new Date();
    
    if (today >= tripStartDate || tripToDelete.status !== 'planned') {
      await alert.warning(
        'Cannot Delete Trip',
        'Cannot delete ongoing, completed, or past trips. You can only delete planned trips before they start.'
      );
      return;
    }

    const result = await alert.deleteConfirm('this trip');
    
    if (result.isConfirmed) {
      try {
        await tripService.delete(tripId);
        await fetchUserTrips();
        await alert.success('Success!', 'Your trip has been deleted successfully.');
      } catch (error) {
        console.error('Failed to delete trip:', error);
        await alert.error('Error', 'Failed to delete trip. Please try again.');
      }
    }
  };

  const handleActionError = (errorMessage: string) => {
    alert.error('Action Failed', errorMessage);
  };

  const clearErrors = () => {
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your amazing trips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                My Trips
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage and organize your travel adventures</p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Link
                href="/planner"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Trip
              </Link>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={clearErrors} className="text-red-500 hover:text-red-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Trips Grid */}
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onEdit={handleEdit}
                onDelete={confirmDelete}
                showEditButton={true}
                showDeleteButton={true}
                showJoinButton={false}
                showViewDetailsButton={true}
                currentUserId={user?.id}
                forceShowActions={true}
                onJoinError={handleActionError}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="text-8xl mb-6">🌎</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No trips planned yet</h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Your next adventure is waiting! Start planning your dream trip and create unforgettable memories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/planner"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Plan Your First Trip
                </Link>
                <Link
                  href="/trips/all"
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore Trips
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        {trips.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{trips.length}</div>
                <div className="text-gray-600 text-sm">Total Trips</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {trips.filter(trip => isUpcomingTrip(trip)).length}
                </div>
                <div className="text-gray-600 text-sm">Planned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {trips.filter(trip => isOngoingTrip(trip)).length}
                </div>
                <div className="text-gray-600 text-sm">Ongoing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {trips.filter(trip => isCompletedTrip(trip)).length}
                </div>
                <div className="text-gray-600 text-sm">Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}