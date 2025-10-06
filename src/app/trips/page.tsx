// app/trips/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tripAPI } from "@/lib/api";
import { Trip } from "@/types/Trip";
import { useAuthStore } from "@/store/authStore";

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (!isAuthenticated || !user) {
        router.push('/login');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch trips created by current user
        const userTrips = await tripAPI.getUserTrips(user.id);
        setTrips(userTrips || []);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
        setError('Failed to load your trips');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrips();
  }, [isAuthenticated, user, router]);

  const handleEdit = (tripId: string) => {
    router.push(`/trips/edit/${tripId}`);
  };

  const confirmDelete = (tripId: string) => {
    setTripToDelete(tripId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;

    try {
      await tripAPI.deleteTrip(tripToDelete);
      setTrips(trips.filter(trip => trip.id !== tripToDelete));
      setShowDeleteModal(false);
      setTripToDelete(null);
    } catch (error) {
      console.error('Failed to delete trip:', error);
      setError('Failed to delete trip');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTripToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">Loading your trips...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600 mt-2">Manage and organize your travel plans</p>
          
          {/* Create New Trip Button */}
          <div className="mt-4">
            <Link
              href="/trips/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              + Create New Trip
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onEdit={handleEdit}
              onDelete={confirmDelete}
            />
          ))}
        </div>

        {/* Empty State */}
        {trips.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌎</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
            <Link
              href="/trips/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Plan Your First Trip
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Trip</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this trip? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Trip Card Component
interface TripCardProps {
  trip: Trip;
  onEdit: (tripId: string) => void;
  onDelete: (tripId: string) => void;
}

function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Trip Image/Header */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {trip.image && (
          <img 
            src={trip.image} 
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Trip Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{trip.title}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">📍</span>
            {trip.destination}
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">📅</span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </div>
          {trip.budget > 0 && (
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">💰</span>
              ₹{trip.budget.toLocaleString()}
            </div>
          )}
        </div>

        {/* Description Preview */}
        {trip.description && (
          <p className="text-sm text-gray-500 mt-3 line-clamp-2">
            {trip.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <Link 
            href={`/trips/${trip.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details
          </Link>
          
          <div className="flex space-x-2">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(trip.id)}
              className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
            >
              <span>✏️</span>
              <span>Edit</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(trip.id)}
              className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-200"
            >
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}